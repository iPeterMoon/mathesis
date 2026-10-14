"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { removeBook, setBookActive } from "@/app/admin/actions";
import { Modal } from "@/components/admin/Modal";
import { BookForm } from "@/components/admin/BookForm";

export type BookRow = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string | null;
  language: string | null;
  description: string | null;
  pageCount: number | null;
  coverImageUrl: string;
  price: string;
  stock: number;
  isActive: boolean;
};

type BookTableProps = {
  books: BookRow[];
};

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const BookTable = ({ books }: BookTableProps) => {
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<BookRow | null>(null);

  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        Aún no hay libros registrados. Usa el botón <strong>Nuevo libro</strong> para agregar el primero.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Libro</th>
              <th className="px-4 py-3 font-medium">ISBN</th>
              <th className="px-4 py-3 text-right font-medium">Precio</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <BookTableRow
                key={book.id}
                book={book}
                onError={setError}
                onEdit={() => setEditingBook(book)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={editingBook !== null}
        onClose={() => setEditingBook(null)}
        title="Editar libro"
        description={editingBook?.title}
      >
        {editingBook && (
          <BookForm
            key={editingBook.id}
            book={editingBook}
            onCancel={() => setEditingBook(null)}
            onSuccess={() => setEditingBook(null)}
          />
        )}
      </Modal>
    </div>
  );
};

function BookTableRow({
  book,
  onError,
  onEdit,
}: {
  book: BookRow;
  onError: (message: string | null) => void;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    onError(null);
    startTransition(async () => {
      const result = await setBookActive(book.id, !book.isActive);
      if (!result.ok) onError(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm(`¿Eliminar "${book.title}"? Esta acción no se puede deshacer.`)) return;
    onError(null);
    startTransition(async () => {
      const result = await removeBook(book.id);
      if (!result.ok) onError(result.error);
    });
  };

  return (
    <tr className={`transition-opacity ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={book.coverImageUrl}
            alt={`Portada de ${book.title}`}
            width={40}
            height={60}
            className="h-15 w-10 shrink-0 rounded object-cover ring-1 ring-slate-200"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{book.title}</p>
            <p className="truncate text-slate-500">{book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{book.isbn}</td>
      <td className="px-4 py-3 text-right tabular-nums text-slate-900">
        {currency.format(Number(book.price))}
      </td>
      <td
        className={`px-4 py-3 text-right tabular-nums ${
          book.stock === 0 ? "font-medium text-red-600" : "text-slate-900"
        }`}
      >
        {book.stock}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          role="switch"
          aria-checked={book.isActive}
          aria-label={book.isActive ? "Marcar como inactivo" : "Marcar como activo"}
          onClick={handleToggle}
          disabled={isPending}
          className="group inline-flex items-center gap-2 disabled:cursor-wait"
        >
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              book.isActive ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                book.isActive ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className={book.isActive ? "text-emerald-700" : "text-slate-500"}>
            {book.isActive ? "Activo" : "Inactivo"}
          </span>
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={isPending}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-wait"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-wait"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
