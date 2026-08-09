# Campings España y Portugal — la Biblia del Camping

App/mapa interactivo de campings pensados desde Torrejón de Ardoz (Madrid), con precios orientativos, filtros por comunidad autónoma y tipo de terreno, y enlaces directos a Waze/Maps/fotos/rutas/puntos de interés.

## Estructura del proyecto

```
campings-app/
├── index.html          # Punto de entrada. Abrir directamente en el navegador, no necesita servidor ni Node.
├── css/styles.css       # Estilos
├── js/app.js             # Lógica del mapa, filtros y popups
├── data/campings.json   # Fuente de datos canónica (editar aquí)
├── data/campings.js     # Generado desde campings.json (ver "Cómo regenerar" abajo)
└── legacy/               # Prototipos anteriores, solo como referencia histórica
```

No hay build ni dependencias (Node no está instalado en este equipo). `data/campings.js` simplemente
envuelve el JSON en `window.CAMPINGS = [...]` para poder cargarlo con `<script src>` sin problemas de
CORS al abrir el `index.html` directamente con doble clic.

### Cómo regenerar `data/campings.js` tras editar `data/campings.json`

En PowerShell, desde la carpeta del proyecto:

```powershell
$json = Get-Content "data\campings.json" -Raw -Encoding UTF8
$js = "window.CAMPINGS = $json;`n"
[System.IO.File]::WriteAllText("data\campings.js", $js, [System.Text.UTF8Encoding]::new($false))
```

## Esquema de cada camping (`data/campings.json`)

| campo | significado |
|---|---|
| `pais` | España / Portugal |
| `n` | nombre |
| `ca` | comunidad autónoma / región |
| `z` | zona / municipio |
| `km` | km aproximados desde Torrejón de Ardoz |
| `pp`, `pa`, `pc`, `pl` | precio parcela, adulto, coche, luz (€) |
| `d` | descripción corta |
| `t` | tipo de terreno: `playa`, `montana`, `rio`, `ciudad`, `naturaleza` — determina qué enlaces de "puntos de interés cerca" se muestran (importante: no tiene sentido poner `playa` en un camping de interior) |
| `lat`, `lon` | coordenadas reales |

## Estado actual

- 277 campings: 216 de España + 61 de Portugal (incluyendo ya todas las islas de ambos países).
- Cobertura insular completa revisada isla por isla: las 7 islas Canarias habitadas + La Graciosa, Mallorca/Menorca/Ibiza, Madeira + Porto Santo, y 8 de las 9 islas de Açores (São Miguel, Terceira, Pico, Faial, Santa Maria, Flores, São Jorge, Graciosa) tienen al menos un camping real y verificado.
- Dos excepciones documentadas a propósito, no son huecos de datos: **Formentera** no tiene ningún camping legal (la acampada está prohibida por normativa balear, confirmado en varias fuentes) y **Corvo** (Açores, ~400 habitantes) no tiene ningún camping formal verificable — no se han inventado alternativas.
- Portugal (3-5 estrellas, verificados con fuentes oficiales — roteiro-campista.pt, visitalentejo.pt, webs municipales, ACSI/Eurocampings): 14 Algarve, 10 Lisboa e Costa de Prata, 11 Centro, 11 Norte, 5 Alentejo. Se descartaron explícitamente los que resultaron tener menos de 3 estrellas (p. ej. Zambujeira do Mar) o estar cerrados (Orbitur Rio Alto).
- Ampliada la densidad en Pirineos (aragonés, catalán, Val d'Aran) y Costa Brava con ~28 campings reales más.
- Añadidas Islas Baleares (5) e Islas Canarias (6), antes ausentes del dataset. Ceuta y Melilla se comprobaron explícitamente y no tienen ningún camping real en funcionamiento (solo áreas de autocaravanas), así que se quedan fuera.
- Corregidos los campings de interior que estaban mal etiquetados como `playa` (mostraban enlaces de playa sin sentido en Sierra Norte, Gredos, Pirineo, Sierra Nevada...).
- Los "puntos de interés cerca" de cada popup están agrupados en un desplegable con subcategorías fijas (pueblos con encanto, rutas de senderismo, monumentos y patrimonio, naturaleza y miradores) más playas o lagunas/embalses según si el camping es costero o de interior.
- El desplegable de zona/filtro está agrupado en dos `optgroup`: **España** (por comunidad autónoma) y **Portugal** (por ciudad/pueblo concreto de cada camping) — antes se mezclaban alfabéticamente y confundía (p. ej. "Algarve" aparecía antes que "Andalucia").

## Pendiente (la "biblia del camping")

- Verificar/actualizar precios reales (muchos de Portugal y de las islas son orientativos por categoría, no tarifario oficial confirmado).
- Fotos reales por camping.
- Favoritos / marcados como "visitado" (localStorage).
- PWA para uso en móvil sin conexión.
- Geolocalización real del usuario en vez de solo distancia desde Torrejón.
- Los km de Baleares/Canarias son distancia aproximada (no hay carretera), habría que aclararlo mejor en la UI (solo barco/avión).

## Paleta

bg #eef4f0 · card #fbfdfb · borde #dbe6e0 · texto #3f4a43 · muted #7d9088 · acento #c99a83 · acento oscuro #57736a
Terreno: playa #6ea6b3 · montaña #8ba178 · río #5fa588 · ciudad #bb8b72 · naturaleza #7fae7a
