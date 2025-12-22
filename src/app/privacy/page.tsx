import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | The Mountain Pathway",
  description: "Privacy Policy for The Mountain Pathway",
};

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-brand-slate/70 italic">Last updated: [DATE]</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              1. Introduction
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Introduction about commitment to privacy and the
              purpose of this policy. Emphasize that personal reflections are
              private and not shared with third parties.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              2. Information We Collect
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Detail what information is collected:]
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2">
              <li>Email address (for account creation)</li>
              <li>First and last name (optional, for personalization)</li>
              <li>
                Journey reflections and responses (user-generated content)
              </li>
              <li>Journey completion dates and times</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              3. How We Use Your Information
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Explain how information is used - account
              management, saving journeys, providing the service, etc. Emphasize
              that reflection content is never analyzed, sold, or shared.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              4. Data Storage and Security
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Describe data storage (Supabase), security measures,
              encryption, and how data is protected.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              5. Your Rights (GDPR/CCPA Compliance)
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Detail user rights including:]
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2">
              <li>Right to access your data</li>
              <li>Right to export your data (PDF download)</li>
              <li>Right to delete your data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              6. Cookies and Tracking
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Describe any cookies used (essential cookies for
              authentication only, no tracking cookies, etc.)]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              7. Third-Party Services
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: List third-party services used (Supabase for
              authentication and database, Vercel for hosting) and link to their
              privacy policies.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              8. Data Retention
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Explain how long data is kept, and what happens to
              data when accounts are deleted.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              9. Contact Us
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add contact information for privacy-related
              questions or data requests.]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
