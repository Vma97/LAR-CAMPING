import React, { useState, useMemo } from "react";
import { MapPin, Waves, Mountain, TreePine, Building2, Tent, Zap, Car, Users, X, Search, Navigation, Compass, Image as ImageIcon, ExternalLink } from "lucide-react";

const CAMPINGS = [{"n": "Camping Osuna", "ca": "Madrid", "z": "Madrid capital", "km": 20, "pp": "8", "pa": "5", "pc": "4", "pl": "4", "d": "Junto a Barajas. Minimercado zona baile parque infantil parque canino", "t": "naturaleza"}, {"n": "Camping Ciudad de Madrid", "ca": "Madrid", "z": "Madrid capital", "km": 25, "pp": "9", "pa": "5", "pc": "4", "pl": "4", "d": "En Casa de Campo. Restaurante supermercado piscina muy urbano", "t": "ciudad"}, {"n": "Camping Arco Iris", "ca": "Madrid", "z": "Villaviciosa de Odon", "km": 30, "pp": "10", "pa": "6", "pc": "4", "pl": "4", "d": "Dos piscinas suites jacuzzi bungalows parada de bus", "t": "naturaleza"}, {"n": "Camping Aranjuez", "ca": "Madrid", "z": "Aranjuez", "km": 40, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Junto a jardines y palacio entretenimiento adultos animacion ninos", "t": "naturaleza"}, {"n": "Camping El Escorial Resort", "ca": "Madrid", "z": "El Escorial", "km": 50, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Tres piscinas una climatizada tobogan grande bungalows", "t": "naturaleza"}, {"n": "Camping Monte Holiday", "ca": "Madrid", "z": "Guadarrama", "km": 85, "pp": "10", "pa": "6", "pc": "4", "pl": "4", "d": "Parcelas piscina parque aventuras tirolina restaurante", "t": "naturaleza"}, {"n": "Camping Doremor", "ca": "Madrid", "z": "Cabanillas de la Sierra", "km": 55, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca sierra de la Cabrera ambiente tranquilo familiar", "t": "montana"}, {"n": "Camping La Fresneda", "ca": "Madrid", "z": "Soto del Real", "km": 75, "pp": "9", "pa": "5", "pc": "4", "pl": "4", "d": "Bosques y montanas piscina area recreativa rutas btt", "t": "montana"}, {"n": "Camping El Rio", "ca": "Madrid", "z": "San Martin de Valdeiglesias", "km": 70, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Junto al Tormes piscina naturaleza embalse cerca", "t": "rio"}, {"n": "Camping El Picachuelo", "ca": "Madrid", "z": "Sierra Norte", "km": 90, "pp": "9", "pa": "5", "pc": "4", "pl": "4", "d": "Especializado deportes de aventura barranquismo escalada", "t": "playa"}, {"n": "Camping Cervera de Buitrago", "ca": "Madrid", "z": "Sierra Norte", "km": 80, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Bungalows pueblo con encanto entorno rural", "t": "naturaleza"}, {"n": "Camping San Juan", "ca": "Madrid", "z": "Nuevo Baztan", "km": 60, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Senderismo y aventura entorno montanoso", "t": "montana"}, {"n": "Camping Pico Miel", "ca": "Madrid", "z": "Bustarviejo", "km": 65, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca pico de la Miel naturaleza tranquila", "t": "montana"}, {"n": "Glamping The Teepee", "ca": "Castilla y Leon", "z": "Mombeltran Avila", "km": 150, "pp": "45", "pa": "incluido", "pc": "incluido", "pl": "incluido", "d": "Cabanas teepee dobles bano privado cocina comun pareja", "t": "naturaleza"}, {"n": "Camping Batanes", "ca": "Castilla y Leon", "z": "Miranda del Castanar Salamanca", "km": 250, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Entorno rural sierra de Francia piscina naturaleza", "t": "montana"}, {"n": "Camping Puerta de Gredos", "ca": "Castilla y Leon", "z": "Navarredonda de Gredos", "km": 180, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "A los pies de Gredos senderismo escalada clima fresco", "t": "playa"}, {"n": "Camping Segovia", "ca": "Castilla y Leon", "z": "Segovia", "km": 100, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Cerca acueducto piscina bungalows familia", "t": "naturaleza"}, {"n": "Camping Riaza", "ca": "Castilla y Leon", "z": "Riaza Segovia", "km": 120, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Sierra de Ayllon naturaleza tranquila pinares", "t": "montana"}, {"n": "Camping Salamanca", "ca": "Castilla y Leon", "z": "Salamanca", "km": 220, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Junto al Tormes cerca casco historico", "t": "ciudad"}, {"n": "Camping Aranda de Duero", "ca": "Castilla y Leon", "z": "Aranda de Duero Burgos", "km": 180, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Ribera del Duero zona de bodegas", "t": "naturaleza"}, {"n": "Camping Burgos", "ca": "Castilla y Leon", "z": "Burgos", "km": 240, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Cerca catedral bien comunicado con la ciudad", "t": "ciudad"}, {"n": "Camping Sanabria", "ca": "Castilla y Leon", "z": "Lago de Sanabria Zamora", "km": 340, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Junto al lago glaciar mas grande de la peninsula", "t": "rio"}, {"n": "Camping Covaleda", "ca": "Castilla y Leon", "z": "Sierra de Urbion Soria", "km": 220, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Pinares de Urbion cerca laguna Negra", "t": "rio"}, {"n": "Camping Leon", "ca": "Castilla y Leon", "z": "Leon", "km": 340, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Bien comunicado con la capital leonesa", "t": "ciudad"}, {"n": "Camping Toledo", "ca": "Castilla La Mancha", "z": "Toledo Vega del Tajo", "km": 75, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Vistas al Alcazar piscina zona verde junto al rio", "t": "rio"}, {"n": "Camping Ciudad Encantada", "ca": "Castilla La Mancha", "z": "Cuenca", "km": 200, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Junto al paraje karstico piscina senderismo naturaleza", "t": "naturaleza"}, {"n": "Camping Rio Mundo", "ca": "Castilla La Mancha", "z": "Riopar Albacete", "km": 300, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca del nacimiento del rio Mundo cascadas piscina", "t": "rio"}, {"n": "Camping Bosque Aventura", "ca": "Castilla La Mancha", "z": "Serrania de Cuenca", "km": 190, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Tirolinas rutas 4x4 entorno pinar", "t": "naturaleza"}, {"n": "Camping Alarcon", "ca": "Castilla La Mancha", "z": "Alarcon Cuenca", "km": 220, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Junto al embalse pueblo medieval sobre penasco", "t": "rio"}, {"n": "Camping Almagro", "ca": "Castilla La Mancha", "z": "Almagro Ciudad Real", "km": 220, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Casco historico manchego corral de comedias cerca", "t": "ciudad"}, {"n": "Camping Lagunas de Ruidera", "ca": "Castilla La Mancha", "z": "Ruidera Ciudad Real", "km": 260, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Parque natural lagunas encadenadas piscina natural cerca", "t": "rio"}, {"n": "Camping Consuegra", "ca": "Castilla La Mancha", "z": "Consuegra Toledo", "km": 120, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Molinos de viento ruta del Quijote", "t": "naturaleza"}, {"n": "Camping Guadalajara", "ca": "Castilla La Mancha", "z": "Guadalajara", "km": 60, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca del Henares bien comunicado con Madrid", "t": "naturaleza"}, {"n": "Camping Sig\u00fcenza", "ca": "Castilla La Mancha", "z": "Sig\u00fcenza Guadalajara", "km": 130, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Ciudad medieval catedral y castillo", "t": "ciudad"}, {"n": "Camping Trujillo", "ca": "Extremadura", "z": "Caceres", "km": 290, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca casco historico piscina parcelas amplias", "t": "ciudad"}, {"n": "Camping Caceres", "ca": "Extremadura", "z": "Caceres", "km": 300, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Naturista familiar piscina zonas verdes bien comunicado", "t": "naturaleza"}, {"n": "Camping Merida", "ca": "Extremadura", "z": "Badajoz", "km": 350, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Junto al Guadiana ruinas romanas cercanas piscina", "t": "naturaleza"}, {"n": "Camping Monfrague", "ca": "Extremadura", "z": "Parque Nacional Monfrague", "km": 270, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Observacion de aves buitres rutas naturaleza", "t": "naturaleza"}, {"n": "Camping Yuste", "ca": "Extremadura", "z": "La Vera Caceres", "km": 280, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Valle del Jerte cerca zona de pantanos piscina natural", "t": "montana"}, {"n": "Camping Badajoz", "ca": "Extremadura", "z": "Badajoz", "km": 400, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Frontera con Portugal cerca del rio Guadiana", "t": "rio"}, {"n": "Camping Guadalupe", "ca": "Extremadura", "z": "Guadalupe Caceres", "km": 320, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Monasterio Patrimonio Humanidad entorno serrano", "t": "rio"}, {"n": "Camping Jerte", "ca": "Extremadura", "z": "Valle del Jerte Caceres", "km": 290, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Famoso por floracion del cerezo rio con piscinas naturales", "t": "rio"}, {"n": "Camping Zafra", "ca": "Extremadura", "z": "Zafra Badajoz", "km": 380, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Casco historico cerca ruta de la Plata", "t": "ciudad"}, {"n": "Camping Coria", "ca": "Extremadura", "z": "Coria Caceres", "km": 320, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Ciudad amurallada junto al rio Alagon", "t": "rio"}, {"n": "Camping Alquezar", "ca": "Aragon", "z": "Huesca", "km": 450, "pp": "10", "pa": "6", "pc": "4", "pl": "4", "d": "Canon del rio Vero barranquismo escalada piscina", "t": "playa"}, {"n": "Camping Ordesa", "ca": "Aragon", "z": "Torla Huesca", "km": 480, "pp": "10", "pa": "6", "pc": "4", "pl": "4", "d": "Puerta al Parque Nacional de Ordesa senderismo alta montana", "t": "montana"}, {"n": "Camping Teruel", "ca": "Aragon", "z": "Teruel", "km": 300, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Naturaleza tranquila punto de paso hacia Levante", "t": "naturaleza"}, {"n": "Camping Zaragoza", "ca": "Aragon", "z": "Zaragoza", "km": 320, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Junto al Ebro urbano bien comunicado", "t": "ciudad"}, {"n": "Camping Benasque", "ca": "Aragon", "z": "Huesca", "km": 500, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "Pirineo aragones alta montana escalada esqui de fondo", "t": "playa"}, {"n": "Camping Formiche", "ca": "Aragon", "z": "Gudar Javalambre Teruel", "km": 350, "pp": "8", "pa": "5", "pc": "3", "pl": "4", "d": "Montana turolense tranquilo estrellas dark sky", "t": "montana"}, {"n": "Camping Jaca", "ca": "Aragon", "z": "Jaca Huesca", "km": 470, "pp": "10", "pa": "6", "pc": "4", "pl": "4", "d": "Pirineo occidental ciudadela cerca camino de Santiago", "t": "montana"}, {"n": "Camping Albarracin", "ca": "Aragon", "z": "Albarracin Teruel", "km": 330, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Pueblo medieval casco rojizo entorno serrano", "t": "naturaleza"}, {"n": "Camping Sos del Rey Catolico", "ca": "Aragon", "z": "Sos del Rey Catolico Zaragoza", "km": 420, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Pueblo medieval cuna de Fernando el Catolico", "t": "naturaleza"}, {"n": "Camping Sallent de Gallego", "ca": "Aragon", "z": "Valle de Tena Huesca", "km": 510, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "Pirineo cerca Formigal esqui y senderismo", "t": "montana"}, {"n": "Camping Nuevalos", "ca": "Aragon", "z": "Monasterio de Piedra Zaragoza", "km": 330, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Junto al parque natural del Monasterio de Piedra cascadas", "t": "rio"}, {"n": "Kikopark Playa", "ca": "Comunidad Valenciana", "z": "Oliva Valencia", "km": 400, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Junto al puerto deportivo piscinas parcelas amplias", "t": "naturaleza"}, {"n": "Camping Benisol", "ca": "Comunidad Valenciana", "z": "Benidorm Alicante", "km": 430, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playa cerca del centro piscina animacion todo el ano", "t": "playa"}, {"n": "Camping Villasol", "ca": "Comunidad Valenciana", "z": "Benidorm", "km": 430, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Cerca playa de Levante piscinas parque acuatico bungalows", "t": "playa"}, {"n": "Marjal Costa Blanca Resort", "ca": "Comunidad Valenciana", "z": "Crevillente Guardamar Alicante", "km": 450, "pp": "16", "pa": "7", "pc": "5", "pl": "5", "d": "Resort moderno lago artificial spa bungalows lujo", "t": "rio"}, {"n": "Alannia Guardamar", "ca": "Comunidad Valenciana", "z": "Guardamar del Segura", "km": 450, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Piscinas toboganes bungalows todo incluido familiar", "t": "naturaleza"}, {"n": "Camping Internacional La Marina", "ca": "Comunidad Valenciana", "z": "Elche Alicante", "km": 440, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a playas de Elche pinar frondoso amplio", "t": "playa"}, {"n": "Camping Javea", "ca": "Comunidad Valenciana", "z": "Javea Alicante", "km": 420, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Cala tranquila entorno natural buceo cercano", "t": "playa"}, {"n": "Camping Calpe Mar", "ca": "Comunidad Valenciana", "z": "Calpe Alicante", "km": 410, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Bajo el Penon de Ifach piscina playa cercana", "t": "playa"}, {"n": "Bravoplaya Camping Resort", "ca": "Comunidad Valenciana", "z": "Peniscola Castellon", "km": 470, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Primera linea playa protegida tres piscinas abierto todo el ano", "t": "playa"}, {"n": "Camping Playa Tropicana", "ca": "Comunidad Valenciana", "z": "Alcossebre Castellon", "km": 450, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "A pie de playa tamano medio tranquilo", "t": "playa"}, {"n": "Euro Camping Oliva", "ca": "Comunidad Valenciana", "z": "Oliva Valencia", "km": 400, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "Playa ancha arena blanca amplias parcelas", "t": "playa"}, {"n": "SAMAY La Marina", "ca": "Comunidad Valenciana", "z": "La Marina Alicante", "km": 440, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Top valorado costa blanca apto ninos piscina", "t": "playa"}, {"n": "Camping Valencia el Saler", "ca": "Comunidad Valenciana", "z": "El Saler Valencia", "km": 380, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a la Albufera y dunas pinar", "t": "playa"}, {"n": "Camping Lo Monte", "ca": "Region de Murcia", "z": "Torre de la Horadada", "km": 470, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "Costa Calida recomendado ciclismo apto mayores", "t": "playa"}, {"n": "Camper Park Huerta de Murcia", "ca": "Region de Murcia", "z": "Los Ramos Murcia", "km": 400, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Area autocaravanas servicios completos bien valorado", "t": "naturaleza"}, {"n": "Camping Murcia", "ca": "Region de Murcia", "z": "Murcia capital", "km": 390, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Bien comunicado con la capital", "t": "ciudad"}, {"n": "Camping Mazarron", "ca": "Region de Murcia", "z": "Mazarron", "km": 450, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Playas del mediterraneo aguas tranquilas", "t": "playa"}, {"n": "Camping Aguilas", "ca": "Region de Murcia", "z": "Aguilas", "km": 470, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Costa Calida calas y castillo de San Juan", "t": "playa"}, {"n": "Camping Cartagena", "ca": "Region de Murcia", "z": "Cartagena", "km": 440, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Puerto historico buceo pecios romanos cerca", "t": "naturaleza"}, {"n": "Camping Calblanque", "ca": "Region de Murcia", "z": "Parque Regional Calblanque", "km": 450, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Dunas virgenes calas protegidas naturaleza", "t": "playa"}, {"n": "Camping Cabo de Palos", "ca": "Region de Murcia", "z": "Cabo de Palos", "km": 460, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Faro emblematico buceo Islas Hormigas", "t": "playa"}, {"n": "Camping Lorca", "ca": "Region de Murcia", "z": "Lorca", "km": 420, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Castillo y casco historico cerca sierra", "t": "montana"}, {"n": "Camping Bullas", "ca": "Region de Murcia", "z": "Bullas", "km": 410, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Zona vinicola entorno rural tranquilo", "t": "naturaleza"}, {"n": "Kampaoh Cambrils", "ca": "Cataluna", "z": "Cambrils Tarragona", "km": 590, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Tiendas equipadas listas playa cerca", "t": "playa"}, {"n": "Kampaoh Delta del Ebro", "ca": "Cataluna", "z": "Delta del Ebro Tarragona", "km": 520, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Naturaleza humedales observacion aves kayak", "t": "naturaleza"}, {"n": "Camping La Siesta", "ca": "Cataluna", "z": "Salou Tarragona", "km": 580, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Costa Dorada piscinas cerca Port Aventura", "t": "playa"}, {"n": "Kampaoh Costa Brava", "ca": "Cataluna", "z": "Playa Brava Girona", "km": 650, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Dos piscinas adultos y ninos zona verde", "t": "naturaleza"}, {"n": "Camping Cala Montjoi", "ca": "Cataluna", "z": "Roses Girona", "km": 660, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a cala salvaje cerca Cap de Creus", "t": "playa"}, {"n": "Camping Port de la Vall", "ca": "Cataluna", "z": "El Port de la Selva Girona", "km": 670, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Extremo Cap de Creus vistas mar y montana", "t": "playa"}, {"n": "Camping Blanes", "ca": "Cataluna", "z": "Blanes Girona", "km": 640, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Puerta a Costa Brava piscina playa cercana", "t": "playa"}, {"n": "Camping Cypsela", "ca": "Cataluna", "z": "Pals Girona", "km": 660, "pp": "18", "pa": "7", "pc": "5", "pl": "5", "d": "Resort premium piscinas parque acuatico grande", "t": "naturaleza"}, {"n": "Camping Barcelona", "ca": "Cataluna", "z": "Vilanova i la Geltru", "km": 610, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Bien comunicado con la ciudad playa cerca", "t": "playa"}, {"n": "Kampaoh L Almadrava", "ca": "Cataluna", "z": "Costa Dorada Tarragona", "km": 560, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Playa amplia tiendas equipadas", "t": "playa"}, {"n": "Camping Sitges", "ca": "Cataluna", "z": "Sitges Barcelona", "km": 600, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Ambiente animado playa urbana cercana", "t": "playa"}, {"n": "Camping Berga", "ca": "Cataluna", "z": "Berga Barcelona", "km": 650, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Prepirineo catalan cerca Cadi Moixero", "t": "montana"}, {"n": "Kampaoh Zumaia", "ca": "Pais Vasco", "z": "Zumaia Guipuzcoa", "km": 480, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Geoparque Flysch escenario Juego de Tronos", "t": "rio"}, {"n": "Camping Igueldo", "ca": "Pais Vasco", "z": "San Sebastian", "km": 470, "pp": "17", "pa": "6", "pc": "5", "pl": "5", "d": "Sobre la ciudad vistas bahia de la Concha", "t": "ciudad"}, {"n": "Camping Portuondo", "ca": "Pais Vasco", "z": "Mundaka Vizcaya", "km": 460, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a la ria surf en Mundaka cerca", "t": "playa"}, {"n": "Camping Laga", "ca": "Pais Vasco", "z": "Ibarrangelu Vizcaya", "km": 470, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Costa vasca acantilados playa salvaje", "t": "playa"}, {"n": "Camping Bilbao", "ca": "Pais Vasco", "z": "Bilbao", "km": 450, "pp": "15", "pa": "6", "pc": "4", "pl": "5", "d": "Bien comunicado con la ciudad y el metro", "t": "ciudad"}, {"n": "Camping Orio", "ca": "Pais Vasco", "z": "Orio Guipuzcoa", "km": 475, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a la ria y playa apto surf", "t": "playa"}, {"n": "Camping Vitoria", "ca": "Pais Vasco", "z": "Vitoria Gasteiz", "km": 400, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Cerca de los Sabinares del Rio Ebro", "t": "rio"}, {"n": "Camping Sopelana", "ca": "Pais Vasco", "z": "Sopelana Vizcaya", "km": 460, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Playas de surf acantilados flysch", "t": "playa"}, {"n": "Camping Deba", "ca": "Pais Vasco", "z": "Deba Guipuzcoa", "km": 475, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Costa vasca cerca ruta del flysch", "t": "playa"}, {"n": "Camping Alegria de Alava", "ca": "Pais Vasco", "z": "Alegria Alava", "km": 420, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Entorno rural montanoso tranquilo", "t": "montana"}, {"n": "Kampaoh Sierra de Urbasa", "ca": "Navarra", "z": "Urbasa", "km": 420, "pp": "13", "pa": "6", "pc": "4", "pl": "4", "d": "Sierra y hayedo entorno de montana tranquilo", "t": "montana"}, {"n": "Kampaoh Mendigorria", "ca": "Navarra", "z": "Mendigorria", "km": 400, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Junto al rio Arga cerca del Camino de Santiago", "t": "rio"}, {"n": "Camping Pamplona", "ca": "Navarra", "z": "Pamplona", "km": 410, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Bien comunicado casco historico y sanfermines", "t": "ciudad"}, {"n": "Camping Roncal", "ca": "Navarra", "z": "Valle del Roncal", "km": 470, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Pirineo navarro quesos DOP naturaleza", "t": "montana"}, {"n": "Camping Ochagavia", "ca": "Navarra", "z": "Valle de Salazar", "km": 460, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Pirineo navarro bosques hayedos", "t": "montana"}, {"n": "Camping Bardenas Reales", "ca": "Navarra", "z": "Bardenas Reales", "km": 430, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Paisaje desertico unico rutas 4x4 y btt", "t": "naturaleza"}, {"n": "Camping Baztan", "ca": "Navarra", "z": "Valle del Baztan", "km": 480, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Pirineo atlantico caserios y bosques", "t": "montana"}, {"n": "Camping Tudela", "ca": "Navarra", "z": "Tudela", "km": 370, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Ribera navarra huerta y verduras", "t": "naturaleza"}, {"n": "Camping Estella", "ca": "Navarra", "z": "Estella Lizarra", "km": 440, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Etapa clave del Camino de Santiago", "t": "naturaleza"}, {"n": "Camping Leitza", "ca": "Navarra", "z": "Leitza", "km": 450, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Pirineo humedo bosques atlanticos", "t": "montana"}, {"n": "Camping Ezcaray", "ca": "La Rioja", "z": "Ezcaray", "km": 340, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Sierra de la Demanda cerca estacion de esqui", "t": "montana"}, {"n": "Camping Haro", "ca": "La Rioja", "z": "Haro", "km": 350, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Capital del Rioja zona de bodegas", "t": "rio"}, {"n": "Camping Logrono", "ca": "La Rioja", "z": "Logrono", "km": 380, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Bien comunicado camino de Santiago", "t": "naturaleza"}, {"n": "Camping San Millan", "ca": "La Rioja", "z": "San Millan de la Cogolla", "km": 340, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Monasterios Patrimonio Humanidad entorno tranquilo", "t": "rio"}, {"n": "Camping Najera", "ca": "La Rioja", "z": "Najera", "km": 360, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Etapa del Camino de Santiago junto al rio Najerilla", "t": "rio"}, {"n": "Camping Arnedillo", "ca": "La Rioja", "z": "Arnedillo", "km": 370, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Aguas termales valle del Cidacos", "t": "montana"}, {"n": "Camping Torrecilla", "ca": "La Rioja", "z": "Torrecilla en Cameros", "km": 350, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Sierra riojana bosques y naturaleza", "t": "montana"}, {"n": "Camping Calahorra", "ca": "La Rioja", "z": "Calahorra", "km": 390, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Huerta riojana bien comunicado", "t": "rio"}, {"n": "Camping Enciso", "ca": "La Rioja", "z": "Enciso", "km": 360, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Zona de icnitas de dinosaurios naturaleza", "t": "rio"}, {"n": "Camping Cervera del Rio Alhama", "ca": "La Rioja", "z": "Cervera del Rio Alhama", "km": 400, "pp": "9", "pa": "5", "pc": "3", "pl": "4", "d": "Frontera con Aragon entorno rural", "t": "naturaleza"}, {"n": "Camping Las Arenas", "ca": "Cantabria", "z": "Pechon", "km": 420, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Junto a la ria de Tina Mayor piscina actividades canoning", "t": "playa"}, {"n": "Camping El Helguero", "ca": "Cantabria", "z": "Comillas", "km": 400, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Mejor camping playa 2017 FECC animacion infantil", "t": "playa"}, {"n": "Camping Playa Joyel", "ca": "Cantabria", "z": "Isla", "km": 410, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Acceso a seis playas lavanderia supermercado", "t": "playa"}, {"n": "Camping Los Molinos de Bareyo", "ca": "Cantabria", "z": "Bareyo", "km": 395, "pp": "11", "pa": "6", "pc": "4", "pl": "5", "d": "A 4 km de playa 35 de Santander piscina vistas", "t": "playa"}, {"n": "Camping Oyambre", "ca": "Cantabria", "z": "Comillas", "km": 400, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Parque natural playa extensa dunas", "t": "playa"}, {"n": "Somo Parque", "ca": "Cantabria", "z": "Suesa", "km": 410, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "A 1.5 km playa de Somo top surf y kitesurf", "t": "playa"}, {"n": "Camping Santillana del Mar", "ca": "Cantabria", "z": "Santillana", "km": 390, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Casco historico cerca cuevas de Altamira", "t": "ciudad"}, {"n": "Camping Cabuerniga", "ca": "Cantabria", "z": "Cabuerniga", "km": 420, "pp": "10", "pa": "5", "pc": "4", "pl": "4", "d": "Valle interior naturaleza tranquila rio cercano", "t": "montana"}, {"n": "Camping Ruiloba", "ca": "Cantabria", "z": "Ruiloba", "km": 405, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Costa occidental cantabra playas tranquilas", "t": "playa"}, {"n": "Camping Liebana", "ca": "Cantabria", "z": "Potes", "km": 440, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Picos de Europa desfiladero senderismo", "t": "montana"}, {"n": "Camping Suances", "ca": "Cantabria", "z": "Suances", "km": 395, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Playas urbanas surf y paseo maritimo", "t": "playa"}, {"n": "Kampaoh Playa Troenzo", "ca": "Asturias", "z": "Llanes", "km": 470, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Costa oriental asturiana calas y acantilados", "t": "playa"}, {"n": "Camping Costa Verde", "ca": "Asturias", "z": "Colunga", "km": 480, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Playa al lado cerca museo jurasico", "t": "playa"}, {"n": "Camping La Isla", "ca": "Asturias", "z": "Cangas de Onis", "km": 490, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Puerta a Picos de Europa rutas Covadonga cercanas", "t": "montana"}, {"n": "Camping Playa Sauces", "ca": "Asturias", "z": "Ribadesella", "km": 470, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Familiar cerca mar y montana descenso del Sella", "t": "playa"}, {"n": "Camping Las Gaviotas", "ca": "Asturias", "z": "Castrillon", "km": 490, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Primera linea de playa abierto en verano diario", "t": "playa"}, {"n": "Kampaoh La Franca", "ca": "Asturias", "z": "La Franca", "km": 460, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playa extensa entre Asturias y Cantabria", "t": "playa"}, {"n": "Camping Gijon", "ca": "Asturias", "z": "Gijon", "km": 510, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Bien comunicado con la ciudad playa San Lorenzo cerca", "t": "playa"}, {"n": "Camping Cudillero", "ca": "Asturias", "z": "Cudillero", "km": 520, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Pueblo marinero de colores pesquero", "t": "playa"}, {"n": "Camping Somiedo", "ca": "Asturias", "z": "Parque Natural de Somiedo", "km": 470, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Osos pardos bra\u00f1as y lagos glaciares", "t": "rio"}, {"n": "Camping Oviedo", "ca": "Asturias", "z": "Oviedo", "km": 480, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Capital asturiana bien comunicada", "t": "playa"}, {"n": "Camping Fisterra", "ca": "Galicia", "z": "Fisterra A Coruna", "km": 610, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Extremo occidental fin de la tierra faro y acantilados", "t": "playa"}, {"n": "Camping O Muino", "ca": "Galicia", "z": "Oia Pontevedra", "km": 610, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Primera linea Atlantico acceso a cala bungalows", "t": "playa"}, {"n": "Camping Bayona Playa", "ca": "Galicia", "z": "Baiona Pontevedra", "km": 590, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Cerca casco historico Baiona playa amplia piscinas", "t": "playa"}, {"n": "Camping Playa America", "ca": "Galicia", "z": "Nigran Pontevedra", "km": 595, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playa extensa supermercado restaurante piscina tobogan", "t": "playa"}, {"n": "Camping Ria de Arousa", "ca": "Galicia", "z": "Ribeira A Coruna", "km": 580, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "A las faldas del monte A Curota trekking rutas a caballo", "t": "naturaleza"}, {"n": "Camping Punta Batuda", "ca": "Galicia", "z": "Porto do Son A Coruna", "km": 590, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Primera categoria 167 parcelas 25 bungalows junto al mar", "t": "playa"}, {"n": "Camping Los Manzanos", "ca": "Galicia", "z": "Oleiros A Coruna", "km": 610, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Jardin botanico museo al aire libre familiar", "t": "naturaleza"}, {"n": "Camping Santa Tecla", "ca": "Galicia", "z": "A Guarda Pontevedra", "km": 580, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Estuario del Mino vistas a Portugal llano y con sombra", "t": "rio"}, {"n": "Camping Playa Canelas", "ca": "Galicia", "z": "Portonovo Pontevedra", "km": 585, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Playa blanca aguas cristalinas piscinas toboganes", "t": "playa"}, {"n": "Kampaoh O Pedrouzo", "ca": "Galicia", "z": "O Pedrouzo A Coruna", "km": 560, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "En el Camino de Santiago parada de peregrinos", "t": "naturaleza"}, {"n": "Camping Rinlo Costa", "ca": "Galicia", "z": "Ribadeo Lugo", "km": 560, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Costa norte de Lugo acantilados playas salvajes", "t": "playa"}, {"n": "Camping Vila de Sarria", "ca": "Galicia", "z": "Sarria Lugo", "km": 540, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Punto clave del Camino Frances entorno verde", "t": "naturaleza"}, {"n": "Camping Estaca de Bares", "ca": "Galicia", "z": "Manon A Coruna", "km": 650, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Punto mas al norte de la peninsula faro y acantilados", "t": "playa"}, {"n": "Camping As Cabazas", "ca": "Galicia", "z": "Ortigueira A Coruna", "km": 630, "pp": "10", "pa": "5", "pc": "3", "pl": "4", "d": "Cerca del extremo norte rias altas tranquilo", "t": "playa"}, {"n": "Camping Giralda", "ca": "Andalucia", "z": "Sevilla", "km": 530, "pp": "12", "pa": "6", "pc": "4", "pl": "4", "d": "Urbano bien comunicado con el centro historico", "t": "ciudad"}, {"n": "Camping Dos Hermanas", "ca": "Andalucia", "z": "Sevilla", "km": 535, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Piscina parcelas amplias cerca capital", "t": "ciudad"}, {"n": "Camping Cordoba", "ca": "Andalucia", "z": "Cordoba", "km": 400, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Junto al rio Guadalquivir cerca mezquita catedral", "t": "rio"}, {"n": "Kampaoh Grazalema", "ca": "Andalucia", "z": "Grazalema Cadiz", "km": 620, "pp": "13", "pa": "6", "pc": "4", "pl": "4", "d": "Sierra pueblo blanco parque natural senderismo", "t": "montana"}, {"n": "Camping El Palmar", "ca": "Andalucia", "z": "Vejer de la Frontera Cadiz", "km": 660, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playa de surf famosa ambiente relajado", "t": "playa"}, {"n": "Camping Los Canos de Meca", "ca": "Andalucia", "z": "Barbate Cadiz", "km": 665, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playa virgen faro de Trafalgar cerca", "t": "playa"}, {"n": "Kampaoh Tarifa", "ca": "Andalucia", "z": "Tarifa Cadiz", "km": 700, "pp": "15", "pa": "7", "pc": "5", "pl": "5", "d": "Kitesurf capital de Europa vientos de levante", "t": "playa"}, {"n": "Camping Torre de la Pena", "ca": "Andalucia", "z": "Tarifa Cadiz", "km": 700, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Vistas a Africa punto mas al sur peninsular", "t": "naturaleza"}, {"n": "Camping Lago de Arcos", "ca": "Andalucia", "z": "Arcos de la Frontera Cadiz", "km": 610, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Junto al embalse pueblo blanco emblematico", "t": "rio"}, {"n": "Camping Conil", "ca": "Andalucia", "z": "Conil de la Frontera Cadiz", "km": 650, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Playas extensas ambiente surfero", "t": "playa"}, {"n": "Camping Torremolinos", "ca": "Andalucia", "z": "Malaga", "km": 540, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Costa del Sol piscina cerca playa", "t": "playa"}, {"n": "Kampaoh Estepona", "ca": "Andalucia", "z": "Estepona Malaga", "km": 590, "pp": "14", "pa": "6", "pc": "4", "pl": "5", "d": "Costa del Sol occidental clima suave todo el ano", "t": "playa"}, {"n": "Camping Sierra Nevada", "ca": "Andalucia", "z": "Monachil Granada", "km": 480, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Montana y nieve cercania a la costa tropical", "t": "playa"}, {"n": "Camping Motril", "ca": "Andalucia", "z": "Motril Granada", "km": 500, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Costa tropical clima subtropical piscina", "t": "playa"}, {"n": "Kampaoh Roquetas", "ca": "Andalucia", "z": "Roquetas de Mar Almeria", "km": 580, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Playas de arena fina invernaderos alrededor", "t": "playa"}, {"n": "Kampaoh Escullos", "ca": "Andalucia", "z": "Cabo de Gata Almeria", "km": 640, "pp": "13", "pa": "6", "pc": "4", "pl": "5", "d": "Parque natural volcanico calas virgenes", "t": "playa"}, {"n": "Kampaoh El Rocio", "ca": "Andalucia", "z": "El Rocio Huelva", "km": 560, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Junto al Parque Nacional de Donana caballos", "t": "naturaleza"}, {"n": "Kampaoh Do\u00f1ana", "ca": "Andalucia", "z": "Matalascanas Huelva", "km": 580, "pp": "12", "pa": "6", "pc": "4", "pl": "5", "d": "Playa y marisma parque nacional observacion aves", "t": "playa"}, {"n": "Camping Ayamonte", "ca": "Andalucia", "z": "Ayamonte Huelva", "km": 640, "pp": "11", "pa": "6", "pc": "4", "pl": "4", "d": "Frontera con Portugal desembocadura Guadiana", "t": "naturaleza"}]
;

