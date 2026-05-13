import Link from "next/link";

// #################################
// ### Navbar Component
// #################################

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between p-6 text-2xl bg-gray-800">
        <Link href={"/"} className="text-white">
          CodeFlow.
        </Link>
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
      </nav>
    </div>
  );
}
