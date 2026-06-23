import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountForm from "@/components/AccountForm";
import { User } from "lucide-react";
import type { Metadata } from "next";

// #################################
// ### Account Page
// #################################

export const metadata: Metadata = {
  title: "Profil | CodeFlow",
  description:
    "Gérez vos paramètres utilisateur, mettez à jour vos identifiants et personnalisez votre expérience CodeFlow.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, password: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-6 max-w-475 pt-12 pb-20">
      <header className="mb-16 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2">
            VOTRE PROFIL
          </h1>
          <div className="h-1.5 w-32 bg-pink-500 mb-6" aria-hidden="true" />
          <p className="text-[12px] text-purple-100/80 font-mono tracking-[0.4em] uppercase flex items-center gap-3">
            <User className="w-4 h-4 text-pink-500" aria-hidden="true" />
            Paramètres de l&apos;utilisateur
          </p>
        </div>
      </header>

      <section
        className="card-fragment p-8 lg:p-12 border-white/10 max-w-5xl mx-auto"
        aria-label="Formulaire de modification de profil"
      >
        <AccountForm user={user} />
      </section>
    </div>
  );
}
