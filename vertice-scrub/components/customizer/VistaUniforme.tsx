import type { Escote, Pantalon, Tela } from "@/lib/catalogo";

interface Props {
  escote: Escote;
  pantalon: Pantalon;
  color: string;
  textura: Tela["textura"];
  bordado?: {
    nombre: string;
    especialidad: string;
    hilo: string;
    tipografia: "script" | "serif" | "sans";
  };
}

/* --- Siluetas (sin fill: lo heredan del <g> contenedor para poder animar el color) --- */

const CUELLO: Record<Escote, string> = {
  pico: "L200,100 L170,34 Z",
  cruzado: "L186,112 L170,34 Z",
  mao: "Q200,52 170,34 Z",
};

const PIERNAS: Record<Pantalon, string> = {
  recto: "M142,262 L258,262 L266,522 L210,522 L200,340 L190,522 L134,522 Z",
  cargo: "M142,262 L258,262 L268,522 L210,522 L200,340 L190,522 L132,522 Z",
  jogger:
    "M142,262 L258,262 L262,420 Q258,478 252,502 L212,502 Q208,440 200,340 Q192,440 188,502 L148,502 Q142,478 138,420 Z",
};

function Silueta({ escote, pantalon }: { escote: Escote; pantalon: Pantalon }) {
  return (
    <>
      {/* Casaca */}
      <path
        d={`M170,34 L128,48 Q106,72 86,114 L114,130 L138,102 L134,248 Q200,256 266,248 L262,102 L286,130 L314,114 Q294,72 272,48 L230,34 ${CUELLO[escote]}`}
      />
      {escote === "mao" && <path d="M166,34 Q200,52 234,34 L233,24 Q200,42 167,24 Z" />}
      {/* Pantalón */}
      <path d={PIERNAS[pantalon]} />
      {pantalon === "jogger" && (
        <>
          <path d="M148,500 L188,500 L187,524 L150,524 Z" />
          <path d="M212,500 L252,500 L250,524 L213,524 Z" />
        </>
      )}
    </>
  );
}

/** Costuras, bolsillos y pespuntes: dan el aspecto de prenda confeccionada. */
function Detalles({ escote, pantalon }: { escote: Escote; pantalon: Pantalon }) {
  const costura = { fill: "none", stroke: "rgba(0,0,0,0.22)", strokeWidth: 1.1 };
  const pespunte = { fill: "none", stroke: "rgba(255,255,255,0.32)", strokeWidth: 0.9, strokeDasharray: "2.5 2.5" };

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Cuello */}
      {escote === "pico" && <path d="M174,37 L200,92 L226,37" {...pespunte} />}
      {escote === "cruzado" && (
        <>
          <path d="M173,37 L212,96" {...costura} />
          <path d="M228,36 L180,126" {...costura} />
          <path d="M224,38 L180,120" {...pespunte} />
        </>
      )}
      {escote === "mao" && (
        <>
          <path d="M200,44 L200,128" {...costura} />
          <path d="M206,46 L206,128" {...pespunte} />
          {[64, 86, 108].map((y) => (
            <circle key={y} cx={203} cy={y} r={2.2} fill="rgba(0,0,0,0.28)" />
          ))}
          <rect x={148} y={112} width={30} height={32} rx={3} {...costura} />
        </>
      )}

      {/* Mangas y hombros */}
      <path d="M128,48 L138,102" {...costura} />
      <path d="M272,48 L262,102" {...costura} />
      <path d="M90,108 L116,123" {...pespunte} />
      <path d="M310,108 L284,123" {...pespunte} />

      {/* Bolsillos de la casaca */}
      {escote !== "mao" && (
        <>
          <rect x={146} y={186} width={40} height={42} rx={4} {...costura} />
          <rect x={214} y={186} width={40} height={42} rx={4} {...costura} />
          <path d="M149,192 L183,192" {...pespunte} />
          <path d="M217,192 L251,192" {...pespunte} />
        </>
      )}
      {escote === "mao" && <path d="M138,210 Q200,218 262,210" {...pespunte} />}
      <path d="M136,238 Q200,246 264,238" {...pespunte} />

      {/* Cintura */}
      <path d="M142,276 L258,276" {...costura} />
      <path d="M143,270 L257,270" {...pespunte} />
      {pantalon !== "cargo" && (
        <>
          <path d="M196,276 Q193,292 190,300" {...costura} />
          <path d="M204,276 Q207,292 210,300" {...costura} />
        </>
      )}
      <path d="M200,276 L200,338" {...costura} />

      {/* Bolsillos del pantalón */}
      {pantalon === "cargo" ? (
        <>
          <rect x={134} y={372} width={30} height={46} rx={3} {...costura} />
          <rect x={236} y={372} width={30} height={46} rx={3} {...costura} />
          <path d="M134,384 L164,384 M236,384 L266,384" {...costura} />
          <path d="M150,280 Q160,300 144,310 M250,280 Q240,300 256,310" {...costura} />
        </>
      ) : (
        <path d="M150,280 Q162,300 140,312 M250,280 Q238,300 260,312" {...costura} />
      )}
      {pantalon === "jogger" && <path d="M149,508 L187,508 M213,508 L251,508" {...pespunte} />}
    </g>
  );
}

