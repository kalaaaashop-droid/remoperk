import {
  BORDADO,
  BOTAS,
  PRETINAS,
  botaDelModelo,
  MODELOS,
  TALLAS,
  TELAS,
  formatearPrecio,
  type Color,
  type Modelo,
  type OpcionAjuste,
  type Tela,
} from "./catalogo";

export interface Seleccion {
  modeloId: string;
  telaId: string;
  colorId: string;
  tallaId: string;
  botaId: string;
  pretinaId: string; // solo cuenta en modelos con eligePretina
  bordado: string; // descripción libre del bordado; se cotiza aparte
}

export type Accion =
  | { tipo: "modelo"; id: string }
  | { tipo: "tela"; id: string }
  | { tipo: "color"; id: string }
  | { tipo: "talla"; id: string }
  | { tipo: "bota"; id: string }
  | { tipo: "pretina"; id: string }
  | { tipo: "bordado"; valor: string };

export const seleccionInicial: Seleccion = {
  modeloId: MODELOS[0].id,
  telaId: TELAS[0].id,
  colorId: "verde-oliva",
  tallaId: "M",
  botaId: botaDelModelo(MODELOS[0]),
  pretinaId: "arruchada",
  bordado: "",
};

export function reducer(estado: Seleccion, accion: Accion): Seleccion {
  switch (accion.tipo) {
    case "modelo": {
      const modelo = buscar(MODELOS, accion.id);
      const tela = modelo.colorInicial && TELAS.find((t) => t.colores.some((c) => c.id === modelo.colorInicial));
      const base = { ...estado, modeloId: modelo.id, botaId: botaDelModelo(modelo) };
      return tela ? { ...base, telaId: tela.id, colorId: modelo.colorInicial! } : base;
    }
    case "tela": {
      // Cada tela tiene su propia carta de colores: si el color actual no existe en la nueva tela,
      // se conserva la posición en la carta para que el cambio se sienta natural.
      const telaAnterior = buscar(TELAS, estado.telaId);
      const telaNueva = buscar(TELAS, accion.id);
      const indice = Math.max(0, telaAnterior.colores.findIndex((c) => c.id === estado.colorId));
      const color = telaNueva.colores.find((c) => c.id === estado.colorId) ?? telaNueva.colores[Math.min(indice, telaNueva.colores.length - 1)];
      return { ...estado, telaId: telaNueva.id, colorId: color.id };
    }
    case "color":
      return { ...estado, colorId: accion.id };
    case "talla":
      return { ...estado, tallaId: accion.id };
    case "bota":
      return { ...estado, botaId: accion.id };
    case "pretina":
      return { ...estado, pretinaId: accion.id };
    case "bordado":
      return { ...estado, bordado: accion.valor.slice(0, BORDADO.maxDetalle) };
  }
}

function buscar<T extends { id: string }>(lista: readonly T[], id: string): T {
  return lista.find((x) => x.id === id) ?? lista[0];
}

export interface LineaPrecio {
  concepto: string;
  importe: number;
}

export interface Resumen {
  modelo: Modelo;
  tela: Tela;
  color: Color;
  bota: OpcionAjuste;
  pretina: OpcionAjuste | null; // null si el modelo no ofrece elegirla
  lineas: LineaPrecio[];
  total: number;
}

/** Deriva todo lo que necesita la UI (objetos del catálogo, desglose y total) de la selección. */
export function resumir(s: Seleccion): Resumen {
  const modelo = buscar(MODELOS, s.modeloId);
  const tela = buscar(TELAS, s.telaId);
  const color = buscar(tela.colores, s.colorId);
  const bota = buscar(BOTAS, s.botaId);
  const pretina = modelo.eligePretina ? buscar(PRETINAS, s.pretinaId) : null;

  const lineas: LineaPrecio[] = [{ concepto: `Conjunto ${modelo.nombre} · ${tela.nombre}`, importe: tela.precio }];
  // Talla grande (2XL en adelante)
  const recargoTalla = TALLAS.find((t) => t.id === s.tallaId)?.recargo ?? 0;
  if (recargoTalla) lineas.push({ concepto: `Talla ${s.tallaId}`, importe: recargoTalla });

  return {
    modelo,
    tela,
    color,
    bota,
    pretina,
    lineas,
    total: lineas.reduce((suma, l) => suma + l.importe, 0),
  };
}

/** Mensaje de pedido listo para enviar por WhatsApp. */
export function mensajePedido(s: Seleccion, r: Resumen): string {
  const bordado = s.bordado.trim();

  return [
    "Hola Vértice.scrub, quiero hacer este pedido:",
    "",
    `• Modelo: ${r.modelo.nombre}`,
    `• Tela: ${r.tela.nombre} — ${r.color.nombre}`,
    `• Talla: ${s.tallaId}`,
    `• Pantalón: ${r.bota.nombre}${r.pretina ? ` · ${r.pretina.nombre}` : ""}`,
    `• Bordado personalizado: ${bordado ? `${bordado} (a cotizar)` : "Sin bordado"}`,
    "",
    `Total estimado: ${formatearPrecio(r.total)}${bordado ? " + bordado personalizado a cotizar" : ""}`,
  ].join("\n");
}
