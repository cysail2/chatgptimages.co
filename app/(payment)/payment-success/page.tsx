"use client";

import { Button } from "@/library/ui/button";
import {
  CheckCircle,
  Sparkles,
  Video,
  Zap,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useUserInfo } from "@/library/providers";
import { useSearchParams } from "next/navigation";
import { normalizeReturnTo } from "@/library/lib/payment/result";
import { PaymentResultFallback } from "@/library/components/PaymentResultFallback";
import { getFrontendSiteConfig } from "@/library/services/frontend-data.client";

// 发送gtag转化事件
const sendGtagConversion = (email?: string, retryCount: number = 0) => {
  console.log(email, "emaail");
  if (typeof window === "undefined") return;
  try {
    if (!window.gtag) {
      if (retryCount < 3) {
        setTimeout(() => sendGtagConversion(email, retryCount + 1), 1000);
      } else {
        console.error("gtag failed to load after 3 retries");
      }
      return;
    }

    // 设置用户数据
    if (email) {
      window.gtag("set", "user_data", { email: email });
      console.log("gtag用户数据设置成功");
    }

    // 发送转化事件
    window.gtag("event", "conversion", {
      send_to: "AW-16699731013/XdpwCNPxhoYbEMXYhps-",
      value: 1.0,
      currency: "USD",
      transaction_id: "",
    });
    console.log("gtag转化事件发送成功");
  } catch (error) {
    console.error("发送gtag转化事件失败:", error);
  }
};
function PaymentSuccessContent() {
  const hasTracked = useRef(false);
  const { userInfo } = useUserInfo();
  const searchParams = useSearchParams();
  const [createHref, setCreateHref] = useState<string>("/");

  const [siteName, setSiteName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {
    getFrontendSiteConfig().then((config) => {
      setSiteName(config?.site.name || "");
      setSupportEmail(config?.contact.email || "");
    });
  }, []);

  useEffect(() => {
    // 只有在有email且未跟踪过时才发送gtag事件
    if (!hasTracked.current && userInfo?.email) {
      sendGtagConversion(userInfo.email);
      hasTracked.current = true;
    }
  }, [userInfo?.email]);

  useEffect(() => {
    const returnToFromQuery = normalizeReturnTo(searchParams.get("returnTo"));
    const returnToFromStorage =
      typeof window === "undefined"
        ? null
        : normalizeReturnTo(localStorage.getItem("payment_return_to"));
    const returnTo = returnToFromQuery || returnToFromStorage;
    if (returnTo) setCreateHref(returnTo);
    if (typeof window !== "undefined") {
      localStorage.removeItem("payment_return_to");
    }
  }, [searchParams]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col ">
      <div className="flex-1 flex items-center justify-center p-8 mt-40">
        <div className="max-w-6xl w-full space-y-16">
          {/* Success Message */}
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="h-40 w-40 text-green-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to {siteName}!
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto font-medium">
                Your account has been upgraded successfully. You now have access
                to the revolutionary AI video generator.
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transform text and images into stunning cinematic-quality videos
                with cutting-edge Mixture-of-Experts technology.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href={createHref} className="flex items-center space-x-3">
                <Video className="h-8 w-8" />
                <span>Start Creating Videos</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-16 py-8 text-xl font-semibold rounded-2xl border-3 border-gray-300 hover:border-gray-400 hover:bg-white/80 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/profile" className="flex items-center space-x-3">
                <span>My Account</span>
              </Link>
            </Button>
          </div>

          <div className="mt-24 space-y-16">
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                How {siteName} Works
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Create stunning videos with {siteName} in just three simple
                steps using our revolutionary AI technology
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-4">
                    Choose Your Creation Mode
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Select between text-to-video or image-to-video generation
                    with {siteName} AI based on your creative needs.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl">✍️</span>
                  </div>
                  <h3 className="text-xl font-bold text-purple-600 mb-4">
                    Input Your Prompt
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Enter detailed text prompts or upload reference images to
                    guide the {siteName} video generation process.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-pink-600 mb-4">
                    Generate & Download
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Let {siteName} work its magic to create your stunning
                    professional 1080P video, then download your masterpiece.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-indigo-100">
              <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
                {siteName} Advantages
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Cinematic Vision Control
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Achieve professional cinematic narratives through deep
                    command of shot language, offering fine-grained control over
                    lighting, color, and composition for versatile styles with
                    delicate detail.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Advanced lighting and color control
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Professional composition tools
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Versatile cinematic styles
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Sweeping Motion & Precision
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Effortlessly recreate complex motion with enhanced fluidity
                    and control. More powerfully understand and execute prompts
                    for complex scenes and multi-object generation.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Complex motion generation
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Multi-object scene creation
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Enhanced fluidity and control
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfect For Section */}
            <div className="space-y-12">
              <h2 className="text-4xl font-bold text-center text-gray-800">
                Perfect for Everyone
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600">
                      Creators & Visual Storytellers
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Accelerate your creative process with our advanced
                    text-to-video AI engine.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 10x faster video production</li>
                    <li>• Perfect for prototyping</li>
                    <li>• No rendering farm required</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600">
                      Marketing & Branding Teams
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Produce compelling product videos and social content in
                    minutes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Easy API integration</li>
                    <li>• Consistent brand styling</li>
                    <li>• Scalable content production</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-600">
                      Educators & Course Designers
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Create engaging visual lessons and educational explainers
                    effortlessly.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Boost engagement rates</li>
                    <li>• Simplify complex topics</li>
                    <li>• Perfect for online learning</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center space-y-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold">
                Ready to Transform Your Video Creation?
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Join thousands of creators, marketers, and educators who are
                already using {siteName} to revolutionize their video production
                workflow.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/" className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6" />
                  <span>Start Creating Today</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
