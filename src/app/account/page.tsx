import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountForm from "@/components/AccountForm";

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
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="mb-20 text-center">
        <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2">
          VOTRE PROFIL
        </h1>
        <div className="h-1 w-24 bg-pink-500 mx-auto mb-6" />
        <p className="text-purple-200/50 font-mono text-sm tracking-widest uppercase">
          Paramètres du fragment utilisateur
        </p>
      </div>

      <div className="card-fragment">
        <AccountForm user={user} />
      </div>
    </div>
  );
}
