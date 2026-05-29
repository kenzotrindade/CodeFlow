"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// #################################
// ### Register Page & Auth
// #################################

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const passwordRules = [
    { label: "12+ characters", test: (pw) => pw.length >= 12 },
    { label: "Uppercase", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Lowercase", test: (pw) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw) => /[0-9]/.test(pw) },
    { label: "Special character", test: (pw) => /[@$!%*?&]/.test(pw) },
  ];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Register error");
      }

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unkown error during register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Inscription</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nom"
          className="p-2 border rounded text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="p-2 border rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <div className="mt-2 space-y-1">
          {passwordRules.map((rule, i) => {
            const isOk = rule.test(password);
            return (
              <div
                key={i}
                className={`text-xs flex items-center gap-1 ${isOk ? "text-green-600" : "text-gray-800"}`}
              >
                <span>
                  {isOk ? (
                    <span>{rule.label + " OK"}</span>
                  ) : (
                    <span>{rule.label + " NO"}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className={`p-2 rounded text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          disabled={loading}
        >
          Register with Github
        </button>
      </div>
    </div>
  );
}
