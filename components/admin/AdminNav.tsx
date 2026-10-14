"use client";

import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

export function AdminNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
      >
        <Settings size={18} />
        Cambiar contraseña
      </button>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
      <ChangePasswordModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
