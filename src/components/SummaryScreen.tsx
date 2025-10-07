import React from "react";
import { motion } from "framer-motion";
import { Download, Copy, RotateCcw, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const SummaryScreen: React.FC = () => {
  const { currentEntry, startNewJourney } = useStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const handleStartNew = () => {
    startNewJourney();
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
            <h3 className="text-xl font-semibold text-brand-gold">
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
                <h4 className="font-semibold text-brand-gold uppercase tracking-wide text-sm">
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

        <Button
          onClick={handleStartNew}
          variant="default"
          size="lg"
          className="font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{pathwayContent.summaryPage.newJourneyButtonText}</span>
        </Button>
      </div>
    </motion.div>
  );
};
