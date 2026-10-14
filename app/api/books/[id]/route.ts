import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { updateBook, deleteBook, getBookById, activateBook, deactivateBook } from "@/lib/services/books.service";
import { getSession } from "@/lib/auth/session";
import { bookSchema as schema } from "@/lib/validations/book.schema";

type RouteContext = { params: Promise<{ id: string }> };

const statusSchema = z.object({ isActive: z.boolean() });

const parseJson = async (request: NextRequest) => {
    try {
        return await request.json();
    } catch {
        return null;
    }
};

//Obtiene un libro por su id
export async function GET(request: NextRequest, { params }: RouteContext) {
    const { id } = await params;
    const book = await getBookById(id);
    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
}

//Actualiza los datos de un libro por su id
export async function PUT(request: NextRequest, { params }: RouteContext) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const validation = schema.safeParse(await parseJson(request));
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const updatedBook = await updateBook(id, validation.data);
    return NextResponse.json(updatedBook);
}

// Elimina un libro por su id
export async function DELETE(request: NextRequest, { params }: RouteContext) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deletedBook = await deleteBook(id);
    return NextResponse.json(deletedBook);
}

// Cambia el estado activo de un libro por su id
export async function PATCH(request: NextRequest, { params }: RouteContext) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const validation = statusSchema.safeParse(await parseJson(request));
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const updatedBook = validation.data.isActive
        ? await activateBook(id)
        : await deactivateBook(id);
    return NextResponse.json(updatedBook);
}