const TERRAIN_META = {
  playa: { icon: Waves, label: "Costa", color: "#6ea6b3", bg: "#e4eff1" },
  montana: { icon: Mountain, label: "Montaña", color: "#8ba178", bg: "#eef2ec" },
  rio: { icon: TreePine, label: "Río / Lago", color: "#5fa588", bg: "#e6f3ec" },
  ciudad: { icon: Building2, label: "Ciudad", color: "#bb8b72", bg: "#f2ebe4" },
  naturaleza: { icon: TreePine, label: "Naturaleza", color: "#7fae7a", bg: "#eaf3ec" },
};

const CAS = [...new Set(CAMPINGS.map((c) => c.ca))].sort();

function q(str) {
  return encodeURIComponent(str);
}

function links(c) {
  const place = `${c.n}, ${c.z}`;
  return {
    maps: `https://www.google.com/maps/search/?api=1&query=${q(place)}`,
    waze: `https://waze.com/ul?q=${q(place)}&navigate=yes`,
    photos: `https://www.google.com/search?tbm=isch&q=${q(place)}`,
    hiking: `https://www.google.com/maps/search/${q("rutas de senderismo cerca de " + c.z)}`,
    beaches: `https://www.google.com/maps/search/${q("playas cerca de " + c.z)}`,
    around: `https://www.google.com/maps/search/${q("que ver cerca de " + c.z)}`,
  };
}

