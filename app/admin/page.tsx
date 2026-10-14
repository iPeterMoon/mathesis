import Link from "next/link";
import { getBooks } from "@/lib/services/books.service";
import { BookTable, type BookRow } from "@/components/admin/BookTable";
import { NewBookButton } from "@/components/admin/NewBookButton";

const PAGE_SIZE = 10;

type DashboardPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { books, pagination } = await getBooks({ page, pageSize: PAGE_SIZE });

  // Prisma devuelve `price` como Decimal, que no se puede pasar a un Client Component.
  const rows: BookRow[] = books.map((book) => ({
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    language: book.language,
    description: book.description,
    pageCount: book.pageCount,
    coverImageUrl: book.coverImageUrl,
    price: book.price.toFixed(2),
    stock: book.stock,
    isActive: book.isActive,
  }));

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Libros</h1>
            <p className="text-sm text-slate-500">
              {pagination.total} {pagination.total === 1 ? "libro registrado" : "libros registrados"}
            </p>
          </div>
          <NewBookButton />
        </header>

        <BookTable books={rows} />

        {pagination.totalPages > 1 && (
          <nav className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <PageLink page={page - 1} disabled={page <= 1}>
                Anterior
              </PageLink>
              <PageLink page={page + 1} disabled={page >= pagination.totalPages}>
                Siguiente
              </PageLink>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}

function PageLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className =
    "rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium";

  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed text-slate-400`}>
        {children}
      </span>
    );
  }

  return (
    <Link href={`/admin?page=${page}`} className={`${className} text-slate-700 hover:bg-slate-50`}>
      {children}
    </Link>
  );
}
