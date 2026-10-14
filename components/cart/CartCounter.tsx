"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore, selectTotalItems } from "@/lib/store/cart.store";
import { useHydrated } from "@/lib/store/use-hydrated";

export function CartButton() {
  const hydrated = useHydrated();
  const totalItems = useCartStore(selectTotalItems);

  const showBadge = hydrated && totalItems > 0;

  return (
    <Link
      href="/carrito"
      aria-label={
        showBadge
          ? `Ver carrito, ${totalItems} ${totalItems === 1 ? "libro" : "libros"}`
          : "Ver carrito"
      }
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
    >
      {showBadge && (
        <span className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
      <ShoppingCart size={24} />
    </Link>
  );
}