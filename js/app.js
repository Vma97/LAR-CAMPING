const CAMPINGS = window.CAMPINGS;
const SPOTS = window.SPOTS || [];
const PATRIMONIO = window.PATRIMONIO || [];

// La app unifica tres categorias de puntos (campings, zonas de bano y
// patrimonio cultural) en un solo mapa/lista, marcadas con "cat" para poder
// filtrar y renderizar cada una a su manera.
const POIS = [
  ...CAMPINGS.map(c => ({...c, cat: "camping"})),
  ...SPOTS.map(c => ({...c, cat: "agua"})),
  ...PATRIMONIO.map(c => ({...c, cat: "patrimonio"})),
];

const TERRAIN_CAMPING = {
  playa: {color:"#5f97a6", key:"terrainPlaya", glyph:"🏖️"},
  montana: {color:"#7f9a6c", key:"terrainMontana", glyph:"🏔️"},
  rio: {color:"#4f9a83", key:"terrainRio", glyph:"💧"},
  ciudad: {color:"#b98561", key:"terrainCiudad", glyph:"🏙️"},
  naturaleza: {color:"#6ea468", key:"terrainNaturaleza", glyph:"🌲"},
};
const TERRAIN_AGUA = {
  rio: {color:"#4f9ac9", key:"terrainAguaRio", glyph:"💧"},
  pantano: {color:"#3e8e7e", key:"terrainAguaPantano", glyph:"🏞️"},
  cala: {color:"#2fb6a3", key:"terrainAguaCala", glyph:"🏖️"},
  piscina_natural: {color:"#5aa9d6", key:"terrainAguaPiscina", glyph:"🏊"},
};
const TERRAIN_PATRIMONIO = {
  castillo: {color:"#8b5e3c", key:"terrainPatCastillo", glyph:"🏰"},
  catedral: {color:"#6b4c9a", key:"terrainPatCatedral", glyph:"⛪"},
  iglesia: {color:"#7a5c9e", key:"terrainPatIglesia", glyph:"⛪"},
  monasterio: {color:"#5c4a7a", key:"terrainPatMonasterio", glyph:"⛪"},
  ruinas: {color:"#a67c52", key:"terrainPatRuinas", glyph:"🏛️"},
  yacimiento: {color:"#9c7b4f", key:"terrainPatYacimiento", glyph:"⛏️"},
  muralla: {color:"#7d6a4f", key:"terrainPatMuralla", glyph:"🧱"},
  palacio: {color:"#b8860b", key:"terrainPatPalacio", glyph:"🏛️"},
  pueblo_historico: {color:"#c2703d", key:"terrainPatPueblo", glyph:"🏘️"},
  puente: {color:"#4f7a8b", key:"terrainPatPuente", glyph:"🌉"},
  ermita: {color:"#8a6a9e", key:"terrainPatErmita", glyph:"⛪"},
  museo: {color:"#b03a5b", key:"terrainPatMuseo", glyph:"🖼️"},
  patrimonio_industrial: {color:"#5a6b7a", key:"terrainPatIndustrial", glyph:"⚙️"},
};
function terrainMapFor(cat){
  if (cat === "agua") return TERRAIN_AGUA;
  if (cat === "patrimonio") return TERRAIN_PATRIMONIO;
  return TERRAIN_CAMPING;
}
function terrainMetaFor(c){
  const map = terrainMapFor(c.cat);
  return map[c.t] || map[Object.keys(map)[0]];
}

// Color del marcador en el MAPA: siempre por categoria (3 colores), nunca
// por tipo concreto. El tipo se sigue viendo como badge en tarjetas/fichas,
// pero en el mapa la senal visual principal es "que clase de sitio es esto".
const CAT_COLOR = {camping:"#4f7a5e", agua:"#3f7fa6", patrimonio:"#a67c3d"};
function catColorFor(c){ return CAT_COLOR[c.cat] || CAT_COLOR.camping; }
function terrainLabel(cat, k){ return t(terrainMapFor(cat)[k].key); }

