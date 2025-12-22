import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Data Deletion | The Mountain Pathway",
  description: "How to delete your account and data from The Mountain Pathway",
};

export default function DataDeletion() {
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
          Data Deletion Instructions
        </h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <p className="text-brand-slate/80 leading-relaxed text-lg">
            We respect your right to control your personal data. You can request
            deletion of your account and all associated data at any time.
          </p>

          {/* What Gets Deleted */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-gold" />
              What Gets Deleted
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              When you request account deletion, the following data will be
              permanently removed:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Your account and login credentials</li>
              <li>Your profile information (name, email)</li>
              <li>All saved journey reflections and responses</li>
              <li>Journey history and completion records</li>
              <li>Any other data associated with your account</li>
            </ul>
          </section>

          {/* How to Request Deletion */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-gold" />
              How to Request Deletion
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              To delete your account and all associated data, please send an
              email to:
            </p>
            <div className="bg-white/50 rounded-lg p-4 border border-slate-300">
              <p className="text-brand-slate font-medium">
                [PLACEHOLDER: Add support email address]
              </p>
            </div>
            <p className="text-brand-slate/80 leading-relaxed">
              Please include the following in your email:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Subject line: &quot;Account Deletion Request&quot;</li>
              <li>The email address associated with your account</li>
              <li>Confirmation that you want all data permanently deleted</li>
            </ul>
          </section>

          {/* Processing Time */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-gold" />
              Processing Time
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              [PLACEHOLDER: Add expected processing time - e.g., &quot;We will
              process your deletion request within 30 days. You will receive a
              confirmation email once your data has been permanently
              deleted.&quot;]
            </p>
          </section>

          {/* Important Notes */}
          <section className="space-y-4 bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-brand-slate">
              Important Notes
            </h2>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2">
              <li>
                <strong>This action is permanent:</strong> Once deleted, your
                data cannot be recovered.
              </li>
              <li>
                <strong>Download first:</strong> If you want to keep your
                reflections, please download them as PDF before requesting
                deletion.
              </li>
              <li>
                <strong>Local data:</strong> This process only deletes data
                stored on our servers. Any PDFs you&apos;ve downloaded or
                content you&apos;ve copied will remain on your devices.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Questions?
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              If you have any questions about the data deletion process, please
              contact us at [PLACEHOLDER: Add contact email].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
