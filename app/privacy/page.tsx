import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | ChatGPT Images",
  description:
    "Read the ChatGPT Images privacy policy. Learn how we collect, use, and protect your data when you use the AI image generator.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "April 24, 2026";

export default function PrivacyPage() {
  return (
    <div className="px-6 pt-24 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm mb-14" style={{ color: "var(--muted2)" }}>
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="prose-policy space-y-10" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">1. Overview</h2>
            <p className="leading-relaxed">
              {site.name} (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates {site.url}. This Privacy Policy describes
              how we collect, use, and protect information when you use our AI image generation service.
              By using the service you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">2. Information we collect</h2>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">Account information</strong> — name, email address, and
                authentication credentials provided when you register via Clerk.
              </li>
              <li>
                <strong className="text-white">Payment information</strong> — billing data processed
                by our payment provider. We do not store full card numbers on our servers.
              </li>
              <li>
                <strong className="text-white">Usage data</strong> — credit balance, generation history,
                selected resolution and format settings, and timestamps.
              </li>
              <li>
                <strong className="text-white">Prompts and reference images</strong> — text prompts
                and any uploaded images you provide during a generation session.
              </li>
              <li>
                <strong className="text-white">Technical data</strong> — IP address, browser type,
                device type, and referral source collected automatically via server logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">3. How we use your information</h2>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>To create and manage your account and credit balance.</li>
              <li>To process payments and fulfill credit pack purchases.</li>
              <li>To generate images in response to your prompts using the gpt-image-2 model.</li>
              <li>To send transactional emails such as purchase receipts and account notifications.</li>
              <li>To investigate abuse, enforce our Terms of Service, and maintain service security.</li>
              <li>To analyze aggregate, anonymized usage patterns and improve the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">4. Your prompts and generated images</h2>
            <p className="leading-relaxed mb-3">
              Your prompts, uploaded reference images, and generated outputs are private by default.
              We do not:
            </p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>Use your prompts or generated images to train AI models.</li>
              <li>Share your content with third parties for advertising or marketing purposes.</li>
              <li>Display your generations in any public gallery or feed.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Prompts and images may be retained on our servers for a limited period to enable
              generation history access. You may request deletion of your content at any time
              by contacting us at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">5. Cookies and tracking</h2>
            <p className="leading-relaxed">
              We use essential cookies required for authentication (via Clerk) and session management.
              We do not place third-party advertising cookies. Analytics, if enabled, uses aggregated
              and anonymized data only. You can disable cookies in your browser settings, though some
              features of the service require them to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">6. Data sharing and third parties</h2>
            <p className="leading-relaxed mb-3">We share personal data only in the following circumstances:</p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">Authentication</strong> — Clerk processes sign-in and
                account management on our behalf.
              </li>
              <li>
                <strong className="text-white">Payment processing</strong> — our payment provider
                processes credit card and payment data. We do not receive or store full card details.
              </li>
              <li>
                <strong className="text-white">AI model</strong> — prompts and reference images are
                transmitted to the underlying model API to generate outputs.
              </li>
              <li>
                <strong className="text-white">Legal requirements</strong> — we may disclose data
                when required by law, court order, or to protect the rights and safety of users.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">7. Data retention and deletion</h2>
            <p className="leading-relaxed">
              We retain account data for as long as your account is active. You may request account
              deletion and full data erasure at any time by emailing{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>. We will process deletion requests within 30 days. Payment records may be retained
              longer as required by applicable tax and accounting regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">8. Security</h2>
            <p className="leading-relaxed">
              We use HTTPS for all data in transit and apply access controls to data at rest.
              No internet transmission is completely secure. If you believe your account has been
              compromised, contact us immediately at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">9. Children</h2>
            <p className="leading-relaxed">
              The service is not directed at children under 13 years of age. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with data, contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">10. Changes to this policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. If changes are material, we will
              notify registered users by email. Continued use of the service after an update constitutes
              acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">11. Contact</h2>
            <p className="leading-relaxed">
              For privacy questions, data deletion requests, or any concerns about how your information
              is handled, contact us at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 flex gap-6 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--muted2)" }}>
          <Link href="/terms" title="ChatGPT Images Terms of Service" className="hover:underline" style={{ color: "var(--accent)" }}>
            Terms of Service
          </Link>
          <Link href="/refund" title="ChatGPT Images Refund Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
