"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddToCartButton } from "./AddToCartButton";
import { CoverImage } from "./CoverImage";
import type { CatalogBook } from "./types";
import { formatMXN } from "@/lib/format";

type BookCardProps = {
  book: CatalogBook;
};

export function BookCard({ book }: BookCardProps) {
  const isOut = book.stock <= 0;

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <Link
        href={`/libros/${book.id}`}
        className="group flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="relative aspect-2/3 overflow-hidden bg-slate-100">
          <CoverImage
            src={book.coverImageUrl}
            alt={`Portada de ${book.title}`}
            sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
          {isOut && (
            <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              Agotado
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 group-hover:text-indigo-600">
            {book.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500">{book.author}</p>
        </div>
      </Link>
      <div className="flex flex-col gap-2.5 border-t border-slate-100 p-3">
        <span className="text-base font-semibold text-slate-900">
          {formatMXN(book.price)}
        </span>
        <AddToCartButton
          bookId={book.id}
          title={book.title}
          author={book.author}
          price={book.price}
          coverImageUrl={book.coverImageUrl}
          stock={book.stock}
          className="w-full"
        />
      </div>
    </motion.article>
  );
}
