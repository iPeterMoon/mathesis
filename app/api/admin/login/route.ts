import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { compare } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  const { user, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { user },
  });

  if (!admin) {
    return NextResponse.json({ error: "Nombre o contraseña incorrectos" }, { status: 401 });
  }

  if (!compare(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Nombre o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(admin.id);

  return NextResponse.json({ message: "Inicio de sesión exitoso!" });
}