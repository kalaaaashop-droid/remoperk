"use client";

import { useState, type Dispatch } from "react";
import { BOTAS, RECARGO_A_MEDIDA, TALLAS, formatearPrecio, type OpcionAjuste } from "@/lib/catalogo";
import { tallaSugerida, type Accion, type Medidas, type Seleccion } from "@/lib/personalizacion";

interface Props {
  seleccion: Seleccion;
  dispatch: Dispatch<Accion>;
}

const CAMPOS_MEDIDA: { campo: keyof Medidas; etiqueta: string; ayuda: string }[] = [
  { campo: "pecho", etiqueta: "Pecho", ayuda: "Por la parte más prominente, cinta horizontal." },
  { campo: "cintura", etiqueta: "Cintura", ayuda: "En la parte más estrecha, sin apretar." },
  { campo: "cadera", etiqueta: "Cadera", ayuda: "Por la parte más ancha, pies juntos." },
  { campo: "estatura", etiqueta: "Estatura", ayuda: "Sin calzado, de pie contra la pared." },
];

const rango = ([a, b]: [number, number]) => `${a}–${b}`;

export function SelectorTalla({ seleccion, dispatch }: Props) {
  const [guiaAbierta, setGuiaAbierta] = useState(false);
  const sugerida = tallaSugerida(Number(seleccion.medidas.pecho));

  return (
    <div className="space-y-8">
      {/* Modo: talla estándar o a medida */}
      <div role="tablist" aria-label="Tipo de talla" className="grid grid-cols-2 rounded-full border border-linea bg-marfil p-1 text-sm">
        {[
          { valor: false, texto: "Talla estándar" },
          { valor: true, texto: `A medida · +${formatearPrecio(RECARGO_A_MEDIDA)}` },
        ].map((op) => {
          const activo = seleccion.aMedida === op.valor;
          return (
            <button
              key={String(op.valor)}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => dispatch({ tipo: "aMedida", valor: op.valor })}
              className={`rounded-full px-4 py-2.5 transition-all duration-500 ease-seda ${
                activo ? "bg-grafito text-hueso" : "text-topo hover:text-grafito"
              }`}
            >
              {op.texto}
            </button>
          );
        })}
      </div>

      {seleccion.aMedida ? (
        <div key="a-medida" className="animate-aparecer space-y-4">
          <p className="text-sm leading-relaxed text-topo">
            Patronamos tu uniforme a partir de tus medidas corporales. Mide sobre ropa interior ligera y con la cinta
            sin apretar.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CAMPOS_MEDIDA.map(({ campo, etiqueta, ayuda }) => (
              <label key={campo} className="block">
                <span className="mb-1.5 block text-xs font-medium">{etiqueta}</span>
                <span className="relative block">
                  <input
                    inputMode="numeric"
                    placeholder="0"
                    value={seleccion.medidas[campo]}
                    onChange={(e) => dispatch({ tipo: "medida", campo, valor: e.target.value })}
                    className="campo pr-10"
                    aria-describedby={`ayuda-${campo}`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-piedra">cm</span>
                </span>
                <span id={`ayuda-${campo}`} className="mt-1 block text-[0.7rem] leading-snug text-piedra">
                  {ayuda}
                </span>
              </label>
            ))}
          </div>
          {sugerida && (
            <p className="animate-aparecer rounded-xl bg-arena/60 px-4 py-3 text-sm">
              Por tu contorno de pecho, tu referencia sería una <strong>{sugerida}</strong>. Ajustaremos el resto del
              patrón a tus medidas.
            </p>
          )}
        </div>
      ) : (
        <div key="estandar" className="animate-aparecer space-y-4">
          <div role="radiogroup" aria-label="Talla" className="grid grid-cols-6 gap-2">
            {TALLAS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === seleccion.tallaId}
                onClick={() => dispatch({ tipo: "talla", id: t.id })}
                className="opcion py-3.5 text-center text-sm font-medium"
              >
                {t.id}
              </button>
            ))}
          </div>

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
                  <caption className="sr-only">Medidas corporales en centímetros</caption>
                  <thead>
                    <tr className="text-left text-xs text-topo">
                      <th className="px-4 py-3 font-medium">Talla</th>
                      <th className="px-4 py-3 font-medium">Pecho</th>
                      <th className="px-4 py-3 font-medium">Cintura</th>
                      <th className="px-4 py-3 font-medium">Cadera</th>
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
                        <td className="px-4 py-2.5">{rango(t.pecho)}</td>
                        <td className="px-4 py-2.5">{rango(t.cintura)}</td>
                        <td className="px-4 py-2.5">{rango(t.cadera)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-piedra">
                Medidas del cuerpo, no de la prenda. Si estás entre dos tallas, elige la mayor.
              </p>
            </div>
          </div>
        </div>
      )}

      <GrupoAjuste
        titulo="Pantalón"
        opciones={BOTAS}
        valor={seleccion.botaId}
        onChange={(id) => dispatch({ tipo: "bota", id })}
      />
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
