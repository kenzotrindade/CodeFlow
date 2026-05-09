export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between p-6 text-2xl bg-gray-800">
        <a href="/" className="text-white">
          Devolinguo.
        </a>
        <ul className="flex gap-6 text-blue-500 underline">
          <li>
            <a href="/login" className="hover:text-blue-400">
              Login
            </a>
          </li>
          <li>
            <a href="/register" className="hover:text-blue-400">
              Register
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
