import Link from "next/link";
import {
  listActiveBooks,
  searchBooks,
  type CatalogSort,
} from "@/lib/services/books.service";
import type { Book } from "@/generated/prisma/client";
import { BookGrid } from "@/components/catalog/BookGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { SearchBar } from "@/components/catalog/SearchBar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { DEFAULT_SORT, isCatalogSort } from "@/components/catalog/sorts";
import type { CatalogBook } from "@/components/catalog/types";

type HomePageProps = {
  searchParams: Promise<{ q?: string; page?: string; orden?: string }>;
};

const PAGE_SIZE = 12;

const toCatalogBook = (book: Book): CatalogBook => ({
  id: book.id,
  title: book.title,
  author: book.author,
  price: Number(book.price.toString()),
  stock: book.stock,
  coverImageUrl: book.coverImageUrl,
});

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const sort: CatalogSort = isCatalogSort(params.orden) ? params.orden : DEFAULT_SORT;

  const { books, pagination } = query
    ? await searchBooks(query, { page, pageSize: PAGE_SIZE, sort })
    : await listActiveBooks({ page, pageSize: PAGE_SIZE, sort });

  const catalogBooks = books.map(toCatalogBook);
  const clearHref = sort === DEFAULT_SORT ? "/" : `/?orden=${sort}`;

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Encuentra tu próximo libro
          </h1>
          <p className="mt-2 text-slate-600">
            Busca por título, autor, ISBN o editorial.
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBar initialQuery={query} orden={sort} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {catalogBooks.length === 0 ? (
          <EmptyState
            title={
              query
                ? "No encontramos libros con esa búsqueda"
                : "Aún no hay libros en el catálogo"
            }
            description={
              query
                ? "Prueba con otro término: revisa la ortografía o busca por autor o ISBN."
                : "Vuelve pronto, estamos cargando nuevos títulos."
            }
            showClear={Boolean(query)}
          />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <p className="text-sm text-slate-600">
                {query ? (
                  <>
                    {pagination.total}{" "}
                    {pagination.total === 1 ? "resultado" : "resultados"} para{" "}
                    <span className="font-medium text-slate-900">«{query}»</span>
                  </>
                ) : (
                  <>
                    {pagination.total}{" "}
                    {pagination.total === 1 ? "libro" : "libros"} en el catálogo
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {query && (
                  <Link
                    href={clearHref}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                    Limpiar búsqueda
                  </Link>
                )}
                <SortSelect value={sort} q={query} />
              </div>
            </div>

            <BookGrid books={catalogBooks} />
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              q={query}
              orden={sort}
            />
          </>
        )}
      </section>
    </>
  );
}

function EmptyState({
  title,
  description,
  showClear,
}: {
  title: string;
  description: string;
  showClear: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="h-12 w-12 text-slate-400"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <h2 className="mt-4 text-lg font-medium text-slate-900">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {showClear && (
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          Ver todo el catálogo
        </Link>
      )}
    </div>
  );
}