function LinkButton({ href, icon: Icon, label, accent }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold border transition-colors"
      style={
        accent
          ? { backgroundColor: "#57736a", color: "#eef4f0", borderColor: "#57736a" }
          : { backgroundColor: "#fbfdfb", color: "#3f4a43", borderColor: "#dbe6e0" }
      }
    >
      <Icon size={15} />
      {label}
    </a>
  );
}

function Badge({ terrain }) {
  const meta = TERRAIN_META[terrain] || TERRAIN_META.naturaleza;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

function CampingCard({ c, onOpen }) {
  const meta = TERRAIN_META[c.t] || TERRAIN_META.naturaleza;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(c)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(c) : null)}
      className="text-left w-full rounded-xl border border-[#dbe6e0] bg-[#fbfdfb] p-4 hover:border-[#c99a83] hover:shadow-md transition-all duration-150 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-[#3f4a43] text-[15px] leading-snug group-hover:text-[#c99a83] transition-colors">
          {c.n}
        </h3>
        <span className="shrink-0 font-mono text-[11px] text-[#7d9088] mt-0.5">{c.km} km</span>
      </div>
      <p className="text-[13px] text-[#6f8079] mt-1">{c.z} · {c.ca}</p>
      <div className="flex items-center gap-2 mt-3">
        <Badge terrain={c.t} />
        <span className="font-mono text-xs text-[#7d9088]">desde {c.pp}€/parcela</span>
      </div>
      <a
        href={links(c).waze}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#57736a] hover:underline"
      >
        <Navigation size={12} /> Ir ahora
      </a>
    </div>
  );
}

