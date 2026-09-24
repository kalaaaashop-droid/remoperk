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
    colorInicial: "verde-oliva",
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
    // Gama de colores de la tela Stretch (en el mismo orden que la carta del taller)
    colores: [
      { id: "azul-cielo", nombre: "Azul cielo", hex: "#298fbc" },
      { id: "blanco", nombre: "Blanco", hex: "#ffffff" },
      { id: "palo-de-rosa", nombre: "Palo de rosa", hex: "#ab696a" },
      { id: "azul-cobalto", nombre: "Azul cobalto", hex: "#025699" },
      { id: "gris-perla", nombre: "Gris perla", hex: "#9aa6a4" },
      { id: "caqui", nombre: "Caqui", hex: "#a19270" },
      { id: "negro", nombre: "Negro", hex: "#1a1a1a" },
      { id: "lila", nombre: "Lila", hex: "#b17fc5" },
      { id: "rosa-bebe", nombre: "Rosa bebé", hex: "#f8bdca" },
      { id: "verde-oliva", nombre: "Verde oliva", hex: "#46624d" },
      { id: "naranja", nombre: "Naranja", hex: "#da6532" },
      { id: "azul-rey", nombre: "Azul rey", hex: "#24418c" },
      { id: "turquesa", nombre: "Turquesa", hex: "#5ad5d2" },
      { id: "fucsia", nombre: "Fucsia", hex: "#f54c97" },
      { id: "rojo-vino", nombre: "Rojo vino", hex: "#b60835" },
      { id: "malva", nombre: "Malva", hex: "#a06c96" },
      { id: "azul-petroleo", nombre: "Azul petróleo", hex: "#376c77" },
      { id: "azul-marino", nombre: "Azul marino", hex: "#3a4065" },
      { id: "verde-esmeralda", nombre: "Verde esmeralda", hex: "#236b51" },
    ],
  },
  {
    id: "microfibra",
    nombre: "Microfibra",
    composicion: "Microfibra de poliéster, ligera y de tacto suave",
    cualidades: ["Tacto suave", "Secado rápido", "Ligera"],
    precio: 30,
    textura: "punto",
    // Gama de colores de la tela Microfibra (en el mismo orden que la carta del taller)
    colores: [
      { id: "palo-de-rosa", nombre: "Palo de rosa", hex: "#aa7277" },
      { id: "blanco", nombre: "Blanco", hex: "#ffffff" },
      { id: "vino-tinto", nombre: "Vino tinto", hex: "#74243f" },
      { id: "verde-grama", nombre: "Verde grama", hex: "#66a51a" },
      { id: "camel", nombre: "Camel", hex: "#9b7c5b" },
      { id: "naranja", nombre: "Naranja", hex: "#e77746" },
      { id: "lila", nombre: "Lila", hex: "#b294b5" },
      { id: "rosa-pastel", nombre: "Rosa pastel", hex: "#dbbbca" },
      { id: "gris-claro", nombre: "Gris claro", hex: "#b3b3b3" },
      { id: "salmon", nombre: "Salmón", hex: "#ff8a82" },
      { id: "azul-francia", nombre: "Azul Francia", hex: "#186dae" },
      { id: "azul-rey", nombre: "Azul rey", hex: "#0a1b85" },
      { id: "arena", nombre: "Arena", hex: "#a8a48f" },
      { id: "azul-pervinca", nombre: "Azul pervinca", hex: "#5b88e2" },
      { id: "rojo", nombre: "Rojo", hex: "#b60835" },
      { id: "aguamarina", nombre: "Aguamarina", hex: "#90e1dc" },
      { id: "morado", nombre: "Morado", hex: "#502d82" },
      { id: "azul-celeste", nombre: "Azul celeste", hex: "#41a5ee" },
      { id: "rojo-teja", nombre: "Rojo teja", hex: "#d74c40" },
      { id: "amarillo", nombre: "Amarillo", hex: "#fdc603" },
      { id: "verde-lima", nombre: "Verde lima", hex: "#b7d94c" },
      { id: "verde-militar", nombre: "Verde militar", hex: "#464b2a" },
      { id: "gris-oscuro", nombre: "Gris oscuro", hex: "#5b5b5b" },
      { id: "negro", nombre: "Negro", hex: "#1a1a1a" },
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
