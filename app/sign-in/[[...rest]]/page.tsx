import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Sign In | ChatGPT Images",
  description: "Sign in to ChatGPT Images 2.0 to access your credits, generation history, and billing.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <AuthShell mode="sign-in" />;
}
