"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// #################################
// ### Navbar Layout
// #################################

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Login", href: "/login" },
  { name: "Sign in", href: "/signin" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black text-white p-4 flex justify-center gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors font-medium ${pathname === link.href ? "text-white" : "text-zinc-400"}`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