function q(s){ return encodeURIComponent(s); }
function esc(s){ return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

// Distancia real desde la ubicacion del usuario (si la ha activado) en vez
// de depender siempre de Torrejon de Ardoz como origen fijo.
let userLoc = null;
function haversineKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function distKmFor(c){
  return userLoc ? haversineKm(userLoc.lat, userLoc.lon, c.lat, c.lon) : c.km;
}

// Favoritos: guardados en localStorage por nombre (unico entre campings y agua).
let favorites = new Set(JSON.parse(localStorage.getItem("campingsFavs") || "[]"));
let showFavsOnly = false;
// El panel de resultados aparece solo mientras hay un filtro/busqueda activo.
// panelDismissed = el usuario lo cerro a mano para el filtro actual; en
// cuanto ese filtro cambia (nueva busqueda, nueva categoria...) se resetea
// para que el panel pueda volver a aparecer automaticamente.
let panelDismissed = false;
let lastFilterKey = "";
function isFav(n){ return favorites.has(n); }
function toggleFav(n){
  if (favorites.has(n)) favorites.delete(n); else favorites.add(n);
  localStorage.setItem("campingsFavs", JSON.stringify([...favorites]));
}
// ---------- Tema claro/oscuro ----------
function currentTheme(){
  return document.documentElement.getAttribute("data-theme")
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function updateThemeToggle(){
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.textContent = currentTheme() === "dark" ? "☀️" : "🌙";
}
function initThemeToggle(){
  const btn = document.getElementById("themeToggle");
  updateThemeToggle();
  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("campingsTheme", next);
    updateThemeToggle();
  });
}

function buildLinks(c){
  const place = c.n + ", " + c.z;
  const L = {
    // Se guian por el nombre real del camping. Waze prioriza "ll" sobre "q"
    // si van juntos (acaba mostrando solo coordenadas), asi que aqui va solo
    // el nombre+zona para que busque y navegue por el sitio real, igual que
    // ya hace bien Google Maps con el destino en texto.
    waze: "https://waze.com/ul?q=" + q(place) + "&navigate=yes",
    maps: "https://www.google.com/maps/dir/?api=1&destination=" + q(place) + "&travelmode=driving",
    photos: "https://www.google.com/search?tbm=isch&q=" + q(place),
  };
  return L;
}

// Puntos de interés cerca, agrupados en subcategorías. Las 4 primeras son
// genéricas (toda zona tiene pueblos, rutas, monumentos y naturaleza cerca);
// las de agua dependen del terreno para no ofrecer playa en el interior.
// Las búsquedas se hacen siempre en español/portugués (idioma local de la
// zona), aunque la interfaz esté en otro idioma: da mejores resultados.
function buildPOI(c){
  const poi = [
    {labelKey:"poiPueblos", query:"pueblos con encanto cerca de " + c.z},
    {labelKey:"poiSenderismo", query:"rutas de senderismo cerca de " + c.z},
    {labelKey:"poiMonumentos", query:"monumentos y lugares historicos cerca de " + c.z},
    {labelKey:"poiNaturalezaMiradores", query:"miradores y parajes naturales cerca de " + c.z},
  ];
  if (c.t === "playa") {
    poi.push({labelKey:"poiPlayas", query:"playas cerca de " + c.z});
  } else {
    poi.push({labelKey:"poiLagunas", query:"lagunas y embalses cerca de " + c.z});
  }
  return poi.map(p => ({...p, url: "https://www.google.com/maps/search/" + q(p.query)}));
}

// Cabecera comun a las tres fichas: icono, nombre, ubicacion y chips (tipo +
// distancia + insignias). El contenido especifico de cada categoria
// (precio/epoca/servicios, descripcion, acciones) va debajo de esto.
function popHeader(c){
  const meta = terrainMetaFor(c);
  return `
    <button class="fav-btn pop-fav-btn${isFav(c.n) ? " active" : ""}" data-fav-name="${esc(c.n)}" title="${esc(t("favToggle"))}">${isFav(c.n) ? "★" : "☆"}</button>
    <div class="pop-hero" style="background:${catColorFor(c)}22">${meta.glyph}</div>
    <h3>${esc(c.n)}</h3>
    <p class="pop-loc">${esc(c.z)} · ${esc(c.ca)}${c.pais && c.pais !== "España" ? " · " + esc(c.pais) : ""}</p>
    <div class="pop-chips">
      <span class="chip" style="background:${meta.color}22;color:${meta.color}">${esc(terrainLabel(c.cat, c.t))}</span>
      ${c.hike ? `<span class="chip" style="background:var(--terracotta)22;color:var(--terracotta)">🥾 ${esc(t("hikeBadge"))}</span>` : ""}
      <span class="chip">📍 ${Math.round(distKmFor(c))} ${esc(userLoc ? t("kmFromYou") : t("kmGeneric"))}</span>
    </div>
  `;
}

