"use client";

import React, { useState } from "react";
import {
  Code2,
  Home,
  Swords,
  LayoutDashboard,
  ShoppingBag,
  Crown,
  User,
  Bell,
} from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Battle", href: "/battle", icon: Swords },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Store", href: "/store", icon: ShoppingBag },
];

export default function Navbar() {
  const [activeRoute, setActiveRoute] = useState("/");

  const navigate = (href: React.SetStateAction<string>) => {
    // In a production app, this would be a router call (e.g., router.push(href))
    setActiveRoute(href);
    console.log(`Navigating to: ${href}`);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-10 py-3 bg-[#0d0d0d] shadow-lg shadow-black/50">
      {/* Left Logo */}
      <a
        href="/"
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-[#00d9ff] text-xl sm:text-2xl font-display transition-all duration-300 hover:scale-[1.05]"
      >
        <Code2 className="h-7 w-7 text-[#00d9ff]" />
        <span>CodeCasino</span>
      </a>

      {/* Middle Nav Links */}
      <div className="flex items-center gap-1 sm:gap-2">
        {navLinks.map(({ name, href, icon: Icon }) => {
          // FIX: Compare against the local state for active status
          const isActive = activeRoute === href;
          return (
            <a
              key={name}
              href="#00d9ff"
              onClick={() => navigate(href)}
              className={clsx(
                "flex items-center gap-1 sm:gap-2 text-sm sm:text-sm font-mono px-3 py-2 rounded-lg transition-all duration-300",
                isActive
                  ? "bg-cyan/10 border text-cyan border-[#00d9ff]/20"
                  : "text-gray-400 hover:text-[#00d9ff] hover:bg-cyan/8"
              )}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{name}</span>
            </a>
          );
        })}
      </div>

      {/* Right Side - VP, Notification, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* VP Display with Bordered Look */}
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-800 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#ffa500] font-semibold border border-gray-700 shadow-sm shadow-orange-900/50">
          <Crown size={16} className="text-[#ffa500]" />
          <span className="hidden sm:inline">2,450 VP</span>
          <span className="sm:hidden">2.4K</span>
        </div>

        {/* Notification Icon (Restyled) */}
        <button className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-[#00d9ff] transition duration-300 shadow-sm hover:shadow-cyan-900/50">
          <Bell size={18} className="text-gray-400 hover:text-[#00d9ff]" />
        </button>

        {/* User Icon (Restyled) */}
        <button className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-[#00d9ff] transition duration-300 shadow-sm hover:shadow-cyan-900/50">
          <User size={18} className="text-gray-400 hover:text-[#00d9ff]" />
        </button>
      </div>
    </nav>
  );
}
