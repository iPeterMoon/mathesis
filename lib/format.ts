const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/** Formatea un precio en pesos mexicanos ($1,234.50). */
export const formatMXN = (value: number | string): string =>
  mxn.format(typeof value === "string" ? Number(value) : value);