// Fila de acciones comun: un CTA grande (Waze) + iconos pequenos para el
// resto de enlaces (mapas, fotos, web, telefono), nunca mas de un nivel de
// jerarquia visible a la vez.
function popActions(c, L, extraIconsHTML){
  return `
    <details class="pop-route">
      <summary class="pop-cta">${esc(t("routeStart"))}</summary>
      <div class="pop-route-menu">
        <a href="${L.waze}" target="_blank">📍 ${esc(t("routeWazePlain"))}</a>
        <a href="${L.maps}" target="_blank">📍 ${esc(t("routeGooglePlain"))}</a>
      </div>
    </details>
    <div class="pop-more">
      <a href="${L.photos}" target="_blank" title="${esc(t("photosLinkGeneric"))}">🖼️</a>
      ${c.web ? `<a href="${esc(c.web)}" target="_blank" title="${esc(t("webLink"))}">🌐</a>` : ""}
      ${extraIconsHTML || ""}
    </div>
  `;
}

function popupHTML(c){
  const L = buildLinks(c);
  if (c.cat === "agua") return popupHTMLAgua(c, L);
  if (c.cat === "patrimonio") return popupHTMLPatrimonio(c, L);

  const poiHTML = buildPOI(c).map(p =>
    `<a href="${p.url}" target="_blank">${esc(t(p.labelKey))}</a>`
  ).join("");
  const telIcon = c.tel ? `<a href="tel:${esc(c.tel.replace(/\s+/g,""))}" title="${esc(c.tel)}">📞</a>` : "";
  return `
    <div class="pop">
      ${popHeader(c)}
      <p class="pop-desc">${esc(descFor(c))}</p>
      ${popActions(c, L, telIcon)}
      <details class="pop-extra">
        <summary>${esc(t("poiTitle"))}</summary>
        <div class="poi-links">${poiHTML}</div>
      </details>
    </div>
  `;
}

// Ficha de zona de bano: sin precios ni POI de campings, con servicios/acceso
// y la insignia de "final de ruta de senderismo / garganta" si aplica.
function popupHTMLAgua(c, L){
  return `
    <div class="pop">
      ${popHeader(c)}
      ${c.servicios ? `<p class="pop-highlight">${esc(c.servicios)}</p>` : ""}
      ${c.d ? `<p class="pop-desc">${esc(c.d)}</p>` : ""}
      ${c.acceso ? `<p class="pop-desc"><b>${esc(t("aguaAcceso"))}:</b> ${esc(c.acceso)}</p>` : ""}
      ${popActions(c, L)}
    </div>
  `;
}

// Ficha de patrimonio cultural: epoca/tipo en vez de precios o servicios.
function popupHTMLPatrimonio(c, L){
  return `
    <div class="pop">
      ${popHeader(c)}
      ${c.epoca ? `<p class="pop-highlight">${esc(c.epoca)}</p>` : ""}
      ${c.d ? `<p class="pop-desc">${esc(c.d)}</p>` : ""}
      ${popActions(c, L)}
    </div>
  `;
}

const map = L.map('map', {zoomControl:true}).setView([40.0, -4.5], 6);

// En movil, al abrir el teclado (p.ej. para buscar) el navegador cambia la
// altura visible de la pantalla y el mapa se queda descuadrado si no se le
// avisa. visualViewport da la altura real visible en cada momento.
if (window.visualViewport) {
  const appEl = document.getElementById('app');
  const syncViewportHeight = () => {
    appEl.style.height = window.visualViewport.height + 'px';
    map.invalidateSize();
  };
  window.visualViewport.addEventListener('resize', syncViewportHeight);
}

// Satelite (Esri) como capa por defecto, es la que mas gusta; se mantiene
// el control para poder cambiar al mapa de carreteras de siempre (OSM
// estandar) cuando alguien lo necesite.
const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 18,
  attribution: 'Tiles &copy; Esri'
}).addTo(map);
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
});
let layerControl = null;
function renderLayerControl(){
  if (layerControl) map.removeControl(layerControl);
  layerControl = L.control.layers(
    {[t("mapLayerStandard")]: osmLayer, [t("mapLayerSatellite")]: satLayer},
    null,
    {position: 'topright'}
  ).addTo(map);
}
renderLayerControl();

