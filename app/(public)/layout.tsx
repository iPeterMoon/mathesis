import type { Metadata } from "next";
import Link from "next/link";
import { bebasNeue } from "@/lib/fonts/fonts";
import { CartButton } from "@/components/cart/CartCounter";
import { StoreInfo } from "@/components/footer/StoreInfo";

export const metadata: Metadata = {
  title: {
    default: "Mathesis — Catálogo de libros",
    template: "%s | Mathesis",
  },
  description:
    "Catálogo de libros en español: encuentra títulos por autor, ISBN o editorial y compra en pesos mexicanos.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className={`text-3xl font-semibold tracking-tight ${bebasNeue.className} text-slate-900 hover:text-indigo-600`}
          >
            Mathesis
          </Link>

          <CartButton />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <StoreInfo />
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p>© {new Date().getFullYear()} Mathesis. Todos los derechos reservados.</p>
            <p>Precios en pesos mexicanos (MXN).</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
