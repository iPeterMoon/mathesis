"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  selectTotalItems,
  selectTotalPrice,
  useCartStore,
} from "@/lib/store/cart.store";
import { formatMXN } from "@/lib/format";
import { CheckoutButton } from "@/components/whatsapp/CheckoutButton";

export function CartSummary() {
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const isEmpty = totalItems === 0;

  const handleClear = () => {
    if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
      clearCart();
    }
  };

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Resumen del pedido</h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">
            {totalItems === 1 ? "Libro" : "Libros"}
          </dt>
          <dd className="font-medium tabular-nums text-slate-900">{totalItems}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <dt className="text-base font-semibold text-slate-900">Total</dt>
          <dd className="text-lg font-semibold tabular-nums text-slate-900">
            {formatMXN(totalPrice)}
          </dd>
        </div>
      </dl>

      <CheckoutButton />

      <button
        type="button"
        onClick={handleClear}
        disabled={isEmpty}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <Trash2 size={16} />
        Vaciar carrito
      </button>

      <Link
        href="/"
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Seguir comprando
      </Link>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        El pago y la entrega se coordinan por WhatsApp con la tienda.
      </p>
    </aside>
  );
}
