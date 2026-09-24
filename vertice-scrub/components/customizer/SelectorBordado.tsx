import type { Dispatch } from "react";
import { BORDADO } from "@/lib/catalogo";
import type { Accion } from "@/lib/personalizacion";

interface Props {
  valor: string;
  dispatch: Dispatch<Accion>;
}

export function SelectorBordado({ valor, dispatch }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between gap-4 text-xs font-medium">
        <span>
          ¿Qué quieres bordar? · <span className="font-semibold text-arcilla">costo adicional, se cotiza</span>
        </span>
        <span className="font-normal text-piedra">
          {valor.length}/{BORDADO.maxDetalle}
        </span>
      </span>
      <textarea
        id="bordado-detalle"
        value={valor}
        onChange={(e) => dispatch({ tipo: "bordado", valor: e.target.value })}
        maxLength={BORDADO.maxDetalle}
        rows={4}
        placeholder="Ej.: «Dra. Lucía Martín · Pediatría» en hilo dorado sobre el pecho, y el logo de mi clínica en la manga"
        className="campo resize-none leading-relaxed"
        aria-describedby="bordado-detalle-ayuda"
      />
      <span id="bordado-detalle-ayuda" className="mt-1 block text-[0.7rem] leading-snug text-piedra">
        Cuéntanos qué quieres bordar: nombre, especialidad, logo, frase o dibujo, con el color del hilo y dónde va. Es un
        costo adicional que te cotizamos por WhatsApp antes de confeccionar.
      </span>
    </label>
  );
}
