import type { FotoModelo } from "@/lib/catalogo";

interface Props {
  foto: FotoModelo;
  nombreModelo: string;
  color: string;
  bordado: { nombre: string; especialidad: string; hilo: string; claseFuente: string };
}

/**
 * Foto real del uniforme, teñida con el color elegido.
 * La imagen es una máscara en grises: la capa de color toma su silueta (mask-image)
 * y la propia foto encima, en modo multiplicar, le devuelve las sombras y pliegues de la tela.
 */
export function FotoUniforme({ foto, nombreModelo, color, bordado }: Props) {
  const mascara = `url("${foto.src}")`;
  const hayBordado = Boolean(bordado.nombre || bordado.especialidad);
  // El nombre se encoge para caber en el ancho del bordado (28% del ancho de la foto, medido en cqh)
  const anchoBordado = 0.28 * (foto.ancho / foto.alto) * 100;
  const tamanoNombre = Math.min(2.2, anchoBordado / (Math.max(bordado.nombre.length, 1) * 0.5));

  return (
    <div
      className="animate-aparecer relative mx-auto h-full max-w-full [isolation:isolate]"
      // containerType: el bordado se mide en cqh para escalar con la foto en móvil y escritorio
      style={{ aspectRatio: `${foto.ancho} / ${foto.alto}`, containerType: "size" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          transition: "background-color 900ms var(--ease-seda)",
          maskImage: mascara,
          WebkitMaskImage: mascara,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={foto.src}
        alt={`Uniforme ${nombreModelo}`}
        className="absolute inset-0 h-full w-full mix-blend-multiply select-none"
        draggable={false}
      />
      {hayBordado && (
        <div
          aria-hidden
          className="absolute -translate-x-1/2 text-center leading-none transition-colors duration-500"
          style={{
            left: `${(foto.bordado.x / foto.ancho) * 100}%`,
            top: `${(foto.bordado.y / foto.alto) * 100}%`,
            color: bordado.hilo,
            width: "28%",
            textShadow: "0 1px 0 rgba(0,0,0,0.2)",
          }}
        >
          {bordado.nombre && (
            <p className={`whitespace-nowrap ${bordado.claseFuente}`} style={{ fontSize: `${tamanoNombre}cqh` }}>
              {bordado.nombre}
            </p>
          )}
          {bordado.especialidad && <p className="mt-[0.3cqh] tracking-[0.18em] uppercase" style={{ fontSize: "1.1cqh" }}>{bordado.especialidad}</p>}
        </div>
      )}
    </div>
  );
}
