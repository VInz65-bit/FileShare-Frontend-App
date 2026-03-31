"use client";

import Link from "next/link";
export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/60 border-b border-white/5 supports-[backdrop-filter]:bg-slate-950/40 shadow-sm shadow-emerald-500/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 sm:px-8">
        {/* logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-black text-xl tracking-tighter">F</span>
          </div>
          <span className="text-xl text-slate-100 tracking-tight">
            <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Student</span>
            <span className="font-light">Share</span>
          </span>
        </Link>

        {/* right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-2.5 px-5 rounded-full hover:bg-emerald-500/10 transition-colors"
            >
              Dashboard
            </Link>
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-400">G</span>
              </div>
              <span className="text-sm font-medium text-slate-300">
                 Malik Bandara
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
