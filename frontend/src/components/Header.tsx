"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07090e]/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white hover:opacity-90">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
              AltFinder
            </span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Explore Directory
            </Link>
            <Link href="/add" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Generate with AI
            </Link>
          </nav>
        </div>

        {/* Profile & Authentication Button */}
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <Link 
              href="/profile" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-2"
            >
              My Stack
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "border border-white/10 w-8 h-8 rounded-none"
                }
              }}
            />
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-none bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-md transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </div>
    </header>
  );
}
