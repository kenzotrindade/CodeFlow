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
    select: {
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>My Account</h1>
      <AccountForm user={user}></AccountForm>
    </div>
  );
}
