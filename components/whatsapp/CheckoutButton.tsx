"use client";
import { MessageCircle } from "lucide-react";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/lib/store/cart.store";
import { buildWhatsAppLink, formatOrderMessage } from "@/lib/whatsapp";

export function CheckoutButton() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  const isEmpty = totalItems === 0;

  const handleCheckout = () => {
    if (isEmpty) return;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
    if (!phone) {
      alert("Configura NEXT_PUBLIC_WHATSAPP_PHONE en .env.local");
      return;
    }
    const message = formatOrderMessage(items, totalItems, totalPrice);
    const url = buildWhatsAppLink(phone, message);
    window.open(url, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isEmpty}
      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
    >
      <MessageCircle size={18} />
      Enviar pedido por WhatsApp
    </button>
  );
}
