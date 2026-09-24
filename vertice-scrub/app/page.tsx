import { Configurador } from "@/components/customizer/Configurador";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";

const VALORES = [
  {
    titulo: "Confección artesanal",
    texto: "Cada pieza se corta y se cose en nuestro taller de Valencia. Series cortas, sin producción masiva.",
  },
  {
    titulo: "Telas premium",
    texto: "Tejidos técnicos con stretch, antimanchas y de secado rápido, elegidos por su caída y durabilidad.",
  },
  {
    titulo: "Entalle preciso",
    texto: "Patrones propios en seis tallas, con pantalón de bota ancha o recta. O, si lo prefieres, a tu medida.",
  },
];

export default function Inicio() {
  return (
    <>
      <Cabecera />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto max-w-7xl px-4 pt-14 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8">
          <p className="eyebrow animate-aparecer">Slow fashion médico</p>
          <h1 className="animate-aparecer mx-auto mt-5 max-w-3xl font-display text-[2.6rem] leading-[1.05] [animation-delay:120ms] sm:text-6xl lg:text-7xl">
            Uniformes que se hacen <em className="text-salvia-oscuro">contigo</em>, no en serie.
          </h1>
          <p className="animate-aparecer mx-auto mt-6 max-w-xl text-base leading-relaxed text-topo [animation-delay:240ms]">
            Diseña tu scrub pieza a pieza: modelo, tela, color, talla y bordado. Lo confeccionamos a mano, solo para ti.
          </p>
          <a
            href="#personaliza"
            className="animate-aparecer mt-8 inline-flex rounded-full bg-grafito px-7 py-3.5 text-sm font-medium tracking-wide text-hueso transition-colors duration-500 [animation-delay:360ms] hover:bg-black"
          >
            Empezar a personalizar
          </a>
        </section>

        {/* ---------- Configurador ---------- */}
        <section id="personaliza" aria-labelledby="titulo-personaliza" className="scroll-mt-16 pt-6">
          <h2 id="titulo-personaliza" className="sr-only">
            Personaliza tu uniforme
          </h2>
          <Configurador />
        </section>

        {/* ---------- Valores de marca ---------- */}
        <section id="taller" className="scroll-mt-16 border-t border-linea bg-arena/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="eyebrow text-center">El taller</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-4xl leading-tight sm:text-5xl">
              Menos prendas, mejor hechas.
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {VALORES.map((v, i) => (
                <div key={v.titulo} className="border-t border-piedra/50 pt-6">
                  <span className="font-display text-lg text-piedra">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-2xl">{v.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-topo">{v.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
