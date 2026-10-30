/*
 * On-screen text for WebTV. Portuguese / English / Spanish via tr(pt, en, es);
 * German, Russian, Italian, French, Danish, Swedish, Dutch (nl-BE) and Austrian German (de-AT)
 * use catalogues keyed by the English string (same idea as the Android app).
 * The language follows the TV unless set in Home Settings.
 */
var I18N = (function () {
  'use strict';

  var lang = 'en';

  var german = {
    " · Liftoff by Tom Ballard": " · Liftoff von Tom Ballard",
    "24h change": "Änderung in 24 h",
    "All Apps": "Alle Apps",
    "Arrows preview · OK applies · Back cancels": "Pfeile zur Vorschau · OK übernimmt · Zurück bricht ab",
    "Automatic": "Automatisch",
    "Classic": "Klassisch",
    "Classic dark": "Klassisch dunkel",
    "Classic light": "Klassisch hell",
    "Clear": "Klar",
    "Cloudy": "Bewölkt",
    "Couldn't open ": "Konnte nicht öffnen: ",
    "Couldn't open TV Settings": "Die TV-Einstellungen ließen sich nicht öffnen",
    "Crypto": "Krypto",
    "Dark": "Dunkel",
    "Dollar": "Dollar",
    "Drizzle": "Nieselregen",
    "Explore": "Entdecken",
    "Fog": "Nebel",
    "For You": "Für dich",
    "HDMI Inputs": "HDMI-Eingänge",
    "Heavy Rain": "Starker Regen",
    "Home Settings": "Startbildschirm",
    "Home wallpaper updated": "Startbildschirm-Hintergrund aktualisiert",
    "Inputs": "Eingänge",
    "Language": "Sprache",
    "Light": "Hell",
    "Live TV": "Live-TV",
    "Mostly Clear": "Überwiegend klar",
    "Mostly Sunny": "Überwiegend sonnig",
    "Movies": "Filme",
    "No weather data right now.": "Gerade keine Wetterdaten.",
    "OK adds or removes · ← → change the order": "OK fügt hinzu oder entfernt · ← → verschieben",
    "OK or the arrows change the value.": "OK oder die Pfeiltasten ändern den Wert.",
    "Off": "Aus",
    "On": "An",
    "On · ": "In der Leiste · ",
    "Partly Cloudy": "Teilweise bewölkt",
    "Quotes widget": "Kurs-Widget",
    "Rain": "Regen",
    "Series": "Serie",
    "Settings": "Einstellungen",
    "Shelf": "Leiste",
    "Shortcuts": "Verknüpfungen",
    "Shows": "Serien",
    "Snow": "Schnee",
    "Sunrise ": "Sonnenaufgang ",
    "Sunset ": "Sonnenuntergang ",
    "TV Settings": "TV-Einstellungen",
    "Temperature": "Temperatur",
    "Theme": "Design",
    "Theme: ": "Design: ",
    "Themes": "Designs",
    "Thunderstorms": "Gewitter",
    "Weather": "Wetter",
    "Weather widget": "Wetter-Widget",
    "home": "Start",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › zum Blättern  ·  OK setzt Hintergrund  ·  ↑ oder Zurück",
  };

  function germanText(en) {
    if (Object.prototype.hasOwnProperty.call(german, en)) return german[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return 'vor ' + m[1] + (m[2] === 'min' ? ' Min.' : ' Std.');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' Staffel' : ' Staffeln');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'H:' + m[1] + m[2] + 'T:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'In die Leiste passen bis zu ' + m[1] + ' Apps.';
    return en;
  }

  var russian = {
    "": "",
    "24h change": "изменение за 24 ч",
    "Action & Adventure": "Боевик и приключения",
    "All Apps": "Приложения",
    "Automatic": "Автоматически",
    "Clear": "Ясно",
    "Cloudy": "Облачно",
    "Couldn't open ": "Не удалось открыть ",
    "Couldn't open TV Settings": "Не удалось открыть настройки телевизора",
    "Crypto": "Криптовалюты",
    "Dark": "Тёмная",
    "Dollar": "Доллар",
    "Drizzle": "Морось",
    "Explore": "Обзор",
    "Fog": "Туман",
    "For You": "Для вас",
    "HDMI Inputs": "Входы HDMI",
    "Heavy Rain": "Сильный дождь",
    "Home Settings": "Главный экран",
    "Inputs": "Входы",
    "Kids": "Для детей",
    "Language": "Язык",
    "Light": "Светлая",
    "Live TV": "Телеканалы",
    "Mostly Clear": "Малооблачно",
    "Mostly Sunny": "Малооблачно",
    "Movies": "Фильмы",
    "News": "Новости",
    "No weather data right now.": "Сейчас нет данных о погоде.",
    "OK adds or removes · ← → change the order": "OK — добавить или убрать · ← → — изменить порядок",
    "OK or the arrows change the value.": "Нажмите OK или стрелки, чтобы изменить значение.",
    "Off": "Выкл.",
    "On": "Вкл.",
    "On · ": "В избранном · ",
    "Partly Cloudy": "Переменная облачность",
    "Quotes widget": "Виджет котировок",
    "Rain": "Дождь",
    "Sci-Fi & Fantasy": "Фантастика и фэнтези",
    "Series": "Сериал",
    "Settings": "Настройки",
    "Shelf": "Избранные приложения",
    "Shortcuts": "Ярлыки",
    "Shows": "Сериалы",
    "Snow": "Снег",
    "Soap": "Мыльная опера",
    "Sunrise ": "Восход ",
    "Sunset ": "Закат ",
    "TV Settings": "Настройки ТВ",
    "Talk": "Ток-шоу",
    "Temperature": "Температура",
    "Theme": "Тема",
    "Thunderstorms": "Гроза",
    "War & Politics": "Война и политика",
    "Weather": "Погода",
    "Weather widget": "Виджет погоды",
    "now": "сейчас",
  };

  function russianText(en) {
    if (Object.prototype.hasOwnProperty.call(russian, en)) return russian[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return m[1] + (m[2] === 'min' ? ' мин назад' : ' ч назад');
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'В избранное можно добавить не более ' + m[1] + ' приложений.';
    return en;
  }

  var italian = {
    " · Liftoff by Tom Ballard": " · Liftoff di Tom Ballard",
    "24h change": "variazione in 24 h",
    "Action & Adventure": "Azione e avventura",
    "All Apps": "Tutte le app",
    "Arrows preview · OK applies · Back cancels": "Le frecce anteprima · OK applica · Indietro annulla",
    "Automatic": "Automatico",
    "Classic": "Classico",
    "Classic dark": "Classico scuro",
    "Classic light": "Classico chiaro",
    "Clear": "Sereno",
    "Cloudy": "Nuvoloso",
    "Couldn't open ": "Impossibile aprire ",
    "Couldn't open TV Settings": "Impossibile aprire le impostazioni TV",
    "Crypto": "Cripto",
    "Dark": "Scuro",
    "Dollar": "Dollaro",
    "Drizzle": "Pioviggine",
    "Explore": "Esplora",
    "Fog": "Nebbia",
    "For You": "Per te",
    "HDMI Inputs": "Ingressi HDMI",
    "Heavy Rain": "Pioggia forte",
    "Home Settings": "Impostazioni Home",
    "Home wallpaper updated": "Sfondo della home aggiornato",
    "Inputs": "Ingressi",
    "Kids": "Bambini",
    "Language": "Lingua",
    "Light": "Chiaro",
    "Live TV": "TV in diretta",
    "Mostly Clear": "Prevalentemente sereno",
    "Mostly Sunny": "Quasi sereno",
    "Movies": "Film",
    "News": "Notizie",
    "No weather data right now.": "Nessun dato meteo al momento.",
    "OK adds or removes · ← → change the order": "OK aggiunge o toglie · ← → cambia l’ordine",
    "OK or the arrows change the value.": "OK o le frecce cambiano il valore.",
    "Off": "Disattivato",
    "On": "Attivato",
    "On · ": "Nella barra · ",
    "Partly Cloudy": "Parzialmente nuvoloso",
    "Quotes widget": "Widget quotazioni",
    "Rain": "Pioggia",
    "Sci-Fi & Fantasy": "Fantascienza e fantasy",
    "Series": "Serie",
    "Settings": "Impostazioni",
    "Shelf": "App preferite",
    "Shortcuts": "Scorciatoie",
    "Shows": "Serie TV",
    "Snow": "Neve",
    "Soap": "Soap",
    "Sunrise ": "Alba ",
    "Sunset ": "Tramonto ",
    "TV Settings": "Impostazioni TV",
    "Talk": "Talk show",
    "Temperature": "Temperatura",
    "Theme": "Tema",
    "Theme: ": "Tema: ",
    "Themes": "Temi",
    "Thunderstorms": "Temporali",
    "War & Politics": "Guerra e politica",
    "Weather": "Meteo",
    "Weather widget": "Widget meteo",
    "home": "home",
    "now": "ora",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › per sfogliare  ·  OK imposta lo sfondo  ·  ↑ o Indietro",
  };

  function italianText(en) {
    if (Object.prototype.hasOwnProperty.call(italian, en)) return italian[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return m[1] + (m[2] === 'min' ? ' min fa' : ' h fa');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' stagione' : ' stagioni');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'Max:' + m[1] + m[2] + 'Min:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'Nella barra entrano fino a ' + m[1] + ' app.';
    return en;
  }

  var french = {
    " · Liftoff by Tom Ballard": " · Liftoff de Tom Ballard",
    "24h change": "variation sur 24 h",
    "Action & Adventure": "Action et aventure",
    "All Apps": "Toutes les apps",
    "Arrows preview · OK applies · Back cancels": "Les flèches prévisualisent · OK applique · Retour annule",
    "Automatic": "Automatique",
    "Classic": "Classique",
    "Classic dark": "Classique sombre",
    "Classic light": "Classique clair",
    "Clear": "Ensoleillé",
    "Cloudy": "Nuageux",
    "Couldn't open ": "Impossible d’ouvrir ",
    "Couldn't open TV Settings": "Impossible d’ouvrir les réglages TV",
    "Crypto": "Crypto",
    "Dark": "Sombre",
    "Dollar": "Dollar",
    "Drizzle": "Bruine",
    "Explore": "Explorer",
    "Fog": "Brouillard",
    "For You": "Pour vous",
    "HDMI Inputs": "Entrées HDMI",
    "Heavy Rain": "Forte pluie",
    "Home Settings": "Réglages de l'accueil",
    "Home wallpaper updated": "Fond d’écran d’accueil mis à jour",
    "Inputs": "Entrées",
    "Kids": "Enfants",
    "Language": "Langue",
    "Light": "Clair",
    "Live TV": "TV en direct",
    "Mostly Clear": "Plutôt dégagé",
    "Mostly Sunny": "Plutôt ensoleillé",
    "Movies": "Films",
    "News": "Actualités",
    "No weather data right now.": "Pas de données météo pour l'instant.",
    "OK adds or removes · ← → change the order": "OK ajoute ou retire · ← → change l’ordre",
    "OK or the arrows change the value.": "OK ou les flèches changent la valeur.",
    "Off": "Désactivé",
    "On": "Activé",
    "On · ": "Dans la barre · ",
    "Partly Cloudy": "Partiellement nuageux",
    "Quotes widget": "Widget des cours",
    "Rain": "Pluie",
    "Sci-Fi & Fantasy": "Science-fiction et fantasy",
    "Series": "Série",
    "Settings": "Réglages",
    "Shelf": "Apps favorites",
    "Shortcuts": "Raccourcis",
    "Shows": "Séries",
    "Snow": "Neige",
    "Soap": "Soap",
    "Sunrise ": "Lever ",
    "Sunset ": "Coucher ",
    "TV Settings": "Réglages de la TV",
    "Talk": "Talk-show",
    "Temperature": "Température",
    "Theme": "Thème",
    "Theme: ": "Thème : ",
    "Themes": "Thèmes",
    "Thunderstorms": "Orages",
    "War & Politics": "Guerre et politique",
    "Weather": "Météo",
    "Weather widget": "Widget météo",
    "home": "accueil",
    "now": "maintenant",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › pour parcourir  ·  OK définit le fond  ·  ↑ ou Retour",
  };

  function frenchText(en) {
    if (Object.prototype.hasOwnProperty.call(french, en)) return french[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return 'il y a ' + m[1] + (m[2] === 'min' ? ' min' : ' h');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' saison' : ' saisons');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'Max:' + m[1] + m[2] + 'Min:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'La barre peut contenir jusqu’à ' + m[1] + ' apps.';
    return en;
  }

  var danish = {
    " · Liftoff by Tom Ballard": " · Liftoff af Tom Ballard",
    "24h change": "ændring på 24 t",
    "Action & Adventure": "Action og eventyr",
    "All Apps": "Alle apps",
    "Arrows preview · OK applies · Back cancels": "Pile forhåndsviser · OK anvender · Tilbage annullerer",
    "Automatic": "Automatisk",
    "Classic": "Klassisk",
    "Classic dark": "Klassisk mørk",
    "Classic light": "Klassisk lys",
    "Clear": "Solrigt",
    "Cloudy": "Overskyet",
    "Couldn't open ": "Kunne ikke åbne ",
    "Couldn't open TV Settings": "Kunne ikke åbne TV-indstillinger",
    "Crypto": "Krypto",
    "Dark": "Mørkt",
    "Dollar": "Dollar",
    "Drizzle": "Støvregn",
    "Explore": "Udforsk",
    "Fog": "Tåge",
    "For You": "Til dig",
    "HDMI Inputs": "HDMI-indgange",
    "Heavy Rain": "Kraftig regn",
    "Home Settings": "Startskærm",
    "Home wallpaper updated": "Hjemmebaggrund opdateret",
    "Inputs": "Indgange",
    "Kids": "Børn",
    "Language": "Sprog",
    "Light": "Lyst",
    "Live TV": "Live-tv",
    "Mostly Clear": "Mest klart",
    "Mostly Sunny": "Mest solrigt",
    "Movies": "Film",
    "News": "Nyheder",
    "No weather data right now.": "Ingen vejrdata lige nu.",
    "OK adds or removes · ← → change the order": "OK tilføjer eller fjerner · ← → ændrer rækkefølgen",
    "OK or the arrows change the value.": "OK eller pilene ændrer værdien.",
    "Off": "Fra",
    "On": "Til",
    "On · ": "På hylden · ",
    "Partly Cloudy": "Delvist skyet",
    "Quotes widget": "Kurswidget",
    "Rain": "Regn",
    "Sci-Fi & Fantasy": "Sci-fi og fantasy",
    "Series": "Serie",
    "Settings": "Indstillinger",
    "Shelf": "Favoritapps",
    "Shortcuts": "Genveje",
    "Shows": "Serier",
    "Snow": "Sne",
    "Soap": "Sæbeopera",
    "Sunrise ": "Solopgang ",
    "Sunset ": "Solnedgang ",
    "TV Settings": "Tv-indstillinger",
    "Talk": "Talkshow",
    "Temperature": "Temperatur",
    "Theme": "Tema",
    "Theme: ": "Tema: ",
    "Themes": "Temaer",
    "Thunderstorms": "Tordenvejr",
    "War & Politics": "Krig og politik",
    "Weather": "Vejr",
    "Weather widget": "Vejrwidget",
    "home": "hjem",
    "now": "nu",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › for at bladre  ·  OK sætter baggrund  ·  ↑ eller Tilbage",
  };

  function danishText(en) {
    if (Object.prototype.hasOwnProperty.call(danish, en)) return danish[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return m[1] + (m[2] === 'min' ? ' min. siden' : ' t. siden');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' sæson' : ' sæsoner');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'H:' + m[1] + m[2] + 'L:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'Hylden kan have op til ' + m[1] + ' apps.';
    return en;
  }

  var swedish = {
    " · Liftoff by Tom Ballard": " · Liftoff av Tom Ballard",
    "24h change": "förändring 24 h",
    "Action & Adventure": "Action och äventyr",
    "All Apps": "Alla appar",
    "Arrows preview · OK applies · Back cancels": "Pilar förhandsvisar · OK tillämpas · Tillbaka avbryter",
    "Automatic": "Automatiskt",
    "Classic": "Klassisk",
    "Classic dark": "Klassisk mörk",
    "Classic light": "Klassisk ljus",
    "Clear": "Soligt",
    "Cloudy": "Mulet",
    "Couldn't open ": "Kunde inte öppna ",
    "Couldn't open TV Settings": "Kunde inte öppna TV-inställningarna",
    "Crypto": "Krypto",
    "Dark": "Mörkt",
    "Dollar": "Dollar",
    "Drizzle": "Duggregn",
    "Explore": "Utforska",
    "Fog": "Dimma",
    "For You": "För dig",
    "HDMI Inputs": "HDMI-ingångar",
    "Heavy Rain": "Kraftigt regn",
    "Home Settings": "Hemskärm",
    "Home wallpaper updated": "Hemskrivbordsbakgrund uppdaterad",
    "Inputs": "Ingångar",
    "Kids": "Barn",
    "Language": "Språk",
    "Light": "Ljust",
    "Live TV": "Live-tv",
    "Mostly Clear": "Mestadels klart",
    "Mostly Sunny": "Mestadels soligt",
    "Movies": "Filmer",
    "News": "Nyheter",
    "No weather data right now.": "Inga väderdata just nu.",
    "OK adds or removes · ← → change the order": "OK lägger till eller tar bort · ← → ändrar ordningen",
    "OK or the arrows change the value.": "OK eller pilarna ändrar värdet.",
    "Off": "Av",
    "On": "På",
    "On · ": "I listen · ",
    "Partly Cloudy": "Växlande molnighet",
    "Quotes widget": "Kurswidget",
    "Rain": "Regn",
    "Sci-Fi & Fantasy": "Sci-fi och fantasy",
    "Series": "Serie",
    "Settings": "Inställningar",
    "Shelf": "Favoritappar",
    "Shortcuts": "Genvägar",
    "Shows": "Serier",
    "Snow": "Snö",
    "Soap": "Såpopera",
    "Sunrise ": "Soluppgång ",
    "Sunset ": "Solnedgång ",
    "TV Settings": "Tv-inställningar",
    "Talk": "Talkshow",
    "Temperature": "Temperatur",
    "Theme": "Tema",
    "Theme: ": "Tema: ",
    "Themes": "Teman",
    "Thunderstorms": "Åska",
    "War & Politics": "Krig och politik",
    "Weather": "Väder",
    "Weather widget": "Väderwidget",
    "home": "hem",
    "now": "nu",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › för att bläddra  ·  OK sätter bakgrund  ·  ↑ eller Tillbaka",
  };

  function swedishText(en) {
    if (Object.prototype.hasOwnProperty.call(swedish, en)) return swedish[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return m[1] + (m[2] === 'min' ? ' min sedan' : ' tim sedan');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' säsong' : ' säsonger');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'H:' + m[1] + m[2] + 'L:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'Listen rymmer upp till ' + m[1] + ' appar.';
    return en;
  }

  var dutch = {
    " · Liftoff by Tom Ballard": " · Liftoff van Tom Ballard",
    "24h change": "verandering in 24 u",
    "Action & Adventure": "Actie en avontuur",
    "All Apps": "Alle apps",
    "Arrows preview · OK applies · Back cancels": "Pijlen bekijken · OK past toe · Terug annuleert",
    "Automatic": "Automatisch",
    "Classic": "Klassiek",
    "Classic dark": "Klassiek donker",
    "Classic light": "Klassiek licht",
    "Clear": "Zonnig",
    "Cloudy": "Bewolkt",
    "Couldn't open ": "Kon niet openen: ",
    "Couldn't open TV Settings": "Kon de tv-instellingen niet openen",
    "Crypto": "Crypto",
    "Dark": "Donker",
    "Dollar": "Dollar",
    "Drizzle": "Motregen",
    "Explore": "Ontdekken",
    "Fog": "Mist",
    "For You": "Voor jou",
    "HDMI Inputs": "HDMI-ingangen",
    "Heavy Rain": "Zware regen",
    "Home Settings": "Startscherm",
    "Home wallpaper updated": "Startachtergrond bijgewerkt",
    "Inputs": "Ingangen",
    "Kids": "Kinderen",
    "Language": "Taal",
    "Light": "Licht",
    "Live TV": "Live tv",
    "Mostly Clear": "Overwegend helder",
    "Mostly Sunny": "Overwegend zonnig",
    "Movies": "Films",
    "News": "Nieuws",
    "No weather data right now.": "Nu geen weergegevens.",
    "OK adds or removes · ← → change the order": "OK voegt toe of verwijdert · ← → wijzigt de volgorde",
    "OK or the arrows change the value.": "OK of de pijlen wijzigen de waarde.",
    "Off": "Uit",
    "On": "Aan",
    "On · ": "In de balk · ",
    "Partly Cloudy": "Half bewolkt",
    "Quotes widget": "Koerswidget",
    "Rain": "Regen",
    "Sci-Fi & Fantasy": "Sci-fi en fantasy",
    "Series": "Serie",
    "Settings": "Instellingen",
    "Shelf": "Favoriete apps",
    "Shortcuts": "Snelkoppelingen",
    "Shows": "Series",
    "Snow": "Sneeuw",
    "Soap": "Soap",
    "Sunrise ": "Zonsopkomst ",
    "Sunset ": "Zonsondergang ",
    "TV Settings": "Tv-instellingen",
    "Talk": "Talkshow",
    "Temperature": "Temperatuur",
    "Theme": "Thema",
    "Theme: ": "Thema: ",
    "Themes": "Thema’s",
    "Thunderstorms": "Onweer",
    "War & Politics": "Oorlog en politiek",
    "Weather": "Weer",
    "Weather widget": "Weerwidget",
    "home": "start",
    "now": "nu",
    "‹ › to browse  ·  OK sets home wallpaper  ·  ↑ or Back": "‹ › om te bladeren  ·  OK zet achtergrond  ·  ↑ of Terug",
  };

  function dutchText(en) {
    if (Object.prototype.hasOwnProperty.call(dutch, en)) return dutch[en];
    var m = /^(\d+) (min|h) ago$/.exec(en);
    if (m) return m[1] + (m[2] === 'min' ? ' min geleden' : ' u geleden');
    m = /^(\d+) seasons?$/.exec(en);
    if (m) return m[1] + (m[1] === '1' ? ' seizoen' : ' seizoenen');
    m = /^H:(\S+)(\s+)L:(\S+)$/.exec(en);
    if (m) return 'H:' + m[1] + m[2] + 'L:' + m[3];
    m = /^The shelf holds up to (\d+) apps\.$/.exec(en);
    if (m) return 'In de balk passen tot ' + m[1] + ' apps.';
    return en;
  }

  function detect(setting) {
    var v = (setting || 'auto').toLowerCase();
    if (v === 'auto') v = (navigator.language || 'en').toLowerCase();
    if (v === 'de-at' || v.indexOf('de-at') === 0) return 'de-AT';
    if (v === 'nl-be' || v.indexOf('nl-be') === 0) return 'nl-BE';
    if (v.indexOf('nl') === 0) return 'nl-BE';
    if (v.indexOf('it') === 0) return 'it';
    if (v.indexOf('fr') === 0) return 'fr';
    if (v.indexOf('da') === 0) return 'da';
    if (v.indexOf('sv') === 0) return 'sv';
    if (v.indexOf('ru') === 0) return 'ru';
    if (v.indexOf('de') === 0) return 'de';
    if (v.indexOf('pt') === 0) return 'pt';
    if (v.indexOf('es') === 0) return 'es';
    return 'en';
  }

  var LANG_DOC = {
    'de-AT': 'de-AT', 'nl-BE': 'nl-BE', nl: 'nl-BE',
    it: 'it', fr: 'fr', da: 'da', sv: 'sv',
    ru: 'ru', de: 'de', es: 'es', en: 'en', pt: 'pt-BR'
  };

  return {
    set: function (setting) {
      lang = detect(setting);
      document.documentElement.lang = LANG_DOC[lang] || lang;
    },
    count: function (n, one, few, many) {
      var last = Math.abs(n % 100);
      return n + ' ' + (last >= 11 && last <= 14 ? many : last % 10 === 1 ? one : last % 10 >= 2 && last % 10 <= 4 ? few : many);
    },
    get lang() { return lang; },
    tr: function (pt, en, es) {
      if (lang === 'ru') return russianText(en);
      if (lang === 'de' || lang === 'de-AT') return germanText(en);
      if (lang === 'it') return italianText(en);
      if (lang === 'fr') return frenchText(en);
      if (lang === 'da') return danishText(en);
      if (lang === 'sv') return swedishText(en);
      if (lang === 'nl-BE' || lang === 'nl') return dutchText(en);
      if (lang === 'es') return (es || en);
      if (lang === 'en') return en;
      return pt;
    },
    /** BCP 47 tag for dates, numbers and TMDB. */
    locale: function () {
      if (lang === 'ru') return 'ru-RU';
      if (lang === 'de-AT') return 'de-AT';
      if (lang === 'de') return 'de-DE';
      if (lang === 'nl-BE') return 'nl-BE';
      if (lang === 'it') return 'it-IT';
      if (lang === 'fr') return 'fr-FR';
      if (lang === 'da') return 'da-DK';
      if (lang === 'sv') return 'sv-SE';
      if (lang === 'es') return 'es-MX';
      if (lang === 'en') return 'en-US';
      return 'pt-BR';
    }
  };
})();

function tr(pt, en, es) {
  return I18N.tr(pt, en, es);
}
