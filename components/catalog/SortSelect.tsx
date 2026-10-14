"use client";

import { useRouter } from "next/navigation";
import { DEFAULT_SORT, SORT_OPTIONS, isCatalogSort } from "./sorts";

type SortSelectProps = {
  value: string;
  /** Búsqueda activa; se conserva al cambiar el orden. */
  q?: string;
};

export function SortSelect({ value, q }: SortSelectProps) {
  const router = useRouter();
  // Si la URL trae un orden inválido, mostramos el default.
  const current = isCatalogSort(value) ? value : DEFAULT_SORT;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (event.target.value !== DEFAULT_SORT) params.set("orden", event.target.value);
    const search = params.toString();
    // Cambiar el orden siempre regresa a la página 1.
    router.replace(search ? `/?${search}` : "/", { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="catalog-sort" className="whitespace-nowrap text-sm text-slate-600">
        Ordenar por:
      </label>
      <select
        id="catalog-sort"
        value={current}
        onChange={handleChange}
        className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
