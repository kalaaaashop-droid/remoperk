"use client";

import { useState, type Dispatch } from "react";
import { BOTAS, MODELOS, PRETINAS, RECARGO_TALLA_GRANDE, TALLAS, formatearPrecio, type OpcionAjuste } from "@/lib/catalogo";
import type { Accion, Seleccion } from "@/lib/personalizacion";

interface Props {
  seleccion: Seleccion;
  dispatch: Dispatch<Accion>;
}

export function SelectorTalla({ seleccion, dispatch }: Props) {
  const [guiaAbierta, setGuiaAbierta] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div role="radiogroup" aria-label="Talla" className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {TALLAS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === seleccion.tallaId}
              onClick={() => dispatch({ tipo: "talla", id: t.id })}
              className="opcion px-0 py-3.5 text-center text-xs font-medium sm:text-sm"
            >
              {t.id}
            </button>
          ))}
        </div>
        <p className="text-xs text-topo">
          Desde la talla 2XL el conjunto tiene un recargo de <strong className="font-semibold text-grafito">+{formatearPrecio(RECARGO_TALLA_GRANDE)}</strong>.
        </p>

        <button
          type="button"
          aria-expanded={guiaAbierta}
          aria-controls="guia-tallas"
          onClick={() => setGuiaAbierta((v) => !v)}
          className="flex items-center gap-2 text-sm text-topo underline decoration-linea underline-offset-4 transition-colors hover:text-grafito"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <rect x="1" y="5" width="14" height="6" rx="1" fill="none" stroke="currentColor" />
            <path d="M4 5v2.5M7 5v2M10 5v2.5M13 5v2" stroke="currentColor" />
          </svg>
          {guiaAbierta ? "Ocultar guía de tallas" : "Ver guía de tallas y cómo medirte"}
        </button>

        {/* Guía desplegable: grid-rows 0fr → 1fr permite animar la altura sin medirla */}
        <div
          id="guia-tallas"
          className={`grid transition-[grid-template-rows,opacity] duration-700 ease-seda ${
            guiaAbierta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="overflow-x-auto rounded-2xl border border-linea bg-marfil">
              <table className="w-full min-w-[20rem] text-sm">
                <caption className="sr-only">Tabla de medidas universales: medidas del cuerpo en centímetros</caption>
                <thead>
                  <tr className="text-left text-xs text-topo">
                    <th className="px-4 py-3 font-medium">Talla</th>
                    <th className="px-4 py-3 font-medium">Busto</th>
                    <th className="px-4 py-3 font-medium">Cadera</th>
                    <th className="px-4 py-3 font-medium">Cintura</th>
                  </tr>
                </thead>
                <tbody>
                  {TALLAS.map((t) => (
                    <tr
                      key={t.id}
                      className={`border-t border-linea transition-colors duration-500 ${
                        t.id === seleccion.tallaId ? "bg-arena/60 font-medium" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5">{t.id}</td>
                      <td className="px-4 py-2.5 tabular-nums">{t.busto}</td>
                      <td className="px-4 py-2.5 tabular-nums">{t.cadera}</td>
                      <td className="px-4 py-2.5 tabular-nums">{t.cintura}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-piedra">
              Medidas del cuerpo, no de la prenda, en centímetros. Mídete sin apretar la cinta y, si estás entre dos tallas, elige la mayor.
            </p>
          </div>
        </div>
      </div>

      <GrupoAjuste
        titulo="Pantalón"
        opciones={BOTAS}
        valor={seleccion.botaId}
        onChange={(id) => dispatch({ tipo: "bota", id })}
      />
      {MODELOS.find((m) => m.id === seleccion.modeloId)?.eligePretina && (
        <div className="animate-aparecer">
          <GrupoAjuste
            titulo="Pretina · elige arruchada o lisa"
            opciones={PRETINAS}
            valor={seleccion.pretinaId}
            onChange={(id) => dispatch({ tipo: "pretina", id })}
          />
        </div>
      )}
    </div>
  );
}

function GrupoAjuste({
  titulo,
  opciones,
  valor,
  onChange,
}: {
  titulo: string;
  opciones: OpcionAjuste[];
  valor: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{titulo}</p>
      <div role="radiogroup" aria-label={titulo} className="grid grid-cols-2 gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onChange(o.id)}
            className="opcion flex flex-col items-start gap-1 px-4 py-3"
          >
            <span className="text-sm font-medium">
              {o.nombre}
              {o.recargo > 0 && <span className="ml-1.5 font-normal text-topo">+{formatearPrecio(o.recargo)}</span>}
            </span>
            <span className="text-xs leading-snug text-topo">{o.descripcion}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
