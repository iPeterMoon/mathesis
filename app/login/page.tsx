"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { bebasNeue, montserrat } from "@/lib/fonts/fonts";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciales inválidas");
        setLoading(false);
        return;
      }
      // Handle successful login
      router.push("/admin/");
    } catch (error) {
      setError("Error de conexión, intenta de nuevo");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mb-8 text-center">
        <h1
          className={`text-6xl font-bold ${bebasNeue.className} text-gray-900`}
        >
          MATHESIS
        </h1>
        <h2
          className={`-mt-2 text-2xl font-light ${montserrat.className} text-gray-700`}
        >
          LIBRERIA
        </h2>
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-gray-900 text-2xl font-bold">
          Inicio de Sesión de Administrador
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              id="user"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mt-1 block w-full rounded-md h-10 text-gray-500 px-2 border-indigo-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md h-10 text-gray-500 px-2 border-indigo-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
