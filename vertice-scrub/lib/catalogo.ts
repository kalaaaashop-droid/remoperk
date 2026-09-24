/**
 * Catálogo de Vértice.scrub.
 * Este es el único archivo que hay que editar para añadir modelos, telas, colores o cambiar precios.
 * Todos los precios están en dólares (USD).
 */

export type Escote = "pico" | "cruzado" | "mao" | "mao-pico" | "alto-pico";
export type Manga = "montada" | "kimono";
export type Pantalon = "recto" | "jogger" | "cargo" | "ancho";

export interface Modelo {
  id: string;
  nombre: string;
  descripcion: string;
  escote: Escote;
  manga: Manga;
  pantalon: Pantalon;
  disponibilidad: "bajo-pedido" | "edicion-limitada";
  unidades?: number; // solo ediciones limitadas
  detalles: string[];
  /** Foto recortada y recoloreable (sustituye al dibujo). Se genera con scripts/recortar-foto.py. */
  foto?: FotoModelo;
  /** Color con el que se muestra el modelo al elegirlo (id de un color de cualquier tela). */
  colorInicial?: string;
}

export interface FotoModelo {
  src: string;
  ancho: number; // px de la imagen, para mantener su proporción
  alto: number;
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
  precio: number; // precio del conjunto completo en esta tela
  textura: "sarga" | "punto" | "lisa";
  colores: Color[];
}

/** Tabla de medidas universales de Vértice.scrub: medidas del cuerpo (no de la prenda), en cm. */
export interface Talla {
  id: string;
  busto: number;
  cadera: number;
  cintura: number;
  recargo?: number; // tallas grandes: se suma al precio del conjunto
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
    descripcion: "Cuello mao abierto en pico, manga kimono y pantalón ancho cargo. Fluido y con estructura.",
    escote: "mao-pico",
    manga: "kimono",
    pantalon: "ancho",
    disponibilidad: "bajo-pedido",
    detalles: ["Manga kimono sin costura de hombro", "Bolsillos cargo con solapa", "Abertura lateral en el bajo"],
  },
  {
    id: "solsticio",
    nombre: "Solsticio",
    descripcion: "Cuello alto en pico, bolsillo de pecho y pantalón de pretina elástica. Nuestra pieza de lanzamiento.",
    escote: "alto-pico",
    manga: "kimono",
    pantalon: "recto",
    disponibilidad: "edicion-limitada",
    unidades: 40,
    detalles: ["Cuello alto en pico", "Bolsillo de parche en el pecho", "Pretina elástica fruncida"],
    foto: { src: "/modelos/solsticio.webp", ancho: 389, alto: 850 },
    colorInicial: "eucalipto",
  },
  {
    id: "nomada",
    nombre: "Nómada",
    descripcion: "Cuello alto en pico, manga kimono y pantalón recto de cintura elástica. Moderno y cómodo.",
    escote: "alto-pico",
    manga: "kimono",
    pantalon: "recto",
    disponibilidad: "bajo-pedido",
    detalles: ["Cuello alto que enmarca el rostro", "Bolsillo de parche en el pecho", "Cintura elástica ancha con bolsillos laterales"],
  },
];

/** El precio del conjunto (casaca + pantalón) lo marca la tela; es igual para todos los modelos. */
export const TELAS: Tela[] = [
  {
    id: "stretch",
    nombre: "Stretch",
    composicion: "Tejido con elastano, se estira en todas las direcciones",
    cualidades: ["Stretch 4 direcciones", "Caída estructurada", "No se arruga"],
    precio: 35,
    textura: "sarga",
    colores: [
      { id: "noche", nombre: "Noche", hex: "#1f2230" },
      { id: "eucalipto", nombre: "Eucalipto", hex: "#5d7468" },
      { id: "vino", nombre: "Vino", hex: "#6b2e3a" },
      { id: "petroleo", nombre: "Petróleo", hex: "#2f5260" },
      { id: "grafito", nombre: "Grafito", hex: "#3a3a3c" },
      { id: "salvia", nombre: "Salvia", hex: "#8a9a86" },
    ],
  },
  {
    id: "microfibra",
    nombre: "Microfibra",
    composicion: "Microfibra de poliéster, ligera y de tacto suave",
    cualidades: ["Tacto suave", "Secado rápido", "Ligera"],
    precio: 30,
    textura: "punto",
    colores: [
      { id: "marino", nombre: "Marino", hex: "#243447" },
      { id: "lavanda", nombre: "Lavanda gris", hex: "#a39fb4" },
      { id: "rosa-empolvado", nombre: "Rosa empolvado", hex: "#c9a39b" },
      { id: "azul-niebla", nombre: "Azul niebla", hex: "#8fa3b1" },
      { id: "hueso", nombre: "Hueso", hex: "#e8e1d5" },
      { id: "arena", nombre: "Arena", hex: "#cbbba4" },
    ],
  },
];

/** A partir de la 2XL el conjunto sube este importe. */
export const RECARGO_TALLA_GRANDE = 6;

export const TALLAS: Talla[] = [
  { id: "S", busto: 90, cadera: 94, cintura: 66 },
  { id: "M", busto: 94, cadera: 98, cintura: 72 },
  { id: "L", busto: 98, cadera: 102, cintura: 74 },
  { id: "XL", busto: 102, cadera: 106, cintura: 78 },
  { id: "2XL", busto: 108, cadera: 112, cintura: 82, recargo: RECARGO_TALLA_GRANDE },
  { id: "3XL", busto: 114, cadera: 118, cintura: 94, recargo: RECARGO_TALLA_GRANDE },
  { id: "4XL", busto: 120, cadera: 124, cintura: 100, recargo: RECARGO_TALLA_GRANDE },
];

export type Bota = "ancha" | "recta";

/** Corte de la pierna del pantalón. */
export const BOTAS: (OpcionAjuste & { id: Bota })[] = [
  { id: "ancha", nombre: "Bota ancha", descripcion: "Pierna amplia con caída fluida.", recargo: 0 },
  { id: "recta", nombre: "Bota recta", descripcion: "Pierna recta de ancho clásico.", recargo: 0 },
];

/** Bota con la que se muestra cada modelo al elegirlo. */
export const botaDelModelo = (m: Modelo): Bota => (m.pantalon === "ancho" ? "ancha" : "recta");

/** Confección a medida: se patrona desde las medidas que envía la clienta. */
export const RECARGO_A_MEDIDA = 18;

/** Bordado personalizado: la clienta lo describe con sus palabras y se cotiza aparte. */
export const BORDADO = {
  maxDetalle: 240,
} as const;

/** Número de WhatsApp que recibe los pedidos (formato internacional, sin "+"). */
export const WHATSAPP_PEDIDOS = "34600000000";

export const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(valor);

/** Precio más bajo de un conjunto (la tela más económica). */
export const PRECIO_DESDE = Math.min(...TELAS.map((t) => t.precio));
