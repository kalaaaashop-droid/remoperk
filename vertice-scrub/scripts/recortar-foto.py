"""
Recorta un uniforme de una foto por su color y genera una máscara recoloreable (WebP con transparencia).
El gris guarda las sombras de la tela; la web lo tiñe con el color elegido.

Además:
  - rellena con tela los huecos que dejan las manos en los bolsillos,
  - endereza la prenda: centra cada fila sobre un mismo eje vertical y suaviza los laterales.

Uso:
  python3 scripts/recortar-foto.py foto.png salida.webp --tono 150 2 --caderas 748 905 --enderezar   (Solsticio, rosa)
  python3 scripts/recortar-foto.py foto.png salida.webp --tono 120 155                                (Aurora, morado)
--tono: rango de tono de la tela en OpenCV (0-179); si el inicio es mayor que el fin, el rango da la vuelta por el rojo.
--caderas: filas (px) donde rellenar huecos de manos en los laterales del pantalón.
--enderezar: centra cada fila sobre un eje vertical común.
Requiere: pip install opencv-python-headless numpy scipy
"""
import argparse
import cv2
import numpy as np
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument("foto"); ap.add_argument("salida")
ap.add_argument("--tono", nargs=2, type=int, default=[150, 2])
ap.add_argument("--saturacion", type=int, default=55)
ap.add_argument("--caderas", nargs=2, type=int)
ap.add_argument("--enderezar", action="store_true")
args = ap.parse_args()

im = cv2.imread(args.foto)
alto, ancho = im.shape[:2]

# 1. Máscara de la prenda por color
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
h, s, v = [hsv[..., i].astype(int) for i in range(3)]
t0, t1 = args.tono
en_tono = (h >= t0) & (h <= t1) if t0 <= t1 else (h >= t0) | (h <= t1)
m = en_tono & (s >= args.saturacion) & (v >= 70)
m = ndi.binary_fill_holes(ndi.binary_closing(ndi.binary_opening(m), iterations=3))
lab, n = ndi.label(m)
m = lab == (np.argmax(ndi.sum(m, lab, range(1, n + 1))) + 1)

# 2. Bordes izquierdo/derecho por fila, con los laterales de la cadera rectos (sin las manos)
filas = np.where(m.any(axis=1))[0]
y0, y1 = filas.min(), filas.max() + 1
L = np.full(alto, np.nan); R = np.full(alto, np.nan)
for y in filas:
    xs = np.where(m[y])[0]; L[y], R[y] = xs.min(), xs.max()
cad0, cad1 = args.caderas or (0, 0)
# En la cadera: envolvente exterior y luego interpolación recta entre la cintura y el muslo
for y in range(cad0, cad1):
    L[y] = np.nanmin(L[max(y - 40, y0):y + 40]); R[y] = np.nanmax(R[max(y - 40, y0):y + 40])
if args.caderas:
    for arr in (L, R):
        arr[cad0:cad1] = np.linspace(arr[cad0 - 1], arr[cad1], cad1 - cad0)

# 3. Rellenar con tela todo lo que quede dentro de los laterales en la cadera
relleno = np.zeros_like(m)
for y in range(cad0, cad1):
    relleno[y, int(L[y]):int(R[y]) + 1] = True
relleno &= ~m
m = m | relleno

# 4. Sombreado de la tela (gris), con retoque de la zona de las manos
gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
ref = np.percentile(gris[m], 97)
sombra = 0.25 + 0.75 * np.clip(gris / ref, 0, 1)
# Marcas oscuras junto a los laterales de la cadera (sombras de manos y muñecas)
mediana = cv2.medianBlur((sombra * 255).astype(np.uint8), 31).astype(np.float32) / 255
lateral = np.zeros_like(m)
for y in range(cad0, cad1):
    lateral[y, int(L[y]):int(L[y]) + 95] = True
    lateral[y, int(R[y]) - 95:int(R[y]) + 1] = True
defectos = relleno | (lateral & m & (sombra < mediana * 0.9))
defectos = ndi.binary_dilation(defectos, iterations=3) & m
s8 = (sombra * 255).astype(np.uint8) if not defectos.any() else cv2.inpaint((sombra * 255).astype(np.uint8), defectos.astype(np.uint8) * 255, 15, cv2.INPAINT_TELEA)
sombra = s8.astype(np.float32) / 255
print("px retocados:", int(defectos.sum()))

# 5. Enderezar (opcional): cada fila se desplaza para que su centro caiga en un eje vertical común
yy = np.arange(alto)
if args.enderezar:
    centro = (L + R) / 2
    validos = ~np.isnan(centro)
    centro = np.interp(yy, yy[validos], centro[validos])
    centro = ndi.gaussian_filter1d(centro, 30)
    desplazamiento = centro - ancho / 2
else:
    desplazamiento = np.zeros(alto)
mapa_x = (np.arange(ancho)[None, :] + desplazamiento[:, None]).astype(np.float32)
mapa_y = np.repeat(yy[:, None], ancho, axis=1).astype(np.float32)
alpha = cv2.GaussianBlur(m.astype(np.float32), (3, 3), 0.8)
sombra = cv2.remap(sombra, mapa_x, mapa_y, cv2.INTER_LINEAR)
alpha = cv2.remap(alpha, mapa_x, mapa_y, cv2.INTER_LINEAR, borderValue=0)

# 6. Recorte ajustado y exportación
ys, xs = np.where(alpha > 0.05)
a0, a1, b0, b1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
g8 = (sombra * 255).astype(np.uint8)
rgba = np.dstack([g8, g8, g8, (alpha * 255).astype(np.uint8)])[a0:a1, b0:b1]
cv2.imwrite(args.salida, cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_WEBP_QUALITY, 88])
print("recorte:", b1 - b0, "x", a1 - a0)
