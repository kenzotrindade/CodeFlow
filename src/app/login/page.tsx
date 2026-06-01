"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
      <div className="card-fragment w-full max-w-md">
        <h1 className="text-4xl font-black italic mb-8 tracking-tighter uppercase">
          CONNEXION
        </h1>

        {isRegistered && !error && (
          <div className="mb-6 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-200 text-xs font-bold uppercase tracking-widest">
            Compte créé. Identifiez-vous.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-200 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
              Identifiant Email
            </label>
            <input
              id="email"
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
            <label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
              Clef d&apos;accès
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-prism"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
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

        <div className="mt-12 flex flex-col gap-6 items-center">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-pink-500 transition-colors border-b border-white/10 pb-1"
            disabled={loading}
          >
            Continuer avec GitHub
          </button>

          <p className="text-xs text-purple-200/40 font-medium italic">
            Nouveau ici ?{" "}
            <Link href="/register" className="text-pink-500 hover:underline">
              Créez votre fragment
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="text-white font-black italic animate-pulse p-20">
          CHARGEMENT...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