function DetailSheet({ c, onClose }) {
  if (!c) return null;
  const meta = TERRAIN_META[c.t] || TERRAIN_META.naturaleza;
  const Icon = meta.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-[#fbfdfb] rounded-t-2xl sm:rounded-2xl border border-[#dbe6e0] p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full mb-3"
            style={{ backgroundColor: meta.bg }}
          >
            <Icon size={22} color={meta.color} strokeWidth={2.5} />
          </div>
          <button onClick={onClose} className="text-[#7d9088] hover:text-[#3f4a43] p-1">
            <X size={20} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-[#3f4a43] leading-tight">{c.n}</h2>
        <p className="text-sm text-[#6f8079] mt-1 flex items-center gap-1">
          <MapPin size={14} /> {c.z} · {c.ca}
        </p>
        <p className="text-sm text-[#3f4a43] mt-4 leading-relaxed">{c.d}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <LinkButton href={links(c).waze} icon={Navigation} label="Ir con Waze" accent />
          <LinkButton href={links(c).maps} icon={MapPin} label="Ir con Maps" accent />
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2">
          <LinkButton href={links(c).photos} icon={ImageIcon} label="Ver fotos del camping" />
          <LinkButton href={links(c).hiking} icon={Compass} label="Rutas de senderismo cerca" />
          <LinkButton href={links(c).beaches} icon={Waves} label="Playas cerca" />
          <LinkButton href={links(c).around} icon={ExternalLink} label="Qué ver cerca" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white border border-[#dbe6e0] p-3">
            <div className="flex items-center gap-1.5 text-[#7d9088] text-[11px] font-semibold uppercase tracking-wide">
              <Tent size={13} /> Parcela
            </div>
            <div className="font-mono text-lg font-bold text-[#3f4a43] mt-0.5">{c.pp}€</div>
          </div>
          <div className="rounded-lg bg-white border border-[#dbe6e0] p-3">
            <div className="flex items-center gap-1.5 text-[#7d9088] text-[11px] font-semibold uppercase tracking-wide">
              <Users size={13} /> Adulto
            </div>
            <div className="font-mono text-lg font-bold text-[#3f4a43] mt-0.5">{c.pa}€</div>
          </div>
          <div className="rounded-lg bg-white border border-[#dbe6e0] p-3">
            <div className="flex items-center gap-1.5 text-[#7d9088] text-[11px] font-semibold uppercase tracking-wide">
              <Car size={13} /> Coche
            </div>
            <div className="font-mono text-lg font-bold text-[#3f4a43] mt-0.5">{c.pc}€</div>
          </div>
          <div className="rounded-lg bg-white border border-[#dbe6e0] p-3">
            <div className="flex items-center gap-1.5 text-[#7d9088] text-[11px] font-semibold uppercase tracking-wide">
              <Zap size={13} /> Luz
            </div>
            <div className="font-mono text-lg font-bold text-[#3f4a43] mt-0.5">{c.pl}€</div>
          </div>
        </div>
        <p className="text-[11px] text-[#7d9088] mt-4">
          Precios orientativos por noche, temporada media. Pueden variar en agosto. A {c.km} km aprox. desde Torrejón de Ardoz.
        </p>
      </div>
    </div>
  );
}

export default function CampingExplorer() {
  const [query, setQuery] = useState("");
  const [ca, setCa] = useState("Todas");
  const [terrain, setTerrain] = useState("Todos");
  const [sortBy, setSortBy] = useState("km");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = CAMPINGS.filter((c) => {
      const matchQuery =
        query.trim() === "" ||
        c.n.toLowerCase().includes(query.toLowerCase()) ||
        c.z.toLowerCase().includes(query.toLowerCase());
      const matchCa = ca === "Todas" || c.ca === ca;
      const matchTerrain = terrain === "Todos" || c.t === terrain;
      return matchQuery && matchCa && matchTerrain;
    });
    list.sort((a, b) => (sortBy === "km" ? a.km - b.km : a.pp - b.pp));
    return list;
  }, [query, ca, terrain, sortBy]);

  return (
    <div className="min-h-screen bg-[#eef4f0]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="sticky top-0 z-40 bg-[#3f4a43] text-[#eef4f0] px-5 pt-6 pb-4 border-b-4 border-[#c99a83]">
        <div className="flex items-center gap-2">
          <Tent size={22} className="text-[#c99a83]" />
          <h1 className="text-lg font-black tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Ruta de Campings — España
          </h1>
        </div>
        <p className="text-xs text-[#c7d6cd] mt-1 font-mono">
          {CAMPINGS.length} campings · ordenados desde Torrejón de Ardoz
        </p>

        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d9088]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o zona..."
            className="w-full bg-[#eef4f0] text-[#3f4a43] rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder-[#7d9088] outline-none focus:ring-2 focus:ring-[#c99a83]"
          />
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-5 px-5">
          <select
            value={ca}
            onChange={(e) => setCa(e.target.value)}
            className="shrink-0 bg-[#57736a] text-[#eef4f0] text-xs rounded-full px-3 py-1.5 outline-none border border-[#7fa294]"
          >
            <option value="Todas">Todas las CCAA</option>
            {CAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={terrain}
            onChange={(e) => setTerrain(e.target.value)}
            className="shrink-0 bg-[#57736a] text-[#eef4f0] text-xs rounded-full px-3 py-1.5 outline-none border border-[#7fa294]"
          >
            <option value="Todos">Todo tipo</option>
            {Object.entries(TERRAIN_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shrink-0 bg-[#57736a] text-[#eef4f0] text-xs rounded-full px-3 py-1.5 outline-none border border-[#7fa294]"
          >
            <option value="km">Ordenar: distancia</option>
            <option value="pp">Ordenar: precio parcela</option>
          </select>
        </div>
      </div>

      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {filtered.length === 0 && (
          <p className="text-sm text-[#7d9088] col-span-2 text-center py-10">
            Ningún camping coincide. Prueba otra búsqueda o filtro.
          </p>
        )}
        {filtered.map((c) => (
          <CampingCard key={c.n + c.z} c={c} onOpen={setSelected} />
        ))}
      </div>

      <DetailSheet c={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
