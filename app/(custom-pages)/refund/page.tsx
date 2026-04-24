import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../_shared/site-content";

export const metadata: Metadata = {
  title: "Refund Policy | ChatGPT Images",
  description:
    "Read the ChatGPT Images refund policy. Credit packs can be refunded within 7 days of purchase. Contact support to request a refund.",
  alternates: { canonical: "/refund" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "April 24, 2026";

export default function RefundPage() {
  return (
    <div className="site-marketing px-6 pt-24 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Refund Policy
        </h1>
        <p className="text-sm mb-14" style={{ color: "var(--muted2)" }}>
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="space-y-10" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Overview</h2>
            <p className="leading-relaxed">
              {site.name} sells credit packs as one-time purchases with no automatic renewal.
              If you are unsatisfied with a purchase, we offer refunds under the conditions below.
              Our goal is a fair process — we want you to feel confident purchasing credits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Eligibility for a refund</h2>
            <p className="leading-relaxed mb-4">
              You may request a refund if all of the following conditions are met:
            </p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                Your refund request is submitted within <strong className="text-white">7 days</strong> of
                the original purchase date.
              </li>
              <li>
                A significant portion of the purchased credits remain unused at the time of the request.
                Refunds generally do not apply to fully or substantially consumed credit packs.
              </li>
              <li>
                Your account is in good standing and has not violated our{" "}
                <Link href="/terms" title="ChatGPT Images Terms of Service" className="hover:underline" style={{ color: "var(--accent)" }}>
                  Terms of Service
                </Link>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">How to request a refund</h2>
            <p className="leading-relaxed mb-4">
              To request a refund, email us at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>{" "}
              with the subject line <strong className="text-white">&quot;Refund Request&quot;</strong> and include:
            </p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>The email address associated with your account.</li>
              <li>The date of purchase and the credit pack you purchased.</li>
              <li>A brief description of why you are requesting a refund.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We will review your request and respond within 3 business days. If approved, refunds
              are processed back to the original payment method within 5–10 business days depending
              on your bank or card provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Non-refundable situations</h2>
            <p className="leading-relaxed mb-4">Refunds will not be issued in the following cases:</p>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                The refund request is submitted more than 7 days after the purchase date.
              </li>
              <li>
                The majority of purchased credits have already been used.
              </li>
              <li>
                The account has been suspended or terminated for violating our Terms of Service.
              </li>
              <li>
                The purchase was made using free promotional credits or bonus credit offers.
              </li>
              <li>
                A chargeback or payment dispute has already been initiated with your bank or card provider.
                Please contact us before initiating a chargeback — chargebacks result in immediate
                account suspension.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Partial refunds</h2>
            <p className="leading-relaxed">
              If a portion of the credits have been used, we may issue a partial refund for the
              unused balance. The refund amount will be calculated based on the per-credit rate of
              the purchased pack and the number of credits remaining at the time of the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Technical issues</h2>
            <p className="leading-relaxed">
              If you experienced a technical error that consumed credits without delivering a usable
              image — for example, a generation failure due to a server error on our side — contact
              us at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>{" "}
              with details of the incident. We will review your account logs and credit affected
              credits where the error is confirmed on our end. Technical credit issues are reviewed
              on a case-by-case basis and are separate from the standard 7-day refund window.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-white">Contact</h2>
            <p className="leading-relaxed">
              For refund requests or any billing questions, reach us at{" "}
              <a href={`mailto:${site.email}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {site.email}
              </a>.
              We aim to respond to all requests within 3 business days.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 flex gap-6 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--muted2)" }}>
          <Link href="/privacy" title="ChatGPT Images Privacy Policy" className="hover:underline" style={{ color: "var(--accent)" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" title="ChatGPT Images Terms of Service" className="hover:underline" style={{ color: "var(--accent)" }}>
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
