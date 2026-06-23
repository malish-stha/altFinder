"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-white hover:opacity-80 transition-opacity">
            AltFinder
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              Directory
            </Link>
            <Link href="/add" className="text-sm text-white/70 hover:text-white transition-colors">
              Generate
            </Link>
          </nav>
        </div>

        {/* Profile & Authentication Button */}
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <Link 
              href="/profile" 
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Profile
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "border border-white/10 w-8 h-8 rounded-full"
                }
              }}
            />
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm px-4 py-2 text-white/70 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </div>
    </header>
  );
}
