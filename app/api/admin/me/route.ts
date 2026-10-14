import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.userId },
    select: { user: true },
  });

  if (!admin) {
    return NextResponse.json({ error: "Administrador no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ user: admin.user });
}
