import type { FotoModelo } from "@/lib/catalogo";

interface Props {
  foto: FotoModelo;
  nombreModelo: string;
  color: string;
}

/**
 * Foto real del uniforme, teñida con el color elegido.
 * La imagen es una máscara en grises: la capa de color toma su silueta (mask-image)
 * y la propia foto encima, en modo multiplicar, le devuelve las sombras y pliegues de la tela.
 */
export function FotoUniforme({ foto, nombreModelo, color }: Props) {
  const mascara = `url("${foto.src}")`;

  // La foto encaja en su caja sin deformarse: ancho = el menor entre el ancho disponible
  // y el que corresponde a la altura disponible (unidades de contenedor cqw/cqh).
  const proporcion = foto.ancho / foto.alto;

  return (
    <div
      className="flex h-full w-full items-end justify-center"
      style={{ containerType: "size" }}
    >
      <div
        className="animate-aparecer relative [isolation:isolate]"
        style={{
          aspectRatio: `${foto.ancho} / ${foto.alto}`,
          width: `min(100cqw, ${proporcion} * 100cqh)`,
        }}
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
      </div>
    </div>
  );
}
