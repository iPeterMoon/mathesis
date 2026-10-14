import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Query de búsqueda actual, se conserva en todos los enlaces. */
  q?: string;
  /** Orden actual, se conserva en todos los enlaces. */
  orden?: string;
};

const buildHref = (page: number, q?: string, orden?: string) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (orden && orden !== "recientes") params.set("orden", orden);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/?${search}` : "/";
};

/** Ventana de números: 1 … 4 [5] 6 … 10 */
function pageItems(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("gap");
  for (let current = start; current <= end; current++) items.push(current);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
}

export function Pagination({ page, totalPages, q, orden }: PaginationProps) {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const items = pageItems(current, totalPages);

  const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50";
  const currentClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 text-sm font-medium text-white";

  return (
    <nav aria-label="Paginación" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {current > 1 ? (
        <Link href={buildHref(current - 1, q, orden)} rel="prev" className={linkClass}>
          Anterior
        </Link>
      ) : (
        <span aria-disabled className={`${linkClass} cursor-not-allowed text-slate-400`}>
          Anterior
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-slate-400" aria-hidden>
            …
          </span>
        ) : item === current ? (
          <span key={item} aria-current="page" className={currentClass}>
            {item}
          </span>
        ) : (
          <Link key={item} href={buildHref(item, q, orden)} className={linkClass}>
            {item}
          </Link>
        )
      )}

      {current < totalPages ? (
        <Link href={buildHref(current + 1, q, orden)} rel="next" className={linkClass}>
          Siguiente
        </Link>
      ) : (
        <span aria-disabled className={`${linkClass} cursor-not-allowed text-slate-400`}>
          Siguiente
        </span>
      )}
    </nav>
  );
}
