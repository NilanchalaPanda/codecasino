"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Trophy, Code2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-indigo-400">🎰</span>
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            CodeCasino
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 font-medium text-indigo-400 hover:bg-indigo-500/10 transition"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-2 font-medium text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-32 md:px-12">
        {/* Main Headline */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-5xl md:text-7xl font-black">
            <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Compete. Code. Win.
            </span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-slate-300">
            Join competitive LeetCode contests and win VP points or real money.
            Test your skills against the best coders.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 px-8 py-4 font-semibold text-white hover:shadow-xl hover:shadow-indigo-500/50 transition transform hover:scale-105"
            >
              Start Playing
            </Link>
            <button className="rounded-lg border-2 border-indigo-400 px-8 py-4 font-semibold text-indigo-400 hover:bg-indigo-500/10 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl bg-slate-800/50 border border-indigo-500/20 p-8 backdrop-blur hover:border-indigo-500/50 transition">
            <Zap className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Real-Time Battles
            </h3>
            <p className="text-slate-400">
              Compete live with other coders. See the leaderboard update in
              real-time as everyone solves problems.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-slate-800/50 border border-pink-500/20 p-8 backdrop-blur hover:border-pink-500/50 transition">
            <Trophy className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Win Big Prizes
            </h3>
            <p className="text-slate-400">
              Top performers earn VP points or real money. Climb tiers and
              unlock exclusive rewards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-slate-800/50 border border-indigo-500/20 p-8 backdrop-blur hover:border-indigo-500/50 transition">
            <Code2 className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              LeetCode Problems
            </h3>
            <p className="text-slate-400">
              Authentic LeetCode problems. Choose your difficulty and compete at
              your level.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-6 py-8 text-center text-slate-400">
        <p>© 2024 CodeCasino. Building competitive coding communities.</p>
      </div>
    </div>
  );
}
