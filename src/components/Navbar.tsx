"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// #################################
// ### Navbar Layout
// #################################

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
        >
          DevLearning.io
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="hover:text-blue-400 transition-colors text-sm font-medium"
        >
          Cours
        </Link>

        {status === "authenticated" ? (
          <>
            <Link
              href="/dashboard"
              className="hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-slate-800 hover:bg-slate-700 text-sm px-4 py-2 rounded-md transition-all border border-slate-700"
            >
              Déconnexion
            </button>
          </>
        ) : status === "unauthenticated" ? (
          <>
            <Link
              href="/login"
              className="hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md transition-all font-semibold shadow-lg shadow-blue-900/20"
            >
              S'inscrire
            </Link>
          </>
        ) : (
          <div className="h-8 w-20 animate-pulse bg-slate-800 rounded-md"></div>
        )}
      </div>
    </nav>
  );
}
