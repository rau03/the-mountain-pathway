import Link from "next/link";
import { ArrowLeft, Coffee } from "lucide-react";

export const metadata = {
  title: "Terms of Service | The Mountain Pathway",
  description: "Terms of Service for The Mountain Pathway",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-stone">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-slate/70 hover:text-brand-slate transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-brand-slate mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-brand-slate/70 italic">Last Updated: December 28, 2025</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Acceptance of Terms
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              By visiting or using Mountain Pathway, you agree to these Terms of Service.
              If you do not agree, please do not use the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Use of the Service
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              You may use Mountain Pathway solely for:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Personal reflection</li>
              <li>Journaling</li>
              <li>Non-commercial use</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Reverse engineer the platform</li>
              <li>Attempt unauthorized access</li>
              <li>Use the app in ways that may harm the service or other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Journaling Content
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              All journaling entries remain yours. We do not claim ownership of your content.
              Your entries are stored locally on your device, unless you export them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Intellectual Property
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              All images, UI layouts, visual designs, code, and written materials are property 
              of Mountain Pathway and may not be copied or distributed without permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              No Guarantee of Availability
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              We may modify or discontinue parts of the service at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Limitation of Liability
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Mountain Pathway provides a reflective journaling experience for personal growth. 
              We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Data loss on your device</li>
              <li>Damages arising from use of the platform</li>
              <li>Emotional outcomes of the journaling process</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-4">
              Use at your own discretion.
            </p>
          </section>

          {/* Disclaimer Section */}
          <section className="space-y-4 bg-amber-50 rounded-lg p-6 border border-amber-200 mt-8">
            <h2 className="text-xl font-semibold text-brand-slate">
              Disclaimer
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Mountain Pathway is a reflective journaling experience designed for personal 
              insight and spiritual development.
            </p>
            <p className="text-brand-slate/80 leading-relaxed">
              <strong>It is not:</strong>
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Medical advice</li>
              <li>Mental health treatment</li>
              <li>Therapy</li>
              <li>Psychological counseling</li>
              <li>Professional guidance</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-4">
              If you are experiencing emotional distress or mental health challenges, 
              please consult a licensed professional.
            </p>
            <p className="text-brand-slate/80 leading-relaxed">
              Use Mountain Pathway at your own discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Contact
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              For questions:{" "}
              <a
                href="mailto:hello@themountainpathway.com"
                className="text-brand-slate underline hover:text-brand-slate/70"
              >
                hello@themountainpathway.com
              </a>
            </p>
          </section>

          {/* Buy Me a Coffee Link */}
          <div className="text-center pt-8 border-t border-brand-slate/10 mt-8">
            <a
              href="https://buymeacoffee.com/themountainpathway"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-slate/50 hover:text-brand-slate/70 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a Coffee</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
