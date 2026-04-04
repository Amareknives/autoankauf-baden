/**
 * Modell-Vorschläge pro Marke
 * Regel: Nur Karosserie-Varianten – keine Motor-/Hubraum-Bezeichnungen.
 * Kraftstoff & Leistung kommen als separate Formularfelder.
 * Performance-Varianten (AMG, M, RS, GTI, R …) immer eigener Eintrag.
 */
export const MODELLE_PRO_MARKE: Record<string, string[]> = {

  // ─── AUDI ──────────────────────────────────────────────────────────────────
  'Audi': [
    'A1 Sportback',
    'A2',
    'A3 Sportback', 'A3 Limousine', 'A3 Cabriolet', 'S3', 'RS3',
    'A4 Limousine', 'A4 Avant (Kombi)', 'A4 Allroad (Kombi)', 'S4', 'RS4 Avant (Kombi)',
    'A5 Coupé', 'A5 Sportback', 'A5 Cabriolet', 'A5 Limousine', 'A5 Avant (Kombi)',
    'S5 Coupé', 'S5 Sportback', 'RS5 Coupé', 'RS5 Sportback',
    'A6 Limousine', 'A6 Avant (Kombi)', 'A6 Allroad (Kombi)', 'S6', 'RS6 Avant (Kombi)',
    'A7 Sportback', 'S7', 'RS7 Sportback',
    'A8', 'A8 L', 'S8',
    'Q2', 'SQ2',
    'Q3', 'Q3 Sportback', 'RS Q3', 'RS Q3 Sportback',
    'Q4 e-tron', 'Q4 Sportback e-tron',
    'Q5', 'Q5 Sportback', 'SQ5', 'RS Q5',
    'Q6 e-tron', 'Q6 Sportback e-tron', 'SQ6 e-tron',
    'Q7', 'SQ7',
    'Q8', 'SQ8', 'RS Q8',
    'Q8 e-tron', 'Q8 Sportback e-tron', 'SQ8 e-tron',
    'TT Coupé', 'TT Roadster', 'TTS', 'TT RS',
    'R8 Coupé', 'R8 Spyder',
    'e-tron GT', 'RS e-tron GT',
    // Klassiker
    'Audi 80', 'Audi 90', 'Audi 100', 'Audi 200', 'Audi V8',
  ],

  // ─── BMW ───────────────────────────────────────────────────────────────────
  'BMW': [
    // 1er
    '1er', 'M135i',
    // 2er – verschiedene Karosserien
    '2er Coupé', '2er Cabriolet', '2er Gran Coupé',
    '2er Active Tourer', '2er Gran Tourer', 'M235i',
    // 3er
    '3er', '3er Touring (Kombi)', '3er Gran Turismo', '3er Coupé', '3er Cabriolet', '3er Compact',
    'M3', 'M3 Touring (Kombi)',
    // 4er
    '4er Coupé', '4er Cabriolet', '4er Gran Coupé', 'M4 Coupé', 'M4 Cabriolet',
    // 5er
    '5er', '5er Touring (Kombi)', '5er Gran Turismo', 'M5',
    // 6er
    '6er Coupé', '6er Cabriolet', '6er Gran Coupé', '6er Gran Turismo',
    'M6 Coupé', 'M6 Cabriolet', 'M6 Gran Coupé',
    // 7er
    '7er', 'M760e',
    // 8er
    '8er Coupé', '8er Cabriolet', '8er Gran Coupé',
    'M8 Coupé', 'M8 Cabriolet', 'M8 Gran Coupé',
    // M-Modelle eigenständig
    'M1', 'M2',
    // X-Reihe
    'X1', 'X2', 'X3', 'X3 M', 'X4', 'X4 M', 'X5', 'X5 M', 'X6', 'X6 M', 'X7', 'XM',
    // Z-Reihe
    'Z1', 'Z3 Roadster', 'Z3 Coupé', 'Z4 Roadster', 'Z8',
    // i / Elektro
    'i3', 'i4', 'i5', 'i5 Touring (Kombi)', 'i7', 'i8', 'iX', 'iX1', 'iX2', 'iX3',
    // Klassiker
    '2002', '02er',
  ],

  // ─── MERCEDES-BENZ ─────────────────────────────────────────────────────────
  'Mercedes-Benz': [
    // A-Klasse
    'A-Klasse', 'A-Klasse Limousine',
    'AMG A 35', 'AMG A 45', 'AMG A 45 S',
    // B-Klasse
    'B-Klasse',
    // C-Klasse – Karosserien
    'C-Klasse', 'C-Klasse T-Modell (Kombi)', 'C-Klasse Coupé', 'C-Klasse Cabrio', 'C-Klasse All-Terrain (Kombi)',
    'AMG C 43', 'AMG C 63', 'AMG C 63 S',
    // E-Klasse – Karosserien
    'E-Klasse', 'E-Klasse T-Modell (Kombi)', 'E-Klasse Coupé', 'E-Klasse Cabrio', 'E-Klasse All-Terrain (Kombi)',
    'AMG E 43', 'AMG E 53', 'AMG E 63', 'AMG E 63 S',
    // S-Klasse
    'S-Klasse', 'S-Klasse Coupé', 'S-Klasse Cabrio', 'Maybach S-Klasse',
    'AMG S 63', 'AMG S 65',
    // CLA / CLS
    'CLA', 'CLA Shooting Brake (Kombi)', 'AMG CLA 35', 'AMG CLA 45',
    'CLS', 'CLS Shooting Brake (Kombi)', 'AMG CLS 53',
    // Kompakt-SUV
    'GLA', 'AMG GLA 35', 'AMG GLA 45',
    'GLB', 'AMG GLB 35',
    'GLC', 'GLC Coupé', 'AMG GLC 43', 'AMG GLC 63',
    'GLE', 'GLE Coupé', 'AMG GLE 53', 'AMG GLE 63',
    'GLS', 'AMG GLS 63',
    // G-Klasse
    'G-Klasse', 'AMG G 63',
    // AMG GT
    'AMG GT Coupé', 'AMG GT Roadster', 'AMG GT 4-Türer Coupé', 'AMG GT 63',
    // SL / SLC / SLK
    'SL (Cabrio)', 'SLC', 'SLK',
    // EQ-Elektro
    'CLE', 'CLE Cabriolet',
    // EQ-Elektro
    'EQA', 'EQB', 'EQC', 'EQE', 'EQE SUV', 'EQS', 'EQS SUV',
    'AMG EQE', 'AMG EQS',
    // V-Klasse / Marco Polo
    'V-Klasse', 'Marco Polo',
    // Nutzfahrzeuge
    'Sprinter', 'Vito', 'Citan',
    // Klassiker (Baureihe)
    'W123 (E-Klasse)', 'W124 (E-Klasse)', 'W126 (S-Klasse)', 'W201 (190)', 'W202 (C-Klasse)',
    'R107 SL', 'R129 SL',
  ],

  // ─── VOLKSWAGEN ────────────────────────────────────────────────────────────
  'Volkswagen | VW': [
    // Golf
    'Golf', 'Golf Variant (Kombi)', 'Golf Sportsvan', 'Golf Alltrack (Kombi)',
    'Golf GTI', 'Golf GTD', 'Golf GTE', 'Golf R', 'e-Golf',
    // Polo
    'Polo', 'Polo GTI',
    // Passat
    'Passat', 'Passat Variant (Kombi)', 'Passat Alltrack (Kombi)', 'Passat GTE',
    // Tiguan
    'Tiguan', 'Tiguan Allspace', 'Tiguan R',
    // T-Roc / T-Cross
    'T-Roc', 'T-Roc R', 'T-Cross',
    // Touareg / Touran
    'Touareg', 'Touran',
    // ID. Reihe
    'ID.3', 'ID.4', 'ID.4 GTX', 'ID.5', 'ID.5 GTX', 'ID.7', 'ID. Buzz',
    // Arteon
    'Arteon', 'Arteon Shooting Brake (Kombi)',
    // Up
    'Up', 'Up GTI', 'e-Up',
    // Nutzfahrzeuge
    'Caddy', 'Caddy Maxi', 'Transporter', 'Transporter Kombi', 'Caravelle',
    'Multivan', 'Crafter', 'Amarok',
    // Klassiker
    'Phaeton', 'CC', 'Scirocco', 'Corrado', 'Eos (Cabrio)', 'Sharan',
    'Jetta', 'Beetle', 'Lupo', 'Fox',
    'Golf Cabrio', 'Golf R32',
    'Golf I', 'Golf II', 'Golf III', 'Golf IV',
  ],

  // ─── OPEL ──────────────────────────────────────────────────────────────────
  'Opel': [
    'Corsa', 'Corsa-e',
    'Astra', 'Astra Sports Tourer (Kombi)', 'Astra-e',
    'Insignia', 'Insignia Sports Tourer (Kombi)', 'Insignia Country Tourer (Kombi)',
    'Mokka', 'Mokka-e',
    'Crossland',
    'Grandland', 'Grandland X',
    'Zafira', 'Zafira Life',
    'Vectra', 'Vectra Caravan (Kombi)',
    'Cascada (Cabrio)',
    'Meriva', 'Agila',
    'Adam', 'Karl',
    'Combo', 'Combo-e Life',
    'Ampera', 'Ampera-e',
    'Movano', 'Vivaro', 'Vivaro-e',
  ],

  // ─── FORD ──────────────────────────────────────────────────────────────────
  'Ford': [
    'Fiesta', 'Fiesta ST',
    'Focus', 'Focus Turnier (Kombi)', 'Focus ST', 'Focus RS',
    'Mondeo', 'Mondeo Turnier (Kombi)',
    'Kuga',
    'Puma', 'Puma ST',
    'EcoSport',
    'Explorer',
    'Mustang', 'Mustang Mach-E',
    'S-Max', 'Galaxy',
    'B-Max', 'C-Max', 'Grand C-Max',
    'Ka', 'Ka+',
    'Edge', 'Ranger', 'Bronco',
    'Transit', 'Transit Custom', 'Transit Connect',
  ],

  // ─── TOYOTA ────────────────────────────────────────────────────────────────
  'Toyota': [
    'Aygo', 'Aygo X',
    'Yaris', 'Yaris Cross', 'GR Yaris',
    'Corolla', 'Corolla Touring Sports (Kombi)',
    'C-HR',
    'Camry',
    'RAV4', 'RAV4 Plug-in',
    'Highlander',
    'Land Cruiser', 'Land Cruiser 300',
    'Prius', 'Prius+',
    'Auris', 'Auris Touring Sports (Kombi)',
    'Avensis', 'Avensis Touring Sports (Kombi)',
    'Proace', 'Proace City', 'Proace Verso',
    'bZ4X',
    'GR86', 'GR Supra',
    'Hilux', 'Tundra',
    // Klassiker
    'Celica', 'MR2', 'Mirai',
  ],

  // ─── HONDA ─────────────────────────────────────────────────────────────────
  'Honda': [
    'Jazz', 'Jazz e:HEV',
    'Civic', 'Civic Type R',
    'CR-V', 'CR-V e:PHEV',
    'HR-V',
    'ZR-V',
    'Accord',
    'e', 'e:Ny1',
    'FR-V', 'CR-Z', 'Insight', 'Stream',
    'Legend',
  ],

  // ─── HYUNDAI ───────────────────────────────────────────────────────────────
  'Hyundai': [
    'i10',
    'i20', 'i20 N',
    'i30', 'i30 Fastback', 'i30 N', 'i30 N Fastback',
    'i40', 'i40 Kombi',
    'Elantra', 'Elantra N',
    'Sonata',
    'Veloster', 'Veloster N',
    'Bayon',
    'Tucson',
    'Santa Fe',
    'Kona', 'Kona Electric',
    'Ioniq', 'Ioniq 5', 'Ioniq 6',
    'Nexo',
    'ix20', 'ix35', 'ix55',
    'Staria',
  ],

  // ─── KIA ───────────────────────────────────────────────────────────────────
  'Kia': [
    'Picanto',
    'Rio',
    'Ceed', 'Ceed Sportswagon (Kombi)', 'ProCeed',
    'Stinger',
    'Niro', 'Niro EV', 'Niro Plug-in',
    'Sportage',
    'Sorento', 'Sorento Plug-in',
    'Stonic', 'XCeed', 'Seltos',
    'Optima', 'Optima Sportswagon (Kombi)',
    'EV3', 'EV6', 'EV9',
    'Carnival', 'Soul',
  ],

  // ─── SKODA ─────────────────────────────────────────────────────────────────
  'Skoda': [
    'Fabia', 'Fabia Combi (Kombi)',
    'Scala',
    'Octavia', 'Octavia Combi (Kombi)', 'Octavia RS',
    'Superb', 'Superb Combi (Kombi)',
    'Kamiq', 'Karoq', 'Kodiaq',
    'Enyaq', 'Enyaq Coupé',
    'Rapid', 'Yeti',
    'Citigo', 'Citigo-e',
  ],

  // ─── SEAT ──────────────────────────────────────────────────────────────────
  'Seat': [
    'Ibiza',
    'Leon', 'Leon ST (Kombi)', 'Leon Sportstourer (Kombi)',
    'Arona', 'Ateca', 'Tarraco',
    'Alhambra',
    'Toledo', 'Exeo',
    'Mii', 'Mii electric',
  ],

  // ─── RENAULT ───────────────────────────────────────────────────────────────
  'Renault': [
    'Twingo', 'Twingo Electric',
    'Zoe',
    'Clio', 'Clio Grandtour (Kombi)',
    'Megane', 'Megane Grandtour (Kombi)', 'Megane E-Tech',
    'Scenic E-Tech', 'Grand Scenic',
    'Laguna', 'Laguna Grandtour (Kombi)',
    'Talisman', 'Talisman Grandtour (Kombi)',
    'Austral',
    'Kadjar', 'Captur', 'Koleos', 'Arkana',
    'Espace',
    'Kangoo', 'Kangoo E-Tech',
    'Renault 5 E-Tech',
    'Sandero', 'Sandero Stepway',
  ],

  // ─── PEUGEOT ───────────────────────────────────────────────────────────────
  'Peugeot': [
    '107', '108',
    '205', '206', '207',
    '208', 'e-208',
    '301', '306', '307', '308', '308 SW (Kombi)',
    '406', '407', '408',
    '508', '508 SW (Kombi)',
    '2008', 'e-2008',
    '3008', 'e-3008',
    '5008', 'e-5008',
    'Rifter', 'Partner', 'Expert', 'Traveller',
    'RCZ',
  ],

  // ─── CITROËN ───────────────────────────────────────────────────────────────
  'Citroën': [
    'C1', 'C2', 'C3', 'C3 Aircross', 'ë-C3',
    'C4', 'C4 Cactus', 'C4 Spacetourer', 'ë-C4',
    'C5', 'C5 Aircross', 'C5 X',
    'C6', 'C8',
    'Berlingo', 'ë-Berlingo',
    'Jumpy', 'Spacetourer',
    'Xsara', 'Xsara Picasso', 'Saxo',
  ],

  // ─── FIAT ──────────────────────────────────────────────────────────────────
  'Fiat': [
    '500', '500C', '500X', '500L', '500e',
    '500 Abarth',
    'Punto', 'Grande Punto', 'Punto Evo', 'Abarth 595', 'Abarth 695',
    'Tipo', 'Tipo SW (Kombi)',
    'Bravo', 'Brava', 'Stilo',
    'Panda', 'Panda Cross',
    'Doblo', 'Fiorino',
    'Freemont',
    'Ducato',
    '124 Spider',
  ],

  // ─── NISSAN ────────────────────────────────────────────────────────────────
  'Nissan': [
    'Micra',
    'Note',
    'Juke', 'Juke Hybrid',
    'Qashqai', 'Qashqai e-Power',
    'X-Trail', 'X-Trail e-Power',
    'Murano',
    'Leaf', 'Ariya',
    '350Z', '370Z', 'Z',
    'GT-R',
    'Navara',
    'Pathfinder',
    'Primera', 'Almera', 'Pulsar',
    'NV200', 'NV400',
  ],

  // ─── MAZDA ─────────────────────────────────────────────────────────────────
  'Mazda': [
    'Mazda2', 'Mazda3', 'Mazda3 Fastback', 'Mazda5', 'Mazda6', 'Mazda6 Kombi',
    'CX-3', 'CX-30', 'CX-5', 'CX-7', 'CX-60', 'CX-80', 'CX-90',
    'MX-5 (Cabrio)', 'MX-30',
    'RX-7', 'RX-8',
    // Klassiker
    '323', '323 Kombi', '626', '626 Kombi',
  ],

  // ─── MITSUBISHI ────────────────────────────────────────────────────────────
  'Mitsubishi': [
    'Colt',
    'Lancer', 'Lancer Sportback',
    'Eclipse Cross',
    'ASX', 'RVR',
    'Outlander', 'Outlander PHEV',
    'Pajero', 'Pajero Sport',
    'L200',
    'Galant', 'Space Star', 'Space Wagon',
    'i-MiEV',
  ],

  // ─── DACIA ─────────────────────────────────────────────────────────────────
  'Dacia': [
    'Sandero', 'Sandero Stepway',
    'Logan', 'Logan MCV (Kombi)',
    'Duster',
    'Spring',
    'Jogger',
    'Bigster',
    'Lodgy', 'Dokker',
  ],

  // ─── VOLVO ─────────────────────────────────────────────────────────────────
  'Volvo': [
    'S40', 'S60', 'S80', 'S90',
    'V40 (Kombi)', 'V40 Cross Country (Kombi)',
    'V50 (Kombi)', 'V60 (Kombi)', 'V60 Cross Country (Kombi)',
    'V70 (Kombi)', 'V90 (Kombi)', 'V90 Cross Country (Kombi)',
    'XC40', 'XC40 Recharge',
    'XC60', 'XC60 Recharge',
    'XC70', 'XC90', 'XC90 Recharge',
    'C30', 'C40 Recharge', 'C70 (Cabrio)',
    'EX30', 'EX40', 'EX90',
  ],

  // ─── MINI ──────────────────────────────────────────────────────────────────
  'Mini': [
    'Mini 3-Türer', 'Mini 5-Türer', 'Mini Cabrio',
    'Mini Clubman', 'Mini Countryman', 'Mini Paceman', 'Mini Coupé', 'Mini Roadster',
    'Cooper', 'Cooper S', 'Cooper SE',
    'John Cooper Works',
    'Aceman',
  ],

  // ─── ALFA ROMEO ────────────────────────────────────────────────────────────
  'Alfa Romeo': [
    'Giulia', 'Giulia Quadrifoglio',
    'Giulietta',
    'Stelvio', 'Stelvio Quadrifoglio',
    'Tonale',
    'Junior',
    '147', '156', '156 Sportwagon (Kombi)', '159', '159 Sportwagon (Kombi)',
    'Brera', 'Spider', 'GTV', 'MiTo', '4C',
    // Klassiker
    '164', '75 (Milano)',
  ],

  // ─── PORSCHE ───────────────────────────────────────────────────────────────
  'Porsche': [
    '911 Carrera', '911 Targa', '911 Cabriolet', '911 Turbo', '911 GT3', '911 GT3 RS', '911 R', '911 Sport Classic',
    '718 Boxster', '718 Boxster GTS', '718 Boxster Spyder',
    '718 Cayman', '718 Cayman GTS', '718 Cayman GT4', '718 Spyder',
    'Boxster', 'Cayman',
    // Klassiker
    '924', '928', '944', '944 Cabrio', '968',
    '918 Spyder',
    'Cayenne', 'Cayenne Coupé', 'Cayenne GTS', 'Cayenne Turbo',
    'Macan', 'Macan GTS', 'Macan Electric',
    'Panamera', 'Panamera Sport Turismo (Kombi)', 'Panamera 4S', 'Panamera Turbo',
    'Taycan', 'Taycan Cross Turismo (Kombi)', 'Taycan Sport Turismo (Kombi)',
  ],

  // ─── LAND ROVER ────────────────────────────────────────────────────────────
  'Land Rover': [
    'Defender 90', 'Defender 110', 'Defender 130',
    'Discovery', 'Discovery 3', 'Discovery 4', 'Discovery Sport',
    'Freelander', 'Freelander 2',
    'Range Rover', 'Range Rover Long Wheelbase',
    'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar',
  ],

  // ─── JAGUAR ────────────────────────────────────────────────────────────────
  'Jaguar': [
    'X-Type', 'X-Type Estate (Kombi)',
    'S-Type',
    'XE', 'XF', 'XF Sportbrake (Kombi)', 'XJ',
    'E-Pace', 'F-Pace', 'I-Pace',
    'F-Type Coupé', 'F-Type Cabriolet',
    'XK', 'XK Cabriolet',
  ],

  // ─── LEXUS ─────────────────────────────────────────────────────────────────
  'Lexus': [
    'CT', 'IS', 'ES', 'GS', 'LS',
    'NX', 'NX Plug-in', 'RX', 'RX Plug-in', 'UX',
    'LC', 'LC Cabrio', 'RC',
    'LBX', 'RZ',
  ],

  // ─── TESLA ─────────────────────────────────────────────────────────────────
  'Tesla': [
    'Model 3', 'Model S', 'Model X', 'Model Y',
    'Cybertruck', 'Roadster',
  ],

  // ─── POLESTAR ──────────────────────────────────────────────────────────────
  'Polestar': [
    'Polestar 1', 'Polestar 2', 'Polestar 3', 'Polestar 4',
  ],

  // ─── BYD ───────────────────────────────────────────────────────────────────
  'BYD': [
    'Atto 3', 'Dolphin', 'Seal', 'Seal U',
    'Han', 'Tang', 'Sea Lion 6',
  ],

  // ─── MG ────────────────────────────────────────────────────────────────────
  'MG': [
    'MG3', 'MG4', 'MG5', 'MG ZS', 'MG ZS EV', 'MG HS', 'MG HS Plug-in',
    'Marvel R', 'Cyberster',
  ],

  // ─── SMART ─────────────────────────────────────────────────────────────────
  'Smart': [
    'Fortwo', 'Fortwo Cabrio', 'Fortwo EQ',
    'Forfour', 'Forfour EQ',
    '#1', '#3',
  ],

  // ─── CUPRA ─────────────────────────────────────────────────────────────────
  'Cupra': [
    'Leon', 'Leon Sportstourer (Kombi)',
    'Ateca',
    'Formentor',
    'Born', 'Terramar',
    'Tavascan',
  ],

  // ─── DS AUTOMOBILES ────────────────────────────────────────────────────────
  'DS Automobiles': [
    'DS 3', 'DS 3 E-Tense',
    'DS 4', 'DS 4 E-Tense',
    'DS 5',
    'DS 7', 'DS 7 E-Tense',
    'DS 9',
  ],

  // ─── SUBARU ────────────────────────────────────────────────────────────────
  'Subaru': [
    'Impreza', 'Impreza STI',
    'WRX', 'WRX STI',
    'Legacy', 'Legacy Outback',
    'Forester', 'XV', 'Crosstrek', 'Outback',
    'BRZ', 'Levorg', 'Solterra',
  ],

  // ─── SUZUKI ────────────────────────────────────────────────────────────────
  'Suzuki': [
    'Swift', 'Swift Sport',
    'Baleno', 'Celerio', 'Ignis', 'Alto', 'Splash',
    'Vitara', 'Grand Vitara',
    'SX4', 'SX4 S-Cross',
    'Jimny', 'Across',
  ],

  // ─── JEEP ──────────────────────────────────────────────────────────────────
  'Jeep': [
    'Avenger', 'Renegade',
    'Compass', 'Patriot', 'Commander',
    'Cherokee', 'Grand Cherokee', 'Grand Cherokee 4xe',
    'Wrangler', 'Wrangler Unlimited',
    'Gladiator',
  ],

  // ─── SAAB ──────────────────────────────────────────────────────────────────
  'Saab': [
    '900', '900 Cabrio',
    '9000',
    '9-3', '9-3 Cabriolet', '9-3 SportCombi',
    '9-5', '9-5 SportCombi',
    '9-7X',
  ],

  // ─── GENESIS ───────────────────────────────────────────────────────────────
  'Genesis': [
    'G70', 'G80', 'G90',
    'GV60', 'GV70', 'GV80',
  ],

  // ─── INFINITI ──────────────────────────────────────────────────────────────
  'Infiniti': [
    'Q30', 'Q50', 'Q60', 'Q70',
    'QX30', 'QX50', 'QX60', 'QX70', 'QX80',
    'FX', 'EX',
  ],

  // ─── ROLLS-ROYCE ───────────────────────────────────────────────────────────
  'Rolls-Royce': [
    'Ghost', 'Ghost Extended',
    'Phantom', 'Phantom Extended',
    'Wraith', 'Dawn',
    'Cullinan', 'Spectre',
  ],

  // ─── BENTLEY ───────────────────────────────────────────────────────────────
  'Bentley': [
    'Continental GT', 'Continental GTC', 'Continental Flying Spur',
    'Flying Spur', 'Bentayga', 'Mulsanne',
  ],

  // ─── MASERATI ──────────────────────────────────────────────────────────────
  'Maserati': [
    'Ghibli', 'Quattroporte', 'Levante',
    'Grecale', 'GranTurismo', 'GranCabrio', 'MC20',
  ],

  // ─── FERRARI ───────────────────────────────────────────────────────────────
  'Ferrari': [
    '458 Italia', '458 Spider', '458 Speciale',
    '488 GTB', '488 Spider', '488 Pista',
    'F8 Tributo', 'F8 Spider',
    'Roma', 'Roma Spider',
    'Portofino', 'Portofino M',
    'SF90 Stradale', 'SF90 Spider',
    '812 Superfast', '812 GTS',
    'Purosangue',
    'California', 'California T',
  ],

  // ─── LAMBORGHINI ───────────────────────────────────────────────────────────
  'Lamborghini': [
    'Huracán', 'Huracán Spyder', 'Huracán Sterrato',
    'Urus', 'Urus Performante',
    'Revuelto',
  ],

  // ─── ASTON MARTIN ──────────────────────────────────────────────────────────
  'Aston Martin': [
    'Vantage', 'Vantage Roadster',
    'DB9', 'DB11', 'DB12',
    'DBS', 'DBS Superleggera',
    'DBX', 'DBX707',
  ],

  // ─── ALPINE ────────────────────────────────────────────────────────────────
  'Alpine': [
    'A110', 'A110 GT', 'A110 R',
    'A290',
  ],

  // ─── CHEVROLET ─────────────────────────────────────────────────────────────
  'Chevrolet': [
    'Aveo', 'Cruze', 'Cruze SW',
    'Camaro', 'Corvette',
    'Captiva', 'Trax', 'Blazer', 'Equinox',
    'Tahoe', 'Suburban', 'Silverado',
    'Spark',
  ],

  // ─── CHRYSLER / DODGE ──────────────────────────────────────────────────────
  'Chrysler': [
    '300C', 'PT Cruiser', 'Voyager', 'Pacifica', 'Sebring',
  ],

  'Dodge': [
    'Challenger', 'Charger', 'Viper',
    'Durango', 'Journey', 'Ram 1500',
  ],

  // ─── LANCIA ────────────────────────────────────────────────────────────────
  'Lancia': [
    'Ypsilon', 'Delta', 'Musa', 'Phedra', 'Voyager',
  ],

  // ─── KGM (ehemals SsangYong) ───────────────────────────────────────────────
  'KGM': [
    'Tivoli', 'Korando', 'Musso', 'Rexton', 'Torres', 'Actyon',
  ],

  'SsangYong': [
    'Tivoli', 'Korando', 'Musso', 'Rexton', 'Rodius', 'Actyon',
  ],

  // ─── ISUZU ─────────────────────────────────────────────────────────────────
  'Isuzu': [
    'D-Max', 'Trooper', 'Rodeo',
  ],

  // ─── IVECO ─────────────────────────────────────────────────────────────────
  'Iveco': [
    'Daily', 'Daily Kastenwagen', 'Daily Kombi',
  ],

  // ─── MAXUS ─────────────────────────────────────────────────────────────────
  'Maxus': [
    'Deliver 9', 'EV80', 'T90 EV', 'Mifa 9',
  ],

  // ─── LYNK & CO ─────────────────────────────────────────────────────────────
  'Lynk & Co': [
    '01', '02', '03',
  ],

  // ─── NIO ───────────────────────────────────────────────────────────────────
  'Nio': [
    'ET5', 'ET5 Touring (Kombi)', 'ET7',
    'ES6', 'ES7', 'ES8',
    'EC6', 'EL6',
  ],

  // ─── XPENG ─────────────────────────────────────────────────────────────────
  'Xpeng': [
    'G3', 'G6', 'G9',
    'P5', 'P7',
  ],

  // ─── SONSTIGE ──────────────────────────────────────────────────────────────
  'Sonstige': [],
}
