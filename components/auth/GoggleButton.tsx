"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function GoogleButton({ onClick, disabled }: GoogleButtonProps) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      onClick?.();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3 py-3 px-4
        rounded-lg font-medium
        bg-white text-slate-900
        hover:bg-slate-100 active:scale-[0.99]
        transition-all border border-slate-200
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {/* Google "G" icon (simple SVG inline since lucide doesn’t include it) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.3 0 24 0 14.6 0 6.4 5.3 2.5 13l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.5-9.5 6.5-16.9z"
        />
        <path
          fill="#4A90E2"
          d="M24 48c6.3 0 11.6-2.1 15.4-5.7l-7.1-5.5c-2 1.4-4.6 2.3-8.3 2.3-6.4 0-11.8-4.3-13.8-10.2l-7.9 6.1C6.4 42.7 14.6 48 24 48z"
        />
        <path
          fill="#FBBC05"
          d="M10.2 28.9c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4l-7.9-6.1C1.2 17.3 0 20.6 0 24s1.2 6.7 3.2 9.9l7-5z"
        />
      </svg>

      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <span>Continue with Google</span>
      )}
    </button>
  );
}
