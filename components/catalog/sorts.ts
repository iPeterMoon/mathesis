import type { CatalogSort } from "@/lib/services/books.service";

export const DEFAULT_SORT: CatalogSort = "recientes";

export const SORT_OPTIONS: ReadonlyArray<{ value: CatalogSort; label: string }> = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "titulo-asc", label: "Título (A–Z)" },
  { value: "titulo-desc", label: "Título (Z–A)" },
];

export const isCatalogSort = (value: unknown): value is CatalogSort =>
  typeof value === "string" && SORT_OPTIONS.some((option) => option.value === value);
