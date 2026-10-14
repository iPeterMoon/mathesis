import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getBookById } from "@/lib/services/books.service";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { CoverImage } from "@/components/catalog/CoverImage";
import { formatMXN } from "@/lib/format";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

// Deduplica la consulta entre generateMetadata y la página (misma request)
const getBook = cache(getBookById);

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);

  if (!book || !book.isActive) {
    return { title: "Libro no encontrado" };
  }

  const description =
    book.description ??
    `${book.title}, de ${book.author}${book.publisher ? ` — ${book.publisher}` : ""}. Disponible en Mathesis.`;

  return {
    title: book.title,
    description: description.slice(0, 160),
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book || !book.isActive) notFound();

  const price = Number(book.price.toString());
  const isOut = book.stock <= 0;

  const specs: { label: string; value: string }[] = [
    { label: "Editorial", value: book.publisher ?? "—" },
    { label: "Idioma", value: book.language ?? "—" },
    { label: "Páginas", value: book.pageCount ? String(book.pageCount) : "—" },
    { label: "ISBN", value: book.isbn },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
        Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
        <div className="mx-auto w-full max-w-xs lg:max-w-none">
          <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <CoverImage
              src={book.coverImageUrl}
              alt={`Portada de ${book.title}`}
              sizes="(min-width: 1024px) 340px, 80vw"
              priority
            />
            {isOut && (
              <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                Agotado
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-indigo-600">{book.author}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {book.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-semibold text-slate-900">
              {formatMXN(price)}
            </span>
            {isOut ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Agotado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                En existencia · {book.stock} disponibles
              </span>
            )}
          </div>

          <div className="mt-6 max-w-sm">
            <AddToCartButton
              bookId={book.id}
              title={book.title}
              author={book.author}
              price={price}
              coverImageUrl={book.coverImageUrl}
              stock={book.stock}
              size="lg"
            />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-200 pt-6 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {spec.label}
                </dt>
                <dd
                  className={`mt-1 text-sm text-slate-900 ${
                    spec.label === "ISBN" ? "font-mono" : ""
                  }`}
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          {book.description && (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-medium text-slate-900">Descripción</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {book.description}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
