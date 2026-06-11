"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// #################################
// ### Login Content
// #################################

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <section className="card-fragment w-full max-w-md border-white/10" aria-labelledby="login-title">
        <h1 id="login-title" className="text-4xl font-black italic mb-8 tracking-tighter uppercase text-white">
          CONNEXION
        </h1>

        {isRegistered && !error && (
          <div role="alert" className="mb-6 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-100 text-xs font-bold uppercase tracking-widest">
            Compte créé. Identifiez-vous.
          </div>
        )}

        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-100 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`btn-prism w-full mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "INITIALISATION..." : "ENTRER DANS LE FLUX"}
          </button>
        </form>

        <footer className="mt-12 flex flex-col gap-6 items-center">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-pink-500 transition-colors border-b border-white/20 pb-1"
            disabled={loading}
          >
            Continuer avec GitHub
          </button>

          <p className="text-xs text-purple-100/50 font-medium italic">
            Nouveau ici ?{" "}
            <Link href="/register" className="text-pink-500 hover:underline">
              Créez votre fragment
            </Link>
          </p>
        </footer>
      </section>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="text-white font-black italic animate-pulse p-20 text-center" role="status">
          CHARGEMENT DU CENTRE D'ACCÈS...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
