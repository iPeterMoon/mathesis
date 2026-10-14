import type { Metadata } from "next";
import Link from "next/link";
import { bebasNeue } from "@/lib/fonts/fonts";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: {
    default: "Admin — Mathesis",
    template: "%s | Admin Mathesis",
  },
  description: "Panel de administración de Mathesis",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/admin"
            className={`text-3xl font-semibold tracking-tight ${bebasNeue.className} text-slate-900 hover:text-indigo-600`}
          >
            Mathesis Admin
          </Link>

          <AdminNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
