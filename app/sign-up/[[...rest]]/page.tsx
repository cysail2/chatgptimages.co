import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Sign Up | ChatGPT Images",
  description: "Create a free ChatGPT Images 2.0 account and receive 12 free credits to try the AI image generator.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <AuthShell mode="sign-up" />;
}
