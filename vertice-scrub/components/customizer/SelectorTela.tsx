import type { Dispatch } from "react";
import { TELAS, formatearPrecio, type Tela } from "@/lib/catalogo";
import type { Accion } from "@/lib/personalizacion";
import { Marca } from "./SelectorModelo";

interface Props {
  telaId: string;
  colorId: string;
  dispatch: Dispatch<Accion>;
}

const MUESTRA_TEXTURA: Record<Tela["textura"], string> = {
  lisa: "none",
  sarga: "repeating-linear-gradient(45deg, rgba(0,0,0,.10) 0 1.5px, transparent 1.5px 5px)",
  punto: "radial-gradient(rgba(255,255,255,.28) 0.8px, transparent 0.9px) 0 0 / 4px 4px",
};

export function SelectorTela({ telaId, colorId, dispatch }: Props) {
  const tela = TELAS.find((t) => t.id === telaId) ?? TELAS[0];
  const color = tela.colores.find((c) => c.id === colorId) ?? tela.colores[0];

  return (
    <div className="space-y-8">
      <div role="radiogroup" aria-label="Tipo de tela" className="grid gap-3 sm:grid-cols-2">
        {TELAS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === telaId}
            onClick={() => dispatch({ tipo: "tela", id: t.id })}
            className="opcion flex flex-col gap-2 p-4"
          >
            {/* Muestra de la tela con su textura, tintada en el primer color de su carta */}
            <span
              aria-hidden
              className="mb-1 h-14 rounded-xl"
              style={{ background: `${MUESTRA_TEXTURA[t.textura]}, ${t.colores[0].hex}` }}
            />
            <span className="font-medium">{t.nombre}</span>
            <span className="text-xs leading-relaxed text-topo">{t.composicion}</span>
            <span className="mt-1 flex flex-wrap gap-1.5">
              {t.cualidades.map((c) => (
                <span key={c} className="rounded-full bg-arena/70 px-2 py-0.5 text-[0.65rem] text-topo">
                  {c}
                </span>
              ))}
            </span>
            <span className="mt-auto pt-2 text-sm text-topo"><strong className="font-semibold text-grafito">{formatearPrecio(t.precio)}</strong> el conjunto</span>
            <Marca activa={t.id === telaId} />
          </button>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <p className="eyebrow">Color · {tela.nombre}</p>
          {/* key: el nombre del color entra con un fundido cada vez que cambia */}
          <p key={color.id} className="animate-aparecer font-display text-xl italic">
            {color.nombre}
          </p>
        </div>
        <div role="radiogroup" aria-label={`Colores disponibles en ${tela.nombre}`} className="flex flex-wrap gap-3">
          {tela.colores.map((c) => {
            const activo = c.id === color.id;
            return (
              <button
                key={`${tela.id}-${c.id}`}
                type="button"
                role="radio"
                aria-checked={activo}
                aria-label={c.nombre}
                title={c.nombre}
                onClick={() => dispatch({ tipo: "color", id: c.id })}
                className={`animate-aparecer grid h-12 w-12 place-items-center rounded-full border transition-all duration-500 ease-seda sm:h-11 sm:w-11 ${
                  activo ? "scale-105 border-grafito" : "border-transparent hover:border-piedra"
                }`}
              >
                <span
                  className="h-9 w-9 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] sm:h-8 sm:w-8"
                  style={{ background: `${MUESTRA_TEXTURA[tela.textura]}, ${c.hex}` }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
