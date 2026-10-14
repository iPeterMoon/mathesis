"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/admin/Modal";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentUser, setCurrentUser] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (open && !fetchedRef.current) {
      const load = async () => {
        try {
          const res = await fetch("/api/admin/me");
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
            setNewUser(data.user);
            fetchedRef.current = true;
          }
        } catch {}
      };
      load();
    }
    if (!open && prevOpenRef.current) {
      fetchedRef.current = false;
    }
    prevOpenRef.current = open;
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newUser, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al cambiar credenciales");
        setLoading(false);
        return;
      }

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      fetchedRef.current = false;
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Cambiar credenciales">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Usuario actual
          </label>
          <input
            type="text"
            value={currentUser}
            disabled
            className="mt-1 block w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Nuevo usuario
          </label>
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Dejar vacío para no cambiar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Contraseña actual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            minLength={6}
            placeholder="Dejar vacío para no cambiar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
