"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GoogleButton from "@/components/auth/GoggleButton";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) router.push("/dashboard");
    };

    checkUser();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
      {/* Left Side - Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-8 lg:px-24 py-16">
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold mb-4">
            <span role="img" aria-label="slot">
              🎰
            </span>{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              CodeCasino
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Compete in real-time coding challenges, win rewards, and join a
            global community of developers pushing their limits.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-slate-300">
            <Feature icon="⚡" text="Fast" />
            <Feature icon="🏆" text="Rewards" />
            <Feature icon="📊" text="Progress" />
            <Feature icon="👥" text="Community" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="flex-1 flex justify-center items-center bg-white/5 backdrop-blur-xl px-8 py-20 lg:py-0">
        <div className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-300 to-pink-400 bg-clip-text text-transparent mb-8">
            Welcome Back
          </h2>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          <GoogleButton onClick={() => setLoading(true)} disabled={loading} />

          <p className="text-center text-slate-400 text-sm mt-8">
            By logging in, you agree to our{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-pink-400 transition-colors"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start gap-1 hover:scale-105 transition-transform duration-200">
      <span className="text-2xl">{icon}</span>
      <p>{text}</p>
    </div>
  );
}
