"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { REGEX, VALIDATION_MESSAGE } from "@/lib/types";

export async function updateAccount(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    const updateData: any = {
      name: formData.name,
      email: formData.email,
    };

    if (!REGEX.USERNAME.test(formData.name)) {
      return { error: VALIDATION_MESSAGE.USERNAME };
    }

    if (!REGEX.EMAIL.test(formData.email)) {
      return { error: VALIDATION_MESSAGE.EMAIL };
    }

    if (formData.password && formData.password.trim() !== "") {
      if (!REGEX.PASSWORD.test(formData.password)) {
        return { error: VALIDATION_MESSAGE.PASSWORD };
      }
      updateData.password = await bcrypt.hash(formData.password, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
    revalidatePath("/account");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Update Unvailabled" };
  }
}
