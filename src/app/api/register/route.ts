import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { REGEX, VALIDATION_MESSAGE } from "@/lib/types";

// #################################
// ### Register Route Auth
// #################################

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Champs manquants" });
    }

    if (!REGEX.USERNAME.test(name))
      return NextResponse.json({ error: VALIDATION_MESSAGE.USERNAME });

    if (!REGEX.EMAIL.test(email))
      return NextResponse.json({ error: VALIDATION_MESSAGE.EMAIL });

    if (!REGEX.PASSWORD.test(password))
      return NextResponse.json({ error: VALIDATION_MESSAGE.PASSWORD });

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser)
      return NextResponse.json({ error: "Cet email est déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return NextResponse.json({ message: "Inscription réussie" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" });
  }
}
