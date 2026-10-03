import type { SVGProps } from "react";

/**
 * Elemento firma: una gota de crema cayendo. Se usa como motivo decorativo
 * (fondo de héroes, divisores, "blob" detrás de imágenes).
 */
export function Drip(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M100 12c30 0 54 20 54 50 0 22-12 36-12 36s-8-8-8-20c0-14 6-24 6-24-12 12-18 30-18 44-6 8-22 8-22 8s8-10 8-20c0-10-6-18-6-18-14 8-18 20-18 30-2 6-20 8-22 4 2-26 14-44 38-56-2-8-8-14-8-14s8 6 14 8c6-10 2-22 2-22s6 6 6 16c2 6 0 12-2 18 8-4 14-12 14-22 0-18-14-32-32-32Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Divisor ondulado (wave) para separar secciones. */
export function WaveDivider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1440 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M0 30C240 60 480 0 720 15C960 30 1200 60 1440 30V60H0V30Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Precio en bolívares formateado (Bs). */
export function formatBs(value: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formatea una fecha del backend (RFC3339) como "20/09/2026, 18:05". */
export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Caracas",
  }).format(date);
}

/** Formatea una fecha como solo "20/09/2026" (sin hora). */
export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Caracas",
  }).format(date);
}