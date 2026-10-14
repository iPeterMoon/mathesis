/**
 * Forma serializable de un libro para los componentes del catálogo.
 * `price` es number: Prisma Decimal no se puede pasar a Client Components.
 */
export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  coverImageUrl: string | null;
};
