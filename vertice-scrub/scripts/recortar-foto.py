"""
Recorta un uniforme de una foto por su color y genera una máscara recoloreable (WebP con transparencia).
El gris guarda las sombras de la tela; la web lo tiñe con el color elegido.

Uso: python3 scripts/recortar-foto.py foto.png public/modelos/nombre.webp
Requiere: pip install opencv-python-headless numpy scipy
Ajusta el rango de tono (h) si la prenda de la foto no es rosa.
"""
import sys
import cv2, numpy as np
from scipy import ndimage as ndi
im = cv2.imread(sys.argv[1])
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
h, s, v = [hsv[..., i].astype(int) for i in range(3)]
m = (((h >= 150) | (h <= 2)) & (s >= 55) & (v >= 70))
m = ndi.binary_opening(m, iterations=1)
m = ndi.binary_closing(m, iterations=3)
m = ndi.binary_fill_holes(m)
lab, n = ndi.label(m)
sizes = ndi.sum(m, lab, range(1, n + 1))
keep = [i + 1 for i, sz in enumerate(sizes) if sz > 2000]
m = np.isin(lab, keep)
# Rellenar las muescas de las manos en los bolsillos (solo en la franja de las caderas)
cerrado = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 61))).astype(bool)
franja = np.zeros_like(m); franja[720:900, :] = True
relleno = cerrado & ~m & franja
m = m | relleno
print("px rellenados:", int(relleno.sum()))
print("componentes:", n, "conservados:", len(keep), [int(x) for x in sorted(sizes)[-4:]])
# borde suave
alpha = cv2.GaussianBlur(m.astype(np.float32), (3, 3), 0.8)
# sombreado: luminosidad de la tela, normalizada para que la zona clara sea blanca
gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
ref = np.percentile(gris[m], 97)
sombra = np.clip(gris / ref, 0, 1)
sombra = 0.25 + 0.75 * sombra
# textura de tela inventada donde estaban las manos
s8 = (sombra * 255).astype(np.uint8)
s8 = cv2.inpaint(s8, relleno.astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
sombra = s8.astype(np.float32) / 255  # evita negros absolutos en el multiply
ys, xs = np.where(m)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
g8 = (sombra * 255).astype(np.uint8)
rgba = np.dstack([g8, g8, g8, (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
cv2.imwrite(sys.argv[2], cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_WEBP_QUALITY, 88])
print("recorte:", x1 - x0, "x", y1 - y0)
