"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// #################################
// ### Register Page
// #################################

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: "12+ caractères", test: (pw: string) => pw.length >= 12 },
    { label: "Majuscule", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Minuscule", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "Chiffre", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "Symbole", test: (pw: string) => /[@$!%*?&]/.test(pw) },
  ];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPasswordValid = passwordRules.every((rule) => rule.test(password));
    if (!isPasswordValid) {
      setError(
        "Veuillez respecter toutes les règles de sécurité du mot de passe.",
      );
      return;
    }

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

      router.push("/login?registered=true");
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
      <section
        className="card-fragment w-full max-w-md border-white/10"
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="text-4xl font-black italic mb-8 tracking-tighter uppercase text-white"
        >
          INSCRIPTION
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-100 text-xs font-bold uppercase tracking-widest"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-100/60"
            >
              Alias
            </label>
            <input
              id="name"
              type="text"
              placeholder="Votre nom"
              className="input-prism text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-100/60"
            >
              Identifiant Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="input-prism text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              title="Utilisez au moins 12 caractères avec majuscules, chiffres et symboles"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-100/60"
            >
              Clef d&apos;accès
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-prism text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div
            className="grid grid-cols-2 gap-2 my-2"
            aria-label="Règles de sécurité du mot de passe"
          >
            {passwordRules.map((rule, i) => {
              const isOk = rule.test(password);
              return (
                <div
                  key={i}
                  className={`text-xs uppercase tracking-tighter font-bold flex items-center gap-2 ${isOk ? "text-green-400" : "text-white/30"}`}
                >
                  <div
                    className={`w-1 h-1 rotate-45 ${isOk ? "bg-green-400" : "bg-white/10"}`}
                    aria-hidden="true"
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

        <footer className="mt-12 flex flex-col gap-6 items-center">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-[12px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-pink-500 transition-colors border-b border-white/20 pb-1"
            disabled={loading}
          >
            S&apos;inscrire avec GitHub
          </button>

          <p className="text-s text-purple-100/50 font-medium italic">
            Déjà un fragment ?{" "}
            <Link href="/login" className="text-pink-500 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </footer>
      </section>
    </div>
  );
}
