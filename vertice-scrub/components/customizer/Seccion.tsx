import type { ReactNode } from "react";

interface Props {
  id: string;
  paso: number;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}

/** Bloque numerado de cada paso del configurador. */
export function Seccion({ id, paso, titulo, subtitulo, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-[calc(min(30vh,18rem)+7rem)] lg:scroll-mt-24 border-t border-linea py-10 first:border-t-0 first:pt-0">
      <header className="mb-6 flex items-baseline gap-4">
        <span className="font-display text-3xl leading-none text-piedra">{String(paso).padStart(2, "0")}</span>
        <div>
          <h3 id={`${id}-titulo`} className="font-display text-2xl leading-tight sm:text-[1.75rem]">
            {titulo}
          </h3>
          {subtitulo && <p className="mt-1 text-sm text-topo">{subtitulo}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
