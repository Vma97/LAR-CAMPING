# IBERICAMP — la Biblia del Camping (España y Portugal)

App/mapa interactivo de campings pensados desde Torrejón de Ardoz (Madrid), con precios orientativos, filtros por comunidad autónoma y tipo de terreno, y enlaces directos a Waze/Maps/fotos/rutas/puntos de interés.

## Estructura del proyecto

```
campings-app/
├── index.html                 # Punto de entrada. Abrir directamente en el navegador, no necesita servidor ni Node.
├── css/styles.css              # Estilos
├── js/app.js                    # Lógica del mapa, filtros, geolocalización y popups
├── js/i18n.js                   # Traducciones de la interfaz (ES/EN/FR/NL/DE/ZH/JA)
├── data/campings.json          # Fuente de datos canónica de campings (editar aquí)
├── data/campings.js            # Generado desde campings.json (ver "Cómo regenerar" abajo)
├── data/aparcamientos.json     # Áreas de autocaravanas GRATUITAS (dataset separado)
├── data/aparcamientos.js       # Generado desde aparcamientos.json
└── legacy/                      # Prototipos anteriores, solo como referencia histórica
```

Importante: cada vez que se edita `index.html`/`js`/`css`, hay que subir el número de versión en los
`?v=N` de los `<script src>` de `index.html` (el navegador cachea agresivamente los archivos locales
por URL exacta y si no, no se refrescan los cambios).

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
| `tel`, `web` | teléfono y web oficial de reservas, si se han encontrado y verificado (cadena vacía `""` si no) |

## Estado actual

- **429 campings** con nombre real, ubicación verificada y descripción, revisados en varias rondas de investigación web dedicadas región por región (la última ronda, con 6 agentes en paralelo cubriendo Norte/Centro/Este/Andalucía/Islas/Portugal, añadió 90 campings nuevos verificados). Se eliminaron todas las entradas que no correspondían a ningún negocio real y se corrigieron ubicaciones erróneas (alguna hasta a 100km de donde debía, incluyendo un caso donde el marcador caía en el mar).
- Todas las comunidades autónomas de España e islas (Canarias, Baleares, Açores, Madeira) tienen cobertura, incluyendo excepciones documentadas a propósito: **Formentera** (acampada prohibida por normativa balear) y **Corvo** (Açores, con un pequeño camping municipal junto a la única playa de arena de la isla).
- Portugal cubierto de norte a sur (Algarve, Lisboa e Costa de Prata, Centro, Norte, Alentejo, Madeira), solo campings de 3-5 estrellas o áreas oficiales verificados con fuentes oficiales.
- Ampliada la densidad junto a agua (embalses, ríos, lagos, playas) en toda la península, y reforzadas especialmente las zonas más flojas: Madeira (1→5), Alentejo (5→12) e Islas Baleares (6→11).
- Algunos campings de Mallorca y Canarias son **zonas de acampada oficiales** gestionadas por IBANAT/Cabildos insulares en vez de campings de servicios tradicionales (es la única opción legal en esas zonas de interior) — se indica explícitamente en su descripción.
- **100% de las descripciones traducidas** a los 7 idiomas soportados (ES/EN/FR/NL/DE/ZH/JA), con fallback automático al español si falta alguna.
- Precios, teléfonos y webs oficiales verificados con investigación dedicada por camping (URL directa mostrada en el popup, "🌐 Web / reservas").
- Los "puntos de interés cerca" de cada popup están agrupados por subcategorías (pueblos con encanto, rutas de senderismo, monumentos y patrimonio, naturaleza y miradores) más playas o lagunas/embalses según si el camping es costero o de interior.
- El desplegable de zona/filtro está agrupado en dos `optgroup`: **España** (por comunidad autónoma) y **Portugal** (por ciudad/pueblo).
- **Geolocalización real**: botón "Usar mi ubicación" que reordena la lista y los popups de más cerca a más lejos desde tu ubicación real, con Torrejón de Ardoz como fallback.
- **Favoritos**: botón de estrella en cada camping (popup y lista), guardados en `localStorage`, con filtro para ver solo favoritos.
- **PWA**: manifest (`manifest.json`), service worker (`sw.js`) e icono (`icons/icon.svg`) para poder instalar IBERICAMP en el móvil y usar el listado/popups sin conexión (los tiles del mapa sí necesitan internet).
- Se retiró del todo la funcionalidad de "áreas de autocaravanas gratuitas" por dudas de calidad de datos (`data/aparcamientos.json` se mantiene en el repo sin usar, por si se retoma con más rigor en el futuro).

## Pendiente

- Retomar áreas de autocaravanas gratuitas con verificación más rigurosa, si se decide recuperar la funcionalidad.
- Fotos reales por camping (de momento enlace a búsqueda de imágenes de Google).
- Seguir puliendo precios/teléfonos en los campings más recientes por si cambian con el tiempo.
- Los km de Baleares/Canarias/Açores/Madeira son distancia aproximada (no hay carretera); aclararlo mejor en la UI cuando no se usa la geolocalización real.

## Paleta

bg #eef4f0 · card #fbfdfb · borde #dbe6e0 · texto #3f4a43 · muted #7d9088 · acento #c99a83 · acento oscuro #57736a
Terreno: playa #6ea6b3 · montaña #8ba178 · río #5fa588 · ciudad #bb8b72 · naturaleza #7fae7a
