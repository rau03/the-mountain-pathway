import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
          <p className="text-brand-slate/70 italic">Last updated: [DATE]</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              1. Acceptance of Terms
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add terms regarding acceptance of service terms,
              eligibility requirements, and agreement to abide by guidelines.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              2. Description of Service
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Describe The Mountain Pathway service - a guided
              reflection and meditation experience that helps users engage in
              mindful journaling and spiritual growth.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              3. User Accounts
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add terms about account creation, responsibility for
              account security, accurate information requirements, and account
              termination.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              4. User Content
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Describe user ownership of their reflection content,
              privacy of personal reflections, and how user data is handled.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              5. Intellectual Property
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add terms about ownership of The Mountain Pathway
              content, scripture usage rights, and restrictions on
              copying/distributing the service content.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              6. Limitation of Liability
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add standard limitation of liability clauses,
              disclaimer that the service is not a substitute for professional
              mental health treatment, etc.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              7. Changes to Terms
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Describe how and when terms may be updated, and how
              users will be notified of changes.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              8. Contact Information
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add contact email or form for questions about these
              terms.]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
