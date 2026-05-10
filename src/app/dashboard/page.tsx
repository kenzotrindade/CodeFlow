"use client";

import { signOut, useSession } from "next-auth/react";

// #################################
// ### Dashboard Page
// #################################

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {session && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p>Welcome, {session.user?.name || session.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
