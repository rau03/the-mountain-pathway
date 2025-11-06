import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  RotateCcw,
  CheckCircle,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { pathwayData, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

export const SummaryScreen: React.FC<{ session: Session | null }> = ({
  session,
}) => {
  const { currentEntry, startNewJourney } = useStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const handleStartNew = () => {
    startNewJourney();
  };

  const handleSaveJourney = async () => {
    // 1. Guard Clauses: Ensure we have a user and a journey to save.
    if (!session?.user) {
      console.error("No user session found. Cannot save journey.");
      alert("You must be logged in to save a journey.");
      return;
    }

    if (!currentEntry) {
      console.error("No current journey entry found in state.");
      return;
    }

    // 2. Set Loading State
    setSaveState("saving");

    try {
      // 3. Insert into the 'journeys' table
      const { data: journeyData, error: journeyError } = await supabase
        .from("journeys")
        .insert({
          user_id: session.user.id,
          // Use the response from step 2 ("Respond") as the title
          title:
            currentEntry.responses[
              "respond" as keyof typeof currentEntry.responses
            ] || "Untitled Journey",
          template_id: "default", // As we planned
        })
        .select("id") // IMPORTANT: This returns the ID of the new row
        .single(); // We expect only one row to be created

      if (journeyError) throw journeyError;
      if (!journeyData) throw new Error("Failed to get new journey ID.");

      const newJourneyId = journeyData.id;

      // 4. Prepare the 'journey_steps' data
      const stepsToInsert = pathwayData
        .filter(
          (step) =>
            step.isInput &&
            currentEntry.responses[
              step.key as keyof typeof currentEntry.responses
            ]
        )
        .map((step) => ({
          journey_id: newJourneyId,
          step_number: step.stepIndex,
          prompt_text: step.title,
          user_response:
            currentEntry.responses[
              step.key as keyof typeof currentEntry.responses
            ],
        }));

      if (stepsToInsert.length === 0) {
        // Handle case with no responses, though unlikely
        console.log("No responses to save.");
        setSaveState("saved");
        return;
      }

      // 5. Bulk insert into the 'journey_steps' table
      const { error: stepsError } = await supabase
        .from("journey_steps")
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      // 6. Update UI State on Success
      console.log("Journey saved successfully!");
      setSaveState("saved");
    } catch (error) {
      console.error("Error saving journey:", error);
      alert("There was an error saving your journey. Please try again.");
      // Reset UI state on failure
      setSaveState("idle");
    }
  };

  const handleCopyToClipboard = async () => {
    const summaryText = generateSummaryText();
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const generateSummaryText = () => {
    const date = new Date(currentEntry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let summary = `${pathwayContent.summaryPage.completionMessage}\n`;
    summary += `Date: ${date}\n\n`;

    pathwayData.forEach((step) => {
      if (
        step.isInput &&
        currentEntry.responses[step.key as keyof typeof currentEntry.responses]
      ) {
        summary += `${step.title.toUpperCase()}\n`;
        summary += `${
          currentEntry.responses[
            step.key as keyof typeof currentEntry.responses
          ]
        }\n\n`;
      }
    });

    return summary;
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      console.log("Starting text-based PDF generation...");

      const jsPDF = (await import("jspdf")).jsPDF;
      const pdf = new jsPDF("p", "mm", "a4");

      // Set text color to black for better readability
      pdf.setTextColor(0, 0, 0);

      // Set up the PDF with text content
      pdf.setFontSize(20);
      pdf.text(pathwayContent.appTitle, 20, 30);

      const date = new Date(currentEntry.createdAt).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      pdf.setFontSize(12);
      pdf.text(`Date: ${date}`, 20, 45);

      let yPosition = 60;

      pathwayData.forEach((step) => {
        const response =
          currentEntry.responses[
            step.key as keyof typeof currentEntry.responses
          ];
        if (!step.isInput || !response) return;

        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        // Add step title
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(step.title.toUpperCase(), 20, yPosition);
        yPosition += 10;

        // Add response text (split into lines if too long)
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(response, 170);
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * 4 + 15; // 4mm per line + 15mm spacing
      });

      const dateStr = new Date(currentEntry.createdAt)
        .toISOString()
        .split("T")[0];
      pdf.save(`mountain-pathway-${dateStr}.pdf`);

      console.log("Text-based PDF saved successfully");
    } catch (err) {
      console.error("Failed to generate text PDF:", err);
      alert(
        `Failed to generate PDF: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 w-full"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-amber-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-brand-gold" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-brand-slate">
          {pathwayContent.summaryPage.title}
        </h2>
        <p className="text-lg text-brand-slate/90">
          {pathwayContent.summaryPage.subtitle}
        </p>
      </div>

      {/* Summary Content */}
      <div
        id="summary-content"
        className="bg-white/50 rounded-lg p-8 shadow-md border border-slate-300 h-full overflow-y-auto scrollbar-thin"
      >
        <div className="space-y-4">
          <div className="text-center border-b border-slate-300 pb-4">
            <h3 className="text-xl font-semibold text-slate-800">
              {pathwayContent.appTitle}
            </h3>
            <p className="text-sm text-brand-slate/70">
              {new Date(currentEntry.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {pathwayData.map((step) => {
            const response =
              currentEntry.responses[
                step.key as keyof typeof currentEntry.responses
              ];
            if (!step.isInput || !response) return null;

            return (
              <div key={step.stepIndex} className="space-y-2">
                <h4 className="font-semibold text-slate-800 uppercase tracking-wide text-sm">
                  {step.title}
                </h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* NEW SAVE BUTTON */}
        <Button
          onClick={handleSaveJourney}
          disabled={saveState !== "idle" || !session}
          variant="default"
          size="lg"
          className="font-medium bg-brand-gold hover:bg-brand-gold/90"
        >
          {saveState === "saving" && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {saveState === "saved" && <CheckCircle className="w-4 h-4" />}
          {saveState === "idle" && <UploadCloud className="w-4 h-4" />}
          <span>
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
              ? "Saved to Cloud"
              : "Save Journey"}
          </span>
        </Button>

        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          variant="default"
          size="lg"
          className="font-medium"
        >
          <Download className="w-4 h-4" />
          <span>
            {downloading
              ? pathwayContent.summaryPage.generatingText
              : pathwayContent.summaryPage.downloadButtonText}
          </span>
        </Button>

        <Button
          onClick={handleCopyToClipboard}
          variant="secondary"
          size="lg"
          className="font-medium"
        >
          {copied ? (
            <CheckCircle className="w-4 h-4 text-brand-gold" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>
            {copied
              ? pathwayContent.summaryPage.copiedText
              : pathwayContent.summaryPage.copyButtonText}
          </span>
        </Button>
      </div>

      {/* Start New Journey Button - Now separate */}
      <div className="text-center mt-6">
        <Button
          onClick={handleStartNew}
          variant="outline"
          size="lg"
          className="font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{pathwayContent.summaryPage.newJourneyButtonText}</span>
        </Button>
      </div>

      {/* Creator Attribution */}
      <p className="text-xs text-brand-slate/50 text-center pt-8">
        The Mountain Pathway created by{" "}
        <a
          href="https://www.webdevbyrau.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors underline"
        >
          webdevbyrau
        </a>
      </p>
    </motion.div>
  );
};
