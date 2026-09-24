import type { Dispatch } from "react";
import { MODELOS, PRECIO_DESDE, formatearPrecio } from "@/lib/catalogo";
import type { Accion } from "@/lib/personalizacion";

interface Props {
  valor: string;
  dispatch: Dispatch<Accion>;
}

export function SelectorModelo({ valor, dispatch }: Props) {
  return (
    <div role="radiogroup" aria-label="Modelo base" className="grid gap-3 sm:grid-cols-3">
      {MODELOS.map((m) => {
        const activo = m.id === valor;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => dispatch({ tipo: "modelo", id: m.id })}
            className="opcion flex flex-col gap-3 p-5"
          >
            <span
              className={`mr-7 self-start rounded-full px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.18em] uppercase ${
                m.disponibilidad === "edicion-limitada" ? "bg-grafito text-hueso" : "bg-arena text-topo"
              }`}
            >
              {m.disponibilidad === "edicion-limitada" ? `Edición limitada · ${m.unidades} uds.` : "Bajo pedido"}
            </span>
            <span className="font-display text-2xl">{m.nombre}</span>
            <span className="text-sm leading-relaxed text-topo">{m.descripcion}</span>
            <ul className="mt-auto space-y-1 pt-2 text-xs text-topo">
              {m.detalles.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-piedra" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
            <span className="border-t border-linea pt-3 text-sm">
              desde <strong className="font-semibold">{formatearPrecio(PRECIO_DESDE)}</strong>
            </span>
            <Marca activa={activo} />
          </button>
        );
      })}
    </div>
  );
}

/** Indicador circular de selección, compartido por las tarjetas de opción. */
export function Marca({ activa }: { activa: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-4 right-4 grid h-5 w-5 place-items-center rounded-full border transition-all duration-500 ease-seda ${
        activa ? "border-grafito bg-grafito" : "border-linea bg-transparent"
      }`}
    >
      <svg viewBox="0 0 12 12" className={`h-2.5 w-2.5 transition-opacity duration-300 ${activa ? "opacity-100" : "opacity-0"}`}>
        <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="var(--color-hueso)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
