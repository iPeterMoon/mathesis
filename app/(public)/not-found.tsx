import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-indigo-600">Error 404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        No encontramos ese libro
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Puede que ya no esté disponible o que el enlace sea incorrecto.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
