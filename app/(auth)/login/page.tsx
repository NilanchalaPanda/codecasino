// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import GoogleButton from "@/components/auth/GoggleButton";

// export default function LoginPage() {
//   const router = useRouter();
//   const supabase = createClient();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (session) router.push("/dashboard");
//     };

//     checkUser();
//   }, [supabase, router]);

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
//       {/* Left Side - Hero Section */}
//       <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-8 lg:px-24 py-16">
//         <div className="max-w-lg">
//           <h1 className="text-5xl font-extrabold mb-4">
//             <span role="img" aria-label="slot">
//               🎰
//             </span>{" "}
//             <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
//               CodeCasino
//             </span>
//           </h1>
//           <p className="text-slate-300 text-lg mb-10 leading-relaxed">
//             Compete in real-time coding challenges, win rewards, and join a
//             global community of developers pushing their limits.
//           </p>

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-slate-300">
//             <Feature icon="⚡" text="Fast" />
//             <Feature icon="🏆" text="Rewards" />
//             <Feature icon="📊" text="Progress" />
//             <Feature icon="👥" text="Community" />
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Login Card */}
//       <div className="flex-1 flex justify-center items-center bg-white/5 backdrop-blur-xl px-8 py-20 lg:py-0">
//         <div className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10">
//           <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-300 to-pink-400 bg-clip-text text-transparent mb-8">
//             Welcome Back
//           </h2>

//           {error && (
//             <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 mb-6 text-red-400 text-sm">
//               {error}
//             </div>
//           )}

//           <GoogleButton onClick={() => setLoading(true)} disabled={loading} />

//           <p className="text-center text-slate-400 text-sm mt-8">
//             By logging in, you agree to our{" "}
//             <a
//               href="#"
//               className="text-indigo-400 hover:text-pink-400 transition-colors"
//             >
//               Terms of Service
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Feature({ icon, text }: { icon: string; text: string }) {
//   return (
//     <div className="flex flex-col items-center lg:items-start gap-1 hover:scale-105 transition-transform duration-200">
//       <span className="text-2xl">{icon}</span>
//       <p>{text}</p>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Code, User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const url =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL_DEV
      : process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL_PROD;

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${url}api/auth/callback`,
        },
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would handle the login logic here
      if (email === "demo@example.com" && password === "password") {
        // Successful login
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-cyan/10 rounded-full mix-blend-overlay filter blur-xl"></div>
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-xl"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="h-8 w-8 text-cyan" />
              <h1 className="font-display text-2xl text-foreground">
                CodeCasino
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-center text-foreground">
              Welcome Back
            </h2>
            <p className="text-center text-gray-400 text-sm mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 rounded border border-red-500/50 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:border-cyan focus:ring-2 focus:ring-cyan/30 text-foreground placeholder-gray-400 transition-all"
                  placeholder="Email address"
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:border-cyan focus:ring-2 focus:ring-cyan/30 text-foreground placeholder-gray-400 transition-all"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="mt-4 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-400 hover:text-cyan transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                isLoading
                  ? "bg-cyan/50 cursor-not-allowed"
                  : "bg-cyan hover:bg-cyan/90 text-background"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">•••</span>
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <button className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-foreground flex items-center justify-center gap-2 transition-colors">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 1.467-4.72 1.467-3.03 0-5.66-2.13-5.66-5.25S7.53 7.09 10.56 7.09c1.56 0 2.52.47 3.28 1.09 1.41-1.41 3.5-2.48 6.14-2.48 1.14 0 2.2.2 3.13.65v2.24H12.48z" />
                </svg>
                Continue with GitHub
              </button>
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-foreground flex items-center justify-center gap-2 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 1.467-4.72 1.467-3.03 0-5.66-2.13-5.66-5.25S7.53 7.09 10.56 7.09c1.56 0 2.52.47 3.28 1.09 1.41-1.41 3.5-2.48 6.14-2.48 1.14 0 2.2.2 3.13.65v2.24H12.48z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan hover:text-cyan/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
