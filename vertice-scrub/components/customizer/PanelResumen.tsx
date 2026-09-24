import { WHATSAPP_PEDIDOS, WHATSAPP_VISIBLE, formatearPrecio } from "@/lib/catalogo";
import { mensajePedido, type Resumen, type Seleccion } from "@/lib/personalizacion";

interface Props {
  seleccion: Seleccion;
  resumen: Resumen;
}

export function PanelResumen({ seleccion, resumen }: Props) {
  const { modelo, tela, color, bota, pretina, lineas, total } = resumen;
  const detalle = seleccion.bordado.trim();

  const filas: [string, string][] = [
    ["Modelo", modelo.nombre],
    ["Tela", tela.nombre],
    ["Color", color.nombre],
    ["Talla", seleccion.tallaId],
    ["Pantalón", pretina ? `${bota.nombre} · ${pretina.nombre}` : bota.nombre],
    ["Bordado personalizado", detalle || "Sin bordado"],
  ];

  const enlace = `https://wa.me/${WHATSAPP_PEDIDOS}?text=${encodeURIComponent(mensajePedido(seleccion, resumen))}`;

  return (
    <div className="rounded-3xl border border-linea bg-marfil p-6 sm:p-8">
      <dl className="divide-y divide-linea text-sm">
        {filas.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-6 py-3 first:pt-0">
            <dt className="text-topo">{k}</dt>
            <dd key={k === "Bordado personalizado" ? k : v} className="animate-aparecer flex min-w-0 items-center gap-2 text-right font-medium break-words">
              {k === "Color" && (
                <span className="transition-colors duration-700 ease-seda h-3.5 w-3.5 rounded-full" style={{ backgroundColor: color.hex }} aria-hidden />
              )}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-2 rounded-2xl bg-hueso p-5 text-sm">
        {lineas.map((l) => (
          <div key={l.concepto} className="animate-aparecer flex justify-between text-topo">
            <span>{l.concepto}</span>
            <span>{formatearPrecio(l.importe)}</span>
          </div>
        ))}
        {detalle && (
          <div className="animate-aparecer flex justify-between text-topo">
            <span>Bordado personalizado</span>
            <span className="text-arcilla">A cotizar</span>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-linea pt-3">
          <span className="font-medium">Total</span>
          <span key={total} className="animate-aparecer font-display text-3xl">
            {formatearPrecio(total)}
          </span>
        </div>
        {detalle && <p className="text-right text-xs text-arcilla">+ bordado personalizado, se cotiza aparte</p>}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-topo">
        {modelo.disponibilidad === "edicion-limitada"
          ? `Edición limitada de ${modelo.unidades} unidades. Entrega entre 7 y 10 días hábiles.`
          : "Confeccionado bajo pedido en nuestro taller. Entrega entre 7 y 10 días hábiles."}
      </p>

      <a
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-grafito px-6 py-4 text-sm font-medium tracking-wide text-hueso transition-all duration-500 ease-seda hover:bg-black hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]"
      >
        Solicitar mi pedido
        <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 ease-seda group-hover:translate-x-1" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </a>
      <p className="mt-3 text-center text-[0.7rem] text-piedra">
        Te confirmamos disponibilidad y pago por WhatsApp:{" "}
        <span className="font-medium text-topo tabular-nums select-all">{WHATSAPP_VISIBLE}</span>
      </p>
    </div>
  );
}
