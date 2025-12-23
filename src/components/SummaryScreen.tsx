import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Download,
  Copy,
  RotateCcw,
  CheckCircle,
  UploadCloud,
  Coffee,
} from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { pathwayData, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";
import SaveJourneyModal from "@/components/SaveJourneyModal";
import AuthModal from "@/components/AuthModal";
import { saveJourney, updateJourney } from "@/lib/journeyApi";

export const SummaryScreen: React.FC<{ session: Session | null }> = ({
  session,
}) => {
  const {
    currentEntry,
    startNewJourney,
    currentStep,
    isSaved,
    savedJourneyId,
    savedJourneyTitle,
    markSaved,
    resetJourney,
  } = useStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleStartNew = () => {
    startNewJourney();
  };

  const handleSaveJourney = async (title: string) => {
    if (!session?.user) {
      throw new Error("You must be logged in to save a journey.");
    }

    if (!currentEntry) {
      throw new Error("No journey data to save.");
    }

    // Check if journey has any responses
    const hasResponses = Object.values(currentEntry.responses).some(
      (response) => response && response.trim()
    );
    if (!hasResponses) {
      throw new Error("Please add some content to your journey before saving.");
    }

    setSaveLoading(true);

    try {
      const journeyData = {
        title,
        currentEntry,
        currentStep,
        isCompleted: true, // Summary screen means journey is complete
      };

      let savedJourney;
      if (isSaved && savedJourneyId) {
        // Update existing journey
        savedJourney = await updateJourney(savedJourneyId, journeyData);
      } else {
        // Save new journey
        savedJourney = await saveJourney(journeyData);
      }

      // Update store with save status and title
      markSaved(savedJourney.id, title);
    } catch (error) {
      throw error; // Let SaveJourneyModal handle the error display
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    setSaveModalOpen(true);
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

        // Add response text (split into lines if too long)
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(response, 170);

        // Calculate total height needed for this section
        const titleHeight = 12; // Space for title + gap
        const contentHeight = lines.length * 5; // 5mm per line (improved from 4mm)
        const sectionHeight = titleHeight + contentHeight + 15; // Plus spacing

        // Check if we need a new page (reduced from 250 to 230 for better bottom margin)
        if (yPosition + sectionHeight > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        // Add step title
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(step.title.toUpperCase(), 20, yPosition);
        yPosition += 10;

        // Add response text
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 15; // 5mm per line + 15mm spacing
      });

      const dateStr = new Date(currentEntry.createdAt)
        .toISOString()
        .split("T")[0];
      pdf.save(`mountain-pathway-${dateStr}.pdf`);
    } catch (err) {
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
      className="flex flex-col gap-4 w-full relative"
    >
      {/* Mobile Logo - Upper Left Corner */}
      {isMobile && (
        <div className="absolute top-0 left-0 p-4 z-20 -ml-6 -mt-8">
          <button
            onClick={resetJourney}
            className="bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 relative"
            aria-label="Return to home"
          >
            <div className="relative inline-block">
              {/* Bolder layer - slightly larger golden version behind */}
              <Image
                src="/mountain-icon.svg"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 absolute pointer-events-none"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(75%) sepia(95%) saturate(1352%) hue-rotate(1deg) brightness(102%) contrast(101%)",
                  transform: "scale(1.08) translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                  zIndex: 0,
                }}
              />
              {/* Main golden logo on top */}
              <Image
                src="/mountain-icon.svg"
                alt="Mountain Pathway Logo"
                width={24}
                height={24}
                className="w-6 h-6 relative"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(75%) sepia(95%) saturate(1352%) hue-rotate(1deg) brightness(102%) contrast(101%)",
                  zIndex: 1,
                }}
              />
            </div>
          </button>
        </div>
      )}

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

      {/* Action Buttons - All buttons with consistent spacing */}
      <div className="flex flex-col gap-3 justify-center items-center mt-6">
        {/* Save Journey Button - Only show if authenticated and on desktop (mobile has button in footer) */}
        {session && !isMobile && (
          <Button
            onClick={handleSaveClick}
            disabled={saveLoading}
            variant="ghost"
            size="lg"
            className="font-medium bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-8 py-4 rounded-md border border-brand-slate/20"
          >
            {isSaved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            <span>{isSaved ? "Complete Journey" : "Save Journey"}</span>
          </Button>
        )}

        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          variant="default"
          size="lg"
          className="font-medium w-48"
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
          variant="outline"
          size="lg"
          className="font-medium w-48"
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

        <Button
          onClick={handleStartNew}
          variant="outline"
          size="lg"
          className="font-medium w-48"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{pathwayContent.summaryPage.newJourneyButtonText}</span>
        </Button>
      </div>

      {/* Mobile Save Button - Only show on mobile */}
      {isMobile && (
        <div className="text-center mt-4">
          <Button
            onClick={handleSaveClick}
            disabled={saveLoading}
            variant="ghost"
            size="lg"
            className="bg-black/10 backdrop-blur-sm text-white font-medium rounded-md border border-brand-slate/20 hover:bg-black/20"
          >
            {session ? (
              <>
                {isSaved ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>{isSaved ? "Complete Journey" : "Save Journey"}</span>
              </>
            ) : (
              <>
                <span>Log in to Save</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Support & Legal */}
      <div className="text-center pt-8 space-y-3">
        {/* Buy Me a Coffee Link */}
        <a
          href="https://buymeacoffee.com/themountainpathway"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-brand-slate/60 hover:text-brand-slate transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Support The Mountain Pathway</span>
        </a>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-3 text-xs text-brand-slate/40">
          <a
            href="/terms"
            className="hover:text-brand-slate/70 transition-colors"
          >
            Terms
          </a>
          <span>·</span>
          <a
            href="/privacy"
            className="hover:text-brand-slate/70 transition-colors"
          >
            Privacy
          </a>
          <span>·</span>
          <a
            href="/data-deletion"
            className="hover:text-brand-slate/70 transition-colors"
          >
            Data Deletion
          </a>
          <span>·</span>
          <a
            href="mailto:hello@themountainpathway.com"
            className="hover:text-brand-slate/70 transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Creator Attribution */}
        <p className="text-xs text-brand-slate/40">
          The Mountain Pathway created by{" "}
          <a
            href="https://www.webdevbyrau.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-slate/70 transition-colors underline"
          >
            webdevbyrau
          </a>
        </p>
      </div>

      {/* Save Journey Modal */}
      <SaveJourneyModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={handleSaveJourney}
        isLoading={saveLoading}
        isUpdate={isSaved}
        initialTitle={
          isSaved && savedJourneyTitle
            ? savedJourneyTitle
            : currentEntry.responses.respond || ""
        }
      />

      {/* Auth Modal for mobile save */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        session={session}
      />
    </motion.div>
  );
};
