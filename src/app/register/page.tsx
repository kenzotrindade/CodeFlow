"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordRules = [
    { label: "8+ caractères", test: (pw: string) => pw.length >= 12 },
    { label: "Majuscule", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Minuscule", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "Chiffre", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "Symbole", test: (pw: string) => /[@$!%*?&]/.test(pw) },
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
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="card-fragment w-full max-w-md">
        <h1
          className="text-4xl font-black italic mb-8 tracking-tighter uppercase text-transparent"
          style={{ WebkitTextStroke: "1px white" }}
        >
          INSCRIPTION
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-200 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
              Alias
            </label>
            <input
              type="text"
              placeholder="Votre nom"
              className="input-prism"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
              Identifiant Email
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="input-prism"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
              Clef d'accès
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-prism"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            {passwordRules.map((rule, i) => {
              const isOk = rule.test(password);
              return (
                <div
                  key={i}
                  className={`text-[9px] uppercase tracking-tighter font-bold flex items-center gap-2 ${isOk ? "text-green-400" : "text-purple-100/20"}`}
                >
                  <div
                    className={`w-1 h-1 rotate-45 ${isOk ? "bg-green-400" : "bg-purple-100/20"}`}
                  />
                  {rule.label}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className={`btn-prism w-full mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "GÉNÉRATION..." : "FORGER LE COMPTE"}
          </button>
        </form>

        <div className="mt-12 flex flex-col gap-6 items-center">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-pink-500 transition-colors border-b border-white/10 pb-1"
            disabled={loading}
          >
            S'inscrire avec GitHub
          </button>

          <p className="text-xs text-purple-200/40 font-medium italic">
            Déjà un fragment ?{" "}
            <Link href="/login" className="text-pink-500 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
