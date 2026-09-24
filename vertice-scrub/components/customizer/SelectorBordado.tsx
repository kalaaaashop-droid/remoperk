import type { Dispatch } from "react";
import { BORDADO, formatearPrecio } from "@/lib/catalogo";
import type { Accion, Seleccion } from "@/lib/personalizacion";

interface Props {
  bordado: Seleccion["bordado"];
  dispatch: Dispatch<Accion>;
}

export function SelectorBordado({ bordado, dispatch }: Props) {
  const set = (campo: keyof Seleccion["bordado"], valor: string) => dispatch({ tipo: "bordado", campo, valor });
  const tieneBordado = Boolean(bordado.nombre.trim() || bordado.especialidad);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex justify-between text-xs font-medium">
            <span>Nombre · +{formatearPrecio(BORDADO.recargoNombre)}</span>
            <span className="font-normal text-piedra">
              {bordado.nombre.length}/{BORDADO.maxCaracteres}
            </span>
          </span>
          <input
            value={bordado.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Dra. Lucía Martín"
            maxLength={BORDADO.maxCaracteres}
            autoComplete="off"
            className="campo"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium">Especialidad · +{formatearPrecio(BORDADO.recargoEspecialidad)}</span>
          <span className="relative block">
            <select value={bordado.especialidad} onChange={(e) => set("especialidad", e.target.value)} className="campo appearance-none pr-10">
              <option value="">Sin especialidad</option>
              {BORDADO.especialidades.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
            <svg viewBox="0 0 12 12" aria-hidden className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-topo">
              <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
        </label>
      </div>

      {/* Hilo y tipografía solo tienen sentido si hay algo que bordar */}
      <fieldset
        disabled={!tieneBordado}
        aria-label="Acabado del bordado"
        className={`grid gap-6 transition-opacity duration-500 sm:grid-cols-2 ${tieneBordado ? "opacity-100" : "opacity-40"}`}
      >
        <div>
          <p className="eyebrow mb-3">Color del hilo</p>
          <div role="radiogroup" aria-label="Color del hilo" className="flex gap-3">
            {BORDADO.hilos.map((h) => (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={bordado.hiloId === h.id}
                aria-label={h.nombre}
                title={h.nombre}
                onClick={() => set("hiloId", h.id)}
                className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 ease-seda ${
                  bordado.hiloId === h.id ? "border-grafito" : "border-transparent hover:border-piedra"
                }`}
              >
                <span className="h-8 w-8 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" style={{ backgroundColor: h.hex }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Tipografía</p>
          <div role="radiogroup" aria-label="Tipografía del bordado" className="grid grid-cols-3 gap-2">
            {BORDADO.tipografias.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={bordado.tipografiaId === t.id}
                onClick={() => set("tipografiaId", t.id)}
                className="opcion flex flex-col items-center gap-1 px-2 py-3"
              >
                <span className={`text-lg leading-none ${t.clase}`}>Aa</span>
                <span className="text-[0.65rem] text-topo">{t.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <p className="text-xs leading-relaxed text-piedra">
        Bordado a máquina con hilo de poliéster de alta tenacidad, a la altura del pecho izquierdo. Resiste lavados
        industriales a 60 °C.
      </p>
    </div>
  );
}
