"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth/session";
import {
  activateBook,
  createBook,
  deactivateBook,
  deleteBook,
  updateBook,
} from "@/lib/services/books.service";
import { bookSchema } from "@/lib/validations/book.schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export type BookFormValues = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  language: string;
  description: string;
  pageCount: string;
  price: string;
  stock: string;
  coverImageUrl: string;
};

export type BookFormResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof BookFormValues, string[]>>;
    };

const requireSession = async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
};

const optionalText = (value: string) => value.trim() || undefined;

// Convierte los valores del formulario (strings) al formato que espera el schema
const parseBookForm = (values: BookFormValues) =>
  bookSchema.safeParse({
    isbn: values.isbn.trim(),
    title: values.title.trim(),
    author: values.author.trim(),
    publisher: optionalText(values.publisher),
    language: optionalText(values.language),
    description: optionalText(values.description),
    pageCount: values.pageCount ? Number(values.pageCount) : undefined,
    price: Number(values.price),
    stock: Number(values.stock),
    coverImageUrl: values.coverImageUrl,
  });

const handleBookError = (error: unknown): BookFormResult => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      ok: false,
      error: "Ya existe un libro con ese ISBN",
      fieldErrors: { isbn: ["Este ISBN ya está registrado"] },
    };
  }
  console.error(error);
  return { ok: false, error: "Ocurrió un error al guardar el libro" };
};

export async function createBookAction(values: BookFormValues): Promise<BookFormResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "Tu sesión expiró, vuelve a iniciar sesión" };
  }

  const parsed = parseBookForm(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los campos marcados",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await createBook(parsed.data);
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return handleBookError(error);
  }
}

export async function updateBookAction(
  id: string,
  values: BookFormValues,
): Promise<BookFormResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "Tu sesión expiró, vuelve a iniciar sesión" };
  }

  const parsed = parseBookForm(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los campos marcados",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;
  try {
    await updateBook(id, {
      ...data,
      // Si el usuario vació un campo opcional, se guarda como null
      publisher: data.publisher ?? null,
      language: data.language ?? null,
      description: data.description ?? null,
      pageCount: data.pageCount ?? null,
    });
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return handleBookError(error);
  }
}

export async function setBookActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await requireSession();
    if (isActive) {
      await activateBook(id);
    } else {
      await deactivateBook(id);
    }
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "No se pudo actualizar el estado del libro" };
  }
}

export async function removeBook(id: string): Promise<ActionResult> {
  try {
    await requireSession();
    await deleteBook(id);
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "No se pudo eliminar el libro" };
  }
}
