"use client";

import { useEffect, useState } from "react";
import { formatearPrecio } from "@/lib/catalogo";

interface Props {
  total: number;
  colorHex: string;
  descripcion: string;
  idResumen: string;
}

/** Barra fija inferior en móvil: precio siempre visible. Se oculta cuando el resumen ya está en pantalla. */
export function BarraMovil({ total, colorHex, descripcion, idResumen }: Props) {
  const [oculta, setOculta] = useState(false);

  useEffect(() => {
    const destino = document.getElementById(idResumen);
    if (!destino) return;
    const observador = new IntersectionObserver(([e]) => setOculta(e.isIntersecting), { threshold: 0.15 });
    observador.observe(destino);
    return () => observador.disconnect();
  }, [idResumen]);

  return (
    <div
      aria-hidden={oculta}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-hueso/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 ease-seda lg:hidden ${
        oculta ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <span className="transition-colors duration-700 ease-seda h-9 w-9 shrink-0 rounded-full border border-linea" style={{ backgroundColor: colorHex }} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-topo">{descripcion}</p>
          <p key={total} className="animate-aparecer font-display text-xl leading-tight">
            {formatearPrecio(total)}
          </p>
        </div>
        <a
          href={`#${idResumen}`}
          tabIndex={oculta ? -1 : 0}
          className="rounded-full bg-grafito px-5 py-3 text-sm font-medium text-hueso"
        >
          Ver resumen
        </a>
      </div>
    </div>
  );
}
