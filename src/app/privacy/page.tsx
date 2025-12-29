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
          <p className="text-brand-slate/70 italic">Last Updated: December 28, 2025</p>
          
          <p className="text-brand-slate/80 leading-relaxed">
            <strong>Website:</strong>{" "}
            <a
              href="https://www.themountainpathway.com"
              className="text-brand-slate underline hover:text-brand-slate/70"
            >
              https://www.themountainpathway.com
            </a>
            <br />
            <strong>Owner:</strong> Mountain Pathway (Christopher Rau)
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Introduction
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Mountain Pathway (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting 
              your privacy. This Privacy Policy explains what information we collect, how we use it, 
              and your rights when using our website and journaling experience.
            </p>
            <p className="text-brand-slate/80 leading-relaxed">
              By using Mountain Pathway, you agree to the terms outlined here.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Information We Collect
            </h2>
            
            <h3 className="text-lg font-medium text-brand-slate">
              1. Personal Information You Provide
            </h3>
            <p className="text-brand-slate/80 leading-relaxed">
              We may collect:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Email address (if you create an account or contact us)</li>
              <li>Feedback or messages you send us</li>
            </ul>

            <h3 className="text-lg font-medium text-brand-slate mt-4">
              2. Journaling Data
            </h3>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>All journaling entries are stored locally on your device unless you choose to export them.</li>
              <li>We do not store your journaling content on our servers.</li>
            </ul>

            <h3 className="text-lg font-medium text-brand-slate mt-4">
              3. Usage Data (Non-Personal)
            </h3>
            <p className="text-brand-slate/80 leading-relaxed">
              We may collect anonymized data such as:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Pages visited</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Time spent in the app</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-2">
              This helps us improve the experience and understand usage patterns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              How We Use Your Information
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              We use collected data to:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Provide and improve the Mountain Pathway experience</li>
              <li>Respond to customer inquiries</li>
              <li>Analyze anonymized usage patterns</li>
              <li>Ensure app stability and performance</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-4 font-medium">
              We do not sell or share your personal information with third parties for marketing.
            </p>
          </section>

          {/* Cookie Policy Section */}
          <section className="space-y-4 bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-brand-slate">
              Cookie Policy
            </h2>
            
            <h3 className="text-lg font-medium text-brand-slate">
              What Are Cookies?
            </h3>
            <p className="text-brand-slate/80 leading-relaxed">
              Cookies are small text files stored on your device to help improve your experience.
            </p>

            <h3 className="text-lg font-medium text-brand-slate mt-4">
              How We Use Cookies
            </h3>
            <p className="text-brand-slate/80 leading-relaxed">
              Mountain Pathway may use:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li><strong>Essential cookies</strong> – required for basic functionality</li>
              <li><strong>Analytics cookies</strong> – measure anonymized usage patterns</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-2">
              We do not use advertising cookies.
            </p>

            <h3 className="text-lg font-medium text-brand-slate mt-4">
              Managing Cookies
            </h3>
            <p className="text-brand-slate/80 leading-relaxed">
              You can disable cookies in your browser settings. Note: disabling essential cookies 
              may break site functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Data Security
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              We take reasonable steps to protect your information. That said, no digital service 
              can guarantee 100% security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Children&apos;s Privacy
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Mountain Pathway is not intended for users under 13.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Your Rights
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              Depending on your region, you may request to:
            </p>
            <ul className="list-disc list-inside text-brand-slate/80 space-y-2 ml-4">
              <li>Access the personal data we store</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics cookies</li>
            </ul>
            <p className="text-brand-slate/80 leading-relaxed mt-4">
              Contact us at:{" "}
              <a
                href="mailto:hello@themountainpathway.com"
                className="text-brand-slate underline hover:text-brand-slate/70"
              >
                hello@themountainpathway.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-slate">
              Changes to This Policy
            </h2>
            <p className="text-brand-slate/80 leading-relaxed">
              We may update this Privacy Policy from time to time. Updates will be posted on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
