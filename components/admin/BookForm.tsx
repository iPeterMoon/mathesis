"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  createBookAction,
  updateBookAction,
  type BookFormResult,
  type BookFormValues,
} from "@/app/admin/actions";
import type { BookRow } from "@/components/admin/BookTable";

type BookFormProps = {
  /** Si se pasa un libro, el formulario funciona en modo edición */
  book?: BookRow;
  onCancel: () => void;
  onSuccess: () => void;
};

type FieldErrors = Extract<BookFormResult, { ok: false }>["fieldErrors"];

const toFormValues = (book?: BookRow): BookFormValues => ({
  isbn: book?.isbn ?? "",
  title: book?.title ?? "",
  author: book?.author ?? "",
  publisher: book?.publisher ?? "",
  language: book?.language ?? "",
  description: book?.description ?? "",
  pageCount: book?.pageCount?.toString() ?? "",
  price: book?.price ?? "",
  stock: book?.stock.toString() ?? "0",
  coverImageUrl: book?.coverImageUrl ?? "",
});

export function BookForm({ book, onCancel, onSuccess }: BookFormProps) {
  const isEditing = Boolean(book);
  const [values, setValues] = useState<BookFormValues>(() => toFormValues(book));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const setField = (field: keyof BookFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!values.coverImageUrl) {
      setFieldErrors((prev) => ({ ...prev, coverImageUrl: ["Sube una portada"] }));
      return;
    }

    startTransition(async () => {
      const result = book
        ? await updateBookAction(book.id, values)
        : await createBookAction(values);

      if (result.ok) {
        onSuccess();
      } else {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  };

  const inputProps = (field: keyof BookFormValues) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setField(field, event.target.value),
    "aria-invalid": Boolean(fieldErrors?.[field]?.length),
    "aria-describedby": fieldErrors?.[field]?.length ? `${field}-error` : undefined,
    className: inputClassName,
  });

  const isBusy = isPending || isUploading;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto px-6 py-5 sm:grid-cols-[200px_1fr]">
        {/* Portada */}
        <div>
          <span className={labelClassName}>
            Portada <span className="text-red-500">*</span>
          </span>
          {values.coverImageUrl ? (
            <div className="group relative mt-1.5 aspect-2/3 w-full overflow-hidden rounded-lg ring-1 ring-slate-200">
              <Image
                src={values.coverImageUrl}
                alt="Vista previa de la portada"
                fill
                sizes="200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setField("coverImageUrl", "")}
                className="absolute inset-x-2 bottom-2 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow backdrop-blur hover:bg-white"
              >
                Cambiar portada
              </button>
            </div>
          ) : (
            <UploadDropzone
              endpoint="bookCover"
              onUploadBegin={() => setIsUploading(true)}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                const url = res[0]?.serverData.url ?? res[0]?.ufsUrl;
                if (url) setField("coverImageUrl", url);
              }}
              onUploadError={(error) => {
                setIsUploading(false);
                setFieldErrors((prev) => ({
                  ...prev,
                  coverImageUrl: [
                    error.message === "Unauthorized"
                      ? "Tu sesión expiró"
                      : "No se pudo subir la imagen",
                  ],
                }));
              }}
              config={{ mode: "auto" }}
              content={{
                label: "Arrastra una imagen o haz clic",
                allowedContent: "PNG, JPG o WEBP · máx. 4MB",
              }}
              appearance={{
                container:
                  "mt-1.5 aspect-2/3 w-full rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors ut-uploading:border-indigo-400 hover:border-indigo-400 hover:bg-indigo-50/40",
                uploadIcon: "h-10 w-10 text-slate-400",
                label: "max-w-full px-4 text-sm font-medium text-slate-700 hover:text-indigo-600 mx-4",
                allowedContent: "text-xs text-slate-500 mb-2",
                button:
                  "mt-3 h-9 w-full rounded-md bg-indigo-600 text-sm font-medium text-white after:bg-indigo-500 ut-uploading:cursor-wait ut-readying:bg-indigo-400",
              }}
            />
          )}
          <FieldError field="coverImageUrl" errors={fieldErrors} />
        </div>

        {/* Datos del libro */}
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <Field label="Título" field="title" required errors={fieldErrors} className="sm:col-span-2">
            <input {...inputProps("title")} required autoFocus />
          </Field>
          <Field label="Autor" field="author" required errors={fieldErrors}>
            <input {...inputProps("author")} required />
          </Field>
          <Field label="ISBN" field="isbn" required errors={fieldErrors}>
            <input {...inputProps("isbn")} required inputMode="numeric" className={`${inputClassName} font-mono`} />
          </Field>
          <Field label="Editorial" field="publisher" errors={fieldErrors}>
            <input {...inputProps("publisher")} />
          </Field>
          <Field label="Idioma" field="language" errors={fieldErrors}>
            <input {...inputProps("language")} placeholder="Español" />
          </Field>
          <Field label="Precio (MXN)" field="price" required errors={fieldErrors}>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                $
              </span>
              <input
                {...inputProps("price")}
                type="number"
                min="0"
                step="0.01"
                required
                className={`${inputClassName} pl-7 tabular-nums`}
              />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock" field="stock" required errors={fieldErrors}>
              <input {...inputProps("stock")} type="number" min="0" step="1" required className={`${inputClassName} tabular-nums`} />
            </Field>
            <Field label="Páginas" field="pageCount" errors={fieldErrors}>
              <input {...inputProps("pageCount")} type="number" min="1" step="1" className={`${inputClassName} tabular-nums`} />
            </Field>
          </div>
          <Field label="Descripción" field="description" errors={fieldErrors} className="sm:col-span-2">
            <textarea {...inputProps("description")} rows={4} className={`${inputClassName} resize-y`} />
          </Field>
        </div>
      </div>

      <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        {formError && (
          <p role="alert" className="mr-auto text-sm text-red-600">
            {formError}
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading
            ? "Subiendo portada…"
            : isPending
              ? "Guardando…"
              : isEditing
                ? "Guardar cambios"
                : "Agregar libro"}
        </button>
      </footer>
    </form>
  );
}

const labelClassName = "block text-sm font-medium text-slate-700";
const inputClassName =
  "mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/20";

function Field({
  label,
  field,
  required,
  errors,
  className,
  children,
}: {
  label: string;
  field: keyof BookFormValues;
  required?: boolean;
  errors: FieldErrors;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={field} className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      <FieldError field={field} errors={errors} />
    </div>
  );
}

function FieldError({ field, errors }: { field: keyof BookFormValues; errors: FieldErrors }) {
  const message = errors?.[field]?.[0];
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}
