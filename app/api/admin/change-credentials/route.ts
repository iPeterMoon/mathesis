import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { compare, encode } from "@/lib/auth/password";
import type { Prisma } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { currentPassword, newUser, newPassword, confirmPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json({ error: "La contraseña actual es requerida" }, { status: 400 });
    }

    if (!newUser && !newPassword && !confirmPassword) {
      return NextResponse.json({ error: "Debe cambiar al menos un campo" }, { status: 400 });
    }

    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: "Completa las contraseñas" }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
      }
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

    const updateData: Prisma.AdminUpdateInput = {};
    if (newUser && newUser.trim()) {
      const trimmed = newUser.trim();
      if (trimmed !== admin.user) {
        const exists = await prisma.admin.findUnique({ where: { user: trimmed } });
        if (exists) {
          return NextResponse.json({ error: "El nombre de usuario ya está en uso" }, { status: 400 });
        }
        updateData.user = trimmed;
      }
    }
    if (newPassword) {
      updateData.passwordHash = await encode(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
    }

    await prisma.admin.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({ message: "Credenciales actualizadas exitosamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar las credenciales" }, { status: 500 });
  }
}
