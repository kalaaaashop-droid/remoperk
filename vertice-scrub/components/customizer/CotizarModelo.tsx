"use client";

import { useState } from "react";
import { WHATSAPP_PEDIDOS, WHATSAPP_VISIBLE } from "@/lib/catalogo";

const MAX_DESCRIPCION = 240;

/**
 * Recuadro aparte para modelos que no están en la tienda: la clienta describe el diseño
 * y abre WhatsApp para enviar su imagen de referencia y recibir la cotización.
 */
export function CotizarModelo() {
  const [descripcion, setDescripcion] = useState("");

  const mensaje = [
    "Hola Vértice.scrub, quiero cotizar un modelo personalizado que no está en la tienda.",
    descripcion.trim() && `Detalles: ${descripcion.trim()}`,
    "Te envío mi imagen de referencia.",
  ]
    .filter(Boolean)
    .join("\n");
  const enlace = `https://wa.me/${WHATSAPP_PEDIDOS}?text=${encodeURIComponent(mensaje)}`;

  return (
    <aside aria-labelledby="cotizar-modelo-titulo" className="rounded-3xl border border-dashed border-piedra bg-arena/40 p-6 sm:p-8">
      <p className="eyebrow">Modelos personalizados</p>
      <h4 id="cotizar-modelo-titulo" className="mt-2 font-display text-2xl leading-tight">
        ¿No encuentras tu modelo?
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-topo">
        También confeccionamos modelos personalizados. Si quieres un diseño que no está en la tienda, mándanos tu imagen
        de referencia y te cotizamos cuánto saldría.
      </p>

      <label className="mt-5 block">
        <span className="mb-1.5 flex justify-between gap-4 text-xs font-medium">
          <span>Cuéntanos del modelo (opcional)</span>
          <span className="font-normal text-piedra">
            {descripcion.length}/{MAX_DESCRIPCION}
          </span>
        </span>
        <textarea
          id="cotizar-modelo-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value.slice(0, MAX_DESCRIPCION))}
          maxLength={MAX_DESCRIPCION}
          rows={3}
          placeholder="Ej.: casaca con cuello redondo y manga larga, pantalón jogger, en azul marino"
          className="campo resize-none bg-marfil leading-relaxed"
        />
      </label>

      <a
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-grafito px-6 py-3.5 text-sm font-medium text-grafito transition-colors duration-500 ease-seda hover:bg-grafito hover:text-hueso"
      >
        Cotizar mi modelo por WhatsApp
      </a>
      <p className="mt-3 text-center text-[0.7rem] leading-snug text-piedra">
        En el chat, adjunta tu imagen de referencia. La cotización es aparte de este pedido. WhatsApp:{" "}
        <span className="font-medium text-topo tabular-nums select-all">{WHATSAPP_VISIBLE}</span>
      </p>
    </aside>
  );
}
