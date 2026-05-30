import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-diff">
      <Link href="/" className="text-3xl font-black tracking-tighter">
        CODE
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: "1px white" }}
        >
          FLOW.
        </span>
      </Link>

      <div className="flex items-center gap-8">
        {session?.user ? (
          <>
            <div className="hidden md:flex gap-10 text-[16px] uppercase tracking-[0.3em] font-bold">
              <Link
                href="/techwatch"
                className="hover:text-pink-500 transition-colors"
              >
                Tech Watch
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-pink-500 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className="hover:text-pink-500 transition-colors"
              >
                Profil
              </Link>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-[16px] uppercase tracking-[0.3em] font-bold border-b border-white/20 hover:border-pink-500 transition-all"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold">
            <Link
              href="/login"
              className="hover:text-pink-500 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hover:text-pink-500 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
