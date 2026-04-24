import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../_shared/site-content";

export const metadata: Metadata = {
  title: "Terms of Service | ChatGPT Images",
  description:
    "Read the ChatGPT Images Terms of Service. Understand permitted use, content policy, credit rules, and limitations of the AI image generator.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "April 24, 2026";

export default function TermsPage() {
  return (
    <div className="site-marketing px-6 pt-24 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm mb-14" style={{ color: "var(--muted2)" }}>
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="space-y-10" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">1. Acceptance of terms</h2>
            <p className="leading-relaxed">
              By accessing or using {site.url} (the &quot;Service&quot;) you agree to be bound by these
              Terms of Service and our{" "}
              <Link href="/privacy" title="ChatGPT Images Privacy Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
                Privacy Policy
              </Link>. If you do not agree, do not use the Service.
              These terms form a binding agreement between you and {site.name}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">2. Eligibility</h2>
            <p className="leading-relaxed">
              You must be at least 18 years old and capable of forming a legally binding contract
              to use the Service. By registering, you confirm that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">3. Account and credits</h2>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                You are responsible for maintaining the security of your account credentials.
                Do not share your password.
              </li>
              <li>
                Credits are non-transferable and may not be sold, gifted, or shared with other accounts.
              </li>
              <li>
                Credits do not expire. They remain in your account until used or until the account
                is closed.
              </li>
              <li>
                Free credits issued on signup are subject to fair use limits and may be adjusted
                without prior notice.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that engage in abuse,
                chargebacks, or violation of these terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">4. Permitted use</h2>
            <p className="leading-relaxed mb-3">
              You may use generated images for personal and commercial purposes including marketing
              campaigns, client deliverables, product pages, social content, editorial content,
              and creative projects. You retain ownership of images you generate.
            </p>
            <p className="leading-relaxed">
              You agree to use the Service only for lawful purposes and in ways that do not
              infringe the rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">5. Prohibited content</h2>
            <p className="leading-relaxed mb-3">You may not use the Service to generate:</p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>Content that is sexually explicit involving minors (CSAM) or any illegal sexual content.</li>
              <li>Content depicting real identifiable individuals in a false, defamatory, or harmful context.</li>
              <li>Content that promotes violence, terrorism, or illegal activity.</li>
              <li>
                Content that infringes trademarks, copyrights, or other intellectual property rights
                of third parties.
              </li>
              <li>Deepfakes or synthetic media designed to deceive, harass, or defame specific people.</li>
              <li>
                Disinformation, propaganda, or content intended to interfere with elections or
                democratic processes.
              </li>
            </ul>
            <p className="leading-relaxed mt-3">
              Violations may result in immediate account termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">6. Intellectual property</h2>
            <p className="leading-relaxed mb-3">
              You own the images you generate, subject to these terms and applicable law.
              {site.name} does not claim ownership of your generated outputs.
            </p>
            <p className="leading-relaxed">
              The {site.name} platform, codebase, UI, branding, and documentation are owned by us
              and protected by copyright and other intellectual property laws. You may not copy,
              modify, or redistribute any part of the platform itself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">7. Payments and billing</h2>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                Credit packs are one-time purchases. All prices are listed in USD and are exclusive
                of applicable taxes unless stated otherwise.
              </li>
              <li>
                There is no subscription or automatic renewal. You will only be charged when you
                manually purchase a credit pack.
              </li>
              <li>
                Payments are processed by our third-party payment provider. We do not store your
                full card details.
              </li>
              <li>
                Credits are granted to your account upon confirmed payment. If a payment fails or
                is reversed, credits may be deducted accordingly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">8. Refunds</h2>
            <p className="leading-relaxed">
              Refund requests must be submitted within 7 days of purchase. See our{" "}
              <Link href="/refund" title="ChatGPT Images Refund Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
                Refund Policy
              </Link>{" "}
              for complete details. We reserve the right to deny refunds for accounts found
              violating these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">9. Disclaimer of warranties</h2>
            <p className="leading-relaxed">
              The Service is provided &quot;as is&quot; without warranties of any kind, express or implied,
              including warranties of merchantability, fitness for a particular purpose, or
              non-infringement. We do not guarantee that the Service will be error-free, uninterrupted,
              or that outputs will meet your specific requirements or be legally compliant in your
              jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">10. Limitation of liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by applicable law, {site.name} shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages arising from
              your use of or inability to use the Service, including loss of profits, data, or business
              opportunities, even if advised of the possibility of such damages. Our total liability
              to you shall not exceed the amount you paid us in the 90 days preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">11. Termination</h2>
            <p className="leading-relaxed">
              We may suspend or terminate your account at any time if you violate these terms or
              engage in conduct that harms other users or the integrity of the Service. You may
              close your account at any time by contacting{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>. Unused credits are non-refundable upon voluntary account closure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">12. Changes to these terms</h2>
            <p className="leading-relaxed">
              We may revise these Terms of Service at any time. Material changes will be communicated
              to registered users via email. Continued use of the Service after changes take effect
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">13. Contact</h2>
            <p className="leading-relaxed">
              Questions about these Terms of Service can be directed to{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 flex gap-6 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--muted2)" }}>
          <Link href="/privacy" title="ChatGPT Images Privacy Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
            Privacy Policy
          </Link>
          <Link href="/refund" title="ChatGPT Images Refund Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
