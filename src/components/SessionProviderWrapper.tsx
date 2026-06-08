"use client";

import { SessionProvider } from "next-auth/react";

// #################################
// ### Session Provider
// #################################

export default function SessionProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
