"use client";

import { useMemo, useReducer } from "react";
import { formatearPrecio, type Bota } from "@/lib/catalogo";
import { reducer, resumir, seleccionInicial } from "@/lib/personalizacion";
import { BarraMovil } from "./BarraMovil";
import { CotizarModelo } from "./CotizarModelo";
import { PanelResumen } from "./PanelResumen";
import { Seccion } from "./Seccion";
import { SelectorBordado } from "./SelectorBordado";
import { SelectorModelo } from "./SelectorModelo";
import { SelectorTalla } from "./SelectorTalla";
import { SelectorTela } from "./SelectorTela";
import { FotoUniforme } from "./FotoUniforme";
import { VistaUniforme } from "./VistaUniforme";

const PASOS = [
  { id: "modelo", titulo: "Modelo" },
  { id: "tela", titulo: "Tela y color" },
  { id: "talla", titulo: "Talla" },
  { id: "bordado", titulo: "Bordado" },
  { id: "resumen", titulo: "Resumen" },
];

export function Configurador() {
  const [seleccion, dispatch] = useReducer(reducer, seleccionInicial);
  const resumen = useMemo(() => resumir(seleccion), [seleccion]);
  const { modelo, tela, color } = resumen;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-32 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:pb-24">
      {/* ---------- Vista previa ----------
          Móvil: panel compacto fijo bajo la cabecera, para ver cada cambio mientras se eligen opciones.
          Escritorio: columna grande fija al hacer scroll. */}
      <div className="sticky top-16 z-30 -mx-4 bg-hueso/95 px-4 pt-3 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:col-span-5 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="lg:sticky lg:top-24">
          <div className="relative flex items-center overflow-hidden rounded-[1.5rem] bg-arena/60 lg:block lg:rounded-[2rem]">
            {/* Arco decorativo detrás de la prenda */}
            <div aria-hidden className="absolute inset-x-8 top-8 bottom-24 hidden rounded-t-full bg-marfil/70 lg:block" />
            <div className="relative h-[30vh] max-h-72 min-h-44 w-2/5 shrink-0 px-2 py-3 lg:mx-auto lg:aspect-[4/5] lg:h-auto lg:max-h-none lg:w-full lg:max-w-md lg:px-6 lg:pt-8 lg:pb-0">
              {modelo.foto ? (
                <FotoUniforme
                  foto={modelo.foto}
                  nombreModelo={modelo.nombre}
                  color={color.hex}
                />
              ) : (
                <VistaUniforme
                  escote={modelo.escote}
                  manga={modelo.manga}
                bota={resumen.bota.id as Bota}
                  pantalon={modelo.pantalon}
                  color={color.hex}
                  textura={tela.textura}
                />
              )}
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col gap-3 py-4 pr-4 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pt-2 lg:pb-8">
              <div className="min-w-0">
                <p className="eyebrow">Tu Vértice</p>
                <p key={modelo.id} className="animate-aparecer font-display text-2xl lg:text-3xl">
                  {modelo.nombre}
                </p>
                <p key={`${tela.id}-${color.id}`} className="animate-aparecer text-xs text-topo lg:text-sm">
                  {tela.nombre} · {color.nombre}
                </p>
              </div>
              <p key={resumen.total} className="animate-aparecer font-display text-2xl lg:text-3xl">
                {formatearPrecio(resumen.total)}
              </p>
            </div>
          </div>

          {/* Índice de pasos (solo escritorio) */}
          <nav aria-label="Pasos de personalización" className="mt-6 hidden flex-wrap gap-2 lg:flex">
            {PASOS.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="rounded-full border border-linea px-4 py-2 text-xs text-topo transition-colors duration-300 hover:border-grafito hover:text-grafito"
              >
                {i + 1}. {p.titulo}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ---------- Pasos ---------- */}
      <div className="lg:col-span-7">
        <Seccion id="modelo" paso={1} titulo="Elige tu modelo" subtitulo="Patrones propios, probados en turnos reales.">
          <SelectorModelo valor={seleccion.modeloId} dispatch={dispatch} />
        </Seccion>

        <Seccion id="tela" paso={2} titulo="Tela y color" subtitulo="Tejidos premium seleccionados por su caída y resistencia.">
          <SelectorTela telaId={seleccion.telaId} colorId={seleccion.colorId} dispatch={dispatch} />
        </Seccion>

        <Seccion id="talla" paso={3} titulo="Talla y pantalón" subtitulo="Un buen uniforme empieza por un buen ajuste.">
          <SelectorTalla seleccion={seleccion} dispatch={dispatch} />
          <div className="mt-10">
            <CotizarModelo />
          </div>
        </Seccion>

        <Seccion id="bordado" paso={4} titulo="Bordado personalizado" subtitulo="Opcional. Descríbelo y te lo cotizamos. También bordamos uniformes universitarios.">
          <SelectorBordado valor={seleccion.bordado} dispatch={dispatch} />
        </Seccion>

        <Seccion id="resumen" paso={5} titulo="Resumen de tu pedido">
          <PanelResumen seleccion={seleccion} resumen={resumen} />
        </Seccion>
      </div>

      <BarraMovil
        total={resumen.total}
        colorHex={color.hex}
        descripcion={`${modelo.nombre} · ${tela.nombre} · ${color.nombre}`}
        idResumen="resumen"
      />
    </div>
  );
}

