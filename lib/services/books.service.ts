import prisma from '@/lib/db/prisma';
import { CreateBookDTO } from '@/lib/types/index';
import { Prisma } from '@/generated/prisma/client';
import { BookWhereInput } from '@/generated/prisma/internal/prismaNamespaceBrowser';

    export const createBook = async (data: CreateBookDTO) => {
    return prisma.book.create({
        data: {
            ...data,
            price: data.price.toFixed(2), // Ensure price is stored with two decimal places
        },
    });
}

/** Opciones de orden del catálogo público. */
export type CatalogSort =
    | "recientes"
    | "precio-asc"
    | "precio-desc"
    | "titulo-asc"
    | "titulo-desc";

type PaginationParams = {
    page?: number;
    pageSize?: number;
    /** Ordenamiento del catálogo. Por defecto: los más recientes. */
    sort?: CatalogSort;
}

const SORT_ORDER_BY: Record<CatalogSort, Prisma.BookOrderByWithRelationInput> = {
    "recientes": { createdAt: "desc" },
    "precio-asc": { price: "asc" },
    "precio-desc": { price: "desc" },
    "titulo-asc": { title: "asc" },
    "titulo-desc": { title: "desc" },
};

export const getBooks = async (params: PaginationParams) => {
    const { page = 1, pageSize = 10, sort = "recientes" } = params;
    const skip = (page - 1 ) * pageSize;

    const [books, total ] = await Promise.all([
        prisma.book.findMany({
            skip,
            take: pageSize,
            orderBy: SORT_ORDER_BY[sort],
        }),
        prisma.book.count(),
    ]);
    return {
        books,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        }
     };
}

export const getActiveBooks = async (params: PaginationParams) => {
    const { page = 1, pageSize = 10, sort = "recientes" } = params;
    const skip = (page - 1 ) * pageSize;

    const [books, total ] = await Promise.all([
        prisma.book.findMany({
            where: { isActive: true },
            skip,
            take: pageSize,
            orderBy: SORT_ORDER_BY[sort],
        }),
        prisma.book.count(),
    ]);
    return {
        books,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        }
     };
}

export const getBookById = async (id: string) => {
    // Devuelve null si no existe. NO filtra por isActive: el caller decide.
    return prisma.book.findUnique({
        where: { id },
    });
}

export const updateBook = async (id: string, data: Prisma.BookUpdateInput) => {
    const updatedBook = await prisma.book.update({
        where: { id },
        data,
    })

    if (updatedBook.stock == 0) {
        // Si el stock es 0, desactivar el libro
        await prisma.book.update({
            where: { id },
            data: { isActive: false },
        });
    }

}

export const deactivateBook = async (id: string) => {
    return prisma.book.update({
        where: { id },
        data: { isActive: false },
    })
}

export const activateBook = async (id: string) => {
    return prisma.book.update({
        where: { id },
        data: { isActive: true },
    })
}

export const deleteBook = async (id: string) => {
    return prisma.book.delete({
        where: { id },
    })
}

type PagedBooksResult = {
  books: Awaited<ReturnType<typeof prisma.book.findMany>>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function searchBooks(
  query: string,
  options?: PaginationParams
): Promise<PagedBooksResult>;
export async function searchBooks(
  query: string,
  isActive?: boolean,
  options?: PaginationParams
): Promise<PagedBooksResult>;
export async function searchBooks(
  query: string,
  second: boolean | PaginationParams = true,
  third: PaginationParams = {}
): Promise<PagedBooksResult> {
  const isActive = typeof second === "boolean" ? second : true;
  const { page = 1, pageSize = 12, sort = "recientes" } =
    typeof second === "object" ? second : third;
  const skip = (page - 1) * pageSize;

  const where: BookWhereInput = {
    isActive,
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { author: { contains: query, mode: "insensitive" } },
      { isbn: { contains: query, mode: "insensitive" } },
      { publisher: { contains: query, mode: "insensitive" } },
    ],
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: SORT_ORDER_BY[sort],
      skip,
      take: pageSize,
    }),
    prisma.book.count({ where }),
  ]);

  return {
    books,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

/* ---------------------------------------------------------------
 * Catálogo público
 * ------------------------------------------------------------- */

export const listActiveBooks = async (params: PaginationParams = {}) => {
  return getActiveBooks(params);
};