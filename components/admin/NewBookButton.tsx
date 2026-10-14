"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { BookForm } from "@/components/admin/BookForm";

export function NewBookButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        Nuevo libro
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Agregar libro"
        description="Completa los datos y sube la portada."
      >
        <BookForm onCancel={() => setOpen(false)} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
