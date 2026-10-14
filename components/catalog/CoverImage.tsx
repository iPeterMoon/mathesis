import Image from "next/image";

type CoverImageProps = {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Portada del libro. Si no hay imagen, muestra un placeholder.
 * Debe ir dentro de un contenedor con `relative` (ej. aspect-[2/3]).
 */
export function CoverImage({ src, alt, sizes, priority }: CoverImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-100 to-slate-200"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="h-10 w-10 text-slate-400"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        <span className="text-xs text-slate-400">Sin portada</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}
