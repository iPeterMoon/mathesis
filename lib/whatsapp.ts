import type { CartItem } from "@/lib/types/index";

export function formatOrderMessage(
  items: CartItem[],
  totalItems: number,
  totalPrice: number
): string {
  const lines = [
    "¡Hola! Me gustaría hacer el siguiente pedido:",
    "",
    ...items.map(
      (item) =>
        `- ${item.title} (x${item.quantity}) · $${(item.price * item.quantity).toFixed(2)} MXN`
    ),
    "",
    `Total: ${totalItems} ${totalItems === 1 ? "libro" : "libros"} · $${totalPrice.toFixed(2)} MXN`,
    "",
    "¿Me podrías confirmar disponibilidad y formas de pago?",
  ];
  return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const sanitizedPhone = phone.replace(/[^+\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}?text=${encoded}`;
}
