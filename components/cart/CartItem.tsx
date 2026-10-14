"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { CoverImage } from "@/components/catalog/CoverImage";
import { useCartStore } from "@/lib/store/cart.store";
import type { CartItem as CartItemType } from "@/lib/types/index";
import { formatMXN } from "@/lib/format";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const atMax = item.quantity >= item.stock;
  const subtotal = item.price * item.quantity;

  const quantityButton =
    "inline-flex h-11 w-11 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-5 sm:p-5"
    >
      <Link
        href={`/libros/${item.id}`}
        aria-label={`Ver ${item.title}`}
        className="relative block aspect-2/3 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/70 sm:w-24"
      >
        <CoverImage
          src={item.coverImageUrl}
          alt={`Portada de ${item.title}`}
          sizes="96px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 sm:text-base">
              <Link
                href={`/libros/${item.id}`}
                className="hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {item.title}
              </Link>
            </h2>
            <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{item.author}</p>
            <p className="mt-1 text-sm text-slate-500">
              {formatMXN(item.price)} <span className="text-slate-400">c/u</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Quitar ${item.title} del carrito`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label={`Disminuir cantidad de ${item.title}`}
                className={`${quantityButton} rounded-l-lg`}
              >
                <Minus size={18} />
              </motion.button>
              <motion.span
                key={item.quantity}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-10 text-center text-sm font-semibold tabular-nums text-slate-900"
              >
                {item.quantity}
              </motion.span>
              <motion.button
                type="button"
                whileTap={!atMax ? { scale: 0.9 } : {}}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={atMax}
                aria-label={`Aumentar cantidad de ${item.title}`}
                className={`${quantityButton} rounded-r-lg`}
              >
                <Plus size={18} />
              </motion.button>
            </div>
            {atMax && (
              <p className="mt-1 text-xs font-medium text-amber-600">
                Máximo disponible
              </p>
            )}
          </div>

          <p className="text-base font-semibold tabular-nums text-slate-900">
            {formatMXN(subtotal)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
