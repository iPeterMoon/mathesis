import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { compare, encode } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.userId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrador no encontrado" }, { status: 404 });
    }

    const isValid = await compare(currentPassword, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
    }

    const passwordHash = await encode(newPassword);
    await prisma.admin.update({
      where: { id: session.userId },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar la contraseña" }, { status: 500 });
  }
}
