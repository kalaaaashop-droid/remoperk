import {
  BORDADO,
  ENTALLES,
  LARGOS,
  MODELOS,
  RECARGO_A_MEDIDA,
  TALLAS,
  TELAS,
  formatearEuros,
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
  entalleId: string;
  largoId: string;
  bordado: {
    nombre: string;
    especialidad: string;
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
  | { tipo: "entalle"; id: string }
  | { tipo: "largo"; id: string }
  | { tipo: "bordado"; campo: keyof Seleccion["bordado"]; valor: string };

export const seleccionInicial: Seleccion = {
  modeloId: MODELOS[0].id,
  telaId: TELAS[1].id,
  colorId: TELAS[1].colores[1].id,
  tallaId: "M",
  aMedida: false,
  medidas: { pecho: "", cintura: "", cadera: "", estatura: "" },
  entalleId: "regular",
  largoId: "regular",
  bordado: { nombre: "", especialidad: "", hiloId: BORDADO.hilos[0].id, tipografiaId: BORDADO.tipografias[0].id },
};

export function reducer(estado: Seleccion, accion: Accion): Seleccion {
  switch (accion.tipo) {
    case "modelo":
      return { ...estado, modeloId: accion.id };
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
    case "entalle":
      return { ...estado, entalleId: accion.id };
    case "largo":
      return { ...estado, largoId: accion.id };
    case "bordado": {
      const valor = accion.campo === "nombre" ? accion.valor.slice(0, BORDADO.maxCaracteres) : accion.valor;
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
  entalle: OpcionAjuste;
  largo: OpcionAjuste;
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
  const entalle = buscar(ENTALLES, s.entalleId);
  const largo = buscar(LARGOS, s.largoId);
  const hilo = buscar(BORDADO.hilos, s.bordado.hiloId);
  const tipografia = buscar(BORDADO.tipografias, s.bordado.tipografiaId);

  const lineas: LineaPrecio[] = [{ concepto: `Conjunto ${modelo.nombre}`, importe: modelo.precioBase }];
  if (tela.recargo) lineas.push({ concepto: `Tela ${tela.nombre}`, importe: tela.recargo });
  if (s.aMedida) lineas.push({ concepto: "Patronaje a medida", importe: RECARGO_A_MEDIDA });
  else if (largo.recargo) lineas.push({ concepto: `Largo ${largo.nombre}`, importe: largo.recargo });
  if (s.bordado.nombre.trim()) lineas.push({ concepto: "Bordado de nombre", importe: BORDADO.recargoNombre });
  if (s.bordado.especialidad) lineas.push({ concepto: "Bordado de especialidad", importe: BORDADO.recargoEspecialidad });

  const medidasCompletas = Object.values(s.medidas).every((v) => Number(v) > 0);

  return {
    modelo,
    tela,
    color,
    entalle,
    largo,
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
    : `${s.tallaId} · largo ${r.largo.nombre}`;
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
    `• Entalle: ${r.entalle.nombre}`,
    `• Bordado: ${bordado.length ? `${bordado.join(" · ")} (hilo ${r.hilo.nombre}, letra ${r.tipografia.nombre})` : "Sin bordado"}`,
    "",
    `Total estimado: ${formatearEuros(r.total)}`,
  ].join("\n");
}
