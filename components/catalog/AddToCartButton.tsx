"use client";

import { ShoppingCartPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart.store";
import { CartItem } from "@/lib/types/index";

type AddToCartButtonProps = {
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImageUrl: string | null;
  stock: number;
  size?: "sm" | "lg";
  className?: string;
};

export function AddToCartButton({
  bookId,
  title,
  author,
  coverImageUrl,
  price,
  stock,
  size = "sm",
  className = "",
}: AddToCartButtonProps) {
  const stockInCart = useCartStore((state) => {
    const item = state.items.find((i) => i.id === bookId);
    return item ? item.quantity : 0;
  });
  const isOut = stock - stockInCart <= 0;

  const handleClick = () => {
    if (!isOut) {
      const item: CartItem = {
        id: bookId,
        title,
        author,
        price,
        coverImageUrl,
        stock,
        quantity: 1,
      };
      useCartStore.getState().addItem(item);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed";
  const variants =
    size === "lg"
      ? "h-12 w-full px-6 text-sm bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      : "h-9 px-3 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isOut}
      whileHover={!isOut ? { scale: 1.02 } : {}}
      whileTap={!isOut ? { scale: 0.98 } : {}}
      aria-label={
        isOut ? `${title} está agotado` : `Agregar ${title} al carrito`
      }
      className={`${base} ${variants} ${className}`}
    >
      <ShoppingCartPlus size={20} />
      {isOut ? "Agotado" : size === "lg" ? "Agregar al carrito" : "Agregar"}
    </motion.button>
  );
}
