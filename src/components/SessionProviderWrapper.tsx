"use client";

import { SessionProvider } from "next-auth/react";

// #################################
// ### Session Provider
// #################################

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
