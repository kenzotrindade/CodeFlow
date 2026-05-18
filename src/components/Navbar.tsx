import Link from "next/link";
import { auth } from "@/lib/auth";

// #################################
// ### Navbar Component
// #################################

export default async function Navbar() {
  const session = await auth();
  return (
    <div>
      <nav className="flex justify-between p-6 text-2xl bg-gray-800">
        <Link href={"/"} className="text-white">
          CodeFlow.
        </Link>
        <div>
          {session ? (
            <ul className="flex gap-6 text-blue-500 underline">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-blue-400">
                  Account
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-6 text-blue-500 underline">
              <li>
                <Link href="/login" className="hover:text-blue-400">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
