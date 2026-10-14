"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

const STORE_HOURS = {
  open: 8,
  close: 20,
};

export function StoreInfo() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const isCurrentlyOpen = hour >= STORE_HOURS.open && hour < STORE_HOURS.close;
      setIsOpen(isCurrentlyOpen);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <MapPin/>
        <span>Ubicación: Calle Sonora 339 entre Náinari y Mórelos, Ciudad Obregón</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock />
        <span>Horario: 8:00 a. m. - 8:00 p. m.</span>
        {isOpen !== null && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            isOpen
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              isOpen ? "bg-emerald-500" : "bg-slate-400"
            }`} />
            {isOpen ? "Abierto" : "Cerrado"}
          </span>
        )}
      </div>
    </div>
  );
}
