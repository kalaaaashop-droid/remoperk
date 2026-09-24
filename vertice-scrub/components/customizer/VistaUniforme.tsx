import type { Escote, Manga, Pantalon, Tela } from "@/lib/catalogo";

interface Props {
  escote: Escote;
  manga: Manga;
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
  "mao-pico": "L212,38 L200,102 L188,38 Z",
};

const PIERNAS: Record<Pantalon, string> = {
  recto: "M142,262 L258,262 L266,522 L210,522 L200,340 L190,522 L134,522 Z",
  cargo: "M142,262 L258,262 L268,522 L210,522 L200,340 L190,522 L132,522 Z",
  // Pierna ancha con caída recta hasta el bajo
  ancho: "M142,262 L258,262 L282,524 L212,524 L200,344 L188,524 L118,524 Z",
  jogger:
    "M142,262 L258,262 L262,420 Q258,478 252,502 L212,502 Q208,440 200,340 Q192,440 188,502 L148,502 Q142,478 138,420 Z",
};

/** Casaca según el tipo de manga. La kimono sale del cuerpo sin costura de hombro y tiene la sisa baja. */
const CASACA: Record<Manga, string> = {
  montada: "M170,34 L128,48 Q106,72 86,114 L114,130 L138,102 L134,248 Q200,256 266,248 L262,102 L286,130 L314,114 Q294,72 272,48 L230,34",
  kimono:
    "M172,34 C138,40 100,58 82,124 L110,138 Q130,144 136,166 L136,248 Q200,256 264,248 L264,166 Q270,144 290,138 L318,124 C300,58 262,40 228,34",
};

type PropsSilueta = { escote: Escote; manga: Manga; pantalon: Pantalon };

function Silueta({ escote, manga, pantalon }: PropsSilueta) {
  return (
    <>
      {/* Casaca */}
      <path d={`${CASACA[manga]} ${CUELLO[escote]}`} />
      {escote === "mao" && <path d="M166,34 Q200,52 234,34 L233,24 Q200,42 167,24 Z" />}
      {escote === "mao-pico" && (
        <>
          {/* Cuello mao abierto: dos piezas levantadas a cada lado de la abertura */}
          <path d="M170,35 L188,39 L189,26 L172,22 Z" />
          <path d="M230,35 L212,39 L211,26 L228,22 Z" />
        </>
      )}
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
function Detalles({ escote, manga, pantalon }: PropsSilueta) {
  const costura = { fill: "none", stroke: "rgba(0,0,0,0.22)", strokeWidth: 1.1 };
  const pespunte = { fill: "none", stroke: "rgba(255,255,255,0.32)", strokeWidth: 0.9, strokeDasharray: "2.5 2.5" };

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Cuello */}
      {escote === "pico" && <path d="M174,37 L200,92 L226,37" {...pespunte} />}
      {escote === "mao-pico" && (
        <>
          {/* Tapetas pespunteadas a cada lado de la abertura */}
          <path d="M179,38 L196,108 L204,108 L221,38" {...costura} />
          <path d="M183,40 L198,103 M217,40 L202,103" {...pespunte} />
          <path d="M189,26 L188,39 M211,26 L212,39" {...costura} />
        </>
      )}
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
      {manga === "montada" ? (
        <>
          <path d="M128,48 L138,102" {...costura} />
          <path d="M272,48 L262,102" {...costura} />
          <path d="M90,108 L116,123" {...pespunte} />
          <path d="M310,108 L284,123" {...pespunte} />
        </>
      ) : (
        <>
          {/* Dobladillo de la manga kimono y pliegue suave bajo el brazo */}
          <path d="M86,118 L111,132" {...pespunte} />
          <path d="M314,118 L289,132" {...pespunte} />
          <path d="M112,128 Q128,136 136,156 M288,128 Q272,136 264,156" {...costura} />
        </>
      )}

      {/* Bolsillos de la casaca */}
      {(escote === "pico" || escote === "cruzado") && (
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
      {pantalon === "ancho" &&
        // Fruncido de la cintura elástica
        Array.from({ length: 14 }, (_, i) => 148 + i * 8).map((x) => (
          <path key={x} d={`M${x},264 L${x + 1},275`} stroke="rgba(0,0,0,0.14)" strokeWidth={0.8} />
        ))}
      {pantalon !== "cargo" && (
        <>
          <path d="M196,276 Q193,292 190,300" {...costura} />
          <path d="M204,276 Q207,292 210,300" {...costura} />
        </>
      )}
      <path d="M200,276 L200,338" {...costura} />

      {/* Bolsillos del pantalón */}
      {pantalon === "ancho" ? (
        <>
          {/* Bolsillos cargo con solapa en el lateral del muslo */}
          <path d="M132,368 L170,368 L170,424 L127,424 Z" {...costura} />
          <path d="M268,368 L230,368 L230,424 L273,424 Z" {...costura} />
          <path d="M131,384 L170,384 M269,384 L230,384" {...costura} />
          <path d="M132,388 L167,388 M268,388 L233,388" {...pespunte} />
          {/* Costura vertical que baja desde el bolsillo, y abertura lateral en el bajo */}
          <path d="M150,424 L148,524 M250,424 L252,524" {...costura} />
          <path d="M121,524 L124,494 M279,524 L276,494" {...costura} />
          <path d="M150,284 Q160,304 142,316 M250,284 Q240,304 258,316" {...costura} />
          <path d="M119,516 L187,516 M281,516 L213,516" {...pespunte} />
        </>
      ) : pantalon === "cargo" ? (
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

export function VistaUniforme({ escote, manga, pantalon, color, textura, bordado }: Props) {
  const { anchoLetra, ...fuente } = FUENTE_BORDADO[bordado?.tipografia ?? "script"];
  const nombre = bordado?.tipografia === "sans" ? bordado.nombre.toUpperCase() : bordado?.nombre;
  const tamano = nombre ? Math.min(fuente.fontSize, ANCHO_BORDADO / (nombre.length * anchoLetra)) : fuente.fontSize;
  // El bordado va en el pecho izquierdo de quien lo lleva (derecha de la imagen).
  // Con manga kimono la sisa curva entra más en el pecho, así que se acerca al centro.
  const xBordado = manga === "kimono" ? 228 : 234;

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
      <g key={`${escote}-${manga}-${pantalon}`} className="animate-aparecer">
        <g className="tinte" style={{ fill: color }}>
          <Silueta escote={escote} manga={manga} pantalon={pantalon} />
        </g>
        {textura !== "lisa" && (
          <g fill={`url(#tex-${textura})`}>
            <Silueta escote={escote} manga={manga} pantalon={pantalon} />
          </g>
        )}
        <g fill="url(#volumen)">
          <Silueta escote={escote} manga={manga} pantalon={pantalon} />
        </g>
        <Detalles escote={escote} manga={manga} pantalon={pantalon} />
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
