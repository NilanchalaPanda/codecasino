"use client";
import React, { useState, useEffect } from "react";
import {
  Code2,
  Home,
  Swords,
  LayoutDashboard,
  ShoppingBag,
  Crown,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Battle", href: "/battle", icon: Swords },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leaderboard", href: "/leaderboard", icon: Crown },
  { name: "Store", href: "/store", icon: ShoppingBag },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Close mobile menu whenever the pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="relative bg-[#0d0d0d] shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-10 py-3">
        {/* Left Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="font-semibold flex items-center gap-2 text-[#00d9ff] text-xl sm:text-2xl font-display transition-all duration-300 hover:scale-[1.05]"
        >
          <Code2 className="h-7 w-7 text-[#00d9ff]" />
          <span>CodeCasino</span>
        </a>

        {/* Middle Nav Links (Desktop Only) */}
        <div className="hidden sm:flex items-center gap-2">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <a
                key={name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                }}
                className={clsx(
                  "flex items-center gap-2 text-sm font-mono px-3 py-2 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-gray-800 text-[#00d9ff] border border-[#00d9ff] shadow-md shadow-cyan-900/50 scale-[1.01]"
                    : "text-gray-400 hover:text-[#00d9ff] hover:scale-[1.03] hover:bg-gray-800"
                )}
              >
                <Icon size={18} />
                <span>{name}</span>
              </a>
            );
          })}
        </div>

        {/* Right Side - VP, Notification, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xs:flex items-center gap-1 sm:gap-2 bg-gray-800 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#ffa500] font-semibold border border-gray-700 shadow-sm shadow-orange-900/50">
            <Crown size={16} className="text-[#ffa500]" />
            <span className="hidden sm:inline">2,450 VP</span>
            <span className="sm:hidden">2.4K</span>
          </div>

          <Link href="/notifications" className="hover:cursor-pointer">
            <button
              className={`p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-[#00d9ff] transition duration-300 shadow-sm hover:shadow-cyan-900/50`}
            >
              <Bell size={18} className="text-gray-400 hover:text-[#00d9ff]" />
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-[#00d9ff] transition duration-300 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={20} className="text-[#00d9ff]" />
            ) : (
              <Menu size={20} className="text-[#00d9ff]" />
            )}
          </button>

          <Link href={"/profile"} className="hover:cursor-pointer">
            <button className="hidden sm:block p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-[#00d9ff] transition duration-300 shadow-sm hover:shadow-cyan-900/50">
              <User size={18} className="text-gray-400 hover:text-[#00d9ff]" />
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={clsx(
          "absolute w-full z-10 bg-[#0d0d0d] shadow-2xl transition-all duration-300 ease-in-out sm:hidden",
          isMenuOpen
            ? "max-h-screen opacity-100 py-2"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col px-4 space-y-2">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <a
                key={name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                }}
                className={clsx(
                  "flex items-center gap-3 text-base font-mono px-3 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-cyan/10 text-[#00d9ff] border border-[#00d9ff]/20"
                    : "text-gray-400 hover:text-[#00d9ff] hover:bg-gray-800"
                )}
              >
                <Icon size={20} />
                <span>{name}</span>
              </a>
            );
          })}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push("/profile");
            }}
            className="flex items-center gap-3 text-base font-mono px-3 py-3 rounded-lg text-gray-400 hover:text-[#00d9ff] hover:bg-gray-800 border-t border-gray-800 mt-2"
          >
            <User size={20} />
            <span>Profile</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
