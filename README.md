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

- 252 campings: 201 de España peninsular + 51 de Portugal continental.
- Portugal (3-5 estrellas, verificados con fuentes oficiales — roteiro-campista.pt, visitalentejo.pt, webs municipales, ACSI/Eurocampings): 14 Algarve, 10 Lisboa e Costa de Prata, 11 Centro, 11 Norte, 5 Alentejo. Se descartaron explícitamente los que resultaron tener menos de 3 estrellas (p. ej. Zambujeira do Mar) o estar cerrados (Orbitur Rio Alto).
- Ampliada la densidad en Pirineos (aragonés, catalán, Val d'Aran) y Costa Brava con ~28 campings reales más.
- Corregidos los campings de interior que estaban mal etiquetados como `playa` (mostraban enlaces de playa sin sentido en Sierra Norte, Gredos, Pirineo, Sierra Nevada...).
- Los "puntos de interés cerca" de cada popup están agrupados en un desplegable con subcategorías fijas (pueblos con encanto, rutas de senderismo, monumentos y patrimonio, naturaleza y miradores) más playas o lagunas/embalses según si el camping es costero o de interior.

## Pendiente (la "biblia del camping")

- Ampliar más comunidades autónomas de España que siguen con poca densidad.
- Verificar/actualizar precios reales (muchos de Portugal son orientativos por categoría, no tarifario oficial confirmado).
- Fotos reales por camping.
- Favoritos / marcados como "visitado" (localStorage).
- PWA para uso en móvil sin conexión.
- Geolocalización real del usuario en vez de solo distancia desde Torrejón.

## Paleta

bg #eef4f0 · card #fbfdfb · borde #dbe6e0 · texto #3f4a43 · muted #7d9088 · acento #c99a83 · acento oscuro #57736a
Terreno: playa #6ea6b3 · montaña #8ba178 · río #5fa588 · ciudad #bb8b72 · naturaleza #7fae7a
