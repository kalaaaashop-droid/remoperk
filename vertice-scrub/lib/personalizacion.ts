import {
  BORDADO,
  BOTAS,
  botaDelModelo,
  MODELOS,
  RECARGO_A_MEDIDA,
  TALLAS,
  TELAS,
  formatearPrecio,
  type Color,
  type Modelo,
  type OpcionAjuste,
  type Tela,
} from "./catalogo";

export interface Medidas {
  pecho: string;
  cintura: string;
  cadera: string;
  estatura: string;
}

export interface Seleccion {
  modeloId: string;
  telaId: string;
  colorId: string;
  tallaId: string;
  aMedida: boolean;
  medidas: Medidas;
  botaId: string;
  bordado: {
    nombre: string;
    especialidad: string;
    detalle: string; // pedido libre: se cotiza aparte
    hiloId: string;
    tipografiaId: string;
  };
}

export type Accion =
  | { tipo: "modelo"; id: string }
  | { tipo: "tela"; id: string }
  | { tipo: "color"; id: string }
  | { tipo: "talla"; id: string }
  | { tipo: "aMedida"; valor: boolean }
  | { tipo: "medida"; campo: keyof Medidas; valor: string }
  | { tipo: "bota"; id: string }
  | { tipo: "bordado"; campo: keyof Seleccion["bordado"]; valor: string };

export const seleccionInicial: Seleccion = {
  modeloId: MODELOS[0].id,
  telaId: TELAS[0].id,
  colorId: TELAS[0].colores[1].id,
  tallaId: "M",
  aMedida: false,
  medidas: { pecho: "", cintura: "", cadera: "", estatura: "" },
  botaId: botaDelModelo(MODELOS[0]),
  bordado: { nombre: "", especialidad: "", detalle: "", hiloId: BORDADO.hilos[0].id, tipografiaId: BORDADO.tipografias[0].id },
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
      return { ...estado, tallaId: accion.id, aMedida: false };
    case "aMedida":
      return { ...estado, aMedida: accion.valor };
    case "medida":
      return { ...estado, medidas: { ...estado.medidas, [accion.campo]: accion.valor.replace(/[^\d]/g, "").slice(0, 3) } };
    case "bota":
      return { ...estado, botaId: accion.id };
    case "bordado": {
      const limite = accion.campo === "nombre" ? BORDADO.maxCaracteres : accion.campo === "detalle" ? BORDADO.maxDetalle : Infinity;
      const valor = accion.valor.slice(0, limite);
      return { ...estado, bordado: { ...estado.bordado, [accion.campo]: valor } };
    }
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
  hilo: Color;
  tipografia: (typeof BORDADO.tipografias)[number];
  lineas: LineaPrecio[];
  total: number;
  medidasCompletas: boolean;
}

/** Deriva todo lo que necesita la UI (objetos del catálogo, desglose y total) de la selección. */
export function resumir(s: Seleccion): Resumen {
  const modelo = buscar(MODELOS, s.modeloId);
  const tela = buscar(TELAS, s.telaId);
  const color = buscar(tela.colores, s.colorId);
  const bota = buscar(BOTAS, s.botaId);
  const hilo = buscar(BORDADO.hilos, s.bordado.hiloId);
  const tipografia = buscar(BORDADO.tipografias, s.bordado.tipografiaId);

  const lineas: LineaPrecio[] = [{ concepto: `Conjunto ${modelo.nombre} · ${tela.nombre}`, importe: tela.precio }];
  if (s.aMedida) lineas.push({ concepto: "Patronaje a medida", importe: RECARGO_A_MEDIDA });
  if (s.bordado.nombre.trim()) lineas.push({ concepto: "Bordado de nombre", importe: BORDADO.recargoNombre });
  if (s.bordado.especialidad) lineas.push({ concepto: "Bordado de especialidad", importe: BORDADO.recargoEspecialidad });

  const medidasCompletas = Object.values(s.medidas).every((v) => Number(v) > 0);

  return {
    modelo,
    tela,
    color,
    bota,
    hilo,
    tipografia,
    lineas,
    total: lineas.reduce((suma, l) => suma + l.importe, 0),
    medidasCompletas,
  };
}

/** Sugiere una talla a partir del contorno de pecho (cm). */
export function tallaSugerida(pecho: number): string | null {
  if (!pecho) return null;
  const talla = TALLAS.find((t) => pecho <= t.pecho[1]) ?? TALLAS[TALLAS.length - 1];
  return talla.id;
}

/** Mensaje de pedido listo para enviar por WhatsApp. */
export function mensajePedido(s: Seleccion, r: Resumen): string {
  const talla = s.aMedida
    ? `A medida — pecho ${s.medidas.pecho} cm, cintura ${s.medidas.cintura} cm, cadera ${s.medidas.cadera} cm, estatura ${s.medidas.estatura} cm`
    : s.tallaId;
  const detalle = s.bordado.detalle.trim();
  const bordado = [
    s.bordado.nombre.trim() && `"${s.bordado.nombre.trim()}"`,
    s.bordado.especialidad,
  ].filter(Boolean);

  return [
    "Hola Vértice.scrub, quiero hacer este pedido:",
    "",
    `• Modelo: ${r.modelo.nombre}`,
    `• Tela: ${r.tela.nombre} — ${r.color.nombre}`,
    `• Talla: ${talla}`,
    `• Pantalón: ${r.bota.nombre}`,
    `• Bordado: ${bordado.length ? `${bordado.join(" · ")} (hilo ${r.hilo.nombre}, letra ${r.tipografia.nombre})` : "Sin bordado"}`,
    ...(detalle ? [`• Bordado personalizado (a cotizar): ${detalle}`] : []),
    "",
    `Total estimado: ${formatearPrecio(r.total)}${detalle ? " + bordado personalizado a cotizar" : ""}`,
  ].join("\n");
}
