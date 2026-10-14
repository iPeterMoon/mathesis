import { NextRequest, NextResponse } from "next/server";
import { getBooks, getActiveBooks, searchBooks, createBook } from "@/lib/services/books.service";
import { getSession } from "@/lib/auth/session";
import { bookSchema as schema } from "@/lib/validations/book.schema";
import { CreateBookDTO } from "@/lib/types/index";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const searchQuery = searchParams.get("search");
    const isActive = searchParams.get("isActive") === "true";

    if (searchQuery) {
        const result = await searchBooks(searchQuery, isActive, { page, pageSize });
        return NextResponse.json(result);
    } else {
        const result = isActive ? await getActiveBooks({ page, pageSize }) : await getBooks({ page, pageSize });
        return NextResponse.json(result);
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validation = schema.safeParse(data);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const bookData: CreateBookDTO = validation.data;

    const book = await createBook(bookData);
    
    return NextResponse.json(book, { status: 201 });
}