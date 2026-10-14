"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  initialQuery?: string;
  orden?: string;
};

export function SearchBar({ initialQuery = "", orden }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);
  const prevQueryRef = useRef(initialQuery);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q !== prevQueryRef.current) {
      prevQueryRef.current = q;
      setValue(q);
      setIsSearching(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const query = value.trim();
    setIsSearching(true);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (orden && orden !== "recientes") params.set("orden", orden);
      if (params.has("page")) params.delete("page");
      const search = params.toString();
      const newUrl = search ? `/?${search}` : "/";
      router.replace(newUrl, { scroll: false });
      setIsSearching(false);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, orden, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <label htmlFor="catalog-search" className="sr-only">
        Buscar libros
      </label>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        ref={inputRef}
        id="catalog-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por título, autor, ISBN o editorial"
        autoComplete="off"
        className="h-12 w-full rounded-full border border-slate-300 bg-white pr-10 pl-12 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      {isSearching && (
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
        </div>
      )}
    </form>
  );
}
