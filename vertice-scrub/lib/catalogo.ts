/**
 * Catálogo de Vértice.scrub.
 * Este es el único archivo que hay que editar para añadir modelos, telas, colores o cambiar precios.
 * Todos los precios están en euros.
 */

export type Escote = "pico" | "cruzado" | "mao";
export type Pantalon = "recto" | "jogger" | "cargo";

export interface Modelo {
  id: string;
  nombre: string;
  descripcion: string;
  escote: Escote;
  pantalon: Pantalon;
  precioBase: number;
  disponibilidad: "bajo-pedido" | "edicion-limitada";
  unidades?: number; // solo ediciones limitadas
  detalles: string[];
}

export interface Color {
  id: string;
  nombre: string;
  hex: string;
}

export interface Tela {
  id: string;
  nombre: string;
  composicion: string;
  cualidades: string[];
  recargo: number;
  textura: "sarga" | "punto" | "lisa";
  colores: Color[];
}

export interface Talla {
  id: string;
  pecho: [number, number]; // cm
  cintura: [number, number];
  cadera: [number, number];
}

export interface OpcionAjuste {
  id: string;
  nombre: string;
  descripcion: string;
  recargo: number;
}

export const MODELOS: Modelo[] = [
  {
    id: "aurora",
    nombre: "Aurora",
    descripcion: "Cuello en pico y pantalón recto. El clásico reinterpretado con un entalle limpio.",
    escote: "pico",
    pantalon: "recto",
    precioBase: 64,
    disponibilidad: "bajo-pedido",
    detalles: ["Pinzas traseras", "2 bolsillos de parche", "Cintura con cordón interior"],
  },
  {
    id: "solsticio",
    nombre: "Solsticio",
    descripcion: "Escote cruzado y jogger con puño. Silueta fluida para jornadas largas.",
    escote: "cruzado",
    pantalon: "jogger",
    precioBase: 72,
    disponibilidad: "edicion-limitada",
    unidades: 40,
    detalles: ["Cruce asimétrico", "Puño elástico en tobillo", "Bolsillo portabolígrafos"],
  },
  {
    id: "nomada",
    nombre: "Nómada",
    descripcion: "Cuello mao y pantalón cargo. Estructurado, funcional y con más almacenaje.",
    escote: "mao",
    pantalon: "cargo",
    precioBase: 78,
    disponibilidad: "bajo-pedido",
    detalles: ["Cuello con tapeta", "6 bolsillos funcionales", "Presilla para identificación"],
  },
];

export const TELAS: Tela[] = [
  {
    id: "esencial",
    nombre: "Esencial",
    composicion: "65% poliéster · 32% viscosa · 3% elastano",
    cualidades: ["Transpirable", "No se arruga"],
    recargo: 0,
    textura: "lisa",
    colores: [
      { id: "grafito", nombre: "Grafito", hex: "#3a3a3c" },
      { id: "marino", nombre: "Marino", hex: "#243447" },
      { id: "salvia", nombre: "Salvia", hex: "#8a9a86" },
      { id: "arena", nombre: "Arena", hex: "#cbbba4" },
    ],
  },
  {
    id: "sarga-premium",
    nombre: "Sarga Premium",
    composicion: "72% poliéster reciclado · 21% rayón · 7% spandex",
    cualidades: ["Caída estructurada", "Antimanchas", "Stretch 4 direcciones"],
    recargo: 14,
    textura: "sarga",
    colores: [
      { id: "noche", nombre: "Noche", hex: "#1f2230" },
      { id: "eucalipto", nombre: "Eucalipto", hex: "#5d7468" },
      { id: "vino", nombre: "Vino", hex: "#6b2e3a" },
      { id: "petroleo", nombre: "Petróleo", hex: "#2f5260" },
      { id: "cacao", nombre: "Cacao", hex: "#5a4337" },
    ],
  },
  {
    id: "seda-tecnica",
    nombre: "Seda Técnica",
    composicion: "Microfibra de tacto sedoso · 10% elastano",
    cualidades: ["Tacto ultrasuave", "Secado rápido", "Antibacteriano"],
    recargo: 22,
    textura: "punto",
    colores: [
      { id: "hueso", nombre: "Hueso", hex: "#e8e1d5" },
      { id: "lavanda", nombre: "Lavanda gris", hex: "#a39fb4" },
      { id: "rosa-empolvado", nombre: "Rosa empolvado", hex: "#c9a39b" },
      { id: "azul-niebla", nombre: "Azul niebla", hex: "#8fa3b1" },
    ],
  },
];

/** Tabla de medidas corporales (no de la prenda), en centímetros. */
export const TALLAS: Talla[] = [
  { id: "XS", pecho: [78, 82], cintura: [60, 64], cadera: [86, 90] },
  { id: "S", pecho: [83, 87], cintura: [65, 69], cadera: [91, 95] },
  { id: "M", pecho: [88, 93], cintura: [70, 75], cadera: [96, 101] },
  { id: "L", pecho: [94, 100], cintura: [76, 82], cadera: [102, 108] },
  { id: "XL", pecho: [101, 107], cintura: [83, 89], cadera: [109, 115] },
  { id: "XXL", pecho: [108, 115], cintura: [90, 97], cadera: [116, 123] },
];

export const ENTALLES: OpcionAjuste[] = [
  { id: "entallado", nombre: "Entallado", descripcion: "Sigue la silueta. Holgura de 4 cm.", recargo: 0 },
  { id: "regular", nombre: "Regular", descripcion: "Nuestro patrón base. Holgura de 8 cm.", recargo: 0 },
  { id: "relajado", nombre: "Relajado", descripcion: "Más libertad de movimiento. Holgura de 12 cm.", recargo: 0 },
];

export const LARGOS: OpcionAjuste[] = [
  { id: "petite", nombre: "Petite", descripcion: "Menos de 1,60 m · largo −5 cm", recargo: 6 },
  { id: "regular", nombre: "Regular", descripcion: "1,60 – 1,75 m", recargo: 0 },
  { id: "tall", nombre: "Tall", descripcion: "Más de 1,75 m · largo +6 cm", recargo: 6 },
];

/** Confección a medida: se patrona desde las medidas que envía la clienta. */
export const RECARGO_A_MEDIDA = 18;

export const BORDADO = {
  maxCaracteres: 22,
  recargoNombre: 9,
  recargoEspecialidad: 6,
  especialidades: [
    "Medicina",
    "Enfermería",
    "Odontología",
    "Pediatría",
    "Fisioterapia",
    "Veterinaria",
    "Anestesiología",
    "Cirugía",
  ],
  hilos: [
    { id: "marfil", nombre: "Marfil", hex: "#f4efe6" },
    { id: "oro", nombre: "Oro viejo", hex: "#c2a06b" },
    { id: "grafito", nombre: "Grafito", hex: "#2a2826" },
    { id: "salvia", nombre: "Salvia", hex: "#9fb09a" },
  ] satisfies Color[],
  tipografias: [
    { id: "script", nombre: "Caligráfica", clase: "font-display italic" },
    { id: "serif", nombre: "Clásica", clase: "font-display" },
    { id: "sans", nombre: "Moderna", clase: "font-sans tracking-wide uppercase" },
  ],
} as const;

/** Número de WhatsApp que recibe los pedidos (formato internacional, sin "+"). */
export const WHATSAPP_PEDIDOS = "34600000000";

export const formatearEuros = (valor: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(valor);
