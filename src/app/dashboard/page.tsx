import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

// #################################
// ### Dashboard Page
// #################################

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="bg-slate-950 flex items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Accès Refusé</h1>
        <p className="text-slate-400 mb-8">
          Vous devez être connecté pour accéder à votre tableau de bord.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
        >
          Se Connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-white p-6 md:p-12 max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-slate-400">
          Bienvenue,{" "}
          <span className="text-blue-400 font-semibold">
            {session.user?.name}
          </span>
        </p>
      </header>
    </div>
  );
}
