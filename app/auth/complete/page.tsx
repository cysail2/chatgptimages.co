import type { Metadata } from "next";
import { AuthCompleteClient } from "./AuthCompleteClient";

export const metadata: Metadata = {
  title: "Completing sign in | ChatGPT Images",
  robots: { index: false, follow: false },
};

export default function AuthCompletePage() {
  return <AuthCompleteClient />;
}
