"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// #################################
// ### Login Page & Auth
// #################################

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe invalide");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Connexion</h1>

        {isRegistered && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
            Compte créé ! Veuillez vous connecter.
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

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
        <button
          type="submit"
          className={`p-2 rounded text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          disabled={loading}
        >
          Se connecter avec GitHub
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
