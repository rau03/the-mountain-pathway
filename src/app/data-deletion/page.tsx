import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Clock, Shield, AlertTriangle, Coffee } from "lucide-react";

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
          Data Deletion Policy
        </h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <p className="text-brand-slate/70 italic">Last Updated: December 28, 2025</p>

          <p className="text-brand-slate/80 leading-relaxed text-lg">
            At The Mountain Pathway, we believe in the sanctity of your personal journey and 
            the privacy of your reflections. You are the owner of your data, and you have the 
            absolute right to control it. This includes the right to permanently delete your 
            account and all associated information from our systems. This policy outlines how 
            you can do that and what you can expect from the process.
          </p>

          {/* Guiding Principle */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-gold" />
              Our Guiding Principle: Your Control
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Our philosophy is simple: when you decide to leave, your data leaves with you. 
              We do not hold onto your personal reflections, and we have designed our systems 
              to make this process comprehensive and irreversible.
            </p>
          </section>

          {/* What Gets Deleted */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-gold" />
              What Data is Deleted?
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              When you request an account deletion, we will permanently remove the following 
              information from our live production databases:
            </p>
            <ol className="list-decimal list-inside text-brand-slate/80 space-y-3 ml-4">
              <li>
                <strong>Your Account Information:</strong> This includes the email address you 
                signed up with and any authentication credentials associated with your account.
              </li>
              <li>
                <strong>Your Saved Journeys:</strong> Every journey you have saved to the cloud, 
                including their titles and creation dates.
              </li>
              <li>
                <strong>Your Journal Reflections:</strong> The full text of every response you 
                wrote for each step within every saved journey.
              </li>
            </ol>
            <p className="text-brand-slate/80 leading-relaxed mt-4">
              When your account is deleted, our system is designed to automatically erase all 
              associated data. The link between you and your reflections is severed, and the 
              reflections themselves are erased.
            </p>
          </section>

          {/* How to Request Deletion */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-gold" />
              How to Request Data Deletion
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              As of the current version, the account deletion process is initiated manually to 
              ensure we can verify your request and prevent accidental deletions.
            </p>
            <p className="text-brand-slate/80 leading-relaxed">
              To permanently delete your account and all associated data, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>
                Send an email from the address associated with your Mountain Pathway account to{" "}
                <a
                  href="mailto:hello@themountainpathway.com?subject=Data%20Deletion%20Request"
                  className="text-brand-slate underline hover:text-brand-slate/70"
                >
                  hello@themountainpathway.com
                </a>
              </li>
              <li>Use the subject line: <strong>&quot;Data Deletion Request&quot;</strong></li>
              <li>In the body of the email, please state clearly that you wish to permanently 
                delete your account and all of your data.</li>
            </ol>
          </section>

          {/* The Deletion Process */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-gold" />
              The Deletion Process: What to Expect
            </h2>
            <ol className="list-decimal list-inside text-brand-slate/80 space-y-3 ml-4">
              <li>
                <strong>Verification:</strong> After we receive your request, we will reply to 
                your email to verify that you are the legitimate owner of the account and to 
                confirm your intention to delete. This is a crucial security step to protect your data.
              </li>
              <li>
                <strong>Execution:</strong> Once you have confirmed your request, we will proceed 
                with the deletion process. This action is irreversible.
              </li>
              <li>
                <strong>Timeline:</strong> We will complete the deletion from our live systems 
                within 7 business days of your final confirmation.
              </li>
              <li>
                <strong>Confirmation:</strong> We will send you a final email confirming that 
                your account and all associated data have been permanently deleted.
              </li>
            </ol>
          </section>

          {/* Data in Backups */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Data in Backups
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Our systems are regularly backed up to prevent catastrophic data loss and ensure 
              service reliability. Your data may remain in these secure, isolated backups for a 
              limited period (typically up to 30 days) before being permanently purged as part 
              of our regular backup rotation cycle. This data is not &quot;live,&quot; is not accessible 
              by any users, and is not used for any operational purpose.
            </p>
          </section>

          {/* Important Notes */}
          <section className="space-y-4 bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-brand-slate flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Important Considerations
            </h2>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2">
              <li>
                <strong>This action is permanent.</strong> Once your data is deleted, there is 
                no way for us to recover it.
              </li>
              <li>
                <strong>Alternative option:</strong> If you simply wish to stop using the service 
                but think you might return later, you can simply log out and cease using your 
                account. Deletion is only necessary if you want your data permanently removed.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Questions?
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              If you have any questions about this policy or our data practices, please do not 
              hesitate to contact us at{" "}
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
