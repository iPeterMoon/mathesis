"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { selectTotalItems, useCartStore } from "@/lib/store/cart.store";
import { useHydrated } from "@/lib/store/use-hydrated";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Tu carrito
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalItems} {totalItems === 1 ? "libro" : "libros"}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="lg:sticky lg:top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <p role="status" className="sr-only">
        Cargando carrito…
      </p>

      <div className="mb-6">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="space-y-4">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:gap-5 sm:p-5"
            >
              <div className="aspect-2/3 w-20 shrink-0 animate-pulse rounded-lg bg-slate-200 sm:w-24" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-11 w-36 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
      >
        <ShoppingBag size={28} className="text-slate-400" aria-hidden />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-5 text-2xl font-semibold tracking-tight text-slate-900"
      >
        Tu carrito está vacío
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-2 max-w-md text-sm text-slate-500"
      >
        Explora el catálogo y agrega los libros que te interesen.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Explorar catálogo
        </Link>
      </motion.div>
    </div>
  );
}
