"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, LogOut, User, LayoutDashboard, Globe, BarChart3 } from "lucide-react";

// #################################
// ### Navbar Layout
// #################################

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/techwatch", label: "Veille Tech", icon: Globe },
    { href: "/dashboard", label: "Console", icon: LayoutDashboard },
    { href: "/exercises", label: "Statistiques", icon: BarChart3 },
    { href: "/account", label: "Profil", icon: User },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[120] px-6 py-4 md:px-12 md:py-8 flex justify-between items-center transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0414] to-transparent h-32 pointer-events-none -z-10 opacity-80" />
        
        <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter mix-diff">
          CODE
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1px white" }}
          >
            FLOW.
          </span>
        </Link>

        {/* Desktop Menu - Hidden below 1200px */}
        <div className="hidden min-[1201px]:flex items-center gap-12">
          {session?.user ? (
            <>
              <div className="flex gap-10 text-[14px] xl:text-[16px] uppercase tracking-[0.3em] font-black text-white/70">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-pink-500 transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-px bg-pink-500 transition-all group-hover:w-full" />
                  </Link>
                ))}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[14px] xl:text-[16px] uppercase tracking-[0.3em] font-black hover:text-pink-500 transition-colors relative group text-white/70"
              >
                Déconnexion
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-pink-500 transition-all group-hover:w-full" />
              </button>
            </>
          ) : (
            <div className="flex gap-10 text-[14px] xl:text-[16px] uppercase tracking-[0.3em] font-black">
              <Link href="/login" className="hover:text-pink-500 transition-colors">Connexion</Link>
              <Link href="/register" className="hover:text-pink-500 transition-colors">Inscription</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle - Fine icons with hover effect */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="min-[1201px]:hidden relative z-[130] p-2 text-white hover:text-pink-500 transition-colors"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className="relative w-8 h-8">
            <Menu className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} strokeWidth={1.5} />
            <X className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} strokeWidth={1.5} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[110] min-[1201px]:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#0a0414]/98 backdrop-blur-xl" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-12">
          {session?.user ? (
            <>
              <div className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-2xl font-black uppercase tracking-[0.2em] text-white hover:text-pink-500 transition-colors"
                  >
                    <link.icon className="w-6 h-6 text-pink-500" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}
                className="flex items-center gap-4 text-xl font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black uppercase tracking-[0.2em] text-white hover:text-pink-500 transition-colors"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black uppercase tracking-[0.2em] text-white hover:text-pink-500 transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/40">CodeFlow System v4.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