// ---------- Marcadores propios (en vez de circulos genericos) ----------
function markerIcon(c){
  const meta = terrainMetaFor(c);
  return L.divIcon({
    className: '',
    html: `<div class="camp-marker" style="background:${catColorFor(c)}"><span>${meta.glyph}</span></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}
// Nunca se usan los popups flotantes clasicos de Leaflet (globo con rabito
// GIS): en su lugar hay un unico panel flotante que hace de bottom sheet en
// movil y de tarjeta flotante en escritorio, y cambia de "lista" a "detalle"
// segun lo que se seleccione, nunca dos capas compitiendo por sitio.
let inDetail = false;
function openSpot(c){
  inDetail = true;
  listEl.innerHTML = `<button type="button" class="back-to-list">${esc(t("closeDetail"))}</button>` + popupHTML(c);
  sidebarEl.classList.add('panel-open');
  map.zoomControl.remove();
  listEl.querySelector('.back-to-list').addEventListener('click', () => {
    inDetail = false;
    map.zoomControl.addTo(map);
    panelDismissed = false;
    render();
  });
  const favBtn = listEl.querySelector('.pop-fav-btn');
  if (favBtn) favBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleFav(c.n);
    favBtn.classList.toggle('active', isFav(c.n));
    favBtn.textContent = isFav(c.n) ? "★" : "☆";
  });
}

const markers = {};
POIS.forEach(c => {
  const marker = L.marker([c.lat, c.lon], {icon: markerIcon(c)});
  marker.on('click', () => openSpot(c));
  markers[c.n] = marker;
});

// Un unico grupo de clusters para todo el mapa (en vez de uno por comunidad
// autonoma): el objetivo es que a poco zoom se vea un cluster limpio por
// zona geografica real, no varios clusters pequenos superpuestos.
function clusterIcon(cluster){
  const count = cluster.getChildCount();
  const size = count < 10 ? 30 : count < 50 ? 38 : count < 200 ? 46 : 54;
  return L.divIcon({
    html: `<div class="marker-cluster-custom" style="width:${size}px;height:${size}px">${count}</div>`,
    className: '',
    iconSize: [size, size],
  });
}
const clusterGroup = L.markerClusterGroup({iconCreateFunction: clusterIcon, maxClusterRadius: 55});
map.addLayer(clusterGroup);


// filtros
const catSel = document.getElementById('cat');
const caSel = document.getElementById('ca');
const terrainSel = document.getElementById('terrain');
const langSel = document.getElementById('lang');
const locateBtn = document.getElementById('locateBtn');
const favToggle = document.getElementById('favToggle');
const qInput = document.getElementById('q');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const flagsStatEl = document.getElementById('flagsStat');
const sidebarEl = document.getElementById('sidebar');

langSel.innerHTML = LANG_ORDER.map(l => `<option value="${l}">${esc(I18N[l].langName)}</option>`).join('');
langSel.value = currentLang();

function updateLocateBtn(){
  locateBtn.textContent = userLoc ? t("locateActive") : t("locateBtn");
  locateBtn.classList.toggle('active', !!userLoc);
}
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return;
  locateBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLoc = {lat: pos.coords.latitude, lon: pos.coords.longitude};
      locateBtn.disabled = false;
      updateLocateBtn();
      render();
      map.setView([userLoc.lat, userLoc.lon], 8);
    },
    () => {
      locateBtn.disabled = false;
      locateBtn.textContent = t("locateDenied");
      setTimeout(updateLocateBtn, 2500);
    },
    {timeout: 10000}
  );
});

function updateFavToggle(){
  favToggle.textContent = showFavsOnly ? t("favToggleHide") : t("favToggleShow");
  favToggle.classList.toggle('active', showFavsOnly);
}
favToggle.addEventListener('click', () => {
  showFavsOnly = !showFavsOnly;
  updateFavToggle();
  render();
});

initThemeToggle();

// España se filtra por comunidad autonoma; Portugal por ciudad/pueblo (sus
// regiones turisticas son demasiado amplias y no tiene sentido mezclarlas
// alfabeticamente con las CCAA espanolas en el mismo desplegable). Las zonas
// de agua son todas de España, asi que entran en el mismo union de CCAA.
const casEspana = [...new Set(POIS.filter(c => c.pais === "España").map(c => c.ca))].sort();
const zonasPortugal = [...new Set(POIS.filter(c => c.pais === "Portugal").map(c => c.z))].sort();
const countEspana = CAMPINGS.filter(c => c.pais === "España").length;
const countPortugal = CAMPINGS.filter(c => c.pais === "Portugal").length;
if (flagsStatEl) flagsStatEl.textContent = `🇪🇸 ${countEspana} · 🇵🇹 ${countPortugal} · 💧 ${SPOTS.length} · 🏛 ${PATRIMONIO.length}`;

// El tipo de terreno depende de la categoria elegida (campings y zonas de
// agua usan vocabularios distintos); los valores del desplegable van
// namespaced como "camping::playa" / "agua::rio" para no mezclarlos.
function renderTerrainOptions(){
  const cat = catSel.value;
  const prevT = terrainSel.value || "Todos";
  if (cat === "camping") {
    terrainSel.innerHTML = `<option value="Todos">${esc(t("allTypes"))}</option>`
      + Object.keys(TERRAIN_CAMPING).map(k => `<option value="camping::${k}">${esc(terrainLabel("camping", k))}</option>`).join('');
  } else if (cat === "agua") {
    terrainSel.innerHTML = `<option value="Todos">${esc(t("allTypes"))}</option>`
      + Object.keys(TERRAIN_AGUA).map(k => `<option value="agua::${k}">${esc(terrainLabel("agua", k))}</option>`).join('');
  } else if (cat === "patrimonio") {
    terrainSel.innerHTML = `<option value="Todos">${esc(t("allTypes"))}</option>`
      + Object.keys(TERRAIN_PATRIMONIO).map(k => `<option value="patrimonio::${k}">${esc(terrainLabel("patrimonio", k))}</option>`).join('');
  } else {
    terrainSel.innerHTML = `<option value="Todos">${esc(t("allTypes"))}</option>`;
  }
  terrainSel.value = [...terrainSel.options].some(o => o.value === prevT) ? prevT : "Todos";
}

function renderControls(){
  const prevCa = caSel.value || "Todas";
  const prevCat = catSel.value || "Todas";
  qInput.placeholder = t("searchPlaceholder");
  caSel.innerHTML = `<option value="Todas">${esc(t("allZones"))}</option>`
    + `<optgroup label="${esc(t("groupSpain"))}">` + casEspana.map(c => `<option value="ES::${esc(c)}">${esc(c)}</option>`).join('') + '</optgroup>'
    + `<optgroup label="${esc(t("groupPortugal"))}">` + zonasPortugal.map(z => `<option value="PT::${esc(z)}">${esc(z)}</option>`).join('') + '</optgroup>';
  catSel.innerHTML = `<option value="Todas">${esc(t("catAll"))}</option>`
    + `<option value="camping">${esc(t("catCamping"))}</option>`
    + `<option value="agua">${esc(t("catAgua"))}</option>`
    + `<option value="patrimonio">${esc(t("catPatrimonio"))}</option>`;
  caSel.value = prevCa;
  catSel.value = prevCat;
  renderTerrainOptions();
  updateLocateBtn();
  updateFavToggle();
}

function render(){
  const query = qInput.value.trim().toLowerCase();
  const ca = caSel.value;
  const cat = catSel.value;
  const terrain = terrainSel.value;

  const filtered = POIS.filter(c => {
    const mQ = !query || c.n.toLowerCase().includes(query) || c.z.toLowerCase().includes(query)
      || c.ca.toLowerCase().includes(query) || (c.d || "").toLowerCase().includes(query);
    let mCa = true;
    if (ca !== "Todas") {
      if (ca.startsWith("ES::")) mCa = c.pais === "España" && c.ca === ca.slice(4);
      else if (ca.startsWith("PT::")) mCa = c.pais === "Portugal" && c.z === ca.slice(4);
    }
    const mCat = cat === "Todas" || c.cat === cat;
    const mT = terrain === "Todos" || terrain === `${c.cat}::${c.t}`;
    const mFav = !showFavsOnly || isFav(c.n);
    return mQ && mCa && mCat && mT && mFav;
  });

  // Siempre de mas cerca a mas lejos: desde tu ubicacion si la has activado,
  // si no, desde Torrejon de Ardoz (los km guardados en el dataset).
  filtered.sort((a, b) => distKmFor(a) - distKmFor(b));

  clusterGroup.clearLayers();
  filtered.forEach(c => clusterGroup.addLayer(markers[c.n]));

  countEl.textContent = filtered.length === POIS.length
    ? filtered.length + " " + t("countSuffixMixed")
    : filtered.length + " " + t("countSuffixFiltered");

  // El panel de lista solo se muestra automaticamente si hay un filtro/
  // busqueda activo; si el filtro cambia respecto a la ultima vez, se
  // olvida que el usuario lo hubiera cerrado a mano (vuelve a poder aparecer).
  const hasActiveFilter = !!query || ca !== "Todas" || cat !== "Todas" || terrain !== "Todos" || showFavsOnly;
  const filterKey = JSON.stringify([query, ca, cat, terrain, showFavsOnly]);
  if (filterKey !== lastFilterKey) { panelDismissed = false; lastFilterKey = filterKey; }

  if (inDetail) return;

  listEl.innerHTML = `<div class="panel-close"><span>${filtered.length} ${esc(t("countSuffixFiltered"))}</span><button id="panelCloseBtn" title="${esc(t("closeDetail"))}">✕</button></div>` + filtered.map(c => {
    const meta = terrainMetaFor(c);
    let bottomLeft, goLabel;
    if (c.cat === "camping") { bottomLeft = ""; goLabel = t("viewCamping"); }
    else if (c.cat === "patrimonio") { bottomLeft = esc(c.epoca || ""); goLabel = t("viewPatrimonio"); }
    else { bottomLeft = ""; goLabel = t("viewAgua"); }
    return `<div class="item" data-name="${esc(c.n)}">
      <div class="cover" style="background:${meta.color}22;color:${meta.color}">${meta.glyph}</div>
      <button class="fav-btn list-fav${isFav(c.n) ? " active" : ""}" data-fav-name="${esc(c.n)}" title="${esc(t("favToggle"))}">${isFav(c.n) ? "★" : "☆"}</button>
      <div class="body">
        <h3>${esc(c.n)}</h3>
        <p>${esc(c.z)} · ${esc(c.ca)}</p>
        <div class="row">
          <span class="badge" style="background:${meta.color}22;color:${meta.color}">${esc(terrainLabel(c.cat, c.t))}</span>
          ${c.hike ? `<span class="badge hike-badge-sm">🥾</span>` : ""}
          <span class="km">📍 ${Math.round(distKmFor(c))} km</span>
        </div>
        <div class="row">
          <span class="price-tag">${bottomLeft}</span>
          <span class="go">${esc(goLabel)} →</span>
        </div>
      </div>
    </div>`;
  }).join('');

  if (filtered.length === 0 && showFavsOnly) {
    listEl.innerHTML = `<div class="fav-empty">${esc(t("favEmpty"))}<br><button id="favEmptyCta">${esc(t("favEmptyCta"))}</button></div>`;
    const cta = document.getElementById('favEmptyCta');
    if (cta) cta.addEventListener('click', () => { showFavsOnly = false; updateFavToggle(); render(); });
  }

  const closeBtn = document.getElementById('panelCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    panelDismissed = true;
    sidebarEl.classList.remove('panel-open');
  });

  sidebarEl.classList.toggle('panel-open', hasActiveFilter && !panelDismissed && filtered.length > 0);

  listEl.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const c = POIS.find(x => x.n === el.dataset.name);
      map.flyTo([c.lat, c.lon], 10, {duration:0.6});
      setTimeout(() => openSpot(c), 400);
    });
  });
  listEl.querySelectorAll('.list-fav').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      toggleFav(btn.dataset.favName);
      render();
    });
  });
}

qInput.addEventListener('input', render);
caSel.addEventListener('change', render);
catSel.addEventListener('change', () => { renderTerrainOptions(); render(); });
terrainSel.addEventListener('change', render);
langSel.addEventListener('change', () => {
  setLang(langSel.value);
  renderControls();
  renderLayerControl();
  render();
});

renderControls();
render();
