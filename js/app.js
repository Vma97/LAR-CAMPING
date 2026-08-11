const CAMPINGS = window.CAMPINGS;

const TERRAIN = {
  playa: {color:"#5f97a6", key:"terrainPlaya", glyph:"🏖️"},
  montana: {color:"#7f9a6c", key:"terrainMontana", glyph:"🏔️"},
  rio: {color:"#4f9a83", key:"terrainRio", glyph:"💧"},
  ciudad: {color:"#b98561", key:"terrainCiudad", glyph:"🏙️"},
  naturaleza: {color:"#6ea468", key:"terrainNaturaleza", glyph:"🌲"},
};
function terrainLabel(k){ return t(TERRAIN[k].key); }

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

// Favoritos: guardados en localStorage por nombre de camping.
let favorites = new Set(JSON.parse(localStorage.getItem("campingsFavs") || "[]"));
let showFavsOnly = false;
function isFav(n){ return favorites.has(n); }
function toggleFav(n){
  if (favorites.has(n)) favorites.delete(n); else favorites.add(n);
  localStorage.setItem("campingsFavs", JSON.stringify([...favorites]));
}
// Se llama desde el HTML del popup (onclick inline); actualiza el boton al
// vuelo y refresca la lista/mapa para reflejar el filtro de favoritos si esta activo.
function onFavClick(ev, n){
  ev.stopPropagation();
  toggleFav(n);
  const btn = ev.currentTarget;
  btn.classList.toggle('active', isFav(n));
  btn.textContent = isFav(n) ? "★" : "☆";
  render();
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
  const coords = c.lat + "," + c.lon;
  const L = {
    // Se guian por el nombre real del camping. Waze prioriza "ll" sobre "q"
    // si van juntos (acaba mostrando solo coordenadas), asi que aqui va solo
    // el nombre+zona para que busque y navegue por el sitio real, igual que
    // ya hace bien Google Maps con el destino en texto.
    waze: "https://waze.com/ul?q=" + q(place) + "&navigate=yes",
    maps: "https://www.google.com/maps/dir/?api=1&destination=" + q(place) + "&travelmode=driving",
    appleMaps: "https://maps.apple.com/?q=" + q(c.n) + "&daddr=" + coords,
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

function popupHTML(c){
  const L = buildLinks(c);
  const poiHTML = buildPOI(c).map(p =>
    `<a href="${p.url}" target="_blank">${esc(t(p.labelKey))}</a>`
  ).join("");
  return `
    <div class="pop">
      <button class="fav-btn${isFav(c.n) ? " active" : ""}" onclick="onFavClick(event, ${JSON.stringify(c.n)})" title="${esc(t("favToggle"))}">${isFav(c.n) ? "★" : "☆"}</button>
      <h3>${esc(c.n)}</h3>
      <p class="zone">${esc(c.z)} · ${esc(c.ca)}${c.pais && c.pais !== "España" ? " · " + esc(c.pais) : ""} · ${Math.round(distKmFor(c))} ${esc(userLoc ? t("kmFromYou") : t("kmFromTorrejon"))}</p>
      <div class="prices">
        <div class="price">${esc(t("priceParcela"))}<b>${c.pp}€</b></div>
        <div class="price">${esc(t("priceAdulto"))}<b>${c.pa}€</b></div>
        <div class="price">${esc(t("priceCoche"))}<b>${c.pc}€</b></div>
        <div class="price">${esc(t("priceLuz"))}<b>${c.pl}€</b></div>
      </div>
      <p style="font-size:12px;margin:6px 0 0;">${esc(descFor(c))}</p>
      <div class="links">
        <details class="poi-group route-group" open>
          <summary>${esc(t("routeStart"))}</summary>
          <div class="poi-links">
            <a href="${L.waze}" target="_blank">${esc(t("routeWaze"))}</a>
            <a href="${L.maps}" target="_blank">${esc(t("routeGoogle"))}</a>
            <a href="${L.appleMaps}" target="_blank">${esc(t("routeApple"))}</a>
          </div>
        </details>
        <a href="${L.photos}" target="_blank">${esc(t("photosLink"))}</a>
        ${c.web ? `<a href="${esc(c.web)}" target="_blank">${esc(t("webLink"))}</a>` : ""}
        ${c.tel ? `<a href="tel:${esc(c.tel.replace(/\s+/g,""))}">📞 ${esc(c.tel)}</a>` : ""}
        <details class="poi-group">
          <summary>${esc(t("poiTitle"))}</summary>
          <div class="poi-links">${poiHTML}</div>
        </details>
      </div>
    </div>
  `;
}

const map = L.map('map', {zoomControl:true}).setView([40.0, -4.5], 6);

// Satelite (Esri) como capa por defecto, es la que mas gusta; se mantiene
// el control para poder cambiar a OpenTopoMap (relieve/carreteras) cuando
// alguien lo necesite.
const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 18,
  attribution: 'Tiles &copy; Esri'
}).addTo(map);
const osmLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  subdomains: 'abc',
  attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
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
  const meta = TERRAIN[c.t] || TERRAIN.naturaleza;
  return L.divIcon({
    className: '',
    html: `<div class="camp-marker" style="background:${meta.color}"><span>${meta.glyph}</span></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}
const markers = {};
CAMPINGS.forEach(c => {
  const marker = L.marker([c.lat, c.lon], {icon: markerIcon(c)})
    // bindPopup con funcion: Leaflet la vuelve a invocar cada vez que se abre,
    // asi el popup siempre refleja el idioma actual sin reconstruir marcadores.
    .bindPopup(() => popupHTML(c), {maxWidth: 260});
  markers[c.n] = marker;
});

// Agrupacion de marcadores (clusters) para que el mapa no se vea como un
// enjambre de puntos con cientos de campings a la vez; al hacer zoom se
// van desagrupando solos.
function clusterIcon(cluster){
  const count = cluster.getChildCount();
  const size = count < 10 ? 32 : count < 50 ? 38 : 46;
  return L.divIcon({
    html: `<div class="marker-cluster-custom" style="width:${size}px;height:${size}px">${count}</div>`,
    className: '',
    iconSize: [size, size],
  });
}

// legend
const legend = L.control({position:'bottomleft'});
let legendDiv = null;
legend.onAdd = function(){
  legendDiv = L.DomUtil.create('div','legend');
  renderLegend();
  return legendDiv;
};
legend.addTo(map);
function renderLegend(){
  if (!legendDiv) return;
  legendDiv.innerHTML = Object.entries(TERRAIN).map(([k,v]) =>
    `<div><span class="dot" style="background:${v.color}"></span>${esc(terrainLabel(k))}</div>`
  ).join('');
}

// filtros
const caSel = document.getElementById('ca');
const terrainSel = document.getElementById('terrain');
const langSel = document.getElementById('lang');
const locateBtn = document.getElementById('locateBtn');
const favToggle = document.getElementById('favToggle');
const qInput = document.getElementById('q');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const flagsStatEl = document.getElementById('flagsStat');
const mobileListToggle = document.getElementById('mobileListToggle');
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

if (mobileListToggle) {
  mobileListToggle.addEventListener('click', () => sidebarEl.classList.toggle('open'));
}

initThemeToggle();

// España se filtra por comunidad autonoma; Portugal por ciudad/pueblo (sus
// regiones turisticas son demasiado amplias y no tiene sentido mezclarlas
// alfabeticamente con las CCAA espanolas en el mismo desplegable).
const casEspana = [...new Set(CAMPINGS.filter(c => c.pais === "España").map(c => c.ca))].sort();
const zonasPortugal = [...new Set(CAMPINGS.filter(c => c.pais === "Portugal").map(c => c.z))].sort();
const countEspana = CAMPINGS.filter(c => c.pais === "España").length;
const countPortugal = CAMPINGS.filter(c => c.pais === "Portugal").length;
if (flagsStatEl) flagsStatEl.textContent = `🇪🇸 ${countEspana} · 🇵🇹 ${countPortugal}`;

function renderControls(){
  const prevCa = caSel.value || "Todas";
  const prevT = terrainSel.value || "Todos";
  qInput.placeholder = t("searchPlaceholder");
  caSel.innerHTML = `<option value="Todas">${esc(t("allZones"))}</option>`
    + `<optgroup label="${esc(t("groupSpain"))}">` + casEspana.map(c => `<option value="ES::${esc(c)}">${esc(c)}</option>`).join('') + '</optgroup>'
    + `<optgroup label="${esc(t("groupPortugal"))}">` + zonasPortugal.map(z => `<option value="PT::${esc(z)}">${esc(z)}</option>`).join('') + '</optgroup>';
  terrainSel.innerHTML = `<option value="Todos">${esc(t("allTypes"))}</option>` + Object.keys(TERRAIN).map(k => `<option value="${k}">${esc(terrainLabel(k))}</option>`).join('');
  caSel.value = prevCa;
  terrainSel.value = prevT;
  renderLegend();
  updateLocateBtn();
  updateFavToggle();
}

// Un grupo de clusters por comunidad autonoma / region (en vez de uno solo
// global), asi los clusters nunca mezclan campings de zonas distintas aunque
// esten geograficamente cerca en el mapa a poco zoom.
const uniqueCAs = [...new Set(CAMPINGS.map(c => c.ca))];
const caGroups = {};
uniqueCAs.forEach(ca => {
  const group = L.markerClusterGroup({iconCreateFunction: clusterIcon, maxClusterRadius: 50});
  caGroups[ca] = group;
  map.addLayer(group);
});

function render(){
  const query = qInput.value.trim().toLowerCase();
  const ca = caSel.value;
  const terrain = terrainSel.value;

  const filtered = CAMPINGS.filter(c => {
    const mQ = !query || c.n.toLowerCase().includes(query) || c.z.toLowerCase().includes(query)
      || c.ca.toLowerCase().includes(query) || (c.d || "").toLowerCase().includes(query);
    let mCa = true;
    if (ca !== "Todas") {
      if (ca.startsWith("ES::")) mCa = c.pais === "España" && c.ca === ca.slice(4);
      else if (ca.startsWith("PT::")) mCa = c.pais === "Portugal" && c.z === ca.slice(4);
    }
    const mT = terrain === "Todos" || c.t === terrain;
    const mFav = !showFavsOnly || isFav(c.n);
    return mQ && mCa && mT && mFav;
  });

  // Siempre de mas cerca a mas lejos: desde tu ubicacion si la has activado,
  // si no, desde Torrejon de Ardoz (los km guardados en el dataset).
  filtered.sort((a, b) => distKmFor(a) - distKmFor(b));

  Object.values(caGroups).forEach(g => g.clearLayers());
  filtered.forEach(c => caGroups[c.ca].addLayer(markers[c.n]));

  countEl.textContent = filtered.length === CAMPINGS.length
    ? filtered.length + " " + t("countSuffix")
    : filtered.length + " " + t("countSuffixFiltered");

  listEl.innerHTML = filtered.map(c => {
    const meta = TERRAIN[c.t] || TERRAIN.naturaleza;
    return `<div class="item" data-name="${esc(c.n)}">
      <div class="cover" style="background:${meta.color}22;color:${meta.color}">${meta.glyph}</div>
      <button class="fav-btn list-fav${isFav(c.n) ? " active" : ""}" data-fav-name="${esc(c.n)}" title="${esc(t("favToggle"))}">${isFav(c.n) ? "★" : "☆"}</button>
      <div class="body">
        <h3>${esc(c.n)}</h3>
        <p>${esc(c.z)} · ${esc(c.ca)}</p>
        <div class="row">
          <span class="badge" style="background:${meta.color}22;color:${meta.color}">${esc(terrainLabel(c.t))}</span>
          <span class="km">📍 ${Math.round(distKmFor(c))} km</span>
        </div>
        <div class="row">
          <span class="price-tag">${esc(t("listKmDesde"))} ${c.pp}€</span>
          <span class="go">${esc(t("viewCamping"))} →</span>
        </div>
      </div>
    </div>`;
  }).join('');

  if (filtered.length === 0 && showFavsOnly) {
    listEl.innerHTML = `<div class="fav-empty">${esc(t("favEmpty"))}<br><button id="favEmptyCta">${esc(t("favEmptyCta"))}</button></div>`;
    const cta = document.getElementById('favEmptyCta');
    if (cta) cta.addEventListener('click', () => { showFavsOnly = false; updateFavToggle(); render(); });
  }

  listEl.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const c = CAMPINGS.find(x => x.n === el.dataset.name);
      map.flyTo([c.lat, c.lon], 10, {duration:0.6});
      setTimeout(() => markers[c.n].openPopup(), 650);
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
terrainSel.addEventListener('change', render);
langSel.addEventListener('change', () => {
  setLang(langSel.value);
  renderControls();
  renderLayerControl();
  render();
  map.closePopup();
});

renderControls();
render();
