const CAMPINGS = window.CAMPINGS;

const TERRAIN = {
  playa: {label:"Costa", color:"#6ea6b3"},
  montana: {label:"Montaña", color:"#8ba178"},
  rio: {label:"Río / Lago", color:"#5fa588"},
  ciudad: {label:"Ciudad", color:"#bb8b72"},
  naturaleza: {label:"Naturaleza", color:"#7fae7a"},
};

function q(s){ return encodeURIComponent(s); }
function esc(s){ return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function buildLinks(c){
  const place = c.n + ", " + c.z;
  const L = {
    maps: "https://www.google.com/maps/search/?api=1&query=" + q(place),
    waze: "https://waze.com/ul?q=" + q(place) + "&navigate=yes",
    photos: "https://www.google.com/search?tbm=isch&q=" + q(place),
  };
  return L;
}

// Puntos de interés cerca, agrupados en subcategorías. Las 4 primeras son
// genéricas (toda zona tiene pueblos, rutas, monumentos y naturaleza cerca);
// las de agua dependen del terreno para no ofrecer playa en el interior.
function buildPOI(c){
  const poi = [
    {icon:"🏘", label:"Pueblos con encanto", query:"pueblos con encanto cerca de " + c.z},
    {icon:"🥾", label:"Rutas de senderismo", query:"rutas de senderismo cerca de " + c.z},
    {icon:"🏛", label:"Monumentos y patrimonio", query:"monumentos y lugares historicos cerca de " + c.z},
    {icon:"🏔", label:"Naturaleza y miradores", query:"miradores y parajes naturales cerca de " + c.z},
  ];
  if (c.t === "playa") {
    poi.push({icon:"🏖", label:"Playas", query:"playas cerca de " + c.z});
  } else {
    poi.push({icon:"💧", label:"Lagunas y embalses", query:"lagunas y embalses cerca de " + c.z});
  }
  return poi.map(p => ({...p, url: "https://www.google.com/maps/search/" + q(p.query)}));
}

function popupHTML(c){
  const L = buildLinks(c);
  const poiHTML = buildPOI(c).map(p =>
    `<a href="${p.url}" target="_blank">${p.icon} ${esc(p.label)}</a>`
  ).join("");
  return `
    <div class="pop">
      <h3>${esc(c.n)}</h3>
      <p class="zone">${esc(c.z)} · ${esc(c.ca)}${c.pais && c.pais !== "España" ? " · " + esc(c.pais) : ""} · ${c.km} km desde Torrejón</p>
      <div class="prices">
        <div class="price">Parcela<b>${c.pp}€</b></div>
        <div class="price">Adulto<b>${c.pa}€</b></div>
        <div class="price">Coche<b>${c.pc}€</b></div>
        <div class="price">Luz<b>${c.pl}€</b></div>
      </div>
      <p style="font-size:12px;margin:6px 0 0;">${esc(c.d)}</p>
      <div class="links">
        <a class="primary" href="${L.waze}" target="_blank">🚗 Ir con Waze</a>
        <a href="${L.maps}" target="_blank">📍 Ir con Google Maps</a>
        <a href="${L.photos}" target="_blank">🖼 Ver fotos del camping</a>
        <details class="poi-group">
          <summary>✨ Puntos de interés cerca</summary>
          <div class="poi-links">${poiHTML}</div>
        </details>
      </div>
    </div>
  `;
}

const map = L.map('map', {zoomControl:true}).setView([40.0, -4.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = {};
CAMPINGS.forEach(c => {
  const meta = TERRAIN[c.t] || TERRAIN.naturaleza;
  const marker = L.circleMarker([c.lat, c.lon], {
    radius: 6,
    color: "#fff",
    weight: 1.5,
    fillColor: meta.color,
    fillOpacity: 0.9
  }).bindPopup(popupHTML(c), {maxWidth: 260});
  markers[c.n] = marker;
});

// legend
const legend = L.control({position:'bottomleft'});
legend.onAdd = function(){
  const div = L.DomUtil.create('div','legend');
  div.innerHTML = Object.values(TERRAIN).map(t =>
    `<div><span class="dot" style="background:${t.color}"></span>${t.label}</div>`
  ).join('');
  return div;
};
legend.addTo(map);

// filtros
const caSel = document.getElementById('ca');
const terrainSel = document.getElementById('terrain');
const qInput = document.getElementById('q');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');

// España se filtra por comunidad autonoma; Portugal por ciudad/pueblo (sus
// regiones turisticas son demasiado amplias y no tiene sentido mezclarlas
// alfabeticamente con las CCAA espanolas en el mismo desplegable).
const casEspana = [...new Set(CAMPINGS.filter(c => c.pais === "España").map(c => c.ca))].sort();
const zonasPortugal = [...new Set(CAMPINGS.filter(c => c.pais === "Portugal").map(c => c.z))].sort();
caSel.innerHTML = '<option value="Todas">Todas las zonas</option>'
  + '<optgroup label="España">' + casEspana.map(c => `<option value="ES::${esc(c)}">${esc(c)}</option>`).join('') + '</optgroup>'
  + '<optgroup label="Portugal">' + zonasPortugal.map(z => `<option value="PT::${esc(z)}">${esc(z)}</option>`).join('') + '</optgroup>';
terrainSel.innerHTML = '<option value="Todos">Todo tipo</option>' + Object.entries(TERRAIN).map(([k,v]) => `<option value="${k}">${v.label}</option>`).join('');

let activeGroup = L.layerGroup(Object.values(markers)).addTo(map);

function render(){
  const query = qInput.value.trim().toLowerCase();
  const ca = caSel.value;
  const terrain = terrainSel.value;

  const filtered = CAMPINGS.filter(c => {
    const mQ = !query || c.n.toLowerCase().includes(query) || c.z.toLowerCase().includes(query);
    let mCa = true;
    if (ca !== "Todas") {
      if (ca.startsWith("ES::")) mCa = c.pais === "España" && c.ca === ca.slice(4);
      else if (ca.startsWith("PT::")) mCa = c.pais === "Portugal" && c.z === ca.slice(4);
    }
    const mT = terrain === "Todos" || c.t === terrain;
    return mQ && mCa && mT;
  });

  map.removeLayer(activeGroup);
  activeGroup = L.layerGroup(filtered.map(c => markers[c.n])).addTo(map);

  countEl.textContent = filtered.length + " campings · mapa interactivo";

  listEl.innerHTML = filtered.map(c => {
    const meta = TERRAIN[c.t] || TERRAIN.naturaleza;
    return `<div class="item" data-name="${esc(c.n)}">
      <h3>${esc(c.n)}</h3>
      <p>${esc(c.z)} · ${esc(c.ca)}</p>
      <div class="row">
        <span class="badge" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
        <span class="km">${c.km} km · desde ${c.pp}€</span>
      </div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const c = CAMPINGS.find(x => x.n === el.dataset.name);
      map.flyTo([c.lat, c.lon], 10, {duration:0.6});
      setTimeout(() => markers[c.n].openPopup(), 650);
    });
  });
}

qInput.addEventListener('input', render);
caSel.addEventListener('change', render);
terrainSel.addEventListener('change', render);

render();