const FUENTE_BORDADO = {
  script: { fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, letterSpacing: 0, anchoLetra: 0.45 },
  serif: { fontFamily: "var(--font-display)", fontStyle: "normal", fontSize: 12, letterSpacing: 0.3, anchoLetra: 0.5 },
  sans: { fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: 8, letterSpacing: 1.2, anchoLetra: 0.85 },
} as const;

/** Ancho disponible en el pecho (unidades SVG) para que el bordado no se salga de la casaca. */
const ANCHO_BORDADO = 54;

export function VistaUniforme({ escote, pantalon, color, textura, bordado }: Props) {
  const { anchoLetra, ...fuente } = FUENTE_BORDADO[bordado?.tipografia ?? "script"];
  const nombre = bordado?.tipografia === "sans" ? bordado.nombre.toUpperCase() : bordado?.nombre;
  const tamano = nombre ? Math.min(fuente.fontSize, ANCHO_BORDADO / (nombre.length * anchoLetra)) : fuente.fontSize;
  // El bordado va en el pecho izquierdo de quien lo lleva (derecha de la imagen),
  // salvo en el modelo con cuello mao, donde ese lado queda libre.
  const xBordado = escote === "mao" ? 236 : 234;

  return (
    <svg viewBox="0 0 400 540" role="img" aria-label="Vista previa del uniforme personalizado" className="h-full w-full">
      <defs>
        <linearGradient id="volumen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        <pattern id="tex-sarga" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#000" strokeOpacity="0.09" strokeWidth="1.4" />
        </pattern>
        <pattern id="tex-punto" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill="#fff" fillOpacity="0.14" />
        </pattern>
        <filter id="sombra-suelo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse cx="200" cy="530" rx="90" ry="7" fill="#2a2826" opacity="0.12" filter="url(#sombra-suelo)" />

      {/* key: al cambiar de modelo la silueta se reconstruye con un fundido suave */}
      <g key={`${escote}-${pantalon}`} className="animate-aparecer">
        <g className="tinte" style={{ fill: color }}>
          <Silueta escote={escote} pantalon={pantalon} />
        </g>
        {textura !== "lisa" && (
          <g fill={`url(#tex-${textura})`}>
            <Silueta escote={escote} pantalon={pantalon} />
          </g>
        )}
        <g fill="url(#volumen)">
          <Silueta escote={escote} pantalon={pantalon} />
        </g>
        <Detalles escote={escote} pantalon={pantalon} />
      </g>

      {bordado && (nombre || bordado.especialidad) && (
        <g
          key={`${bordado.tipografia}-${escote}`}
          className="animate-aparecer"
          textAnchor="middle"
          style={{ fill: bordado.hilo, transition: "fill 600ms var(--ease-seda)" }}
        >
          {nombre && (
            <text x={xBordado} y={150} style={{ ...fuente, fontSize: tamano }}>
              {nombre}
            </text>
          )}
          {bordado.especialidad && (
            <text
              x={xBordado}
              y={nombre ? 163 : 152}
              style={{ fontFamily: "var(--font-sans)", fontSize: 6, letterSpacing: 1.6, textTransform: "uppercase" }}
            >
              {bordado.especialidad}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
