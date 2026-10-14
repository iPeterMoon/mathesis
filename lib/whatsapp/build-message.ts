import type { CartItem } from "@/lib/types";
import { formatMXN } from "@/lib/format";

const WHATSAPP_BASE_URL = "https://wa.me";

export function buildWhatsAppMessage(
  items: CartItem[],
  totalPrice: number,
): string {
  const itemLines = items.flatMap((item) => [
    `- ${item.title}`,
    `  Autor: ${item.author}`,
    `  Cantidad: ${item.quantity}`,
    `  Precio en página: ${formatMXN(item.price)}`,
  ]);

  return [
    "Hola, quiero realizar el siguiente pedido:",
    "",
    ...itemLines,
    "",
    `Total: ${formatMXN(totalPrice)}`,
  ].join("\n");
}

export function buildWhatsAppUrl(
  phoneNumber: string,
  items: CartItem[],
  totalPrice: number,
): string {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");

  if (!normalizedPhoneNumber) {
    throw new Error("El número de WhatsApp no está configurado.");
  }

  const message = buildWhatsAppMessage(items, totalPrice);
  return `${WHATSAPP_BASE_URL}/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}