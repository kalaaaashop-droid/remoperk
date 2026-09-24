# Vértice.scrub — web y configurador de uniformes

Web de la marca con el catálogo de personalización (modelo → tela y color → talla → bordado → resumen).

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript

## Arrancar en local

```bash
cd vertice-scrub
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
```

## Dónde se cambia cada cosa

| Quiero cambiar…                                        | Archivo                                        |
| ------------------------------------------------------ | ---------------------------------------------- |
| Modelos, telas, colores, tallas, precios, WhatsApp     | `lib/catalogo.ts`                              |
| Paleta de colores, tipografías, animaciones            | `app/globals.css` (bloque `@theme`)            |
| Cálculo del precio y mensaje de pedido                 | `lib/personalizacion.ts`                       |
| Textos de portada y sección «El taller»                | `app/page.tsx`                                 |
| Dibujo del uniforme (siluetas, costuras, bordado)      | `components/customizer/VistaUniforme.tsx`      |

## Estructura

```
app/
  layout.tsx          fuentes (Cormorant Garamond + Manrope) y metadatos
  page.tsx            portada, configurador y valores de marca
  globals.css         sistema de diseño
components/
  layout/             Cabecera, Pie
  customizer/
    Configurador.tsx  orquesta el estado y el layout (vista previa fija + pasos)
    VistaUniforme.tsx SVG del uniforme con transición de color
    SelectorModelo / SelectorTela / SelectorTalla / SelectorBordado
    PanelResumen.tsx  desglose, total y botón de pedido por WhatsApp
    BarraMovil.tsx    precio siempre visible en móvil
lib/
  catalogo.ts         datos del catálogo
  personalizacion.ts  estado (reducer), precio y mensaje de pedido
```

> Antes de publicar, cambia `WHATSAPP_PEDIDOS` en `lib/catalogo.ts` por el número real.
