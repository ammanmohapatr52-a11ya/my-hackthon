/**
 * Comprehensive Dataset for ALL 28 Indian States and 8 Union Territories
 * Covers official State Symbols (Bird, Animal, Flower, Tree),
 * Comprehensive Tourist Locations with Authentic Imagery,
 * Best Time to Visit, Highlights, Nearest Transit,
 * Culture, Rivers, Foods, and Multilingual Names.
 */

export interface StateFamousPlace {
  name: string;
  hindiName?: string;
  category: 'UNESCO Heritage' | 'Historical Monument' | 'Natural Wonder' | 'Spiritual Shrine' | 'Hill Station' | 'Beach' | 'Wildlife Safari' | 'Fort & Palace' | 'Scenic Wonder';
  description: string;
  imageUrl: string;
  bestTimeToVisit?: string;
  highlights?: string[];
  nearestCity?: string;
  entryFee?: string;
}

export interface StateSymbols {
  bird: { name: string; hindiName?: string; description: string; imageUrl: string };
  animal: { name: string; hindiName?: string; description: string; imageUrl: string };
  flower: { name: string; hindiName?: string; imageUrl: string };
  tree: { name: string; hindiName?: string; imageUrl: string };
}

export interface IndiaStateData {
  id: string;
  name: string;
  hindiName: string;
  odiaName: string;
  capital: string;
  zone: 'East' | 'West' | 'North' | 'South' | 'Central' | 'North-East' | 'UT';
  formationYear: string;
  officialLanguages: string[];
  areaKm2: string;
  population: string;
  literacyRate: string;
  tagline: string;
  symbols: StateSymbols;
  famousPlaces: StateFamousPlace[];
  majorRivers: string[];
  famousFood: string[];
  famousFestivals: string[];
  classicalDance: string;
  coordinates: { x: number; y: number };
}

export const INDIA_STATES: IndiaStateData[] = [
  {
    "id": "odisha",
    "name": "Odisha",
    "hindiName": "ओडिशा",
    "odiaName": "ଓଡ଼ିଶା",
    "capital": "Bhubaneswar",
    "zone": "East",
    "formationYear": "1 April 1936 (Utkala Dibasa)",
    "officialLanguages": [
      "Odia",
      "English"
    ],
    "areaKm2": "155,707 km²",
    "population": "47 Million",
    "literacyRate": "73.5%",
    "tagline": "India's Best Kept Secret · Land of Lord Jagannath",
    "coordinates": {
      "x": 58,
      "y": 55
    },
    "symbols": {
      "bird": {
        "name": "Indian Roller (Blue Jay)",
        "hindiName": "नीलकंठ",
        "description": "Sacred bird with vibrant turquoise blue plumage seen during Dussehra.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Sambar Deer",
        "hindiName": "सांभर हिरण",
        "description": "Large majestic deer with massive antlers native to Similipal and Satkosia forests.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Ashoka Flower",
        "hindiName": "अशोक पुष्प",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Sacred Fig (Peepal)",
        "hindiName": "पीपल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Konark Sun Temple",
        "hindiName": "कोणार्क सूर्य मंदिर",
        "category": "UNESCO Heritage",
        "description": "13th-century monumental Black Pagoda designed as the celestial chariot of Surya with 24 carved stone wheels and 7 horses, showcasing sublime Kalinga stone sculpture.",
        "imageUrl": "https://images.unsplash.com/photo-1626279930777-628e9999e037?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "24 Sun Chariot Wheels",
          "Natya Mandap Carvings",
          "Konark Dance Festival in Dec",
          "Light & Sound Show"
        ],
        "nearestCity": "Puri (35 km) / Bhubaneswar (65 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Jagannath Temple Puri",
        "hindiName": "जगन्नाथ मंदिर पुरी",
        "category": "Spiritual Shrine",
        "description": "Sacred Char Dham epicenter dedicated to Lord Jagannath, Balabhadra and Subhadra. Renowned for the world-famous Ratha Yatra, mysterious flag fluttering against the wind, and the world's largest open-fire temple kitchen (Mahaprasad).",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & June/July (Ratha Yatra)",
        "highlights": [
          "World's Largest Temple Kitchen (Ananda Bazar)",
          "Mysterious Neela Chakra & Flag",
          "World Famous Ratha Yatra",
          "Sacred Golden Beach Promenade"
        ],
        "nearestCity": "Puri (City Center) / Bhubaneswar (60 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Chilika Lake & Satapada",
        "hindiName": "चिल्लिका झील एवं सतपड़ा",
        "category": "Scenic Wonder",
        "description": "Asia's largest brackish water lagoon, home to rare Irrawaddy dolphins at Satapada, millions of winter migratory birds at Nalabana Bird Sanctuary, and serene Kalijai Island temple.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February",
        "highlights": [
          "Irrawaddy Dolphin Boat Safaris",
          "Nalabana Migratory Bird Island",
          "Kalijai Temple in Mid-Lake",
          "Fresh Crab & Prawn Delicacies"
        ],
        "nearestCity": "Satapada / Puri (50 km)",
        "entryFee": "Boating ₹1,200 - ₹2,500 per boat"
      },
      {
        "name": "Lingaraj Temple & Dhauli Shanti Stupa, Bhubaneswar",
        "hindiName": "लिंगराज मंदिर एवं धौली शांति स्तूप",
        "category": "Spiritual Shrine",
        "description": "11th-century soaring 180-foot deula of Harihara representing the pinnacle of Kalinga architecture in the 'Temple City', paired with Dhauli hill where Emperor Ashoka renounced war after the Kalinga war.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "11th Century Kalinga Tower",
          "Ashokan Rock Edicts at Dhauli",
          "White Japanese Peace Pagoda",
          "Bindusagar Sacred Lake"
        ],
        "nearestCity": "Bhubaneswar (City Center)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Similipal National Park & Tiger Reserve",
        "hindiName": "सिमिलिपाल राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "Massive UNESCO Biosphere Reserve in Mayurbhanj featuring dense sal forests, royal Bengal tigers, unique melanistic black tigers, Asian elephants, and the breathtaking Barehipani (399m) and Joranda waterfalls.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to April",
        "highlights": [
          "Barehipani & Joranda Waterfalls",
          "Melanistic Black Tigers",
          "Elephant Safari & Dense Sal Forests",
          "Chahala Wildlife Watchtower"
        ],
        "nearestCity": "Baripada (30 km) / Balasore (85 km)",
        "entryFee": "₹100 per person + Safari charges"
      },
      {
        "name": "Udayagiri & Khandagiri Caves",
        "hindiName": "उदयगिरि एवं खंडगिरि गुफाएं",
        "category": "Historical Monument",
        "description": "Ancient 2nd-century BCE rock-cut residential cave complexes built by Mahameghavahana King Kharavela for Jain monks, featuring the famous Hathigumpha inscription and Rani Gumpha double-storey monastery.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Hathigumpha 17-line Brahmi Inscription",
          "Rani Gumpha Multi-level Carvings",
          "Panoramic View of Bhubaneswar",
          "Ancient Jain Tirthankara Sculptures"
        ],
        "nearestCity": "Bhubaneswar (6 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Chandrabhaga & Puri Golden Beach",
        "hindiName": "चंद्रभागा एवं पुरी गोल्डन बीच",
        "category": "Beach",
        "description": "Blue Flag eco-label certified pristine golden sand beaches with crystal waters, vibrant sunrise viewpoints, lighthouse, and evening cultural sand art exhibitions by Padma Shri Sudarsan Pattnaik.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Blue Flag Certified Clean Beach",
          "International Sand Art Festival",
          "Sunrise over Bay of Bengal",
          "Surfing & Jet Skiing"
        ],
        "nearestCity": "Puri & Konark (3 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Mahanadi",
      "Brahmani",
      "Baitarani",
      "Rushikulya",
      "Subarnarekha"
    ],
    "famousFood": [
      "Pakhala Bhata",
      "Chhena Poda (Cheese Dessert)",
      "Rasagola (GI Tag)",
      "Dalma",
      "Macha Besara"
    ],
    "famousFestivals": [
      "Ratha Yatra Puri",
      "Raja Parba",
      "Nuakhai",
      "Konark Dance Festival",
      "Boita Bandana"
    ],
    "classicalDance": "Odissi (Ancient classical dance depicting Geeta Govinda)"
  },
  {
    "id": "maharashtra",
    "name": "Maharashtra",
    "hindiName": "महाराष्ट्र",
    "odiaName": "ମହାରାଷ୍ଟ୍ର",
    "capital": "Mumbai (Financial Capital)",
    "zone": "West",
    "formationYear": "1 May 1960",
    "officialLanguages": [
      "Marathi"
    ],
    "areaKm2": "307,713 km²",
    "population": "126 Million",
    "literacyRate": "82.3%",
    "tagline": "Unlimited Maharashtra · Land of Chhatrapati Shivaji Maharaj",
    "coordinates": {
      "x": 36,
      "y": 58
    },
    "symbols": {
      "bird": {
        "name": "Yellow-footed Green Pigeon (Hariyal)",
        "hindiName": "हरियाल",
        "description": "Arboreal fruit-eating pigeon that rarely sets foot on the ground.",
        "imageUrl": "https://images.unsplash.com/photo-1522926197415-e5a9a34f11ec?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Indian Giant Squirrel (Shekru)",
        "hindiName": "शेकरू (विशाल गिलहरी)",
        "description": "Tree-dwelling giant rodent with two-tone coat found in Bhimashankar wildlife sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1507666405895-422efe7d0096?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Pride of India (Jarul)",
        "hindiName": "जारुल पुष्प",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Mango Tree",
        "hindiName": "आम का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Gateway of India & Marine Drive, Mumbai",
        "hindiName": "गेटवे ऑफ इंडिया एवं मरीन ड्राइव, मुंबई",
        "category": "Historical Monument",
        "description": "1924 basalt ceremonial arch overlooking Mumbai Harbour facing the historic Taj Mahal Palace Hotel, leading to Marine Drive's sweeping 3.6-kilometer 'Queen's Necklace' promenade.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Iconic British Raj Arch of 1924",
          "Queen's Necklace Sunset Promenade",
          "Ferry Ride to Elephanta Island Caves",
          "Colaba Causeway Shopping & Street Food"
        ],
        "nearestCity": "Mumbai (South Mumbai)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Ajanta & Ellora Caves, Chhatrapati Sambhaji Nagar",
        "hindiName": "अजंता एवं एलोरा गुफाएं",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage monumental rock-cut cave monuments spanning 2nd-century BCE to 10th-century CE, highlighted by Ellora's monolithic Kailash Temple carved top-down from a single basalt cliff.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Monolithic Kailash Temple (Cave 16)",
          "Ajanta Buddhist Fresco Paintings",
          "34 Monasteries & Temples in Ellora",
          "Daulatabad Fort & Bibi Ka Maqbara nearby"
        ],
        "nearestCity": "Chhatrapati Sambhaji Nagar (Aurangabad: 30 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Mahabaleshwar & Panchgani",
        "hindiName": "महाबलेश्वर एवं पांचगणी",
        "category": "Hill Station",
        "description": "Sahyadri Western Ghats mountain paradise perched at 1,353 meters, famed as India's strawberry capital with breathtaking viewpoints like Arthur's Seat, Venna Lake, and Table Land plateau.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to June",
        "highlights": [
          "Fresh Strawberry Farm Tours",
          "Arthur's Seat 'Queen of Points'",
          "Venna Lake Boating & Horse Riding",
          "Panchgani Asia's 2nd Largest Tableland"
        ],
        "nearestCity": "Mahabaleshwar / Pune (120 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Shirdi Sai Baba Temple",
        "hindiName": "शिर्डी साईं बाबा मंदिर",
        "category": "Spiritual Shrine",
        "description": "One of India's most visited spiritual centers dedicated to 19th-century saint Sai Baba, encompassing the Samadhi Mandir, Dwarkamai mosque where he lived, and the sacred sacred fire Dhuni.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (Winter preferred)",
        "highlights": [
          "Sai Baba Gold-Embossed Samadhi",
          "Dwarkamai & Eternal Dhuni Fire",
          "Gurusthan Neem Tree",
          "World's Largest Solar Steam Kitchen"
        ],
        "nearestCity": "Shirdi (City Center) / Nashik (85 km)",
        "entryFee": "Free Entry (VIP Darshan ₹200)"
      },
      {
        "name": "Lonavala, Khandala & Karla Caves",
        "hindiName": "लोनावला, खंडाला एवं कार्ले गुफाएं",
        "category": "Hill Station",
        "description": "Scenic Western Ghats monsoon retreat famous for misty waterfalls, Tiger's Leap cliff, Bhushi Dam, sweet chikki fudge, and the 2nd-century BCE Karla Buddhist rock-cut Chaitya hall.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "July to February (Monsoon & Winter)",
        "highlights": [
          "Tiger's Point & Lion's Point Gorges",
          "Karla & Bhaja Ancient Caves",
          "Bhushi Dam Monsoon Cascades",
          "Famous Maganlal Lonavala Chikki"
        ],
        "nearestCity": "Lonavala / Pune (65 km) / Mumbai (85 km)",
        "entryFee": "Free Entry (Caves ₹25)"
      },
      {
        "name": "Tadoba-Andhari Tiger Reserve, Chandrapur",
        "hindiName": "ताडोबा-अंधारी बाघ अभयारण्य",
        "category": "Wildlife Safari",
        "description": "Maharashtra's oldest and largest national park, renowned globally for the highest tiger density in India, thriving leopard population, and open teak forest safaris around Tadoba Lake.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to June (Peak sightings Mar-May)",
        "highlights": [
          "High Frequency Royal Bengal Tiger Sightings",
          "Moharli, Kolara & Navegaon Safari Gates",
          "Tadoba Lake Mugger Crocodiles",
          "Sloth Bears & Indian Wild Dogs (Dhole)"
        ],
        "nearestCity": "Chandrapur (45 km) / Nagpur (140 km)",
        "entryFee": "Safari Gypsy ₹3,500 - ₹5,000"
      },
      {
        "name": "Raigad Fort & Shivneri Fort",
        "hindiName": "रायगढ़ किला एवं शिवनेरी किला",
        "category": "Fort & Palace",
        "description": "Historic hill capital of the Maratha Empire where Chhatrapati Shivaji Maharaj was crowned in 1674 at 2,700 ft, coupled with Shivneri Fort where Shivaji Maharaj was born in 1630.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "July to February",
        "highlights": [
          "Maha Darwaja & Takmak Tok Precipice",
          "Shivaji Maharaj Coronation Throne",
          "Raigad Ropeway Cable Car",
          "Birthplace Shrine at Shivneri"
        ],
        "nearestCity": "Mahad (25 km) / Pune (120 km)",
        "entryFee": "₹25 (Indians) / Ropeway ₹350"
      }
    ],
    "majorRivers": [
      "Godavari",
      "Krishna",
      "Tapi",
      "Bhima",
      "Narmada"
    ],
    "famousFood": [
      "Vada Pav",
      "Pav Bhaji",
      "Misal Pav",
      "Puran Poli",
      "Modak",
      "Kanda Poha"
    ],
    "famousFestivals": [
      "Ganesh Chaturthi",
      "Gudi Padwa",
      "Shivaji Jayanti",
      "Banganga Music Festival"
    ],
    "classicalDance": "Lavani & Koli Folk Dance"
  },
  {
    "id": "rajasthan",
    "name": "Rajasthan",
    "hindiName": "राजस्थान",
    "odiaName": "ରାଜସ୍ଥାନ",
    "capital": "Jaipur (The Pink City)",
    "zone": "West",
    "formationYear": "30 March 1949",
    "officialLanguages": [
      "Hindi",
      "Rajasthani"
    ],
    "areaKm2": "342,239 km² (India's Largest State)",
    "population": "81 Million",
    "literacyRate": "69.7%",
    "tagline": "The Incredible State of India · Padharo Mhare Desh",
    "coordinates": {
      "x": 28,
      "y": 38
    },
    "symbols": {
      "bird": {
        "name": "Great Indian Bustard (Godawan)",
        "hindiName": "गोडावण",
        "description": "Critically endangered majestic grassland bird with black crown and long neck.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Chinkara & Dromedary Camel",
        "hindiName": "चिंकारा व ऊंट",
        "description": "Indian gazelle and camel representing Thar Desert endurance.",
        "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Rohida (Tecomella)",
        "hindiName": "रोहिड़ा का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Khejri Tree (Prosopis cineraria)",
        "hindiName": "खेजड़ी का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Hawa Mahal & City Palace, Jaipur",
        "hindiName": "हवा महल एवं सिटी पैलेस, जयपुर",
        "category": "UNESCO Heritage",
        "description": "1799 pink sandstone Palace of Winds featuring 953 honeycombed jharokha windows allowing royal women to watch street festivals without being seen, adjacent to the Maharaja's majestic City Palace.",
        "imageUrl": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "953 Ornate Honeycomb Windows",
          "Chandra Mahal & Peacock Courtyard",
          "World's Largest Silver Vessels",
          "Jantar Mantar UNESCO Observatory next door"
        ],
        "nearestCity": "Jaipur (Pink City Center)",
        "entryFee": "₹50 (Indians) / ₹200 (Foreigners)"
      },
      {
        "name": "Amber Fort & Maota Lake, Jaipur",
        "hindiName": "आमेर किला, जयपुर",
        "category": "UNESCO Heritage",
        "description": "Hilltop UNESCO Rajput-Mughal fortress made of yellow and pink sandstone, celebrated for the dazzling Sheesh Mahal (Mirror Palace) where a single candle illuminates the entire ceiling.",
        "imageUrl": "https://images.unsplash.com/photo-1603288967566-41f235e12f0e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Sheesh Mahal (Palace of Mirrors)",
          "Elephant & Jeep Ascent to Sun Gate",
          "Evening Light & Sound Show",
          "Reflection in Maota Lake"
        ],
        "nearestCity": "Jaipur (11 km)",
        "entryFee": "₹100 (Indians) / ₹500 (Foreigners)"
      },
      {
        "name": "Mehrangarh Fort, Jodhpur",
        "hindiName": "मेहरानगढ़ किला, जोधपुर",
        "category": "Fort & Palace",
        "description": "Impregnable 15th-century fortress perched 400 feet above the Blue City of Jodhpur, with grand royal palanquins, Moti Mahal, Phool Mahal, and zip-lining over defensive moat lakes.",
        "imageUrl": "https://images.unsplash.com/photo-1597042777174-8aa7677d337f?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Blue City Rooftop Views from Ramparts",
          "Flying Fox Zipline across Rao Jodha Park",
          "Moti Mahal & Sheesh Mahal Palaces",
          "Royal Arms and Armoury Collection"
        ],
        "nearestCity": "Jodhpur (City Center)",
        "entryFee": "₹100 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "City Palace & Lake Pichola, Udaipur",
        "hindiName": "सिटी पैलेस एवं पिछोला झील, उदयपुर",
        "category": "Fort & Palace",
        "description": "The 'Venice of the East', a 400-year-old marble and granite palace complex towering over Lake Pichola with crystal gallery, Jag Mandir, and the floating Taj Lake Palace.",
        "imageUrl": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March",
        "highlights": [
          "Sunset Boat Cruise on Lake Pichola",
          "Jag Mandir Island Palace",
          "Manak Mahal (Ruby Palace) & Mor Chowk",
          "Vintage Car Collection Museum"
        ],
        "nearestCity": "Udaipur (City Center)",
        "entryFee": "₹300 (Palace Entry) + ₹400 (Boat Ride)"
      },
      {
        "name": "Jaisalmer Golden Fort & Sam Sand Dunes",
        "hindiName": "सोनार किला एवं सैम सैंड ड्यून्स, जैसलमेर",
        "category": "UNESCO Heritage",
        "description": "Living golden yellow sandstone UNESCO fortress in the heart of the Great Thar Desert where 3,000 residents still live, coupled with camel safaris and folk dance camps under the stars at Sam dunes.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to February",
        "highlights": [
          "Living Fort with 99 Bastions",
          "Patwon Ki Haveli Filigree Carvings",
          "Sunset Camel Safari on Dunes",
          "Rajasthani Kalbelia Dance Camps"
        ],
        "nearestCity": "Jaisalmer (City Center / Sam 40 km)",
        "entryFee": "Fort Free / Safari ₹500 - ₹2,000"
      },
      {
        "name": "Ranthambore National Park, Sawai Madhopur",
        "hindiName": "रणथंभौर राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "Former royal hunting ground of the Maharajas of Jaipur, one of India's premier tiger reserves famous for diurnal Bengal tiger sightings against the dramatic backdrop of the 10th-century Ranthambore Fort.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April (Park closed Jul-Sep)",
        "highlights": [
          "Open Gypsy Tiger Safaris",
          "10th-Century Ranthambore UNESCO Fort",
          "Padam Talao & Jogi Mahal",
          "Crocodile Basking at Rajbagh Lake"
        ],
        "nearestCity": "Sawai Madhopur (14 km) / Jaipur (160 km)",
        "entryFee": "Canter ₹800 / Gypsy ₹1,500 per head"
      },
      {
        "name": "Brahma Temple & Sacred Lake, Pushkar",
        "hindiName": "ब्रह्मा मंदिर एवं पुष्कर झील",
        "category": "Spiritual Shrine",
        "description": "One of the world's very few prominent temples dedicated to creator Lord Brahma, surrounded by 52 bathing ghats on the sacred holy lake and the colorful annual Pushkar Camel Fair.",
        "imageUrl": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Kartik Purnima Fair",
        "highlights": [
          "World's Rare 14th-Century Brahma Temple",
          "52 Holy Lake Bathing Ghats",
          "Annual Pushkar Camel & Livestock Fair",
          "Savitri Mata Hilltop Ropeway"
        ],
        "nearestCity": "Pushkar / Ajmer (15 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Chambal",
      "Luni",
      "Banas",
      "Sabarmati"
    ],
    "famousFood": [
      "Dal Baati Churma",
      "Gatte ki Sabzi",
      "Laal Maas",
      "Ker Sangri",
      "Ghevar",
      "Pyaaz Kachori"
    ],
    "famousFestivals": [
      "Pushkar Camel Fair",
      "Desert Festival Jaisalmer",
      "Teej",
      "Gangaur"
    ],
    "classicalDance": "Ghoomar & Kalbelia Folk Dance (UNESCO Intangible Heritage)"
  },
  {
    "id": "uttar_pradesh",
    "name": "Uttar Pradesh",
    "hindiName": "उत्तर प्रदेश",
    "odiaName": "ଉତ୍ତର ପ୍ରଦେଶ",
    "capital": "Lucknow (City of Nawabs)",
    "zone": "North",
    "formationYear": "24 January 1950",
    "officialLanguages": [
      "Hindi",
      "Urdu"
    ],
    "areaKm2": "240,928 km²",
    "population": "241 Million (India's Most Populous State)",
    "literacyRate": "67.7%",
    "tagline": "The Heartland of India · Land of Ram & Krishna",
    "coordinates": {
      "x": 48,
      "y": 38
    },
    "symbols": {
      "bird": {
        "name": "Sarus Crane",
        "hindiName": "सारस क्रेन",
        "description": "World's tallest flying bird standing up to 1.8m tall, symbolizing lifelong marital fidelity.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Swamp Deer (Barasingha)",
        "hindiName": "बारहसिंगा",
        "description": "Majestic deer with up to 12-tined antlers protected in Dudhwa National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Palash (Flame of the Forest)",
        "hindiName": "पलाश का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Ashoka Tree",
        "hindiName": "अशोक का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Taj Mahal, Agra",
        "hindiName": "ताजमहल, आगरा",
        "category": "UNESCO Heritage",
        "description": "One of the Seven Wonders of the World, an ivory-white marble mausoleum on the south bank of the Yamuna river commissioned in 1632 by Mughal Emperor Shah Jahan for his beloved wife Mumtaz Mahal.",
        "imageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Sunrise view)",
        "highlights": [
          "Pietra Dura Inlaid Marble Art",
          "Four 40-meter Minarets",
          "Charbagh Mughal Gardens",
          "Full Moon Night Viewing"
        ],
        "nearestCity": "Agra (City Center)",
        "entryFee": "₹50 (Indians) / ₹1,100 (Foreigners)"
      },
      {
        "name": "Kashi Vishwanath Temple & Ganga Ghats, Varanasi",
        "hindiName": "काशी विश्वनाथ मंदिर एवं गंगा घाट, वाराणसी",
        "category": "Spiritual Shrine",
        "description": "World's oldest living city on the sacred Ganga, home to the golden spire Jyotirlinga of Lord Shiva, Dashashwamedh Ghat's mesmerizing evening Ganga Aarti, and centuries of philosophy.",
        "imageUrl": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Mesmerizing Dashashwamedh Ganga Aarti",
          "Kashi Vishwanath Golden Temple Corridor",
          "Early Morning Subah-e-Banaras Boat Ride",
          "Assi Ghat & Manikarnika Ghat"
        ],
        "nearestCity": "Varanasi (City Center)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Ram Mandir & Saryu Ghats, Ayodhya",
        "hindiName": "श्री राम जन्मभूमि मंदिर एवं सरयू घाट, अयोध्या",
        "category": "Spiritual Shrine",
        "description": "Magnificent newly consecrated traditional Nagara-style pink Bansi Paharpur sandstone temple at the holy birthplace of Lord Ram, paired with serene evening dip at Saryu river and Ram Ki Paidi.",
        "imageUrl": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Diwali (Deepotsav)",
        "highlights": [
          "Nagara-style Bansi Paharpur Stone Architecture",
          "Grand Ram Janmabhoomi Complex",
          "Ram Ki Paidi Deepotsav Laser Show",
          "Hanuman Garhi Fort Temple"
        ],
        "nearestCity": "Ayodhya (City Center) / Lucknow (135 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Agra Fort & Fatehpur Sikri",
        "hindiName": "आगरा किला एवं फतेहपुर सीकरी",
        "category": "UNESCO Heritage",
        "description": "Massive 16th-century red sandstone fortress of Mughal Emperors featuring Jahangiri Mahal, Diwan-i-Khas, paired with Emperor Akbar's imperial ghost city Fatehpur Sikri featuring the towering 54-meter Buland Darwaza.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Buland Darwaza (Highest Gateway in World)",
          "Sheesh Mahal & Diwan-e-Khas",
          "Tomb of Salim Chishti",
          "View of Taj Mahal across Yamuna"
        ],
        "nearestCity": "Agra (Fort: 2 km, Fatehpur Sikri: 36 km)",
        "entryFee": "₹50 (Indians) / ₹650 (Foreigners)"
      },
      {
        "name": "Triveni Sangam & Kumbh Mela, Prayagraj",
        "hindiName": "त्रिवेणी संगम, प्रयागराज",
        "category": "Spiritual Shrine",
        "description": "Sacred confluence of three holy rivers—Ganga, Yamuna, and the mythical Saraswati. Venue of the world's largest religious gathering, the Kumbh Mela, plus Akbar's Fort and Anand Bhavan.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February (Magh Mela)",
        "highlights": [
          "Confluence Boat Ride at Sangam",
          "Akbar's Allahabad Fort & Patalpuri Temple",
          "Anand Bhavan (Nehru Ancestral Home)",
          "Shahi Snan Ghats during Kumbh"
        ],
        "nearestCity": "Prayagraj (City Center)",
        "entryFee": "Boating ₹100 - ₹500"
      },
      {
        "name": "Mathura & Vrindavan Krishna Janmabhoomi",
        "hindiName": "मथुरा एवं वृंदावन (श्रीकृष्ण जन्मभूमि)",
        "category": "Spiritual Shrine",
        "description": "Sacred twin cities on the banks of Yamuna celebrating the childhood leelas of Lord Krishna, featuring Shri Krishna Janmasthan, Banke Bihari Temple, Prem Mandir with dazzling evening illuminations, and ISKCON Vrindavan.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March & Holi / Janmashtami",
        "highlights": [
          "Prem Mandir Illuminated Marble Carvings",
          "Banke Bihari Temple Darshan",
          "Krishna Janmasthan Prison Cell",
          "Lathmar Holi Celebrations"
        ],
        "nearestCity": "Mathura / Vrindavan (12 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Bara Imambara & Rumi Darwaza, Lucknow",
        "hindiName": "बड़ा इमामबाड़ा एवं रूमी दरवाजा, लखनऊ",
        "category": "Historical Monument",
        "description": "1784 grand architectural monument built by Nawab Asaf-ud-Daula with unsupported vaulted central hall, an intricate Bhool Bhulaiya (labyrinth of 1,000 corridors), and the 60-foot Turkish Gate Rumi Darwaza.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Bhool Bhulaiya 3D Labyrinth",
          "World's Largest Unsupported Arched Hall",
          "60-foot Royal Rumi Darwaza",
          "Chhota Imambara Glass Chandelier Gallery"
        ],
        "nearestCity": "Lucknow (City Center)",
        "entryFee": "₹50 (Indians) / ₹500 (Foreigners)"
      }
    ],
    "majorRivers": [
      "Ganga",
      "Yamuna",
      "Sarayu",
      "Gomti",
      "Ghaghara",
      "Betwa"
    ],
    "famousFood": [
      "Galouti Kebab",
      "Awadhi Biryani",
      "Banarasi Paan",
      "Bedmi Puri",
      "Peda of Mathura",
      "Petha of Agra"
    ],
    "famousFestivals": [
      "Kumbh Mela Prayagraj",
      "Dev Deepawali Varanasi",
      "Lathmar Holi Barsana",
      "Taj Mahotsav"
    ],
    "classicalDance": "Kathak (North Indian Classical Dance of storytellers)"
  },
  {
    "id": "tamil_nadu",
    "name": "Tamil Nadu",
    "hindiName": "तमिलनाडु",
    "odiaName": "ତାମିଲନାଡୁ",
    "capital": "Chennai",
    "zone": "South",
    "formationYear": "26 January 1950",
    "officialLanguages": [
      "Tamil"
    ],
    "areaKm2": "130,058 km²",
    "population": "76 Million",
    "literacyRate": "80.1%",
    "tagline": "Enchanting Tamil Nadu · Land of Living Chola Temples",
    "coordinates": {
      "x": 45,
      "y": 82
    },
    "symbols": {
      "bird": {
        "name": "Emerald Dove",
        "hindiName": "मरकत कपोत",
        "description": "Bright green and bronze-winged pigeon native to the tropical rainforests.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Nilgiri Tahr",
        "hindiName": "नीलगिरि तहर",
        "description": "Endangered mountain ungulate found on the steep cliffs of the Western Ghats.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Gloriosa Lily (Kanthal)",
        "hindiName": "ग्लोरियोसा लिली",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Palmyra Palm",
        "hindiName": "ताड़ का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Meenakshi Amman Temple, Madurai",
        "hindiName": "मीनाक्षी अम्मन मंदिर, मदुरै",
        "category": "Spiritual Shrine",
        "description": "Architectural wonder of Dravidian style situated in the 2,500-year-old city of Madurai, featuring 14 soaring gopurams encrusted with thousands of painted stucco deities and the Hall of 1000 Pillars.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "14 Multi-Tiered Painted Gopurams",
          "Hall of 1000 Pillars & Musical Pillars",
          "Golden Lotus Sacred Pond (Potramarai Kulam)",
          "Chithirai Festival Celebrations"
        ],
        "nearestCity": "Madurai (City Center)",
        "entryFee": "Free Entry (Pillar Museum ₹50)"
      },
      {
        "name": "Brihadeeswara Temple, Thanjavur",
        "hindiName": "बृहदेश्वर मंदिर, तंजावुर",
        "category": "UNESCO Heritage",
        "description": "UNESCO Great Living Chola Temple completed in 1010 CE by Emperor Raja Raja Chola I. Built entirely of granite, featuring a soaring 216-foot vimana topped with a monolithic 80-tonne granite capstone.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "216-foot Granite Vimana Tower",
          "80-tonne Monolithic Kumbam Peak",
          "Giant Monolithic Nandi Bull (12 tonnes)",
          "Ancient 1000-year-old Chola Fresco Murals"
        ],
        "nearestCity": "Thanjavur (City Center) / Trichy (55 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Shore Temple & Pancha Rathas, Mahabalipuram",
        "hindiName": "शोर मंदिर एवं पंच रथ, महाबलीपुरम",
        "category": "UNESCO Heritage",
        "description": "7th-century rock-cut coastal monuments of the Pallava dynasty overlooking the Bay of Bengal, featuring monolithic chariot shrines, Arjuna's Penance giant bas-relief, and Krishna's Butter Ball.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February",
        "highlights": [
          "Twin-Spired Ocean-facing Shore Temple",
          "Pancha Pandava Rathas Carved from Single Rocks",
          "Arjuna's Penance Bas-Relief (World's Largest)",
          "Gravity-defying Krishna's Butterball"
        ],
        "nearestCity": "Mahabalipuram / Chennai (55 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Ooty (Udhagamandalam) & Nilgiri Toy Train",
        "hindiName": "ऊटी एवं नीलगिरि माउंटेन रेलवे",
        "category": "Hill Station",
        "description": "'Queen of Hill Stations' in the blue Nilgiri mountains at 2,240m, featuring the UNESCO Nilgiri Mountain Railway rack toy train, Botanical Gardens, Doddabetta Peak, and emerald Pykara Lake.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to June",
        "highlights": [
          "UNESCO Heritage Nilgiri Steam Toy Train",
          "Doddabetta Peak Viewpoint (2,637m)",
          "Government Botanical Gardens (22 hectares)",
          "Pykara Falls & Speedboat Cruising"
        ],
        "nearestCity": "Ooty / Coimbatore (85 km)",
        "entryFee": "Botanical Garden ₹40 / Toy Train ₹200 - ₹500"
      },
      {
        "name": "Rameshwaram Ramanathaswamy Temple & Dhanushkodi",
        "hindiName": "रामेश्वरम एवं धनुषकोडी",
        "category": "Spiritual Shrine",
        "description": "Sacred Char Dham island connected by the engineering wonder Pamban Sea Bridge, famous for the longest temple corridor in the world (1,212 pillars), 22 holy theertham wells, and the ghost town of Dhanushkodi facing Sri Lanka.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "World's Longest Temple Pillared Corridor",
          "Historic Pamban Cantilever Railway Bridge",
          "Dhanushkodi Land's End & Mythological Ram Setu",
          "Bathing in 22 Holy Temple Wells"
        ],
        "nearestCity": "Rameshwaram (City Center) / Madurai (170 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Kanyakumari & Vivekananda Rock Memorial",
        "hindiName": "कन्याकुमारी एवं विवेकानंद रॉक मेमोरियल",
        "category": "Historical Monument",
        "description": "The southernmost tip of the Indian mainland where three oceans converge—Arabian Sea, Bay of Bengal, and Indian Ocean—featuring the offshore Vivekananda Rock Memorial and 133-foot Thiruvalluvar Statue.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Simultaneous Sunset & Moonrise)",
        "highlights": [
          "Triveni Sangam of 3 Oceans",
          "Ferry Ride to Vivekananda Rock Memorial",
          "133-foot Colossal Thiruvalluvar Statue",
          "Sunset & Sunrise from Same Shoreline"
        ],
        "nearestCity": "Kanyakumari / Trivandrum (90 km)",
        "entryFee": "Memorial ₹20 + Ferry ₹50"
      }
    ],
    "majorRivers": [
      "Kaveri",
      "Vaigai",
      "Thamirabarani",
      "Bhavani",
      "Palar"
    ],
    "famousFood": [
      "Idli Sambar",
      "Dosa",
      "Chettinad Chicken",
      "Filter Coffee",
      "Pongal",
      "Payasam"
    ],
    "famousFestivals": [
      "Pongal (Harvest Festival)",
      "Chithirai Festival Madurai",
      "Natyanjali Dance Festival"
    ],
    "classicalDance": "Bharatanatyam (Oldest classical dance tradition of India)"
  },
  {
    "id": "karnataka",
    "name": "Karnataka",
    "hindiName": "कर्नाटक",
    "odiaName": "କର୍ଣ୍ଣାଟକ",
    "capital": "Bengaluru (Silicon Valley of India)",
    "zone": "South",
    "formationYear": "1 November 1956",
    "officialLanguages": [
      "Kannada"
    ],
    "areaKm2": "191,791 km²",
    "population": "68 Million",
    "literacyRate": "75.4%",
    "tagline": "One State. Many Worlds. · Heritage & Tech Hub",
    "coordinates": {
      "x": 37,
      "y": 72
    },
    "symbols": {
      "bird": {
        "name": "Indian Roller",
        "hindiName": "नीलकंठ",
        "description": "Turquoise blue roller bird admired for aerial courtship displays.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Asian Elephant",
        "hindiName": "एशियाई हाथी",
        "description": "Karnataka holds India's highest wild elephant population.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Lotus",
        "hindiName": "कमल का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Sandalwood Tree (Chandan)",
        "hindiName": "चंदन का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Hampi Ruins & Stone Chariot",
        "hindiName": "हम्पी स्मारक समूह एवं रथ",
        "category": "UNESCO Heritage",
        "description": "Capital of the opulent 14th-century Vijayanagara Empire situated amidst dramatic boulder-strewn hills along Tungabhadra river, featuring the iconic Stone Chariot at Vijaya Vittala Temple and Virupaksha Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Iconic Stone Chariot (Featured on ₹50 note)",
          "Vittala Musical Pillars",
          "Virupaksha Active Temple Complex",
          "Coracle Boat Ride on Tungabhadra River"
        ],
        "nearestCity": "Hampi / Hospet (12 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Mysore Palace (Amba Vilas)",
        "hindiName": "मैसूर महल (अंबा विलास)",
        "category": "Fort & Palace",
        "description": "Seat of the Wadiyar Maharajas, one of India's most visited royal palaces. An Indo-Saracenic masterpiece designed by Henry Irwin, illuminated on Sunday evenings by 100,000 glowing light bulbs.",
        "imageUrl": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Dasara Festival",
        "highlights": [
          "Illumination by 100,000 Light Bulbs",
          "Golden Howdah Royal Throne",
          "Kalyana Mantapa (Stained Glass Wedding Pavilion)",
          "Mysore Dasara Elephant Jumbo Savari"
        ],
        "nearestCity": "Mysuru (City Center) / Bengaluru (140 km)",
        "entryFee": "₹100 (Indians) / ₹200 (Foreigners)"
      },
      {
        "name": "Coorg (Kodagu) & Abbey Falls",
        "hindiName": "कूर्ग (कॉफी हिल्स)",
        "category": "Hill Station",
        "description": "'Scotland of India', verdant hill district renowned for fragrant Arabica and Robusta coffee plantations, Abbey and Iruppu waterfalls, Raja's Seat sunset garden, and Tibetan Namdroling Golden Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Coffee & Cardamom Plantation Walks",
          "Abbey Falls Hanging Bridge View",
          "Bylakuppe Golden Temple (Largest Tibetan settlement in South India)",
          "Dubare Elephant Camp River Rafting"
        ],
        "nearestCity": "Madikeri / Mangalore (135 km) / Mysuru (120 km)",
        "entryFee": "Abbey Falls ₹15 / Namdroling Free"
      },
      {
        "name": "Jog Falls, Shimoga",
        "hindiName": "जोग जलप्रपात, शिमोगा",
        "category": "Scenic Wonder",
        "description": "India's second highest plunge waterfall, created by the Sharavathi river dropping 253 meters (830 ft) in four distinct cascades: Raja, Roarer, Rocket, and Rani.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "July to December (Peak in Monsoon)",
        "highlights": [
          "Four Cascades: Raja, Roarer, Rocket, Rani",
          "1,400 Steps Descent to Base of Gorge",
          "Laser Light & Musical Fountain Show",
          "Sharavathi Valley Viewpoint"
        ],
        "nearestCity": "Sagara (30 km) / Shimoga (100 km)",
        "entryFee": "₹50 (Indians)"
      },
      {
        "name": "Gokarna & Om Beach",
        "hindiName": "गोकर्ण एवं ओम बीच",
        "category": "Beach",
        "description": "Sacred coastal pilgrimage town combined with pristine crescent beaches, famous for Om Beach naturally shaped like the Hindu 'ॐ' symbol, Kudle Beach, and the ancient Atmalinga at Mahabaleshwar Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Om-shaped Shoreline & Water Sports",
          "Cliffside Trek from Kudle to Half Moon Beach",
          "Mahabaleshwar Temple (Pranalinga of Shiva)",
          "Peaceful Alternative to North Goa"
        ],
        "nearestCity": "Gokarna / Goa (140 km) / Hubballi (150 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Bandipur & Nagarhole Tiger Reserves",
        "hindiName": "बांदीपुर एवं नागरहोल बाघ अभयारण्य",
        "category": "Wildlife Safari",
        "description": "Premier reserves of the Nilgiri Biosphere, sheltering the highest Asian elephant population in South Asia, along with dense populations of Royal Bengal tigers, Indian leopards, and dholes.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Open Bus & Jeep Safaris",
          "Large Elephant Herds at Kabini River",
          "Tiger & Black Panther Sightings in Kabini",
          "Dense Teak & Rosewood Forests"
        ],
        "nearestCity": "Mysuru (80 km) / Bengaluru (220 km)",
        "entryFee": "Safari ₹350 - ₹2,000"
      }
    ],
    "majorRivers": [
      "Kaveri",
      "Krishna",
      "Tungabhadra",
      "Sharavathi",
      "Ghataprabha"
    ],
    "famousFood": [
      "Bisi Bele Bath",
      "Mysore Pak",
      "Neer Dosa",
      "Dharwad Pedha",
      "Ragi Mudde",
      "Coorg Pandi Curry"
    ],
    "famousFestivals": [
      "Mysuru Dasara",
      "Ugadi",
      "Kambala Buffalo Race",
      "Hampi Utsav"
    ],
    "classicalDance": "Yakshagana (Folk Theater Dance) & Carnatic Music Center"
  },
  {
    "id": "kerala",
    "name": "Kerala",
    "hindiName": "केरल",
    "odiaName": "କେରଳ",
    "capital": "Thiruvananthapuram",
    "zone": "South",
    "formationYear": "1 November 1956",
    "officialLanguages": [
      "Malayalam"
    ],
    "areaKm2": "38,863 km²",
    "population": "35 Million",
    "literacyRate": "96.2% (India's Highest Literacy)",
    "tagline": "God's Own Country · Land of Spices & Backwaters",
    "coordinates": {
      "x": 38,
      "y": 88
    },
    "symbols": {
      "bird": {
        "name": "Great Hornbill",
        "hindiName": "ग्रेट हॉर्नबिल",
        "description": "Massive frugivorous forest bird with bright yellow casque atop its beak.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Indian Elephant",
        "hindiName": "भारतीय हाथी",
        "description": "Revered cultural symbol present at temple festivals like Thrissur Pooram.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Golden Shower (Kanikkonna)",
        "hindiName": "कणिकौन्ना (अमलतास)",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Coconut Palm",
        "hindiName": "नारियल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Alleppey (Alappuzha) Backwaters",
        "hindiName": "अलेप्पी (बैकवाटर्स)",
        "category": "Scenic Wonder",
        "description": "'Venice of the East', a mesmerizing network of palm-fringed tranquil lagoons, canals, and lakes. Best experienced on a traditional thatched-roof Kettuvallam houseboat gliding past paddy fields.",
        "imageUrl": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March & August (Nehru Trophy Snake Boat Race)",
        "highlights": [
          "Overnight Traditional Houseboat Cruise",
          "Nehru Trophy Chundan Vallam Snake Boat Race",
          "Vembanad Lake Sunset Views",
          "Fresh Karimeen Pollichathu Fish Cuisine"
        ],
        "nearestCity": "Alappuzha / Kochi (60 km)",
        "entryFee": "Houseboat ₹7,000 - ₹18,000 / day"
      },
      {
        "name": "Munnar Tea Gardens & Anamudi Peak",
        "hindiName": "मुन्नार चाय बागान एवं अनामुडी",
        "category": "Hill Station",
        "description": "Serene hill station at 1,600m in the Western Ghats surrounded by rolling emerald tea estates, mist-covered valleys, the endangered Nilgiri Tahr at Eravikulam National Park, and South India's highest peak Anamudi (2,695m).",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to May",
        "highlights": [
          "Tata Tea Museum & Tea Tasting",
          "Eravikulam National Park (Nilgiri Tahr sightings)",
          "Mattupetty Dam & Echo Point",
          "Neelakurinji Blooming (Once in 12 years)"
        ],
        "nearestCity": "Munnar / Kochi (125 km)",
        "entryFee": "Eravikulam ₹200 (Indians)"
      },
      {
        "name": "Fort Kochi & Chinese Fishing Nets",
        "hindiName": "फोर्ट कोच्चि एवं चीनी मछली पकड़ने के जाल",
        "category": "Historical Monument",
        "description": "Historic colonial port melting pot of Portuguese, Dutch, and British heritage, featuring iconic cantilevered Chinese Fishing Nets, St. Francis Church (Vasco da Gama's burial place), and Jew Town synagogue.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Sunset View of Chinese Fishing Nets (Cheena Vala)",
          "Mattancherry Dutch Palace Murals",
          "1568 Paradesi Synagogue in Jew Town",
          "Kathakali Evening Dance Performances"
        ],
        "nearestCity": "Kochi (City Center)",
        "entryFee": "Dutch Palace ₹5 / Synagogue ₹10"
      },
      {
        "name": "Wayanad (Edakkal Caves & Chembra Peak)",
        "hindiName": "वायनाड (एडक्कल गुफाएं)",
        "category": "Hill Station",
        "description": "Pristine highland district filled with spice plantations, misty forests, Edakkal Caves' Neolithic petroglyphs dating to 6000 BCE, Banasura Sagar (India's largest earth dam), and heart-shaped Chembra Lake.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Edakkal Caves Stone Age Carvings",
          "Heart-Shaped Chembra Peak Lake Trek",
          "Banasura Sagar Dam Speedboating",
          "Wayanad Wildlife Sanctuary Elephant Safaris"
        ],
        "nearestCity": "Kalpetta / Kozhikode (75 km)",
        "entryFee": "Edakkal ₹50 / Chembra Trek ₹750"
      },
      {
        "name": "Varkala Cliff Beach & Kovalam",
        "hindiName": "वर्कला क्लिफ बीच एवं कोवलम",
        "category": "Beach",
        "description": "Dramatic red laterite sedimentary cliffs overlooking the Arabian Sea at Varkala with natural geo-thermal springs, coupled with Kovalam's iconic red-and-white striped lighthouse beach and Ayurvedic resorts.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Cliff-top Cafes & Panoramic Ocean Sunset",
          "Papanasam Beach Holy Waters",
          "Kovalam 30-meter Vizhinjam Lighthouse",
          "Traditional Ayurvedic Rejuvenation Massages"
        ],
        "nearestCity": "Varkala / Trivandrum (45 km)",
        "entryFee": "Free Entry (Lighthouse ₹20)"
      },
      {
        "name": "Athirappilly Waterfalls",
        "hindiName": "अथिरापिल्ली जलप्रपात",
        "category": "Scenic Wonder",
        "description": "'The Niagara of India', a majestic 80-foot wide waterfall cascading on the Chalakudy river through lush Sholayar rainforests, featured extensively in films like Baahubali and Dil Se.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "June to January (Monsoon & Post-Monsoon)",
        "highlights": [
          "80-foot Roaring Curtain of Water",
          "Trek to the Bottom of Falls",
          "Sholayar Hornbill Bird Habitat",
          "Vazhachal Rapids nearby"
        ],
        "nearestCity": "Chalakudy (30 km) / Kochi (70 km)",
        "entryFee": "₹50 (Indians)"
      }
    ],
    "majorRivers": [
      "Periyar",
      "Bharathappuzha",
      "Pamba",
      "Chaliyar"
    ],
    "famousFood": [
      "Appam with Stew",
      "Kerala Sadya",
      "Puttu and Kadala",
      "Karimeen Pollichathu",
      "Banana Chips"
    ],
    "famousFestivals": [
      "Onam",
      "Thrissur Pooram",
      "Vishu",
      "Nehru Trophy Snake Boat Race"
    ],
    "classicalDance": "Kathakali & Mohiniyattam (Renowned classical dance-dramas)"
  },
  {
    "id": "west_bengal",
    "name": "West Bengal",
    "hindiName": "पश्चिम बंगाल",
    "odiaName": "ପଶ୍ଚିମ ବଙ୍ଗ",
    "capital": "Kolkata (City of Joy)",
    "zone": "East",
    "formationYear": "26 January 1950",
    "officialLanguages": [
      "Bengali",
      "English"
    ],
    "areaKm2": "88,752 km²",
    "population": "100 Million",
    "literacyRate": "77.1%",
    "tagline": "Beautiful Bengal · Land of Nobel Laureates",
    "coordinates": {
      "x": 64,
      "y": 48
    },
    "symbols": {
      "bird": {
        "name": "White-throated Kingfisher",
        "hindiName": "श्वेतकंठ कौड़िल्ला",
        "description": "Striking turquoise blue and chocolate brown plumage kingfisher.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Fishing Cat & Bengal Tiger",
        "hindiName": "मछुआरी बिल्ली व बंगाल टाइगर",
        "description": "Wetland fishing cat and Sundarbans Royal Bengal Tiger.",
        "imageUrl": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Night-flowering Jasmine (Shiuli)",
        "hindiName": "हरसिंगार / शिउली",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Devil's Tree (Chatim)",
        "hindiName": "छतिम का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Victoria Memorial & Howrah Bridge, Kolkata",
        "hindiName": "विक्टोरिया मेमोरियल एवं हावड़ा ब्रिज, कोलकाता",
        "category": "Historical Monument",
        "description": "Grand white Makrana marble monument commissioned by Lord Curzon celebrating Queen Victoria, set in 64 acres of gardens, paired with the iconic cantilever Howrah Bridge spanning the Hooghly river.",
        "imageUrl": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Makrana White Marble Architecture",
          "Royal Gallery & Historic British Paintings",
          "Howrah Bridge Sunset Hooghly Ferry Ride",
          "Park Street & College Street Tram Experience"
        ],
        "nearestCity": "Kolkata (City Center)",
        "entryFee": "₹50 (Indians) / ₹500 (Foreigners)"
      },
      {
        "name": "Darjeeling & Tiger Hill",
        "hindiName": "दार्जिलिंग एवं टाइगर हिल",
        "category": "Hill Station",
        "description": "'Queen of the Hills' at 2,042m, world-renowned for Darjeeling Champagne tea estates, Tiger Hill sunrise illuminating Mount Kanchenjunga (world's 3rd highest peak) in golden hues, and the UNESCO Toy Train.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to May & October to December",
        "highlights": [
          "Sunrise on Mount Kanchenjunga from Tiger Hill",
          "UNESCO Darjeeling Himalayan Toy Train (Batasia Loop)",
          "Happy Valley Tea Estate Tasting",
          "Padmaja Naidu Himalayan Zoo (Red Panda & Snow Leopard)"
        ],
        "nearestCity": "Darjeeling / Siliguri (65 km)",
        "entryFee": "Toy Train ₹1,000 / Tiger Hill ₹50"
      },
      {
        "name": "Sundarbans National Park",
        "hindiName": "सुंदरवन राष्ट्रीय उद्यान",
        "category": "UNESCO Heritage",
        "description": "The world's largest coastal mangrove forest delta, created by the confluence of Ganga, Brahmaputra, and Meghna rivers. UNESCO World Heritage Site home to the swimming Royal Bengal Tiger and saltwater crocodiles.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March",
        "highlights": [
          "Boat Safari through Mangrove Creeks",
          "Swimming Royal Bengal Tiger Sightings",
          "Sajnekhali Watchtower & Mangrove Interpretation Center",
          "Spotted Deer & Olive Ridley Turtles"
        ],
        "nearestCity": "Godkhali (Port) / Kolkata (100 km)",
        "entryFee": "Boat Package ₹3,500 - ₹8,000"
      },
      {
        "name": "Dakshineswar Kali Temple & Belur Math",
        "hindiName": "दक्षिणेश्वर काली मंदिर एवं बेलूर मठ",
        "category": "Spiritual Shrine",
        "description": "19th-century Nava-ratna (nine-spired) Kali temple where mystic saint Sri Ramakrishna Paramahamsa served as priest, connected by river ferry to Belur Math, headquarters of Ramakrishna Mission founded by Swami Vivekananda.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "12 Shiva Shrines along Hooghly River Ghats",
          "Sri Ramakrishna's Living Room & Panchavati Garden",
          "Belur Math Universal Architecture (Fusing Hindu, Christian, Islamic motifs)",
          "Evening Aarti at Belur Math"
        ],
        "nearestCity": "Kolkata (Northern Suburbs)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Bishnupur Terracotta Temples",
        "hindiName": "विष्णुपुर टेराकोटा मंदिर",
        "category": "Historical Monument",
        "description": "Ancient capital of the Malla kings, famed for extraordinary burnt-clay terracotta brick temples including Rasmancha, Jor Bangla, and Madan Mohan, decorated with scenes from the Ramayana and Mahabharata.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Rasmancha 1600 CE Pyramidal Stepped Tower",
          "Jor Bangla Double Hut Architecture",
          "Baluchari Silk Saree Weaving Centers",
          "Bankura Terracotta Horses Art"
        ],
        "nearestCity": "Bishnupur / Kolkata (140 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Digha & Mandarmani Beaches",
        "hindiName": "दीघा एवं मंदारमणि समुद्र तट",
        "category": "Beach",
        "description": "Popular Bay of Bengal seaside retreats with hard, flat sandy beaches allowing driving right onto the shoreline at Mandarmani, colorful red crabs, fresh seafood shacks, and gentle rolling waves.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Mandarmani 13 km Drivable Hard Sand Beach",
          "New Digha Casuarina Pine Forests",
          "Marine Aquarium and Research Centre",
          "Fresh Fried Bhetki & Prawn Shacks"
        ],
        "nearestCity": "Digha / Kolkata (180 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Hooghly (Ganga)",
      "Teesta",
      "Damodar",
      "Rupnarayan",
      "Subarnarekha"
    ],
    "famousFood": [
      "Rosogolla",
      "Mishti Doi",
      "Shorshe Ilish",
      "Kolkata Biryani",
      "Sandesh",
      "Kosha Mangsho"
    ],
    "famousFestivals": [
      "Durga Puja (UNESCO Intangible Cultural Heritage)",
      "Poila Boishakh",
      "Poush Mela Shantiniketan"
    ],
    "classicalDance": "Gaudiya Nritya & Rabindra Nritya"
  },
  {
    "id": "gujarat",
    "name": "Gujarat",
    "hindiName": "गुजरात",
    "odiaName": "ଗୁଜରାଟ",
    "capital": "Gandhinagar",
    "zone": "West",
    "formationYear": "1 May 1960",
    "officialLanguages": [
      "Gujarati"
    ],
    "areaKm2": "196,024 km²",
    "population": "70 Million",
    "literacyRate": "78.0%",
    "tagline": "Vibrant Gujarat · Land of the Asiatic Lion & Mahatma Gandhi",
    "coordinates": {
      "x": 22,
      "y": 48
    },
    "symbols": {
      "bird": {
        "name": "Greater Flamingo",
        "hindiName": "हंसावर / बड़ा फ्लेमिंगो",
        "description": "Pink-legged wader breeding in thousands across the Rann of Kutch Flamingo City.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Asiatic Lion",
        "hindiName": "एशियाई शेर",
        "description": "The only wild population of Asiatic lions in the world, thriving in Gir National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Marigold (Galdgota)",
        "hindiName": "गेंदे का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Banyan Tree",
        "hindiName": "बरगद का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Statue of Unity, Kevadia",
        "hindiName": "स्टैच्यू ऑफ यूनिटी, केवड़िया",
        "category": "Historical Monument",
        "description": "The world's tallest statue standing at 182 meters (597 ft), dedicated to Sardar Vallabhbhai Patel. Overlooks the Narmada River and Sardar Sarovar Dam, featuring a high-speed elevator to a 153m chest-level viewing gallery.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "182-meter World's Tallest Statue",
          "153-meter High Viewing Gallery over Narmada",
          "Evening Laser Light & Sound Projection Show",
          "Valley of Flowers & Jungle Safari Zoo"
        ],
        "nearestCity": "Kevadia / Vadodara (90 km) / Ahmedabad (200 km)",
        "entryFee": "₹150 (Basic) / ₹380 (Viewing Gallery)"
      },
      {
        "name": "Great Rann of Kutch (White Desert)",
        "hindiName": "कच्छ का रण (श्वेत मरुस्थल)",
        "category": "Scenic Wonder",
        "description": "One of the largest salt deserts in the world, stretching over 7,500 sq km of blinding white salt flats. Host to the vibrant 3-month Rann Utsav festival under full moon skies, showcasing Kutchi embroidery, music, and crafts.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February (Rann Utsav)",
        "highlights": [
          "Full Moon Night White Salt Reflection",
          "Rann Utsav Luxury Tent City",
          "Kala Dungar (Highest Point in Kutch)",
          "Rogan Art & Handicraft Village Tours"
        ],
        "nearestCity": "Dhordo / Bhuj (85 km)",
        "entryFee": "Rann Permit ₹100 / Person"
      },
      {
        "name": "Gir National Park & Wildlife Sanctuary",
        "hindiName": "गिर राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "The only natural habitat of the endangered Asiatic Lion (Panthera leo persica) anywhere in the wild. Spans 1,412 sq km of dry deciduous scrub forest, also sheltering over 300 leopards and 300 species of birds.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "December to April (Park closed Jun-Oct)",
        "highlights": [
          "Wild Asiatic Lion Open Gypsy Safari",
          "Maldhari Tribal Settlements",
          "Kamleshwar Dam Crocodile Breeding Center",
          "Devalia Safari Park (Gir Interpretation Zone)"
        ],
        "nearestCity": "Sasan Gir / Junagadh (60 km) / Rajkot (160 km)",
        "entryFee": "Safari Gypsy ₹4,000 - ₹5,500"
      },
      {
        "name": "Somnath & Dwarkadhish Jyotirlinga / Char Dham",
        "hindiName": "सोमनाथ एवं द्वारकाधीश मंदिर",
        "category": "Spiritual Shrine",
        "description": "Somnath is the first of the twelve sacred Jyotirlingas, rebuilt on the Arabian Sea shore after centuries of invasions. Paired with Dwarkadhish Temple, the sacred Char Dham kingdom of Lord Krishna on the Gomti creek.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Somnath Sound & Light Show over Ocean",
          "Baan Stambh (Arrow Pillar pointing to South Pole)",
          "Dwarka 5-Story 72-Pillar Temple",
          "Bet Dwarka Island Boat Ride"
        ],
        "nearestCity": "Somnath / Dwarka (230 km apart)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Rani ki Vav & Sun Temple Modhera",
        "hindiName": "रानी की वाव एवं मोढेरा सूर्य मंदिर",
        "category": "UNESCO Heritage",
        "description": "UNESCO 11th-century stepwell in Patan designed as an inverted subterranean temple with over 500 principal sculptures, paired with Modhera Sun Temple featuring Surya Kund step tank and exact solar equinox alignment.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "7 Levels of Subterranean Sculptures (Featured on ₹100 note)",
          "Sheshashayi Vishnu Carvings",
          "Modhera 52-Pillar Sabha Mandap",
          "Modhera Dance Festival in Jan"
        ],
        "nearestCity": "Patan / Mehsana (30 km) / Ahmedabad (100 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Sabarmati Ashram, Ahmedabad",
        "hindiName": "साबरमती आश्रम, अहमदाबाद",
        "category": "Historical Monument",
        "description": "Headquarters of Mahatma Gandhi's freedom struggle from 1917 to 1930, from where he launched the historic Dandi Salt March. Houses Hriday Kunj, Gandhi's spinning charkha, and an extensive museum designed by Charles Correa.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Hriday Kunj (Mahatma Gandhi's Residence)",
          "Original Spinning Charkha Collection",
          "Gandhi Smarak Sangrahalaya Museum",
          "Tranquil Sabarmati Riverfront Promenade"
        ],
        "nearestCity": "Ahmedabad (City Center)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Narmada",
      "Tapi",
      "Sabarmati",
      "Mahi"
    ],
    "famousFood": [
      "Dhokla",
      "Khandvi",
      "Thepla",
      "Fafda Jalebi",
      "Gujarati Thali",
      "Undhiyu"
    ],
    "famousFestivals": [
      "Navratri Garba (World's Longest Dance Festival)",
      "Rann Utsav Kutch",
      "Uttarayan Kite Festival"
    ],
    "classicalDance": "Garba & Dandiya Raas (UNESCO Intangible Cultural Heritage)"
  },
  {
    "id": "punjab",
    "name": "Punjab",
    "hindiName": "पंजाब",
    "odiaName": "ପଞ୍ଜାବ",
    "capital": "Chandigarh",
    "zone": "North",
    "formationYear": "1 November 1966",
    "officialLanguages": [
      "Punjabi"
    ],
    "areaKm2": "50,362 km²",
    "population": "31 Million",
    "literacyRate": "75.8%",
    "tagline": "India's Breadbasket · Land of Five Rivers",
    "coordinates": {
      "x": 33,
      "y": 25
    },
    "symbols": {
      "bird": {
        "name": "Northern Goshawk (Baaz)",
        "hindiName": "उत्तरी गोशॉक (बाज़)",
        "description": "Raptor celebrated as the symbolic companion bird of Guru Gobind Singh Ji.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Blackbuck (Kala Hiran)",
        "hindiName": "काला हिरण",
        "description": "Fast-running antelope with distinctive spiraling horns revered in Bishnoi tradition.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Gladiolus",
        "hindiName": "ग्लैडियोलस",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Shisham (Tahli)",
        "hindiName": "शीशम का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Golden Temple (Sri Harmandir Sahib), Amritsar",
        "hindiName": "स्वर्ण मंदिर (श्री हरिमंदिर साहिब), अमृतसर",
        "category": "Spiritual Shrine",
        "description": "The holiest Gurdwara and spiritual capital of Sikhism, plated in 500 kg of pure gold leaf surrounded by the sacred Amrit Sarovar lake. Famous for Langar, the world's largest free community kitchen feeding 100,000 pilgrims daily.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "500 kg Pure Gold-Plated Sanctum",
          "World's Largest Free Community Kitchen (Langar)",
          "Sacred Amrit Sarovar Holy Dip",
          "Night Palki Sahib Ceremony"
        ],
        "nearestCity": "Amritsar (City Center)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Wagah Border Beating Retreat Ceremony",
        "hindiName": "वाघा बॉर्डर बीटिंग रिट्रीट समारोह",
        "category": "Historical Monument",
        "description": "Electrifying military drill and flag-lowering ceremony conducted daily since 1959 by India's Border Security Force (BSF) and Pakistan Rangers, marked by synchronized goose-stepping and thunderous patriotic cheers.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Evening 4:30 PM)",
        "highlights": [
          "Electrifying 45-minute Border Military Drill",
          "High-Kicking BSF Soldier March",
          "Patriotic Dancing & Chants in Stadium",
          "Border Gates Lowering at Sunset"
        ],
        "nearestCity": "Attari / Amritsar (28 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Jallianwala Bagh Memorial & Partition Museum",
        "hindiName": "जलियांवाला बाग स्मारक एवं विभाजन संग्रहालय",
        "category": "Historical Monument",
        "description": "Sacred national memorial garden commemorating martyrs of the 13 April 1919 massacre, preserving the bullet marks on brick walls and the historic Martyrs' Well, paired with the world's first Partition Museum at Town Hall.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Preserved Bullet Marks on Memorial Walls",
          "Martyrs' Well (Shaheedi Khuh)",
          "Eternal Flame Memorial",
          "Partition Museum at Amritsar Town Hall"
        ],
        "nearestCity": "Amritsar (500m from Golden Temple)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Virasat-e-Khalsa & Anandpur Sahib",
        "hindiName": "विरासत-ए-खालसा एवं आनंदपुर साहिब",
        "category": "Historical Monument",
        "description": "World-class museum complex designed by Moshe Safdie in the holy city where Guru Gobind Singh created the Khalsa Panth in 1699, tracing 500 years of Sikh history with immersive audio-visual exhibits.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Hola Mohalla (March)",
        "highlights": [
          "Moshe Safdie Architectural Landmark",
          "Virasat-e-Khalsa 3D Multimedia Galleries",
          "Takht Sri Kesgarh Sahib Gurdwara",
          "Hola Mohalla Martial Arts Festival"
        ],
        "nearestCity": "Anandpur Sahib / Chandigarh (80 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Qila Mubarak, Patiala & Bathinda",
        "hindiName": "किला मुबारक, पटियाला एवं बठिंडा",
        "category": "Fort & Palace",
        "description": "Historic fortresses representing royal Punjabi heritage: Bathinda Fort is one of India's oldest surviving forts dating to 6th century where Razia Sultan was imprisoned; Patiala Qila Mubarak showcases grand Sikh-Mughal fresco art.",
        "imageUrl": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Razia Sultan Prison Cell in Bathinda",
          "Sheesh Mahal & Ran Baas in Patiala",
          "World's Largest Chandelier Collection in Patiala",
          "Ancient Baked Mud-Brick Architecture"
        ],
        "nearestCity": "Patiala / Bathinda",
        "entryFee": "₹20 (Indians)"
      }
    ],
    "majorRivers": [
      "Sutlej",
      "Beas",
      "Ravi"
    ],
    "famousFood": [
      "Makki di Roti & Sarson da Saag",
      "Butter Chicken",
      "Amritsari Kulcha",
      "Lassi",
      "Chole Bhature",
      "Pinni"
    ],
    "famousFestivals": [
      "Baisakhi",
      "Lohri",
      "Hola Mohalla Anandpur Sahib",
      "Gurpurab"
    ],
    "classicalDance": "Bhangra & Giddha (High-energy folk dances of Punjab)"
  },
  {
    "id": "madhya_pradesh",
    "name": "Madhya Pradesh",
    "hindiName": "मध्य प्रदेश",
    "odiaName": "ମଧ୍ୟ ପ୍ରଦେଶ",
    "capital": "Bhopal (City of Lakes)",
    "zone": "Central",
    "formationYear": "1 November 1956",
    "officialLanguages": [
      "Hindi"
    ],
    "areaKm2": "308,252 km²",
    "population": "85 Million",
    "literacyRate": "70.6%",
    "tagline": "The Heart of Incredible India · Tiger State of India",
    "coordinates": {
      "x": 45,
      "y": 48
    },
    "symbols": {
      "bird": {
        "name": "Asian Paradise Flycatcher (Dudhraj)",
        "hindiName": "दूधराज (पैराडाइज फ्लाईकैचर)",
        "description": "Graceful white bird with long ribbon-like tail feathers.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Barasingha (Swamp Deer)",
        "hindiName": "बारहसिंगा",
        "description": "Hard-ground swamp deer preserved in Kanha Tiger Reserve.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "White Madonna Lily",
        "hindiName": "सफेद लिली",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Banyan Tree",
        "hindiName": "बरगद का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Khajuraho Group of Monuments",
        "hindiName": "खजुराहो स्मारक समूह",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Hindu and Jain temples built between 950-1050 CE by the Chandela dynasty, famed worldwide for celestial nagara sandstone sculptures celebrating beauty, life, and erotic art.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Kandariya Mahadeva Temple",
          "Lakshmana Temple Sculptures",
          "Khajuraho Dance Festival in Feb",
          "Light & Sound Show in Western Group"
        ],
        "nearestCity": "Khajuraho (City Center)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Sanchi Stupa",
        "hindiName": "सांची स्तूप",
        "category": "UNESCO Heritage",
        "description": "India's oldest monumental stone structure, commissioned by Emperor Ashoka in the 3rd century BCE, with hemispherical dome housing Lord Buddha's relics and four intricately carved Torana gateways.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Great Stupa No. 1 Ashokan Relics",
          "Four Detailed Torana Gateways",
          "Ashoka Pillar Inscriptions",
          "Archaeological Museum Sanchi"
        ],
        "nearestCity": "Sanchi / Bhopal (46 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Gwalior Fort & Man Mandir Palace",
        "hindiName": "ग्वालियर किला एवं मान मंदिर",
        "category": "Fort & Palace",
        "description": "Described by Mughal Emperor Babur as 'the pearl among the fortresses of Hind', an impenetrable 8th-century hill fortress featuring blue ceramic tiled Man Mandir Palace and colossal Jain rock-cut statues.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Turquoise Ceramic Tile Work on Walls",
          "Saas Bahu Temples & Teli Ka Mandir",
          "Colossal Jain Rock Sculptures at Gopachal",
          "Gujari Mahal Museum"
        ],
        "nearestCity": "Gwalior (City Center)",
        "entryFee": "₹75 (Indians) / ₹250 (Foreigners)"
      },
      {
        "name": "Kanha & Bandhavgarh National Parks",
        "hindiName": "कान्हा एवं बांधवगढ़ राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "Legendary tiger heartlands that inspired Rudyard Kipling's The Jungle Book, home to the largest wild tiger population in central India and the revived hard-ground Barasingha swamp deer.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to June",
        "highlights": [
          "Highest Tiger Sightings at Tala Zone",
          "Sunset Point Bamni Dadar in Kanha",
          "Hard-ground Barasingha Deer",
          "Bandhavgarh Ancient Fort Hilltop"
        ],
        "nearestCity": "Jabalpur (Kanha: 160 km / Bandhavgarh: 165 km)",
        "entryFee": "Safari Gypsy ₹4,000 - ₹6,500"
      },
      {
        "name": "Bhedaghat Marble Rocks & Dhuandhar Falls, Jabalpur",
        "hindiName": "भेड़ाघाट संगमरमर की चट्टानें एवं धुआंधार जलप्रपात",
        "category": "Scenic Wonder",
        "description": "Majestic Narmada river slicing through 100-foot gleaming white marble rocks, accompanied by the thunderous Dhuandhar Falls where crashing waters generate a smoky mist.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March (Full Moon Boating)",
        "highlights": [
          "Moonlight Boat Ride through Marble Gorge",
          "Dhuandhar 'Smoky Waterfall' Cascade",
          "Chausath Yogini 10th-Century Temple",
          "Ropeway Cable Car across Gorge"
        ],
        "nearestCity": "Jabalpur (25 km)",
        "entryFee": "Boating ₹100 - ₹400 / Cable Car ₹100"
      },
      {
        "name": "Mahakaleshwar Jyotirlinga, Ujjain",
        "hindiName": "महाकालेश्वर ज्योतिर्लिंग, उज्जैन",
        "category": "Spiritual Shrine",
        "description": "One of the twelve sacred Jyotirlingas, south-facing Dakshinmukhi lingam situated on the sacred Shipra river, revered for the world-famous pre-dawn Bhasma Aarti and the sprawling Mahakal Lok Corridor.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (Oct-Mar & Mahashivratri)",
        "highlights": [
          "Pre-Dawn Bhasma Aarti (Sacred Ash Ritual)",
          "Grand Mahakal Lok Corridor (900m long)",
          "Ram Ghat Evening Shipra Aarti",
          "Harsiddhi Mata Shakti Peeth"
        ],
        "nearestCity": "Ujjain (City Center) / Indore (55 km)",
        "entryFee": "Free Entry (Bhasma Aarti booking required)"
      }
    ],
    "majorRivers": [
      "Narmada",
      "Chambal",
      "Betwa",
      "Son",
      "Shipra",
      "Tapti"
    ],
    "famousFood": [
      "Poha Jalebi",
      "Dal Bafla",
      "Bhutte ka Kees",
      "Mawa Bati",
      "Bhopali Gosht Korma"
    ],
    "famousFestivals": [
      "Tansen Music Festival Gwalior",
      "Khajuraho Dance Festival",
      "Ujjain Simhastha Kumbh"
    ],
    "classicalDance": "Matki & Karma Tribal Dances"
  },
  {
    "id": "telangana",
    "name": "Telangana",
    "hindiName": "तेलंगाना",
    "odiaName": "ତେଲେଙ୍ଗାନା",
    "capital": "Hyderabad (City of Pearls)",
    "zone": "South",
    "formationYear": "2 June 2014 (India's Youngest State)",
    "officialLanguages": [
      "Telugu",
      "Urdu"
    ],
    "areaKm2": "112,077 km²",
    "population": "38 Million",
    "literacyRate": "72.8%",
    "tagline": "It's All Here · IT Powerhouse & Nizami Heritage",
    "coordinates": {
      "x": 45,
      "y": 66
    },
    "symbols": {
      "bird": {
        "name": "Indian Roller (Pala Pitta)",
        "hindiName": "नीलकंठ (पाला पिट्टा)",
        "description": "Auspicious blue roller bird representing fortune during Bathukamma.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Spotted Deer (Jinka)",
        "hindiName": "चित्तीदार हिरण",
        "description": "Gentle graceful chital deer wandering in Telengana reserves.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Tangedu (Senna auriculata)",
        "hindiName": "तंगेड़ू का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Jammi Chettu (Prosopis cineraria)",
        "hindiName": "जम्मी चेट्टू",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Charminar & Laad Bazaar, Hyderabad",
        "hindiName": "चारमीनार एवं लाड बाजार, हैदराबाद",
        "category": "Historical Monument",
        "description": "1591 CE Indo-Islamic square monument with four 56-meter minarets built by Sultan Muhammad Quli Qutb Shah to commemorate the end of a deadly plague, surrounded by the centuries-old Laad Bazaar pearl and lacquer bangle market.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Four 56-meter Ornate Minarets",
          "Laad Bazaar Lacquer Bangle & Pearl Shopping",
          "Historic Mecca Masjid adjacent",
          "Authentic Hyderabadi Dum Biryani & Irani Chai nearby"
        ],
        "nearestCity": "Hyderabad (Old City)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Golconda Fort & Qutb Shahi Tombs",
        "hindiName": "गोलकुंडा किला एवं कुतुब शाही मकबरे",
        "category": "Fort & Palace",
        "description": "Medieval acoustic wonder fortress where a hand clap at the Fateh Darwaza can be heard 1 km away at the Bala Hissar pavilion atop the hill, historic trading source of the Koh-i-Noor and Hope diamonds.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Acoustic Echo System at Fateh Darwaza",
          "Bala Hissar Hilltop Royal Pavilion",
          "Evening Sound & Light Show in English/Hindi",
          "Qutb Shahi Royal Domed Tombs nearby"
        ],
        "nearestCity": "Hyderabad (11 km from center)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Ramappa Temple & Thousand Pillar Temple, Warangal",
        "hindiName": "रामप्पा मंदिर एवं हजार स्तंभ मंदिर, वारंगल",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Site 1213 CE Kakatiya temple built with lightweight floating bricks, sandbox foundation engineering that withstands earthquakes, and intricate black basalt dancing figurine pillars.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Lightweight Floating Bricks in Gopuram",
          "Sandbox Earthquake-Proof Foundation",
          "Exquisite Black Basalt Sculptures",
          "Warangal Fort Stone Gateway (Kakatiya Thoranam)"
        ],
        "nearestCity": "Warangal (70 km) / Hyderabad (160 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Hussain Sagar Lake & Monolithic Buddha",
        "hindiName": "हुसैन सागर झील एवं बुद्ध प्रतिमा",
        "category": "Historical Monument",
        "description": "Heart-shaped artificial lake built in 1563 connecting Hyderabad and Secunderabad, featuring a 350-tonne 18-meter monolithic white granite statue of Lord Buddha standing on the Gibraltar Rock in the center of the lake.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (Evening boat ride)",
        "highlights": [
          "18-meter Monolithic Granite Buddha",
          "Ferry Boat Cruise to Gibraltar Rock",
          "Lumbini Park Musical Fountain",
          "Necklace Road Evening Waterfront Drive"
        ],
        "nearestCity": "Hyderabad (Center)",
        "entryFee": "Ferry ₹100 / Person"
      },
      {
        "name": "Salar Jung Museum & Chowmahalla Palace",
        "hindiName": "सालार जंग संग्रहालय एवं चौमहल्ला पैलेस",
        "category": "Historical Monument",
        "description": "One of the three National Museums of India housing the one-man art collection of Salar Jung III (Nawab Mir Yousuf Ali Khan), featuring the Veiled Rebecca marble statue, musical clock, and the opulent Chowmahalla royal palace of the Nizams.",
        "imageUrl": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (Closed on Fridays)",
        "highlights": [
          "Veiled Rebecca 1876 Marble Sculpture",
          "19th-Century British Bracket Musical Clock",
          "Nizam's Grand Durbar Hall (Khilwat Mubarak)",
          "Vintage Rolls-Royce Royal Fleet"
        ],
        "nearestCity": "Hyderabad (Old City)",
        "entryFee": "Museum ₹50 / Palace ₹100"
      }
    ],
    "majorRivers": [
      "Godavari",
      "Krishna",
      "Musi",
      "Manjira"
    ],
    "famousFood": [
      "Hyderabadi Dum Biryani",
      "Mirchi ka Salan",
      "Haleem",
      "Double ka Meetha",
      "Sarva Pindi"
    ],
    "famousFestivals": [
      "Bathukamma (Floral Festival)",
      "Bonalu",
      "Sammakka Saralamma Jathara (Asia's Largest Tribal Fair)"
    ],
    "classicalDance": "Perini Sivatandavam (Warrior Dance of Kakatiyas)"
  },
  {
    "id": "andhra_pradesh",
    "name": "Andhra Pradesh",
    "hindiName": "आंध्र प्रदेश",
    "odiaName": "ଆନ୍ଧ୍ର ପ୍ରଦେଶ",
    "capital": "Amaravati",
    "zone": "South",
    "formationYear": "1 October 1953 (First Linguistic State)",
    "officialLanguages": [
      "Telugu"
    ],
    "areaKm2": "162,975 km²",
    "population": "53 Million",
    "literacyRate": "67.4%",
    "tagline": "The Sunrise State · Rice Bowl of India",
    "coordinates": {
      "x": 52,
      "y": 72
    },
    "symbols": {
      "bird": {
        "name": "Rose-ringed Parakeet (Rama Chiluka)",
        "hindiName": "तोता / रामा चिलुका",
        "description": "Beloved green parakeet celebrated in Telugu folklore and poetry.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Blackbuck (Krishna Jinka)",
        "hindiName": "काला हिरण",
        "description": "Spiraled-horn antelope roving the grasslands of Andhra Pradesh.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Jasmine (Malle Puvvu)",
        "hindiName": "चमेली का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Neem Tree (Vepa Chettu)",
        "hindiName": "नीम का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Tirupati Balaji (Sri Venkateswara Swamy Temple)",
        "hindiName": "तिरुपति बालाजी (वेंकटेश्वर स्वामी मंदिर)",
        "category": "Spiritual Shrine",
        "description": "The world's richest and most visited Hindu pilgrimage shrine situated atop the seventh peak of Tirumala hills (Seshachalam range), dedicated to Lord Venkateswara (Kaliyuga Varada).",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to March",
        "highlights": [
          "Ananda Nilayam Golden Vimana",
          "Sacred Tirupati Laddu Prasadam (GI Tag)",
          "Hair Tonsuring (Mundan) Ritual",
          "Silathoranam Natural Stone Arch"
        ],
        "nearestCity": "Tirupati (City Center)",
        "entryFee": "Free (Special Entry Darshan ₹300)"
      },
      {
        "name": "Araku Valley & Borra Caves",
        "hindiName": "अराकू घाटी एवं बोरा गुफाएं",
        "category": "Hill Station",
        "description": "Picturesque hill station in the Eastern Ghats at 910m famous for organic coffee plantations, Dhimsa tribal dance, and million-year-old Borra Caves featuring naturally formed limestone stalactites and stalagmites.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "150-million-year-old Borra Limestone Caves",
          "Araku Tribal Museum & Coffee Museum",
          "Katiki & Chaparai Waterfalls",
          "Scenic Vistadome Glass-top Train from Vizag"
        ],
        "nearestCity": "Araku / Visakhapatnam (110 km)",
        "entryFee": "Borra Caves ₹80 (Indians)"
      },
      {
        "name": "Visakhapatnam (Vizag) & RK Beach",
        "hindiName": "विशाखापट्टनम एवं आरके बीच",
        "category": "Beach",
        "description": "'City of Destiny', a coastal gem featuring the INS Kursura Submarine Museum (South Asia's first submarine museum on a beach), Kailasagiri hilltop park overlooking the sea, and Dolphin's Nose lighthouse.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "INS Kursura Decommissioned Submarine Museum",
          "TU 142 Aircraft War Museum",
          "Kailasagiri Hill Ropeway & Shiva-Parvati Statues",
          "Rushikonda Blue Flag Beach Surfing"
        ],
        "nearestCity": "Visakhapatnam (City Center)",
        "entryFee": "Submarine ₹70 / Aircraft Museum ₹70"
      },
      {
        "name": "Gandikota Grand Canyon & Belum Caves",
        "hindiName": "गंडीकोटा (ग्रैंड कैनियन) एवं बेलम गुफाएं",
        "category": "Scenic Wonder",
        "description": "'The Grand Canyon of India', a breathtaking gorge carved by the Pennar river through the Erramala hills, coupled with Belum Caves—India's second longest cave system spanning 3.2 km underground.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to February",
        "highlights": [
          "Massive Red Granite Canyon Gorge View",
          "13th-century Gandikota Fort & Madhavaraya Temple",
          "Belum Caves Underground Stalactite Passages (150 ft deep)",
          "Pennar River Kayaking & Camping"
        ],
        "nearestCity": "Kadapa / Jammalamadugu (15 km) / Kurnool (140 km)",
        "entryFee": "Gandikota Free / Belum Caves ₹65"
      },
      {
        "name": "Lepakshi Veerabhadra Temple",
        "hindiName": "लेपाक्षी वीरभद्र मंदिर",
        "category": "Historical Monument",
        "description": "16th-century Vijayanagara architectural masterpiece famous for its Hanging Pillar that does not touch the ground, India's largest monolithic Nandi bull carved from a single granite boulder, and exquisite ceiling frescoes.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Mysterious Gravity-defying Hanging Pillar",
          "Giant 27-foot Monolithic Nandi Bull",
          "Nagalinga Multi-Hooded Serpent Shrine",
          "Ancient Vijayanagara Ceiling Frescoes"
        ],
        "nearestCity": "Lepakshi / Hindupur (14 km) / Bengaluru (120 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Godavari",
      "Krishna",
      "Penna",
      "Tungabhadra",
      "Nagavali"
    ],
    "famousFood": [
      "Hyderabadi Pesarattu",
      "Gongura Pachadi",
      "Andhra Spicy Chicken Curry",
      "Pootharekulu",
      "Tirupati Laddu (GI Tag)"
    ],
    "famousFestivals": [
      "Ugadi (Telugu New Year)",
      "Tirupati Brahmotsavam",
      "Sankranti",
      "Visakha Utsav"
    ],
    "classicalDance": "Kuchipudi (Classical dance-drama born in Kuchipudi village)"
  },
  {
    "id": "bihar",
    "name": "Bihar",
    "hindiName": "बिहार",
    "odiaName": "ବିହାର",
    "capital": "Patna (Ancient Pataliputra)",
    "zone": "East",
    "formationYear": "22 March 1912 (Bihar Diwas)",
    "officialLanguages": [
      "Hindi",
      "Urdu",
      "Bhojpuri",
      "Maithili"
    ],
    "areaKm2": "94,163 km²",
    "population": "130 Million",
    "literacyRate": "63.8%",
    "tagline": "Blissful Bihar · Birthplace of Buddhism & Jainism",
    "coordinates": {
      "x": 58,
      "y": 40
    },
    "symbols": {
      "bird": {
        "name": "House Sparrow (Gauraiya)",
        "hindiName": "गौरैया",
        "description": "Common house bird conserved actively across Bihar households.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Gaur (Indian Bison)",
        "hindiName": "गौर (जंगली भैंसा)",
        "description": "Powerful bovine inhabiting Valmiki National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Kachnar Flower",
        "hindiName": "कचनार का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Peepal Tree",
        "hindiName": "पीपल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Mahabodhi Temple Complex, Bodh Gaya",
        "hindiName": "महाबोधि मंदिर, बोधगया",
        "category": "UNESCO Heritage",
        "description": "The cradle of Buddhism and a UNESCO World Heritage Site, marking the exact spot where Prince Siddhartha Gautama attained supreme enlightenment under the sacred Bodhi Tree in 531 BCE.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Sacred 5th-Generation Bodhi Tree (Ficus religiosa)",
          "55-meter Soaring Pyramidal Grand Tower",
          "Vajrasana (Diamond Throne of Ashoka)",
          "80-foot Giant Great Buddha Statue nearby"
        ],
        "nearestCity": "Bodh Gaya / Gaya (12 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Nalanda University Archaeological Ruins",
        "hindiName": "नालंदा विश्वविद्यालय के खंडहर",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Site, the ancient international monastic university that flourished from the 5th to 12th century CE, accommodating 10,000 Buddhist students and 2,000 teachers from across Asia before its famed library Dharmaganja was destroyed.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Monumental Sariputra Stupa Structure",
          "Red Brick Monastic Dormitories & Classroom Cells",
          "Ancient Underground Drainage System",
          "Nalanda Archaeological Museum"
        ],
        "nearestCity": "Nalanda / Rajgir (15 km) / Patna (85 km)",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Rajgir (Vishwa Shanti Stupa & Vulture's Peak)",
        "hindiName": "राजगीर (विश्व शांति स्तूप एवं गृद्धकूट पर्वत)",
        "category": "Spiritual Shrine",
        "description": "Ancient capital of the Magadha Empire, sacred to both Buddhism and Jainism. Features the white Japanese Vishwa Shanti Stupa atop Ratnagiri hill accessed by aerial ropeway, Griddhakuta (Vulture's Peak) where Buddha gave sermons, and natural hot springs.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Ratnagiri Hill Aerial Chairlift Ropeway",
          "White Japanese Peace Pagoda (Shanti Stupa)",
          "Vulture's Peak (Griddhakuta Hill)",
          "Brahmakund Natural Sulphur Hot Springs"
        ],
        "nearestCity": "Rajgir (City Center) / Patna (100 km)",
        "entryFee": "Ropeway ₹100"
      },
      {
        "name": "Vaishali & Ashokan Pillar",
        "hindiName": "वैशाली एवं अशोक स्तंभ",
        "category": "Historical Monument",
        "description": "The world's first republic (Licchavi Republic), birthplace of Lord Mahavira (24th Jain Tirthankara), and the site where Lord Buddha preached his last sermon, marked by a perfectly intact monolithic polished Ashokan Pillar topped by a lion.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Intact Polished Ashokan Lion Pillar",
          "Relic Stupa where Buddha's Ashes were Found",
          "Abhishek Pushkarni (Coronation Sacred Tank)",
          "Kundalpur (Birthplace of Mahavira)"
        ],
        "nearestCity": "Vaishali / Hajipur (35 km) / Patna (55 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Golghar & Takht Sri Patna Sahib, Patna",
        "hindiName": "गोलघर एवं तख्त श्री पटना साहिब",
        "category": "Historical Monument",
        "description": "Patna's historic landmarks: Golghar, a massive 1786 pillarless beehive-shaped granary with 145 spiral exterior steps offering panoramic views of the Ganga; and Takht Sri Harmandir Ji Patna Sahib, the holy birthplace of Guru Gobind Singh Ji.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "145 Spiral Steps of Golghar Granary",
          "Birthplace Shrine of Guru Gobind Singh Ji",
          "Bihar Museum World-Class Exhibition",
          "Sunset Boat Ride along Ganga Ghats"
        ],
        "nearestCity": "Patna (City Center)",
        "entryFee": "Golghar ₹10 / Museum ₹100"
      }
    ],
    "majorRivers": [
      "Ganga",
      "Gandak",
      "Kosi (Sorrow of Bihar)",
      "Son",
      "Ghaghara",
      "Bagmati"
    ],
    "famousFood": [
      "Litti Chokha",
      "Sattu Paratha",
      "Thekua (Chhath Prasad)",
      "Khaja of Silao",
      "Chana Ghugni"
    ],
    "famousFestivals": [
      "Chhath Puja (Grand Sun worship)",
      "Sonepur Cattle Fair",
      "Bihula Festival",
      "Buddha Jayanti"
    ],
    "classicalDance": "Bidesiya & Jat-Jatin Folk Theatre"
  },
  {
    "id": "assam",
    "name": "Assam",
    "hindiName": "असम",
    "odiaName": "ଆସାମ",
    "capital": "Dispur (Guwahati)",
    "zone": "North-East",
    "formationYear": "26 January 1950",
    "officialLanguages": [
      "Assamese",
      "Bodo",
      "Bengali"
    ],
    "areaKm2": "78,438 km²",
    "population": "36 Million",
    "literacyRate": "72.2%",
    "tagline": "Awesome Assam · Land of the Red River & Blue Hills",
    "coordinates": {
      "x": 82,
      "y": 38
    },
    "symbols": {
      "bird": {
        "name": "White-winged Wood Duck (Deo Hah)",
        "hindiName": "सफेद पंखों वाली लकड़ी बत्तख",
        "description": "Rare, secretive tropical duck inhabiting swamp forests.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "One-horned Rhinoceros",
        "hindiName": "एक सींग वाला गैंडा",
        "description": "Iconic prehistoric mammal preserved in Kaziranga National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Foxtail Orchid (Kopou Phool)",
        "hindiName": "फॉक्सटेल ऑर्किड (कपोऊ फूल)",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Hollong Tree",
        "hindiName": "होलॉन्ग का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Kaziranga National Park",
        "hindiName": "काजीरंगा राष्ट्रीय उद्यान",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Site on the Brahmaputra floodplain, home to two-thirds of the world's population of the Great One-Horned Rhinoceros (over 2,600 rhinos), along with the highest density of Royal Bengal tigers and wild water buffaloes.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to April (Park closed in Monsoon)",
        "highlights": [
          "Elephant-Back Morning Rhino Safari",
          "Open Gypsy Wildlife Safaris in Kohora & Bagori",
          "Great One-Horned Rhinoceros Sightings",
          "Kaziranga National Orchid and Biodiversity Park"
        ],
        "nearestCity": "Kohora / Jorhat (90 km) / Guwahati (220 km)",
        "entryFee": "Safari Gypsy ₹2,500 - ₹3,500 + Park entry"
      },
      {
        "name": "Kamakhya Temple, Guwahati",
        "hindiName": "कामाख्या मंदिर, गुवाहाटी",
        "category": "Spiritual Shrine",
        "description": "One of the oldest and most revered of the 51 Shakti Peethas, situated atop Nilachal Hill overlooking the Brahmaputra river. Celebrated for its unique sanctum where the Yoni of goddess Sati is worshipped, and the annual Ambubachi Mela.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April & June (Ambubachi Mela)",
        "highlights": [
          "Nilachal Hilltop Sacred Sanctum",
          "Annual Ambubachi Fertility Festival",
          "Brahmaputra Ropeway (India's Longest River Ropeway)",
          "Umananda Island Temple in Mid-Brahmaputra"
        ],
        "nearestCity": "Guwahati (City Center)",
        "entryFee": "Free Entry (Special Darshan ₹500)"
      },
      {
        "name": "Majuli Island (World's Largest River Island)",
        "hindiName": "माजुली द्वीप (विश्व का सबसे बड़ा नदी द्वीप)",
        "category": "Scenic Wonder",
        "description": "The world's largest inhabited river island nestled in the Brahmaputra river, epicenter of Assamese Neo-Vaishnavite culture established by Srimanta Sankardeva, home to historic Satras (monasteries) and traditional mask-making.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Raas Mahotsav in Nov)",
        "highlights": [
          "Brahmaputra Ferry Crossing from Neemati Ghat",
          "Ancient Vaishnavite Satras (Kamalabari, Auniati)",
          "Traditional Chamari Mask-Making at Samaguri Satra",
          "Mishing Tribal Villages & Bamboo Cottages"
        ],
        "nearestCity": "Majuli / Jorhat (Ferry 1.5 hr)",
        "entryFee": "Ferry ₹15 - ₹30"
      },
      {
        "name": "Manas National Park",
        "hindiName": "मानस राष्ट्रीय उद्यान",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Site, Project Tiger reserve, and biosphere reserve contiguous with Royal Manas National Park in Bhutan, renowned for rare endangered species like the Pygmy Hog, Golden Langur, and wild water buffalo.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Endemic Golden Langur & Pygmy Hog Sightings",
          "Manas River Bamboo Rafting through Forests",
          "Indo-Bhutan Border Mathanguri Forest Lodge",
          "Elephant & Jeep Jungle Safaris"
        ],
        "nearestCity": "Barpeta Road (40 km) / Guwahati (140 km)",
        "entryFee": "Safari ₹3,000 - ₹4,500"
      },
      {
        "name": "Sivasagar & Rang Ghar (Ahom Kingdom Capital)",
        "hindiName": "शिवसागर एवं रंग घर",
        "category": "Historical Monument",
        "description": "Historic capital of the 600-year Ahom Kingdom, featuring Rang Ghar (Asia's oldest amphitheater where Ahom kings watched buffalo fights), Talatal Ghar multi-storey palace with secret tunnels, and the 200-foot Shiva Dol temple.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Rang Ghar Two-Storey Royal Amphitheater",
          "Talatal Ghar Underground Palace & Tunnels",
          "Shiva Dol (One of India's Tallest Shiva Temples)",
          "Joysagar Artificial Lake (Largest Man-Made Tank)"
        ],
        "nearestCity": "Sivasagar / Jorhat (55 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      }
    ],
    "majorRivers": [
      "Brahmaputra",
      "Barak",
      "Manas",
      "Subansiri",
      "Dihing"
    ],
    "famousFood": [
      "Assam Orthodox Tea",
      "Masor Tenga (Tangy Fish)",
      "Khaar",
      "Duck Curry with Ash Gourd",
      "Pitha"
    ],
    "famousFestivals": [
      "Rongali Bihu",
      "Kongali Bihu",
      "Ambubachi Mela",
      "Majuli Raas Mahotsav"
    ],
    "classicalDance": "Sattriya Dance (500-year-old monastic classical dance founded by Srimanta Sankardev)"
  },
  {
    "id": "jammu_kashmir",
    "name": "Jammu & Kashmir",
    "hindiName": "जम्मू और कश्मीर",
    "odiaName": "ଜମ୍ମୁ ଓ କଶ୍ମୀର",
    "capital": "Srinagar (Summer) / Jammu (Winter)",
    "zone": "UT",
    "formationYear": "31 October 2019 (Union Territory)",
    "officialLanguages": [
      "Kashmiri",
      "Dogri",
      "Urdu",
      "Hindi",
      "English"
    ],
    "areaKm2": "42,241 km²",
    "population": "13.6 Million",
    "literacyRate": "67.2%",
    "tagline": "Paradise on Earth · Crown of India",
    "coordinates": {
      "x": 32,
      "y": 14
    },
    "symbols": {
      "bird": {
        "name": "Kalij Pheasant",
        "hindiName": "कालीज तीतर",
        "description": "Glossy blue-black mountain pheasant native to the Himalayas.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Kashmir Stag (Hangul)",
        "hindiName": "हंगुल (कश्मीरी हिरण)",
        "description": "Critically endangered red deer subspecies protected in Dachigam National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Lotus",
        "hindiName": "कमल का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Chinar Tree (Platanus orientalis)",
        "hindiName": "चिनार का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Dal Lake & Houseboats, Srinagar",
        "hindiName": "डल झील एवं हाउसबोट, श्रीनगर",
        "category": "Scenic Wonder",
        "description": "'Jewel in the crown of Kashmir', a pristine 18 sq km urban lake framed by Pir Panjal mountains, famous for carved cedarwood luxury houseboats, colorful Shikara rides, and the floating vegetable market at dawn.",
        "imageUrl": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "April to October & Dec-Feb (Frozen Dal Lake)",
        "highlights": [
          "Handmade Carved Cedar Houseboat Stay",
          "Shikara Boat Cruise to Char Chinar Island",
          "Dawn Floating Vegetable & Flower Market",
          "Mughal Gardens: Shalimar Bagh & Nishat Bagh"
        ],
        "nearestCity": "Srinagar (City Center)",
        "entryFee": "Shikara Ride ₹700 - ₹1,500 / hr"
      },
      {
        "name": "Gulmarg & Apharwat Gondola",
        "hindiName": "गुलमर्ग एवं गोंडोला केबल कार",
        "category": "Hill Station",
        "description": "'Meadow of Flowers' at 2,650m, Asia's premier ski destination featuring the world's second-highest operating cable car, the Gulmarg Gondola, ascending to 3,980 meters on Apharwat Peak.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "December to March (Skiing) / May to Sep (Green meadows)",
        "highlights": [
          "Gulmarg Gondola to 3,980m (Phase 1 & 2)",
          "Deep Powder Snow Skiing & Snowboarding",
          "World's Highest 18-hole Golf Course",
          "St. Mary's 100-year-old British Church in Snow"
        ],
        "nearestCity": "Gulmarg / Srinagar (50 km)",
        "entryFee": "Gondola Phase 1 ₹800 / Phase 2 ₹1,000"
      },
      {
        "name": "Pahalgam, Betaab Valley & Aru Valley",
        "hindiName": "पहलगाम, बेताब घाटी एवं अरू घाटी",
        "category": "Hill Station",
        "description": "'Valley of Shepherds' at the confluence of Lidder river streams, gateway to the holy Amarnath Yatra, famous for lush alpine meadows, Betaab Valley pine forests, and pony treks to Baisaran ('Mini Switzerland').",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to November & July-Aug (Amarnath Yatra)",
        "highlights": [
          "Betaab Valley Lush Meadows & Lidder Stream",
          "Baisaran Meadow Horse Trek",
          "Aru Valley Wildlife & Glacial Treks",
          "Trout Fishing in Crystal Lidder River"
        ],
        "nearestCity": "Pahalgam / Srinagar (95 km)",
        "entryFee": "Betaab Valley ₹100"
      },
      {
        "name": "Vaishno Devi Shrine, Katra",
        "hindiName": "माता वैष्णो देवी मंदिर, कटरा",
        "category": "Spiritual Shrine",
        "description": "One of India's most revered Shakti Peeth shrines situated in the Trikuta mountains at 5,200 ft, welcoming over 8 million pilgrims annually who undertake a 12 km sacred trek or battery-car/helicopter ascent.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to November (Navratri festivals)",
        "highlights": [
          "Holy Pindies Cave Darshan (Maha Kali, Lakshmi, Saraswati)",
          "Ardhkuwari Cave (Garbha Joon)",
          "Bhairon Nath Temple Ropeway",
          "Illuminated All-Weather Mountain Track"
        ],
        "nearestCity": "Katra (Base Camp) / Jammu (50 km)",
        "entryFee": "Free Entry (Helicopter/Ropeway extra)"
      },
      {
        "name": "Sonamarg & Thajiwas Glacier",
        "hindiName": "सोनमर्ग एवं थाजीवास ग्लेशियर",
        "category": "Hill Station",
        "description": "'Meadow of Gold' on the Sindh river at 2,740m, surrounded by alpine glacial peaks, the starting point of the Great Lakes Trek and pony rides to the perennial Thajiwas snow glacier.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "April to October",
        "highlights": [
          "Thajiwas Glacier Sledging & Snow Play",
          "Zoji La Pass (Gateway to Ladakh)",
          "Kashmir Great Lakes Multi-day Trek Base",
          "Sindh River White Water Rafting"
        ],
        "nearestCity": "Sonamarg / Srinagar (80 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Jhelum",
      "Chenab",
      "Indus",
      "Tawi"
    ],
    "famousFood": [
      "Wazwan (Rogan Josh, Gustaba)",
      "Kashmiri Kahwa",
      "Dum Aloo",
      "Modur Pulao",
      "Nadru Yakhni"
    ],
    "famousFestivals": [
      "Tulip Festival Srinagar",
      "Shikara Festival",
      "Baisakhi",
      "Navreh"
    ],
    "classicalDance": "Rouf & Bhand Pather Folk Dance"
  },
  {
    "id": "ladakh",
    "name": "Ladakh",
    "hindiName": "लद्दाख",
    "odiaName": "ଲାଦାଖ",
    "capital": "Leh & Kargil",
    "zone": "UT",
    "formationYear": "31 October 2019",
    "officialLanguages": [
      "Ladakhi",
      "Tibetan",
      "Hindi",
      "English"
    ],
    "areaKm2": "59,146 km²",
    "population": "300,000",
    "literacyRate": "77.2%",
    "tagline": "Land of High Passes · Rooftop of the World",
    "coordinates": {
      "x": 38,
      "y": 8
    },
    "symbols": {
      "bird": {
        "name": "Black-necked Crane",
        "hindiName": "काली गर्दन वाला सारस",
        "description": "Revered high-altitude bird nesting around Tso Moriri and Tso Kar lakes.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Snow Leopard (Shan)",
        "hindiName": "हिम तेंदुआ",
        "description": "Ghost of the mountains roaming Hemis National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Himalayan Blue Poppy",
        "hindiName": "हिमालयी नीला पोस्ता",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Juniper (Shukpa)",
        "hindiName": "धूप का पेड़ (जुनिपर)",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Pangong Tso Lake",
        "hindiName": "पैंगोंग त्सो झील",
        "category": "Scenic Wonder",
        "description": "High-altitude endorheic lake at 14,270 ft extending 134 km from Ladakh into Tibet, renowned for its hypnotic color-changing waters shifting from turquoise blue to deep emerald green and purple under the sun.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to September",
        "highlights": [
          "Hypnotic Changing Shades of Blue Waters",
          "Drive over Chang La Pass (17,590 ft)",
          "Camping under Pristine Milky Way Night Skies",
          "Marmot Sightings along Lakeside"
        ],
        "nearestCity": "Spangmik / Leh (140 km)",
        "entryFee": "Inner Line Permit ₹400"
      },
      {
        "name": "Nubra Valley & Hunder Sand Dunes",
        "hindiName": "नुब्रा घाटी एवं हुंडर सैंड ड्यून्स",
        "category": "Scenic Wonder",
        "description": "Breathtaking high-altitude cold desert valley carved by Shyok and Nubra rivers, famous for white sand dunes at Hunder where rare double-humped Bactrian camels roam, and the 106-foot Maitreya Buddha statue at Diskit Monastery.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to September",
        "highlights": [
          "Double-Humped Bactrian Camel Safari",
          "106-foot Colossal Maitreya Buddha at Diskit",
          "Hot Sulphur Springs at Panamik",
          "Turtuk Village (Balti culture on Pakistan border)"
        ],
        "nearestCity": "Diskit / Leh (120 km via Khardung La)",
        "entryFee": "Camel Ride ₹300 - ₹500"
      },
      {
        "name": "Khardung La Pass (17,982 ft)",
        "hindiName": "खारदुंग ला दर्रा",
        "category": "Scenic Wonder",
        "description": "One of the world's highest motorable mountain passes at 5,359 meters (17,982 ft), the historic caravan gateway connecting Leh with the Nubra Valley and the Silk Route.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to October",
        "highlights": [
          "Iconic 'World's Highest Motorable Pass' Signboard",
          "Panoramic Himalayan & Karakoram Glacial Vistas",
          "Mountain Biking Descent from Top to Leh",
          "Rinchen Cafe at Pass Summit"
        ],
        "nearestCity": "Leh (40 km)",
        "entryFee": "Inner Line Permit Required"
      },
      {
        "name": "Leh Palace, Shanti Stupa & Hall of Fame",
        "hindiName": "लेह पैलेस एवं शांति स्तूप",
        "category": "Historical Monument",
        "description": "9-storey Tibetan royal fortress built in 1600 CE by King Sengge Namgyal modeled on Lhasa's Potala Palace, paired with the white-domed Japanese Shanti Stupa providing 360° views of the Indus Valley.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to October",
        "highlights": [
          "360° Sunset View from Shanti Stupa",
          "9-Storey Namgyal Royal Tibetan Palace",
          "Hall of Fame Military Museum",
          "Leh Main Bazaar Tibetan Curio Shops"
        ],
        "nearestCity": "Leh (City Center)",
        "entryFee": "Palace ₹25 / Stupa Free"
      },
      {
        "name": "Magnetic Hill & Indus-Zanskar Sangam",
        "hindiName": "मैग्नेटिक हिल एवं संगम",
        "category": "Scenic Wonder",
        "description": "Gravity-defying optical illusion hill where parked vehicles appear to roll uphill on their own, followed by the dramatic confluence (Sangam) of the emerald Indus and muddy turquoise Zanskar rivers.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to October",
        "highlights": [
          "Gravity Hill Vehicle Roll Demonstration",
          "Two-Tone River Confluence at Nimmu",
          "Grade IV Zanskar River Rafting",
          "Gurdwara Pathar Sahib (Guru Nanak boulder)"
        ],
        "nearestCity": "Nimmu / Leh (30 km)",
        "entryFee": "Free Entry (Rafting ₹1,500 - ₹3,000)"
      }
    ],
    "majorRivers": [
      "Indus (Sindhu)",
      "Zanskar",
      "Shyok",
      "Nubra"
    ],
    "famousFood": [
      "Thukpa",
      "Momos",
      "Butter Tea (Gur Gur Chai)",
      "Skyu",
      "Tingmo",
      "Chhurpi (Yak Cheese)"
    ],
    "famousFestivals": [
      "Hemis Tsechu Festival",
      "Losar (Ladakhi New Year)",
      "Ladakh Festival"
    ],
    "classicalDance": "Cham Masked Dances by Buddhist Monks"
  },
  {
    "id": "delhi",
    "name": "Delhi (NCT)",
    "hindiName": "दिल्ली (राष्ट्रीय राजधानी)",
    "odiaName": "ଦିଲ୍ଲୀ",
    "capital": "New Delhi (National Capital of India)",
    "zone": "UT",
    "formationYear": "1 February 1992 (NCT Act)",
    "officialLanguages": [
      "Hindi",
      "English",
      "Urdu",
      "Punjabi"
    ],
    "areaKm2": "1,484 km²",
    "population": "32 Million",
    "literacyRate": "86.2%",
    "tagline": "Dildaar Dilli · Heart of the Nation",
    "coordinates": {
      "x": 37,
      "y": 32
    },
    "symbols": {
      "bird": {
        "name": "House Sparrow",
        "hindiName": "गौरैया",
        "description": "Beloved urban bird nurtured in gardens across the capital.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Nilgai (Blue Bull)",
        "hindiName": "नीलगाय",
        "description": "Largest Asian antelope wandering the Asola Bhatti Wildlife Sanctuary and Central Ridge.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Alfalfa",
        "hindiName": "अल्फाल्फा का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Gulmohar (Flamboyant)",
        "hindiName": "गुलमोहर का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Red Fort (Lal Qila)",
        "hindiName": "लाल किला, दिल्ली",
        "category": "UNESCO Heritage",
        "description": "Massive 17th-century octagonal red sandstone fortress designed by Ustad Ahmad Lahori for Mughal Emperor Shah Jahan, symbol of India's national sovereignty where the Prime Minister hoists the Tricolour on Independence Day.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Lahori Gate & Diwan-i-Aam",
          "Diwan-i-Khas ('If there is paradise on earth...')",
          "Moti Masjid & Royal Hammams",
          "Evening Sound & Light Projection Show"
        ],
        "nearestCity": "Old Delhi (City Center)",
        "entryFee": "₹50 (Indians) / ₹550 (Foreigners)"
      },
      {
        "name": "Qutub Minar & Iron Pillar",
        "hindiName": "कुतुब मीनार एवं लौह स्तंभ",
        "category": "UNESCO Heritage",
        "description": "World's tallest brick minaret at 72.5 meters (238 ft) built in 1192 CE by Qutb-ud-din Aibak, alongside the rust-resistant 4th-century Gupta Iron Pillar and Quwwat-ul-Islam Mosque.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "72.5-meter Fluted Sandstone Minaret",
          "1600-year-old Rustless Gupta Iron Pillar",
          "Alai Darwaza Inlaid Marble Arch",
          "Illuminated Qutub Complex at Night"
        ],
        "nearestCity": "Mehrauli, South Delhi",
        "entryFee": "₹50 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "India Gate & Kartavya Path",
        "hindiName": "इंडिया गेट एवं कर्तव्य पथ",
        "category": "Historical Monument",
        "description": "42-meter high triumphal arch war memorial designed by Sir Edwin Lutyens honoring 84,000 soldiers, fronted by the National War Memorial and the grand ceremonial boulevard of Kartavya Path leading to Rashtrapati Bhavan.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Evening lights)",
        "highlights": [
          "Amar Jawan Jyoti & National War Memorial",
          "Rashtrapati Bhavan Vista from Kartavya Path",
          "Canopy Statue of Netaji Subhas Chandra Bose",
          "Evening Street Food & Ice Cream Promenade"
        ],
        "nearestCity": "Central Delhi",
        "entryFee": "Free Entry"
      },
      {
        "name": "Humayun's Tomb",
        "hindiName": "हुमायूँ का मकबरा",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage masterpiece commissioned in 1558 by Empress Bega Begum, the first grand garden-tomb on the Indian subcontinent that directly inspired the architectural design of the Taj Mahal.",
        "imageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Persian Charbagh Four-Quadrant Water Gardens",
          "Double-Domed White Marble Centerpiece",
          "Isa Khan 1547 Octagonal Tomb Complex",
          "Barber's Tomb & Arab Serai Gateway"
        ],
        "nearestCity": "Nizamuddin, New Delhi",
        "entryFee": "₹40 (Indians) / ₹600 (Foreigners)"
      },
      {
        "name": "Akshardham Temple Complex",
        "hindiName": "स्वामीनारायण अक्षरधाम मंदिर",
        "category": "Spiritual Shrine",
        "description": "Colossal traditional Hindu mandir carved from pink Rajasthani sandstone and Italian Carrara marble without steel or concrete, featuring 234 carved pillars, Sahaj Anand water laser show, and boat ride through Vedic heritage.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Evening Laser Show)",
        "highlights": [
          "141-foot High Hand-Carved Stone Mandir",
          "Sahaj Anand Musical Water & Laser Fountain Show",
          "Sanskruti Vihar 12-minute Cultural Boat Ride",
          "Abhishek Mandap & Lotus Garden"
        ],
        "nearestCity": "East Delhi (Akshardham Metro)",
        "entryFee": "Temple Free / Exhibition & Show ₹250"
      },
      {
        "name": "Lotus Temple & Jama Masjid",
        "hindiName": "लोटस टेम्पल एवं जामा मस्जिद",
        "category": "Spiritual Shrine",
        "description": "Architectural icons of unity: the Bahá'í Lotus Temple crafted in 27 free-standing white marble petals welcoming all faiths, paired with Shah Jahan's Jama Masjid, India's largest congregational mosque in Old Delhi.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Award-Winning Lotus-Petal Architecture",
          "Silent Meditation Hall for All Religions",
          "Jama Masjid Courtyard Holding 25,000 People",
          "Chandni Chowk Paranthe Wali Gali Street Food"
        ],
        "nearestCity": "Kalkaji / Chandni Chowk",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Yamuna"
    ],
    "famousFood": [
      "Butter Chicken (Moti Mahal)",
      "Chole Bhature",
      "Chaat of Chandni Chowk",
      "Parathas of Paranthe Wali Gali",
      "Nihari"
    ],
    "famousFestivals": [
      "Republic Day Parade",
      "Qutub Festival",
      "Dussehra Ramlila Ground",
      "Diwali"
    ],
    "classicalDance": "Kathak & International Cultural Festivals"
  },
  {
    "id": "goa",
    "name": "Goa",
    "hindiName": "गोवा",
    "odiaName": "ଗୋଆ",
    "capital": "Panaji",
    "zone": "West",
    "formationYear": "30 May 1987",
    "officialLanguages": [
      "Konkani"
    ],
    "areaKm2": "3,702 km² (Smallest State)",
    "population": "1.6 Million",
    "literacyRate": "88.7%",
    "tagline": "A Perfect Holiday Destination · Pearl of the Orient",
    "coordinates": {
      "x": 33,
      "y": 70
    },
    "symbols": {
      "bird": {
        "name": "Flame-throated Bulbul",
        "hindiName": "माणिकण (फ्लेम-थ्रोटेड बुलबुल)",
        "description": "Bright yellow bird with ruby red throat.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Gaur (Indian Bison)",
        "hindiName": "गौर (जंगली सांड)",
        "description": "Robust wild cattle roaming Bhagwan Mahaveer Sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Red Jasmine",
        "hindiName": "लाल चमेली",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Matti (Terminalia elliptica)",
        "hindiName": "असन / मत्ती का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Basilica of Bom Jesus & Se Cathedral, Old Goa",
        "hindiName": "बेसिलिका ऑफ बॉम जीसस, ओल्ड गोवा",
        "category": "UNESCO Heritage",
        "description": "UNESCO Baroque Roman Catholic masterpiece completed in 1605, holding the sacred mortal remains of St. Francis Xavier in a silver casket, opposite the monumental Se Cathedral with its Golden Bell.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February",
        "highlights": [
          "Sacred Relics of St. Francis Xavier",
          "Unplastered Laterite Baroque Facade",
          "Se Cathedral Golden Bell (Largest in Asia)",
          "Feast of St. Francis Xavier in Dec"
        ],
        "nearestCity": "Old Goa / Panaji (10 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Calangute, Baga & Anjuna Beaches",
        "hindiName": "कलंगूट, बागा एवं अंजुना बीच",
        "category": "Beach",
        "description": "The pulse of North Goa tourism, famed for golden sand stretches, thrilling water sports (parasailing, jet-skiing), legendary beach shacks (Tito's, Britto's), and Wednesday Anjuna flea market.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Parasailing, Banana Boat & Jet Ski Sports",
          "Beachfront Candlelight Shacks & Seafood",
          "Anjuna Wednesday Flea Market",
          "Baga River Creek Nightlife"
        ],
        "nearestCity": "Calangute / Panaji (16 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Dudhsagar Waterfalls",
        "hindiName": "दूधसागर जलप्रपात",
        "category": "Scenic Wonder",
        "description": "'Sea of Milk', a four-tiered 310-meter (1,017 ft) roaring cascade on the Mandovi river amidst Bhagwan Mahavir Wildlife Sanctuary, famous for the scenic railway viaduct crossing directly in front of the spray.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May (Monsoon train view)",
        "highlights": [
          "Four-Tiered 310m Roaring Waterfall",
          "Jeep Safari through Mollem National Park",
          "Railway Bridge crossing over Waterfall",
          "Natural Plunge Pool Swimming"
        ],
        "nearestCity": "Kulem / Madgaon (45 km) / Panaji (60 km)",
        "entryFee": "Jeep ₹500 - ₹800 per person + Forest entry"
      },
      {
        "name": "Fort Aguada & Chapora Fort",
        "hindiName": "अगुआडा किला एवं चपोरा किला",
        "category": "Fort & Palace",
        "description": "17th-century Portuguese coastal fortresses overlooking the Arabian Sea, featuring Aguada's four-storey lighthouse and massive 79-million-litre freshwater cistern, and Chapora Fort of 'Dil Chahta Hai' fame.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April (Sunset)",
        "highlights": [
          "1612 Portuguese Lighthouse & Ramparts",
          "360-degree Sunset View of Vagator Shoreline",
          "Upper Aguada Prison Heritage Museum",
          "Sinquerim Beach Watersports below Fort"
        ],
        "nearestCity": "Candolim / Panaji (14 km)",
        "entryFee": "Fort Free / Museum ₹50"
      },
      {
        "name": "Palolem & Agonda Beaches, South Goa",
        "hindiName": "पालोलेम एवं अगोंडा बीच, दक्षिण गोवा",
        "category": "Beach",
        "description": "Laid-back crescent-shaped paradise with calm turquoise bays, coconut palm tree groves, dolphin-spotting boat trips, silent noise parties, and pristine nesting grounds for Olive Ridley sea turtles at Agonda.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Scenic Crescent Bay & Kayaking",
          "Dolphin Spotting & Butterfly Beach Boat Trips",
          "Olive Ridley Turtle Nesting Sanctuary",
          "Silent Noise Headphone Parties"
        ],
        "nearestCity": "Canacona / Madgaon (35 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Fontainhas Latin Quarter, Panaji",
        "hindiName": "फोंटेनहास लैटिन क्वार्टर, पणजी",
        "category": "Historical Monument",
        "description": "Asia's only authentic Latin Quarter, an enchanting heritage district filled with 18th-century brightly painted Portuguese villas in ochre yellow, indigo blue and terracotta, narrow lanes, and quaint bakeries.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (Morning/Evening stroll)",
        "highlights": [
          "Portuguese Pastel Colonial Architecture",
          "Traditional Portuguese Bakeries (Pastel de Nata)",
          "St. Sebastian Chapel",
          "Heritage Art Galleries & Boutiques"
        ],
        "nearestCity": "Panaji (City Center)",
        "entryFee": "Free Walking Tour"
      }
    ],
    "majorRivers": [
      "Mandovi",
      "Zuari",
      "Terekhol",
      "Chapora"
    ],
    "famousFood": [
      "Goan Fish Curry Rice",
      "Pork Vindaloo",
      "Bebinca (7-layer dessert)",
      "Xacuti",
      "Feni (Cashew Liquor)"
    ],
    "famousFestivals": [
      "Goa Carnival",
      "Shigmo",
      "Feast of St. Francis Xavier",
      "Sunburn Festival"
    ],
    "classicalDance": "Fugdi & Dekhnni Folk Dances"
  },
  {
    "id": "uttarakhand",
    "name": "Uttarakhand",
    "hindiName": "उत्तराखंड",
    "odiaName": "ଉତ୍ତରାଖଣ୍ଡ",
    "capital": "Dehradun (Winter) / Gairsain (Summer)",
    "zone": "North",
    "formationYear": "9 November 2000",
    "officialLanguages": [
      "Hindi",
      "Sanskrit",
      "Garhwali",
      "Kumaoni"
    ],
    "areaKm2": "53,483 km²",
    "population": "11.5 Million",
    "literacyRate": "78.8%",
    "tagline": "Devbhoomi · Land of the Gods",
    "coordinates": {
      "x": 42,
      "y": 25
    },
    "symbols": {
      "bird": {
        "name": "Himalayan Monal",
        "hindiName": "हिमालयी मोनाल",
        "description": "Brilliantly iridescent rainbow-plumaged mountain pheasant.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Alpine Musk Deer (Kasturi Mrig)",
        "hindiName": "कस्तूरी मृग",
        "description": "Fragile shy mountain deer celebrated for natural musk.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Brahma Kamal",
        "hindiName": "ब्रह्म कमल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Burans (Rhododendron)",
        "hindiName": "बुरांश का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Kedarnath & Badrinath (Chardham)",
        "hindiName": "केदारनाथ एवं बद्रीनाथ (चारधाम)",
        "category": "Spiritual Shrine",
        "description": "Pinnacles of Himalayan spiritual pilgrimage at over 11,000 ft: Kedarnath Jyotirlinga standing steadfast against Mandakini glaciers, and Badrinath Temple dedicated to Lord Vishnu beside hot water Tapt Kund.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to June & September to October (Closed in winter)",
        "highlights": [
          "8th-Century Adi Shankaracharya Kedarnath Shrine",
          "Badrinath Painted Bright Facade on Alaknanda River",
          "Mana Village (Last Indian Village before Tibet border)",
          "Vasudhara 400-foot Glacial Waterfall"
        ],
        "nearestCity": "Rudraprayag / Joshimath / Haridwar (230 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Rishikesh & Haridwar (Yoga Capital of the World)",
        "hindiName": "ऋषिकेश एवं हरिद्वार",
        "category": "Spiritual Shrine",
        "description": "Spiritual gateways to the Himalayas on the holy Ganga: Rishikesh is famous for suspension bridges Laxman Jhula & Ram Jhula, white-water river rafting, and meditation ashrams; Haridwar is celebrated for Har Ki Pauri Ganga Aarti.",
        "imageUrl": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to April",
        "highlights": [
          "Evening Har Ki Pauri Ganga Aarti with Floating Diyas",
          "Grade III/IV White Water River Rafting on Ganga",
          "Beatles Ashram (Chaurasi Kutia)",
          "Bungee Jumping at Mohan Chatti (83m)"
        ],
        "nearestCity": "Rishikesh / Haridwar / Dehradun (45 km)",
        "entryFee": "Free Entry (Rafting ₹600 - ₹1,500)"
      },
      {
        "name": "Jim Corbett National Park, Nainital",
        "hindiName": "जिम कॉर्बेट राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "India's oldest national park established in 1936, the birthplace of Project Tiger, encompassing 520 sq km of sal forests, grasslands, and the Ramganga river famous for wild elephant herds and Royal Bengal tigers.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to June (Dhikala zone opens Nov 15)",
        "highlights": [
          "Dhikala Forest Rest House Stay in Core Zone",
          "Open Gypsy Wildlife Safaris",
          "Wild Elephant Herds along Ramganga River",
          "Over 580 Species of Himalayan Birds"
        ],
        "nearestCity": "Ramnagar (City Center) / Delhi (240 km)",
        "entryFee": "Safari Gypsy ₹4,500 - ₹7,000"
      },
      {
        "name": "Nainital Lake & Viewpoints",
        "hindiName": "नैनीताल झील एवं व्यूप्वाइंट्स",
        "category": "Hill Station",
        "description": "Charming Kumaon hill station at 2,084m centered around the eye-shaped emerald Naini Lake, sacred Naina Devi Shakti Peeth, cable car to Snow Viewpoint, and Tiffin Top overlooking Himalayan ranges.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & September to November",
        "highlights": [
          "Yacht & Row Boating on Naini Lake",
          "Aerial Ropeway to Snow View Point (Trishul & Nanda Devi peaks)",
          "Naina Devi Temple on Lakeside",
          "Mall Road Evening Promenade"
        ],
        "nearestCity": "Nainital / Kathgodam Railway Station (34 km)",
        "entryFee": "Boating ₹200 - ₹350 / Ropeway ₹300"
      },
      {
        "name": "Mussoorie & Kempty Falls",
        "hindiName": "मसूरी एवं कैंपटी फॉल्स",
        "category": "Hill Station",
        "description": "'Queen of the Hills' overlooking the Doon Valley, featuring Kempty Falls, colonial Mall Road, Gun Hill cable car, Lal Tibba high-altitude binocular viewpoint, and the home of author Ruskin Bond.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & September to November",
        "highlights": [
          "40-foot Cascading Kempty Falls",
          "Gun Hill 2nd Highest Peak Ropeway",
          "Lal Tibba Scenic Himalayan Telescope Point",
          "Camel's Back Road Nature Walk"
        ],
        "nearestCity": "Mussoorie / Dehradun (35 km)",
        "entryFee": "Free Entry (Ropeway ₹150)"
      },
      {
        "name": "Valley of Flowers & Auli Ski Resort",
        "hindiName": "फूलों की घाटी एवं औली",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage alpine valley blanketed in hundreds of wild endemic flower species against glaciers from July to September, paired with Auli—India's premier ski resort facing Nanda Devi peak (7,816m).",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Valley: July-Sep / Auli: Dec-March (Skiing)",
        "highlights": [
          "Over 500 Wild Alpine Flower Species in Valley",
          "Hemkund Sahib High-Altitude Glacial Lake (14,200 ft)",
          "Auli Asia's Longest Cable Car (4 km from Joshimath)",
          "Panoramic Views of Mount Nanda Devi"
        ],
        "nearestCity": "Joshimath / Govindghat (20 km)",
        "entryFee": "Valley Permit ₹150 / Cable Car ₹1,000"
      }
    ],
    "majorRivers": [
      "Ganga (Bhagirathi)",
      "Alaknanda",
      "Yamuna",
      "Mandakini",
      "Kali"
    ],
    "famousFood": [
      "Kafuli",
      "Chainsoo",
      "Bal Mithai of Almora",
      "Singori",
      "Aloo ke Gutke"
    ],
    "famousFestivals": [
      "Kumbh Mela Haridwar",
      "Ganga Dussehra Rishikesh",
      "Nanda Devi Raj Jat"
    ],
    "classicalDance": "Chholiya Sword Dance & Jhora"
  },
  {
    "id": "himachal_pradesh",
    "name": "Himachal Pradesh",
    "hindiName": "हिमाचल प्रदेश",
    "odiaName": "ହିମାଚଳ ପ୍ରଦେଶ",
    "capital": "Shimla (Summer) / Dharamshala (Winter)",
    "zone": "North",
    "formationYear": "25 January 1971",
    "officialLanguages": [
      "Hindi",
      "Pahari"
    ],
    "areaKm2": "55,673 km²",
    "population": "7.5 Million",
    "literacyRate": "82.8%",
    "tagline": "Unforgettable Himachal · Apple State of India",
    "coordinates": {
      "x": 37,
      "y": 20
    },
    "symbols": {
      "bird": {
        "name": "Western Tragopan (Jujurana)",
        "hindiName": "जजुराना (वेस्टर्न ट्रैगोपैन)",
        "description": "King of birds with crimson neck and spotted plumage.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Snow Leopard",
        "hindiName": "हिम तेंदुआ",
        "description": "Apex high-altitude cat roaming Spiti Valley.",
        "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Pink Rhododendron",
        "hindiName": "गुलाबी बुरांश",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Deodar Cedar",
        "hindiName": "देवदार का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Shimla & Mall Road",
        "hindiName": "शिमला एवं मॉल रोड",
        "category": "Hill Station",
        "description": "The summer capital of British India perched at 2,276m, featuring colonial landmarks like Viceregal Lodge, neo-Gothic Christ Church at The Ridge, bustling Mall Road, and the 108-foot Hanuman statue at Jakhu Hill.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & December to February (Snowfall)",
        "highlights": [
          "Christ Church on The Ridge",
          "Viceregal Lodge (Indian Institute of Advanced Study)",
          "Jakhu Ropeway to 108-ft Hanuman Statue",
          "Kalka-Shimla UNESCO Heritage Toy Train"
        ],
        "nearestCity": "Shimla / Chandigarh (110 km)",
        "entryFee": "Free Entry (Viceregal Lodge ₹50)"
      },
      {
        "name": "Manali, Solang Valley & Atal Tunnel",
        "hindiName": "मनाली, सोलांग घाटी एवं अटल टनल",
        "category": "Hill Station",
        "description": "Year-round alpine playground on the Beas river, featuring snow sports at Solang Valley, Rohtang Pass, the engineering wonder Atal Tunnel (9.02 km at 10,000 ft), and the ancient wooden Hadimba Devi Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to June (Snow in Dec-Feb)",
        "highlights": [
          "World's Longest High-Altitude Atal Tunnel",
          "Skiing, Paragliding & Zorbing at Solang",
          "Rohtang Pass (13,058 ft) Glacial Vistas",
          "1553 CE Pagoda Hadimba Temple in Deodar Woods"
        ],
        "nearestCity": "Manali / Kullu Airport (50 km)",
        "entryFee": "Rohtang Permit ₹500 / Atal Tunnel Free"
      },
      {
        "name": "Dharamshala & McLeod Ganj",
        "hindiName": "धर्मशाला एवं मैक्लोडगंज",
        "category": "Hill Station",
        "description": "'Little Lhasa in India' against the snowcapped Dhauladhar range, the official exile residence of His Holiness the 14th Dalai Lama, Tsuglagkhang Temple complex, and the famous Triund mountain trek.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to June",
        "highlights": [
          "Dalai Lama Tsuglagkhang Monastery & Tibetan Museum",
          "Triund Day Trek with Dhauladhar Ridge Views",
          "Bhagsunag Waterfall & Shiva Cafe",
          "HPCA International Cricket Stadium at 1,457m"
        ],
        "nearestCity": "Dharamshala / Kangra Airport (15 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Spiti Valley & Key Monastery",
        "hindiName": "स्पीति घाटी एवं की मोनेस्ट्री",
        "category": "Scenic Wonder",
        "description": "Cold desert mountain valley at 12,500 ft known as 'Middle Land' between India and Tibet, featuring 1000-year-old Key Monastery perched like a fortress on a cliff, high-altitude Chandratal Lake, and Komic (world's highest motorable village).",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to October",
        "highlights": [
          "11th-Century Fortress-like Key Monastery",
          "Crescent-Shaped Blue Chandratal Lake",
          "World's Highest Post Office at Hikkim",
          "Fossil Hunting at Langza Village"
        ],
        "nearestCity": "Kaza / Manali (200 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Kasol, Tosh & Parvati Valley",
        "hindiName": "कसोल, तोश एवं पार्वती घाटी",
        "category": "Hill Station",
        "description": "Serene backpacker paradise nestled along the raging Parvati river amidst towering pine forests, renowned for riverside cafes, Manikaran hot sulfur springs, and treks to Malana and Kheerganga.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & September to November",
        "highlights": [
          "Natural Hot Sulphur Springs at Manikaran Gurdwara",
          "Kheerganga Hot Spring Trek (12 km)",
          "Riverside Cafes along Parvati River",
          "Ancient Isolated Village of Malana"
        ],
        "nearestCity": "Kasol / Bhuntar Airport (30 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Dalhousie & Khajjiar ('Mini Switzerland')",
        "hindiName": "डलहौजी एवं खजियार",
        "category": "Hill Station",
        "description": "Colonial hill station spread over five hills, featuring Khajjiar—officially recognized as India's 'Mini Switzerland'—a saucer-shaped green meadow ringed by cedar forests with a floating island lake.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & December to February",
        "highlights": [
          "Khajjiar Floating Island Lake & Pine Meadow",
          "Panchpula Memorial Waterfalls",
          "Dainkund Peak (Singing Hill) Viewpoint",
          "St. John's British Stone Church"
        ],
        "nearestCity": "Dalhousie / Pathankot (80 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Chenab",
      "Ravi",
      "Beas",
      "Sutlej",
      "Yamuna"
    ],
    "famousFood": [
      "Dham (Traditional Feast)",
      "Siddu",
      "Chha Gosht",
      "Madra",
      "Babru",
      "Kullu Trout Fish"
    ],
    "famousFestivals": [
      "Kullu Dussehra",
      "Mandi Shivratri",
      "Minjar Fair Chamba",
      "Lahaul Losar"
    ],
    "classicalDance": "Nati Folk Dance (Guinness Record Folk Dance)"
  },
  {
    "id": "haryana",
    "name": "Haryana",
    "hindiName": "हरियाणा",
    "odiaName": "ହରିୟାଣା",
    "capital": "Chandigarh",
    "zone": "North",
    "formationYear": "1 November 1966",
    "officialLanguages": [
      "Hindi",
      "Haryanvi",
      "Punjabi"
    ],
    "areaKm2": "44,212 km²",
    "population": "28 Million",
    "literacyRate": "75.6%",
    "tagline": "Pioneering Haryana · Land of the Bhagavad Gita",
    "coordinates": {
      "x": 34,
      "y": 30
    },
    "symbols": {
      "bird": {
        "name": "Black Francolin (Kala Teetar)",
        "hindiName": "काला तीतर",
        "description": "Distinctive spotted gamebird known for melodious calls.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Blackbuck",
        "hindiName": "काला हिरण",
        "description": "Vigorous antelope roving the plains of Kurukshetra and Hisar.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Lotus",
        "hindiName": "कमल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Peepal Tree",
        "hindiName": "पीपल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Brahma Sarovar & Jyotisar, Kurukshetra",
        "hindiName": "ब्रह्म सरोवर एवं ज्योतिसर, कुरुक्षेत्र",
        "category": "Spiritual Shrine",
        "description": "The sacred epic landscape of the Mahabharata: Brahma Sarovar is a massive 1,800-foot water reservoir where millions bathe during solar eclipses, paired with Jyotisar—the sacred banyan tree birthplace where Lord Krishna delivered the Bhagavad Gita to Arjuna.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Gita Jayanti (Dec)",
        "highlights": [
          "Immense 1,800-foot Sacred Brahma Sarovar Lake",
          "Jyotisar 5,000-Year-Old Sacred Banyan Tree",
          "Gita Jayanti International Festival",
          "Panorama and Science Centre Kurukshetra"
        ],
        "nearestCity": "Kurukshetra (City Center) / Delhi (160 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Sultanpur National Park, Gurugram",
        "hindiName": "सुल्तानपुर राष्ट्रीय उद्यान, गुरुग्राम",
        "category": "Wildlife Safari",
        "description": "Premier Ramsar wetland bird sanctuary spanning 1.43 sq km, welcoming over 250 species of migratory birds every winter from Siberia, Central Asia, and Eastern Europe, including Siberian cranes, flamingos, and pelicans.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to February",
        "highlights": [
          "Over 250 Migratory Bird Species",
          "Four Strategic Bird Watching Towers",
          "Siberian Crane & Greater Flamingo Sightings",
          "Nature Walking Trail around Lake"
        ],
        "nearestCity": "Gurugram (15 km) / Delhi (40 km)",
        "entryFee": "₹5 (Indians)"
      },
      {
        "name": "Yadavindra Gardens (Pinjore Gardens)",
        "hindiName": "यादविन्द्रा गार्डन (पिंजौर गार्डन)",
        "category": "Historical Monument",
        "description": "Exquisite 17th-century Mughal terraced garden created by Nawab Fidai Khan on the Shivalik foothills, laid out across seven descending terraces with water fountains, Sheesh Mahal, Rang Mahal, and Jal Mahal.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Mango Mela (July)",
        "highlights": [
          "Seven Descending Mughal Terraces",
          "Cascading Water Fountains & Channels",
          "Sheesh Mahal & Rang Mahal Palaces",
          "Annual Baisakhi & Mango Festival"
        ],
        "nearestCity": "Pinjore / Chandigarh (20 km)",
        "entryFee": "₹25 (Indians)"
      },
      {
        "name": "Morni Hills & Tikkar Taal",
        "hindiName": "मोरनी हिल्स एवं टिक्कर ताल",
        "category": "Hill Station",
        "description": "The only hill station in Haryana at 1,220 meters in the Shivalik range, surrounded by pine forests, home to the interconnected twin mystical lakes of Tikkar Taal, trekking trails, and an ancient 14th-century hill fort.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to April",
        "highlights": [
          "Tikkar Taal Twin Interconnected Lakes",
          "Morni Fort 14th-Century Ramparts",
          "Adventure Sports: Kayaking, Ziplining, Rock Climbing",
          "Pheasant Breeding Centre at Berwala"
        ],
        "nearestCity": "Morni / Panchkula (45 km) / Chandigarh (50 km)",
        "entryFee": "Free Entry (Boating ₹100)"
      }
    ],
    "majorRivers": [
      "Yamuna",
      "Ghaggar-Hakra",
      "Markanda",
      "Tangri"
    ],
    "famousFood": [
      "Bajre ki Khichdi",
      "Kadhi Pakora",
      "Kachri ki Sabzi",
      "Ghevar",
      "Cholia",
      "Malpua"
    ],
    "famousFestivals": [
      "Surajkund International Crafts Mela",
      "Geeta Jayanti Kurukshetra",
      "Gugga Naumi"
    ],
    "classicalDance": "Dhamal, Saang & Khoria Folk Dance"
  },
  {
    "id": "jharkhand",
    "name": "Jharkhand",
    "hindiName": "झारखंड",
    "odiaName": "ଝାଡ଼ଖଣ୍ଡ",
    "capital": "Ranchi (City of Waterfalls)",
    "zone": "East",
    "formationYear": "15 November 2000 (Birsa Munda Jayanti)",
    "officialLanguages": [
      "Hindi",
      "Santhali",
      "Khortha",
      "Bengali"
    ],
    "areaKm2": "79,714 km²",
    "population": "39 Million",
    "literacyRate": "66.4%",
    "tagline": "The Land of Forests · Mineral Capital of India",
    "coordinates": {
      "x": 58,
      "y": 48
    },
    "symbols": {
      "bird": {
        "name": "Asian Koel",
        "hindiName": "कोयल",
        "description": "Melodious singing bird herald of monsoon.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Indian Elephant",
        "hindiName": "भारतीय हाथी",
        "description": "Roaming the dense Sal forests of Dalma Wildlife Sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Palash",
        "hindiName": "पलाश का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Sal Tree",
        "hindiName": "साल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Baidyanath Jyotirlinga Temple, Deoghar",
        "hindiName": "बैद्यनाथ ज्योतिर्लिंग मंदिर, देवघर",
        "category": "Spiritual Shrine",
        "description": "One of the twelve sacred Jyotirlingas of Lord Shiva and also a revered Shakti Peeth, center of the massive month-long Shravani Mela where millions of Kanwariyas walk 108 km carrying holy Ganga water from Sultanganj.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & July/August (Shravan Month)",
        "highlights": [
          "Kamna Lingam (Wish-Fulfilling Jyotirlinga)",
          "Shravani Mela 108 km Kanwar Yatra",
          "Trikut Pahar Hill Ropeway",
          "Naulakha Temple (Radha-Krishna)"
        ],
        "nearestCity": "Deoghar (City Center)",
        "entryFee": "Free Entry (VIP Darshan ₹500)"
      },
      {
        "name": "Parasnath Hill (Shikharji)",
        "hindiName": "पारसनाथ पहाड़ी (शिखरजी)",
        "category": "Spiritual Shrine",
        "description": "The most sacred pilgrimage destination for Jainism worldwide, situated at 4,480 ft (highest peak in Jharkhand), where 20 of the 24 Jain Tirthankaras, including Lord Parshvanatha, attained salvation (Nirvana/Moksha).",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Highest Mountain Peak in Jharkhand (1,365m)",
          "Tonk Shrines of 20 Jain Tirthankaras",
          "27 km Holy Parikrama Walking Pilgrimage",
          "Madhuban Base Camp Monasteries"
        ],
        "nearestCity": "Giridih (45 km) / Dhanbad (80 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Hundru, Dassam & Jonha Falls, Ranchi",
        "hindiName": "हुंडरू, दसम एवं जोन्हा जलप्रपात, रांची",
        "category": "Scenic Wonder",
        "description": "'City of Waterfalls': Hundru falls cascade 98 meters on Subarnarekha river over rocky basalt formations, while Dassam drops 44 meters in ten distinct chutes on Kanchi river, and Jonha (Gautamdhara) features an Ashoka-era Buddha temple.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "August to February (Post-Monsoon & Winter)",
        "highlights": [
          "Hundru 98-meter Roaring Plunge",
          "Dassam 10-Stream Cascade (Taimara)",
          "Jonha Falls Gautamdhara Buddha Temple",
          "Patratu Valley Serpentine Ghat Road"
        ],
        "nearestCity": "Ranchi (35 - 45 km from falls)",
        "entryFee": "₹10 - ₹20 per waterfall"
      },
      {
        "name": "Betla National Park, Palamu",
        "hindiName": "बेतला राष्ट्रीय उद्यान, पलामू",
        "category": "Wildlife Safari",
        "description": "One of India's first national parks, renowned for being one of the original 9 Project Tiger reserves declared in 1974, featuring sal and bamboo forests, wild elephants, sloth bears, and the historic 16th-century Chero Dynasty Palamu Forts.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to April",
        "highlights": [
          "Jeep & Elephant Wildlife Safaris",
          "16th-Century Twin Palamu Forts in Jungle",
          "Kamaldah Lake Mugger Crocodiles",
          "Mirchaiya & Lodh Waterfalls nearby"
        ],
        "nearestCity": "Daltonganj (25 km) / Ranchi (165 km)",
        "entryFee": "Safari ₹800 - ₹1,500"
      },
      {
        "name": "Netarhat ('Queen of Chotanagpur')",
        "hindiName": "नेतरहाट (छोटानागपुर की रानी)",
        "category": "Hill Station",
        "description": "Picturesque hill station perched at 1,128 meters amidst dense pine forests, famous for the magnificent sunrise at Netarhat and sunset at Magnolia Point, Koel river viewpoint, and the 143-meter Lodh Falls (highest in Jharkhand).",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Magnolia Point Legendary Sunset",
          "Lodh Falls (Highest Waterfall in Jharkhand - 143m)",
          "Upper Ghaghri & Lower Ghaghri Falls",
          "Dense Pine Forest Nature Walks"
        ],
        "nearestCity": "Netarhat / Latehar / Ranchi (155 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Subarnarekha",
      "Damodar",
      "Koel",
      "Sankh",
      "Barakar"
    ],
    "famousFood": [
      "Dhuska with Ghugni",
      "Rugra (Wild Mushroom)",
      "Litti Chokha",
      "Chilka Roti",
      "Pitha",
      "Thekua"
    ],
    "famousFestivals": [
      "Sarhul (Flower Festival)",
      "Karam Puja",
      "Tusu Parab",
      "Shravani Mela"
    ],
    "classicalDance": "Chhau Dance (Seraikella Chhau - UNESCO Heritage)"
  },
  {
    "id": "chhattisgarh",
    "name": "Chhattisgarh",
    "hindiName": "छत्तीसगढ़",
    "odiaName": "ଛତିଶଗଡ଼",
    "capital": "Raipur",
    "zone": "Central",
    "formationYear": "1 November 2000",
    "officialLanguages": [
      "Chhattisgarhi",
      "Hindi"
    ],
    "areaKm2": "135,192 km²",
    "population": "30 Million",
    "literacyRate": "70.3%",
    "tagline": "Full of Surprises · Mineral & Rice Bowl of Central India",
    "coordinates": {
      "x": 50,
      "y": 56
    },
    "symbols": {
      "bird": {
        "name": "Bastar Hill Myna",
        "hindiName": "बस्तर पहाड़ी मैना",
        "description": "Celebrated bird capable of flawlessly mimicking human speech.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Wild Water Buffalo (Ban Bhainsa)",
        "hindiName": "जंगली जल भैंसा",
        "description": "Critically endangered pure-breed wild buffalo in Udanti Sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Rhynchostylis gigantea",
        "hindiName": "गेन्दा / ऑर्किड",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Sal Tree",
        "hindiName": "साल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Chitrakote Waterfalls, Bastar",
        "hindiName": "चित्रकोट जलप्रपात, बस्तर",
        "category": "Scenic Wonder",
        "description": "'The Niagara of India', the widest waterfall in India spanning over 300 meters (980 ft) during monsoon as the Indravati River plunges 29 meters off a horseshoe-shaped cliff in a thunderous roar.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "July to October (Roaring Monsoon) / Nov-Feb (Gentle)",
        "highlights": [
          "300-meter Wide Horseshoe Waterfall Curtain",
          "Boat Ride to Base of Spray",
          "Evening Colorful Floodlights on Water",
          "Bastar Tribal Handicrafts Market"
        ],
        "nearestCity": "Jagdalpur (38 km) / Raipur (280 km)",
        "entryFee": "Free Entry (Boating ₹100)"
      },
      {
        "name": "Tirathgarh Waterfalls & Kanger Valley National Park",
        "hindiName": "तीरथगढ़ जलप्रपात एवं कांगेर घाटी",
        "category": "Scenic Wonder",
        "description": "Spectacular 91-meter multi-tiered white cascading waterfall on the Kanger river, surrounded by Kanger Valley National Park's subterranean Kotumsar and Kailash limestone caves with ancient blind fish.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Step-like White Water Cascade",
          "Kotumsar Underground Stalactite Caves",
          "Rare Blind Cave Fish (Kempichthys)",
          "State Bird Bastar Hill Myna Habitat"
        ],
        "nearestCity": "Jagdalpur (35 km)",
        "entryFee": "₹50 (Indians) + Cave guide fee"
      },
      {
        "name": "Sirpur Heritage Archaeological Site",
        "hindiName": "सिरपुर ऐतिहासिक स्थल",
        "category": "Historical Monument",
        "description": "Ancient capital of South Kosala on the Mahanadi river, famous for the 7th-century brick-built Lakshman Temple (one of India's finest terracotta temples), Surang Tila, and extensive Buddhist monastic universities visited by Xuanzang.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Sirpur Dance Festival in Jan",
        "highlights": [
          "7th-Century Terracotta Lakshman Temple",
          "Surang Tila 32-Pillar White Stone Platform",
          "Teevardev Buddhist Monasteries (Viharas)",
          "Sirpur National Dance and Music Festival"
        ],
        "nearestCity": "Sirpur / Mahasamund (35 km) / Raipur (80 km)",
        "entryFee": "₹25 (Indians) / ₹300 (Foreigners)"
      },
      {
        "name": "Bhoramdeo Temple, Kawardha",
        "hindiName": "भोरमदेव मंदिर, कवर्धा",
        "category": "Historical Monument",
        "description": "'The Khajuraho of Chhattisgarh', an 11th-century Nagara-style stone temple built by the Nagavanshi kings in the Maikal hills, renowned for intricate erotic carvings, Radha-Krishna sculptures, and peaceful tribal setting.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Nagara Stone Carvings in Maikal Hills",
          "Madhwa Mahal 16-Pillar Shiva Temple",
          "Chherki Mahal Tribal Brick Shrine",
          "Saroda Dadar Nature Viewpoint"
        ],
        "nearestCity": "Kawardha (18 km) / Raipur (130 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Barnawapara Wildlife Sanctuary",
        "hindiName": "बारनवापारा वन्यजीव अभयारण्य",
        "category": "Wildlife Safari",
        "description": "Lush wildlife reserve spanning 245 sq km in Mahasamund, famed for sightings of Indian leopards, sloth bears, gaur (Indian bison), sambar, four-horned antelope (chousingha), and over 150 species of birds.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to May",
        "highlights": [
          "Open Gypsy Wildlife Safaris",
          "Large Indian Bison (Gaur) Herds",
          "Pakshiraj Bird Watching Towers",
          "Balrampur Lake Wildlife Watch"
        ],
        "nearestCity": "Mahasamund (60 km) / Raipur (100 km)",
        "entryFee": "Safari ₹1,500 - ₹2,500"
      }
    ],
    "majorRivers": [
      "Mahanadi",
      "Indravati",
      "Hasdeo",
      "Shivnath",
      "Rihand"
    ],
    "famousFood": [
      "Chila",
      "Muthia",
      "Fara",
      "Bafauri",
      "Aamat",
      "Dubki Kadhi"
    ],
    "famousFestivals": [
      "Bastar Dussehra (75-day World's Longest Festival)",
      "Madai Festival",
      "Hareli",
      "Rajim Kumbh"
    ],
    "classicalDance": "Panthi, Raut Nacha & Pandavani (Folk ballad theatre by Teejan Bai)"
  },
  {
    "id": "sikkim",
    "name": "Sikkim",
    "hindiName": "सिक्किम",
    "odiaName": "ସିକ୍କିମ୍",
    "capital": "Gangtok",
    "zone": "North-East",
    "formationYear": "16 May 1975",
    "officialLanguages": [
      "Nepali",
      "Sikkimese (Bhutia)",
      "Lepcha",
      "English"
    ],
    "areaKm2": "7,096 km²",
    "population": "690,000",
    "literacyRate": "81.4%",
    "tagline": "Small Beautiful Sikkim · India's First 100% Organic State",
    "coordinates": {
      "x": 70,
      "y": 32
    },
    "symbols": {
      "bird": {
        "name": "Blood Pheasant",
        "hindiName": "ब्लड तीतर",
        "description": "Alpine pheasant with crimson streaks across its chest.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Red Panda",
        "hindiName": "लाल पांडा",
        "description": "Acrobatic arboreal mammal with ringed tail living in bamboo forests.",
        "imageUrl": "https://images.unsplash.com/photo-1507666405895-422efe7d0096?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Noble Dendrobium Orchid",
        "hindiName": "नोबल आर्किड",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Rhododendron niveum",
        "hindiName": "बुरांश का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Tsomgo Lake & Nathu La Pass",
        "hindiName": "त्सोमगो झील एवं नाथू ला दर्रा",
        "category": "Scenic Wonder",
        "description": "Glacial high-altitude lake at 12,310 ft that changes colors with seasons and freezes solid in winter, leading to Nathu La Pass at 14,140 ft on the historic Indo-China Silk Route border, and Baba Harbhajan Singh Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to May & October to December",
        "highlights": [
          "Color-Changing Glacial Tsomgo Lake (Changu Lake)",
          "Decorated Yak Ride along Lake Shore",
          "Indo-China Border at Nathu La (14,140 ft)",
          "Legendary Baba Harbhajan Singh Shrine"
        ],
        "nearestCity": "Gangtok (40 km)",
        "entryFee": "Permit ₹200 - ₹500 (Indians only at Nathu La)"
      },
      {
        "name": "Rumtek Monastery & Gangtok",
        "hindiName": "रुमटेक मठ एवं गंगटोक",
        "category": "Spiritual Shrine",
        "description": "Dharma Chakra Centre, the largest monastery in Sikkim and seat of the Gyalwang Karmapa (Black Hat order) of Tibetan Buddhism, paired with Gangtok's MG Marg pedestrian mall and ropeway.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to June & September to December",
        "highlights": [
          "Golden Stupa containing 16th Karmapa Relics",
          "Tibetan Thangka Paintings & Rare Manuscripts",
          "MG Marg Spit-Free Pedestrian Street",
          "Gangtok Deorali to Tashiling Cable Car"
        ],
        "nearestCity": "Gangtok (Rumtek: 24 km)",
        "entryFee": "Monastery ₹10 / Cable Car ₹110"
      },
      {
        "name": "Pelling & Pemayangtse Monastery",
        "hindiName": "पेलिंग एवं पेमायांगत्से मठ",
        "category": "Hill Station",
        "description": "Scenic Western Sikkim hill town at 2,150m offering the closest unobstructed panoramic views of Mount Kanchenjunga (8,586m), ancient 1705 Pemayangtse Monastery, and Sikkim's first glass Skywalk at Chenrezig statue.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Unmatched Mount Kanchenjunga Sunrise View",
          "Chenrezig 137-foot Statue & Glass Skywalk",
          "Pemayangtse Monastery (Perfect Sublime Lotus)",
          "Rabdentse Ruins (Ancient Royal Palace)"
        ],
        "nearestCity": "Pelling / Geyzing (10 km) / Gangtok (115 km)",
        "entryFee": "Skywalk ₹50 / Monastery ₹20"
      },
      {
        "name": "Yumthang Valley of Flowers & Lachung",
        "hindiName": "युमथांग फूलों की घाटी एवं लाचुंग",
        "category": "Scenic Wonder",
        "description": "'Valley of Rhododendrons' in North Sikkim at 11,693 ft, where over 24 species of wild rhododendrons carpet the alpine meadows in vibrant scarlet, pink, and white blossoms in spring, flanked by snow peaks and hot springs.",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to May (Flowers) / Dec to Feb (Snow)",
        "highlights": [
          "24 Wild Rhododendron Species in Bloom",
          "Natural Sulphur Thermal Hot Spring Baths",
          "Zero Point (Yumesamdong at 15,300 ft)",
          "Traditional Wooden Cottages of Lachung Village"
        ],
        "nearestCity": "Lachung / Gangtok (130 km)",
        "entryFee": "North Sikkim Protected Area Permit required"
      },
      {
        "name": "Gurudongmar Lake, North Sikkim",
        "hindiName": "गुरुडोंगमार झील",
        "category": "Scenic Wonder",
        "description": "One of the highest lakes in the world at an altitude of 17,800 ft (5,430m), sacred to Buddhists, Sikhs, and Hindus. Blessed by Guru Padmasambhava and Guru Nanak, a portion of the crystal blue water never freezes even in sub-zero winter.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "April to June & October to November",
        "highlights": [
          "17,800 ft Altitude Glacial Turquoise Waters",
          "Sacred Unfrozen Section of Lake",
          "Dramatic Tibetan Plateau Landscape",
          "Chopta Valley Himalayan Vistas"
        ],
        "nearestCity": "Lachen (65 km) / Gangtok (170 km)",
        "entryFee": "Special Permit (Indian Nationals only)"
      }
    ],
    "majorRivers": [
      "Teesta",
      "Rangeet"
    ],
    "famousFood": [
      "Momos",
      "Thukpa",
      "Gundruk Soup",
      "Phagshapa",
      "Chhurpi Soup",
      "Sel Roti"
    ],
    "famousFestivals": [
      "Losoong (Sikkimese New Year)",
      "Pang Lhabsol",
      "Saga Dawa",
      "Maghey Sankranti"
    ],
    "classicalDance": "Singhi Chham (Snow Lion Dance) & Yak Dance"
  },
  {
    "id": "meghalaya",
    "name": "Meghalaya",
    "hindiName": "मेघालय",
    "odiaName": "ମେଘାଳୟ",
    "capital": "Shillong (Scotland of the East)",
    "zone": "North-East",
    "formationYear": "21 January 1972",
    "officialLanguages": [
      "English",
      "Khasi",
      "Garo"
    ],
    "areaKm2": "22,429 km²",
    "population": "3.3 Million",
    "literacyRate": "74.4%",
    "tagline": "Abode of Clouds · Wettest Place on Planet Earth",
    "coordinates": {
      "x": 78,
      "y": 42
    },
    "symbols": {
      "bird": {
        "name": "Hill Myna",
        "hindiName": "पहाड़ी मैना",
        "description": "Vocal mimic inhabiting subtropical evergreen hills.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Clouded Leopard",
        "hindiName": "धूमिल तेंदुआ",
        "description": "Arboreal spotted cat with massive canines living in Nokrek Biosphere.",
        "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Lady's Slipper Orchid",
        "hindiName": "लेडीज स्लिपर ऑर्किड",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Gamhar (White Teak)",
        "hindiName": "गमहार का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Double Decker Living Root Bridges, Cherrapunji (Sohra)",
        "hindiName": "डबल डेकर लिविंग रूट ब्रिज, चेरापूंजी",
        "category": "Scenic Wonder",
        "description": "Bio-engineering marvels grown by the Khasi tribe over centuries by training the aerial roots of Ficus elastica rubber trees across rivers, featuring the iconic two-tier bridge at Nongriat reached via 3,500 stone steps.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Nongriat 3,500-Step Forest Descent Trek",
          "Two-Tier Living Root Bridge over Turquoise Pool",
          "Natural Fish Spa in Glacial River Pools",
          "Rainbow Falls Trek 1.5 hr further from Bridge"
        ],
        "nearestCity": "Nongriat / Cherrapunji (12 km) / Shillong (65 km)",
        "entryFee": "₹50 (Indians)"
      },
      {
        "name": "Nohkalikai Falls, Sohra",
        "hindiName": "नोहकलिकाई जलप्रपात, सोहरा",
        "category": "Scenic Wonder",
        "description": "The tallest plunge waterfall in India, dropping 340 meters (1,115 ft) in a sheer vertical cascade off the wettest plateau on earth into a haunting emerald-green plunge pool.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to December (Clear views) / July-Aug (Massive volume)",
        "highlights": [
          "340-meter Sheer Vertical Plunge (India's Highest)",
          "Emerald-Green Plunge Pool at Canyon Base",
          "Mawsmai Limestone Caves nearby",
          "Seven Sisters (Nohsngithiang) Falls View"
        ],
        "nearestCity": "Cherrapunji (7 km) / Shillong (55 km)",
        "entryFee": "₹20 (Indians)"
      },
      {
        "name": "Dawki River (Umngot River)",
        "hindiName": "डावकी नदी (उमंगोट नदी)",
        "category": "Scenic Wonder",
        "description": "World-famous for its crystal-clear turquoise waters so transparent that wooden boats appear to float in mid-air above the riverbed pebbles, situated along the India-Bangladesh border.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to April (Glass-like clarity)",
        "highlights": [
          "Wooden Boat Ride on Floating-Glass Transparent Waters",
          "Shnongpdeng Adventure Camping & Scuba Diving",
          "Umngot River Suspension Bridge",
          "Tamabil Indo-Bangladesh Border Crossing"
        ],
        "nearestCity": "Dawki / Shnongpdeng (8 km) / Shillong (80 km)",
        "entryFee": "Boating ₹800 - ₹1,200 per boat"
      },
      {
        "name": "Mawlynnong ('Asia's Cleanest Village')",
        "hindiName": "मावलिनोंग (एशिया का सबसे स्वच्छ गांव)",
        "category": "Scenic Wonder",
        "description": "Acclaimed by Discover India as 'Asia's Cleanest Village', a picture-perfect hamlet with flower-lined cobblestone pathways, bamboo conical dustbins, 100% literacy, and an 85-foot bamboo Skywalk overlooking Bangladesh.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to May",
        "highlights": [
          "Pristine Flower-Lined Cobblestone Alleys",
          "Bamboo Skywalk Treehouse (Machan) View over Bangladesh",
          "Single Living Root Bridge at Riwai (Easy 10-min walk)",
          "Balancing Rock Natural Phenomenon"
        ],
        "nearestCity": "Mawlynnong / Shillong (75 km)",
        "entryFee": "Village Entry ₹50"
      },
      {
        "name": "Shillong & Umiam Lake",
        "hindiName": "शिलांग एवं उमियम झील",
        "category": "Hill Station",
        "description": "'Scotland of the East', the vibrant cosmopolitan capital featuring pine-clad hills, rock music culture, the expansive Umiam Lake (Barapani) for watersports, Elephant Falls, and Shillong Peak (1,965m).",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to May",
        "highlights": [
          "Umiam Lake Speedboating & Kayaking",
          "Three-Tier Elephant Falls",
          "Don Bosco Centre for Indigenous Cultures Museum",
          "Police Bazar Cafes & Khasi Live Music"
        ],
        "nearestCity": "Shillong (City Center) / Guwahati (100 km)",
        "entryFee": "Umiam Free (Boating ₹100 - ₹500)"
      }
    ],
    "majorRivers": [
      "Simsang",
      "Umngot",
      "Myntdu",
      "Kynshi"
    ],
    "famousFood": [
      "Jadoh (Rice cooked with meat)",
      "Doh Khlieh",
      "Pukhlein",
      "Nakham Bitchi",
      "Tungrymbai"
    ],
    "famousFestivals": [
      "Shad Suk Mynsiem",
      "Nongkrem Dance",
      "Wangala Hundred Drums Festival"
    ],
    "classicalDance": "Wangala & Shad Suk Mynsiem Dances"
  },
  {
    "id": "tripura",
    "name": "Tripura",
    "hindiName": "त्रिपुरा",
    "odiaName": "ତ୍ରିପୁରା",
    "capital": "Agartala",
    "zone": "North-East",
    "formationYear": "21 January 1972",
    "officialLanguages": [
      "Bengali",
      "Kokborok",
      "English"
    ],
    "areaKm2": "10,491 km²",
    "population": "4.1 Million",
    "literacyRate": "87.2%",
    "tagline": "Explore Tripura · Land of Royalty & Bamboo Groves",
    "coordinates": {
      "x": 75,
      "y": 50
    },
    "symbols": {
      "bird": {
        "name": "Green Imperial Pigeon",
        "hindiName": "हरा शाही कबूतर",
        "description": "Large forest pigeon with emerald green mantle.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Phayre's Leaf Monkey (Chashma Bandar)",
        "hindiName": "चश्माधारी लंगूर",
        "description": "Endangered spectacled primate with prominent white rings around eyes.",
        "imageUrl": "https://images.unsplash.com/photo-1507666405895-422efe7d0096?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Nageshwar (Indian Rose Chestnut)",
        "hindiName": "नागकेसर",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Agarwood Tree",
        "hindiName": "अगर का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Ujjayanta Palace, Agartala",
        "hindiName": "उज्जयंत पैलेस, अगरतला",
        "category": "Fort & Palace",
        "description": "Stately neoclassical royal palace built between 1899-1901 by Maharaja Radha Kishore Manikya, named by Nobel Laureate Rabindranath Tagore. Set amidst Mughal gardens and twin lakes, now housing the Tripura State Museum.",
        "imageUrl": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Neoclassical White Domes & Royal Architecture",
          "Tagore Connection & Manuscript Galleries",
          "Tripura State Museum Cultural Artifacts",
          "Musical Fountains in Symmetrical Mughal Gardens"
        ],
        "nearestCity": "Agartala (City Center)",
        "entryFee": "₹20 (Indians) / ₹150 (Foreigners)"
      },
      {
        "name": "Neermahal (Water Palace), Melaghar",
        "hindiName": "नीरमहल (जल महल), मेलाघर",
        "category": "Fort & Palace",
        "description": "The only floating water palace in Eastern India, built in 1930 by Maharaja Bir Bikram Kishore Manikya in the center of the 6 sq km Rudrasagar Lake, fusing Hindu and Islamic architectural styles.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March (Boat Race in Aug)",
        "highlights": [
          "Boat Cruise across Rudrasagar Lake to Palace",
          "Andar Mahal Royal Residential Wing",
          "Evening Light & Sound Show over Water",
          "Annual Neermahal Water Festival & Boat Race"
        ],
        "nearestCity": "Melaghar / Agartala (53 km)",
        "entryFee": "Palace ₹25 + Boat ₹50"
      },
      {
        "name": "Unakoti Rock Sculptures",
        "hindiName": "उनाकोटी रॉक नक्काशी",
        "category": "UNESCO Heritage",
        "description": "Mystical 7th-9th century rock-cut Shaivite pilgrimage site known as 'Sub-Himalayan Angkor Wat', featuring colossal bas-relief stone carvings of Lord Shiva (Unakotiswara Kal Bhairava, 30 ft tall) carved directly on mountain cliffs.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Ashokastami Mela (April)",
        "highlights": [
          "30-foot Tall Central Shiva Rock Carving",
          "Thousands of Ganesha, Durga, & Nandi Reliefs",
          "Mystical Forest Waterfall Setting",
          "Annual Ashokastami Pilgrimage Fair"
        ],
        "nearestCity": "Kailashahar (8 km) / Agartala (178 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Tripurasundari Temple, Udaipur",
        "hindiName": "त्रिपुरा सुंदरी मंदिर, उदयपुर",
        "category": "Spiritual Shrine",
        "description": "Over 500 years old, one of the 51 sacred Shakti Peethas (where the right foot of Sati fell), built in 1501 CE by Maharaja Dhanya Manikya in traditional Bengali Ek-ratna curved hut architecture beside Kalyansagar lake.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March & Diwali Mela",
        "highlights": [
          "Ek-Ratna Traditional Bengali Roof Architecture",
          "Kalyansagar Lake Tortoise Feeding Sanctuary",
          "Annual Grand Diwali Mela (200,000 pilgrims)",
          "Bhubaneswari Temple of Tagore's 'Rajarshi' nearby"
        ],
        "nearestCity": "Udaipur / Agartala (55 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Gomati",
      "Manu",
      "Haora",
      "Khowai"
    ],
    "famousFood": [
      "Mui Borok",
      "Berma (Fermented Fish)",
      "Chakhwi",
      "Mosdeng Serma",
      "Bhangui"
    ],
    "famousFestivals": [
      "Kharchi Puja (14 Gods Worship)",
      "Garia Puja",
      "Ker Puja",
      "Neermahal Water Festival"
    ],
    "classicalDance": "Hojagiri Dance (Reang tribal balance dance on earthen pots)"
  },
  {
    "id": "arunachal_pradesh",
    "name": "Arunachal Pradesh",
    "hindiName": "अरुणाचल प्रदेश",
    "odiaName": "ଅରୁଣାଚଳ ପ୍ରଦେଶ",
    "capital": "Itanagar",
    "zone": "North-East",
    "formationYear": "20 February 1987",
    "officialLanguages": [
      "English",
      "Hindi"
    ],
    "areaKm2": "83,743 km²",
    "population": "1.5 Million",
    "literacyRate": "65.4%",
    "tagline": "Land of Dawn-Lit Mountains · First Sunrise of India",
    "coordinates": {
      "x": 88,
      "y": 28
    },
    "symbols": {
      "bird": {
        "name": "Great Hornbill",
        "hindiName": "ग्रेट हॉर्नबिल",
        "description": "Revered forest bird celebrated by Nyishi tribe.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Gayal (Mithun)",
        "hindiName": "मिथुन (ग्याल)",
        "description": "Domesticated forest ox holding enormous socio-cultural value.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Foxtail Orchid",
        "hindiName": "फॉक्सटेल ऑर्किड",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Hollong Tree",
        "hindiName": "होलॉन्ग का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Tawang Monastery",
        "hindiName": "तवांग मठ",
        "category": "Spiritual Shrine",
        "description": "The largest Buddhist monastery in India and second largest in the world after the Potala Palace in Lhasa, founded in 1680 at 10,000 ft in the Eastern Himalayas, housing an 26-foot gilded statue of Lord Buddha and rare ancient manuscripts.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to May & September to November",
        "highlights": [
          "26-foot Gilded Buddha Statue in Dukhang",
          "400-year-old Monastic Library & Kangyur Texts",
          "Torgya Annual Monastic Mask Dance Festival",
          "Tawang War Memorial (1962 Indo-China War)"
        ],
        "nearestCity": "Tawang / Tezpur (320 km) / Guwahati (440 km)",
        "entryFee": "Free Entry (ILP Required)"
      },
      {
        "name": "Sela Pass & Sela Lake (13,700 ft)",
        "hindiName": "सेला दर्रा एवं सेला झील",
        "category": "Scenic Wonder",
        "description": "High-altitude mountain pass connecting Tawang to the rest of India at 4,170 meters (13,700 ft), featuring the mystical crystal blue Paradise Lake (Sela Lake) that freezes completely in winter, and the Sela Tunnel.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April (Snowy paradise)",
        "highlights": [
          "13,700 ft High Altitude Frozen Sela Lake",
          "World's Longest Bi-Lane Tunnel at 13,000 ft (Sela Tunnel)",
          "Jaswant Garh War Memorial (Rifleman Jaswant Singh MVC)",
          "Chasing Cloud Waves over Himalayan Ridges"
        ],
        "nearestCity": "Dirang (60 km) / Tawang (75 km)",
        "entryFee": "ILP Required"
      },
      {
        "name": "Ziro Valley",
        "hindiName": "जीरो घाटी",
        "category": "Scenic Wonder",
        "description": "Enchanting UNESCO World Heritage candidate valley nestled amidst pine-clad hills and emerald paddy terraces, home to the indigenous Apatani tribe known for their unique facial tattoos, nose plugs (Yaping Hullo), and the Ziro Music Festival.",
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "March to October & September (Ziro Festival of Music)",
        "highlights": [
          "Apatani Tribal Villages (Hong, Hari, Bulla)",
          "Traditional Facial Tattoos & Nose Plugs Heritage",
          "Ziro Festival of Music (India's premier indie festival)",
          "Kardo Shivalinga (Massive 25-foot natural rock lingam)"
        ],
        "nearestCity": "Ziro / Itanagar (115 km) / North Lakhimpur (120 km)",
        "entryFee": "Free Entry (ILP Required)"
      },
      {
        "name": "Namdapha National Park, Changlang",
        "hindiName": "नामदाफा राष्ट्रीय उद्यान",
        "category": "Wildlife Safari",
        "description": "The fourth largest national park in India, a biodiversity global hotspot spanning 1,985 sq km of tropical rainforests, only park in the world home to four feline big cat species: tiger, leopard, snow leopard, and clouded leopard.",
        "imageUrl": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Home to 4 Big Cats: Tiger, Leopard, Clouded & Snow Leopard",
          "Hoolock Gibbon (India's only ape) Sightings",
          "Lisu Tribal Forest Treks",
          "Pristine Noa-Dihing River Glacial Valley"
        ],
        "nearestCity": "Miao (Base Camp) / Tinsukia (140 km)",
        "entryFee": "Park Entry ₹50 + Forest Permit"
      },
      {
        "name": "Mechuka (Menchukha) Valley",
        "hindiName": "मेचुका घाटी",
        "category": "Hill Station",
        "description": "'The Forbidden Valley of Arunachal' at 6,000 ft near the Tibetan border, a fairytale landscape of emerald meadows, the Yargyap Chu river, wooden suspension footbridges, and the 400-year-old Samten Yongcha Monastery.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Wooden Suspension Bridges over Yargyap Chu River",
          "400-year-old Samten Yongcha Mahayana Monastery",
          "Memba Tribal Wooden Architecture & Warmth",
          "Adventure Paragliding & High Alpine Treks"
        ],
        "nearestCity": "Mechuka / Aalo (180 km)",
        "entryFee": "ILP Required"
      }
    ],
    "majorRivers": [
      "Siang (Brahmaputra)",
      "Subansiri",
      "Kameng",
      "Dibang",
      "Lohit"
    ],
    "famousFood": [
      "Thukpa",
      "Zan",
      "Pika Pila",
      "Apong (Rice Beer)",
      "Bamboo Shoot Pork"
    ],
    "famousFestivals": [
      "Losar Festival",
      "Torgya Festival Tawang",
      "Dree Festival",
      "Nyokum"
    ],
    "classicalDance": "Bardo Chham (Dance of Sherdukpen depicting good over evil)"
  },
  {
    "id": "manipur",
    "name": "Manipur",
    "hindiName": "मणिपुर",
    "odiaName": "ମଣିପୁର",
    "capital": "Imphal",
    "zone": "North-East",
    "formationYear": "21 January 1972",
    "officialLanguages": [
      "Meitei (Manipuri)"
    ],
    "areaKm2": "22,327 km²",
    "population": "3.2 Million",
    "literacyRate": "79.2%",
    "tagline": "Jeweled Land · Birthplace of Modern Polo",
    "coordinates": {
      "x": 84,
      "y": 48
    },
    "symbols": {
      "bird": {
        "name": "Mrs. Hume's Pheasant (Nongin)",
        "hindiName": "नोंगिन (ह्यूम तीतर)",
        "description": "Forest pheasant with metallic copper-brown plumage.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Sangai (Dancing Deer)",
        "hindiName": "संगाई (डांसिंग डियर)",
        "description": "Endangered brow-antlered deer walking on floating biomass (Phumdis) in Loktak Lake.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Siroi Lily (Lilium mackliniae)",
        "hindiName": "शिरोई लिली",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Uningthou (Phoebe hainesiana)",
        "hindiName": "उयिंगथौ का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Loktak Lake & Keibul Lamjao National Park",
        "hindiName": "लोकटक झील एवं केबुल लामजाओ",
        "category": "Scenic Wonder",
        "description": "The largest freshwater lake in Northeast India, famous for its circular floating biomass islands called Phumdis, and Keibul Lamjao—the world's only floating national park—the last wild refuge of the endangered brow-antlered Sangai deer.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "World's Only Floating National Park",
          "Endangered Dancing Sangai Deer Sightings",
          "Circular Floating Phumdi Island Boat Rides",
          "Sendra Island Hilltop Viewpoint over Lake"
        ],
        "nearestCity": "Moirang / Imphal (45 km)",
        "entryFee": "Park ₹50 / Boating ₹200 - ₹500"
      },
      {
        "name": "Kangla Fort, Imphal",
        "hindiName": "कांगला किला, इम्फाल",
        "category": "Historical Monument",
        "description": "Ancient royal capital and sacred seat of Manipur's Meitei rulers until 1891, located on the banks of the Imphal river, featuring the Kangla Sha dragon lion sculptures, Govindaji Temple, and the royal coronation site.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Colossal Kangla Sha Dragon Lion Statues",
          "Historic Meitei Royal Coronation Stone",
          "Govindaji Temple Ruins & Sacred Ponds",
          "Ima Keithel (Mother's Market run by 5,000 women) nearby"
        ],
        "nearestCity": "Imphal (City Center)",
        "entryFee": "₹20 (Indians)"
      },
      {
        "name": "INA War Memorial, Moirang",
        "hindiName": "आईएनए युद्ध स्मारक, मोइरांग",
        "category": "Historical Monument",
        "description": "Historic national shrine where Colonel Shaukat Malik of Netaji Subhas Chandra Bose's Indian National Army (Azad Hind Fauj) first hoisted the Tricolour flag of free India on Indian soil on 14 April 1944.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Site of First Indian Flag Unfurling by INA",
          "Bronze Statue of Netaji Subhas Chandra Bose",
          "INA Museum with Letters, Weapons & Artifacts",
          "Loktak Lake shoreline adjacent"
        ],
        "nearestCity": "Moirang (City Center) / Imphal (45 km)",
        "entryFee": "₹10 (Indians)"
      },
      {
        "name": "Shirui Peak & Shirui Kashung",
        "hindiName": "शिरुई पीक एवं शिरुई कशुंग",
        "category": "Hill Station",
        "description": "Majestic mountain peak in Ukhrul district at 2,835 meters, the exclusive natural habitat in the world of the rare, delicate pink Shirui Lily (Lilium mackliniae), the state flower of Manipur that blossoms only here in May-June.",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "May to June (Shirui Lily Festival) & Oct-Feb",
        "highlights": [
          "Endemic Shirui Lily Flowering in May",
          "Panoramic Mountain Trek to Peak (2,835m)",
          "Tangkhul Naga Tribal Culture & Woodcraft",
          "Annual Shirui Lily Festival Celebrations"
        ],
        "nearestCity": "Ukhrul (18 km) / Imphal (85 km)",
        "entryFee": "Trek Fee ₹50"
      }
    ],
    "majorRivers": [
      "Imphal",
      "Barak",
      "Iril",
      "Manipur River"
    ],
    "famousFood": [
      "Eromba",
      "Kangshoi",
      "Singju",
      "Chak-Hao Kheer (Black Rice GI Tag)",
      "Ngang Kham"
    ],
    "famousFestivals": [
      "Yaoshang (Manipuri Holi)",
      "Sangai Festival",
      "Lai Haraoba",
      "Ningol Chakouba"
    ],
    "classicalDance": "Manipuri Raas Leela (Graceful classical dance depicting Radha-Krishna)"
  },
  {
    "id": "nagaland",
    "name": "Nagaland",
    "hindiName": "नागालैंड",
    "odiaName": "ନାଗାଲାଣ୍ଡ",
    "capital": "Kohima",
    "zone": "North-East",
    "formationYear": "1 December 1963",
    "officialLanguages": [
      "English"
    ],
    "areaKm2": "16,579 km²",
    "population": "2.2 Million",
    "literacyRate": "79.6%",
    "tagline": "Land of Festivals · Falcon Capital of the World",
    "coordinates": {
      "x": 86,
      "y": 42
    },
    "symbols": {
      "bird": {
        "name": "Blyth's Tragopan",
        "hindiName": "ब्लाइथ ट्रैगोपैन",
        "description": "Vibrant horned pheasant roosting in high canopy forests.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Mithun (Gayal)",
        "hindiName": "मिथुन",
        "description": "Sacred cattle that forms the official state seal of Nagaland.",
        "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Tree Rhododendron",
        "hindiName": "बुरांश का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Alder Tree",
        "hindiName": "एल्डर का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Kisama Heritage Village & Hornbill Festival",
        "hindiName": "किसामा हेरिटेज विलेज एवं हॉर्नबिल फेस्टिवल",
        "category": "Historical Monument",
        "description": "Traditional Naga heritage village nestled at the foot of Mount Japfu, venue of the world-renowned 'Festival of Festivals'—Hornbill Festival (1-10 December)—where all 17 major Naga tribes showcase war dances, indigenous crafts, and songs.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "1 to 10 December (Hornbill Festival) & Oct-April",
        "highlights": [
          "17 Naga Tribal Morungs (Traditional Dormitories)",
          "Grand Hornbill Festival Traditional Dances & Costumes",
          "Naga King Chilli (Bhut Jolokia) Eating Contest",
          "WWII Museum and Traditional Archery"
        ],
        "nearestCity": "Kohima (12 km) / Dimapur (85 km)",
        "entryFee": "₹50 (Indians) / Festival pass ₹100"
      },
      {
        "name": "Dzukou Valley (Valley of Flowers of the East)",
        "hindiName": "द्ज़ुको घाटी",
        "category": "Scenic Wonder",
        "description": "Enchanting high-altitude valley sitting at 2,452m on the border of Nagaland and Manipur, characterized by rolling emerald green carpeted knolls, meandering crystal streams, and the rare endemic pink Dzukou Lily.",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "June to September (Lilies) / Oct to March (Clear skies)",
        "highlights": [
          "Endemic Pink Dzukou Lily Blooming in July",
          "Rolling Velvet Green Mounds & Bamboo Ridges",
          "Trek from Viswema / Jakhama Villages",
          "Overnight Camping in Natural Mountain Caves"
        ],
        "nearestCity": "Viswema / Kohima (25 km)",
        "entryFee": "Entry ₹100"
      },
      {
        "name": "Kohima War Cemetery",
        "hindiName": "कोहिमा युद्ध कब्रिस्तान",
        "category": "Historical Monument",
        "description": "Commonwealth War Graves memorial on Garrison Hill commemorating Allied soldiers of the 1944 Battle of Kohima, described by historian Arthur Swinson as 'The Stalingrad of the East', featuring the famous Kohima Epitaph.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Famous Kohima Epitaph ('When you go home, tell them of us...')",
          "Preserved Tennis Court Battlefield Site",
          "Immaculately Manicured Hilltop Terraced Gardens",
          "State Museum of Kohima nearby"
        ],
        "nearestCity": "Kohima (City Center)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Khonoma Green Village",
        "hindiName": "खोनोमा ग्रीन विलेज",
        "category": "Historical Monument",
        "description": "Asia's first officially declared Green Village, a 700-year-old Angami Naga settlement famous for its historic resistance against British colonial forces and its modern community-led conservation banning logging and hunting.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Centuries-old Stone Forts & Carved Gateways",
          "Pristine Khonoma Nature Conservation & Tragopan Sanctuary",
          "Alder Wood Sustainable Terraced Agriculture",
          "Homestays with Authentic Naga Cuisine"
        ],
        "nearestCity": "Khonoma / Kohima (20 km)",
        "entryFee": "Village Entry ₹50"
      }
    ],
    "majorRivers": [
      "Doyang",
      "Dhansiri",
      "Dikhu",
      "Tizu"
    ],
    "famousFood": [
      "Smoked Pork with Axone (Fermented Soyabean)",
      "Bamboo Shoot Pork",
      "Bhut Jolokia Ghost Pepper",
      "Galho",
      "Anishi"
    ],
    "famousFestivals": [
      "Hornbill Festival",
      "Sekrenyi (Angami)",
      "Moatsu (Ao)",
      "Aoleang (Konyak)"
    ],
    "classicalDance": "War Dance & Modse Folk Dance"
  },
  {
    "id": "mizoram",
    "name": "Mizoram",
    "hindiName": "मिजोरम",
    "odiaName": "ମିଜୋରାମ",
    "capital": "Aizawl",
    "zone": "North-East",
    "formationYear": "20 February 1987",
    "officialLanguages": [
      "Mizo",
      "English"
    ],
    "areaKm2": "21,081 km²",
    "population": "1.2 Million",
    "literacyRate": "91.3% (One of India's Highest)",
    "tagline": "Peaceful Mizoram · Land of the Blue Mountains",
    "coordinates": {
      "x": 80,
      "y": 55
    },
    "symbols": {
      "bird": {
        "name": "Mrs. Hume's Pheasant (Vavu)",
        "hindiName": "ह्यूम तीतर",
        "description": "Long-tailed forest bird roaming the Phawngpui Blue Mountains.",
        "imageUrl": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Serow (Saza)",
        "hindiName": "सीरो (हिमालयी बकरा)",
        "description": "Goat-antelope navigating rocky precipices in Murlen National Park.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Red Vanda Orchid (Senhri)",
        "hindiName": "लाल वांडा ऑर्किड",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Iron Wood (Herhse)",
        "hindiName": "नागकेसर / आयरन वुड",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Vantawng Falls, Thenzawl",
        "hindiName": "वनतवांग जलप्रपात, थेंजोल",
        "category": "Scenic Wonder",
        "description": "The highest uninterrupted waterfall in Mizoram, plunging 229 meters (750 ft) in a two-tiered cascade amidst thick bamboo and deciduous forests on the Vanva river near the handloom town of Thenzawl.",
        "imageUrl": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "September to January (Post-monsoon roar)",
        "highlights": [
          "229-meter Tallest Waterfall in Mizoram",
          "Surrounding Lush Bamboo Forests & Gorge",
          "Thenzawl Handloom Weaving Village nearby",
          "Tuirihnau Falls next door"
        ],
        "nearestCity": "Thenzawl (5 km) / Aizawl (95 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Reiek Tlang Peak",
        "hindiName": "रेइक त्लांग पीक",
        "category": "Hill Station",
        "description": "Dramatic cliff peak at 1,548m overlooking Aizawl, offering breathtaking vistas of the surrounding misty blue valleys and the distant plains of Bangladesh on clear days, complemented by a model Mizo heritage village.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April (Anthurium Festival in Sep)",
        "highlights": [
          "Spectacular 360-degree Cliff-edge Ridge View",
          "Traditional Mizo Model Village (Zawlbuk)",
          "Anthurium Flower Plantation Farms",
          "Annual Anthurium Tourism Festival"
        ],
        "nearestCity": "Reiek / Aizawl (29 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Phawngpui (Blue Mountain National Park)",
        "hindiName": "फावंगपुई (ब्लू माउंटेन)",
        "category": "Hill Station",
        "description": "The highest mountain peak in Mizoram at 2,157m, revered by the Mizos as the abode of the gods, famed for dramatic cliff drop-offs (Thlazuang Kham), rare wild orchids, rhododendrons, and Mrs. Hume's pheasant.",
        "imageUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "November to April",
        "highlights": [
          "Highest Mountain in Mizoram (2,157m)",
          "Semi-Circular Bamboo Plateau & Orchids",
          "Breathtaking Thlazuang Kham Cliff Drop",
          "Endemic Mrs. Hume's Pheasant Sightings"
        ],
        "nearestCity": "Sangau / Lawngtlai (60 km) / Aizawl (230 km)",
        "entryFee": "Forest Permit Required"
      },
      {
        "name": "Solomon's Temple, Aizawl",
        "hindiName": "सोलोमन टेम्पल, आइजोल",
        "category": "Historical Monument",
        "description": "A grand white marble church complex built by Kohhran Thianghlim (The Holy Church) over two decades in Chawlhhmun, Aizawl, designed as a modern replica of King Solomon's biblical temple with a 3,000-seat sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "Year-round (October to March best)",
        "highlights": [
          "Gleaming White Marble Biblical Architecture",
          "3,000-Seat Main Sanctuary Hall",
          "Mizoram State Museum in Aizawl nearby",
          "Bara Bazar Cultural Market Experience"
        ],
        "nearestCity": "Aizawl (City Center)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Tlawng",
      "Chhimtuipui (Kaladan)",
      "Tut",
      "Tuivawl"
    ],
    "famousFood": [
      "Bai (Vegetable and Pork Stew)",
      "Vawksa Rep (Smoked Pork)",
      "Sawhchiar",
      "Sanpiau",
      "Koat Pitha"
    ],
    "famousFestivals": [
      "Chapchar Kut (Spring Harvest Festival)",
      "Mim Kut",
      "Pawl Kut",
      "Thalfavang Kut"
    ],
    "classicalDance": "Cheraw (Famous Bamboo Dance rhythmically stepping between moving bamboo poles)"
  },
  {
    "id": "chandigarh",
    "name": "Chandigarh",
    "hindiName": "चंडीगढ़",
    "odiaName": "ଚଣ୍ଡିଗଡ଼",
    "capital": "Chandigarh (Joint Capital of Punjab & Haryana)",
    "zone": "UT",
    "formationYear": "1 November 1966",
    "officialLanguages": [
      "English",
      "Hindi",
      "Punjabi"
    ],
    "areaKm2": "114 km²",
    "population": "1.2 Million",
    "literacyRate": "86.1%",
    "tagline": "The City Beautiful · Planned Masterpiece by Le Corbusier",
    "coordinates": {
      "x": 35,
      "y": 26
    },
    "symbols": {
      "bird": {
        "name": "Indian Grey Hornbill",
        "hindiName": "धूसर हॉर्नबिल",
        "description": "Arboreal fruit eater thriving in Chandigarh's shaded sectors.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Indian Grey Mongoose",
        "hindiName": "नेवला",
        "description": "Agile mammal wandering Sukhna Wildlife Sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1507666405895-422efe7d0096?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Dhak (Palash)",
        "hindiName": "पलाश का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Mango Tree",
        "hindiName": "आम का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Rock Garden of Chandigarh (Nek Chand)",
        "hindiName": "रॉक गार्डन, चंडीगढ़",
        "category": "Historical Monument",
        "description": "World-famous 40-acre sculpture fantasy park created entirely in secret by road inspector Nek Chand over 18 years, using recycled urban and industrial waste like broken ceramics, glass bangles, tiles, and electrical fittings.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Over 5,000 Recycled Ceramic Sculptures",
          "Interconnected Courtyards, Waterfalls & Grottoes",
          "Wall of Broken Bangles & Sinks",
          "Open-Air Amphitheater with Swings"
        ],
        "nearestCity": "Chandigarh (Sector 1)",
        "entryFee": "₹30 (Adults) / ₹10 (Children)"
      },
      {
        "name": "Sukhna Lake",
        "hindiName": "सुखना झील",
        "category": "Scenic Wonder",
        "description": "Tranquil 3 sq km artificial rainfed lake at the foothills of the Shivalik Himalayas, created in 1958 by Le Corbusier and Chief Engineer P.L. Verma, famous for sunrise jogging, boating, and migratory birds.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Shivalik Mountain Foothill Reflection",
          "Pedal & Shikara Boat Cruises",
          "Solar-Powered Promenade Stroll",
          "Siberian Migratory Bird Watching"
        ],
        "nearestCity": "Chandigarh (Sector 1)",
        "entryFee": "Free Entry (Boating ₹100 - ₹250)"
      },
      {
        "name": "Capitol Complex & Le Corbusier Open Hand",
        "hindiName": "कैपिटल कॉम्प्लेक्स एवं ओपन हैंड",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Site designed by legendary Swiss-French architect Le Corbusier, comprising the Secretariat, High Court, Legislative Assembly, and the monumental 28-meter rotating Open Hand Monument symbolizing peace and openness.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "UNESCO World Heritage Modern Architecture",
          "28-meter Rotating Giant Open Hand Monument",
          "Tower of Shadows & Geometric Hill",
          "Punjab & Haryana High Court Brise-Soleil Facade"
        ],
        "nearestCity": "Chandigarh (Sector 1)",
        "entryFee": "Free Entry (Guided Tour registration required)"
      },
      {
        "name": "Zakir Hussain Rose Garden",
        "hindiName": "ज़ाकिर हुसैन रोज़ गार्डन",
        "category": "Scenic Wonder",
        "description": "Asia's largest rose botanical garden spanning 30 acres in Sector 16, featuring over 50,000 rose bushes representing 1,600 different species, along with medicinal trees and the vibrant annual Rose Festival in February.",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "February to March (Peak Bloom & Rose Festival)",
        "highlights": [
          "Over 50,000 Rose Bushes of 1,600 Varieties",
          "Annual Three-Day Rose Festival in February",
          "Musical Water Fountains & Manicured Lawns",
          "Sector 17 Shopping Plaza adjacent"
        ],
        "nearestCity": "Chandigarh (Sector 16)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Sukhna Choe",
      "Patiala Ki Rao"
    ],
    "famousFood": [
      "Butter Chicken",
      "Amritsari Kulcha",
      "Chole Bhature",
      "Lassi",
      "Paneer Tikka"
    ],
    "famousFestivals": [
      "Rose Festival Zakir Hussain Garden",
      "Chandigarh Carnival",
      "Baisakhi",
      "Mango Mela"
    ],
    "classicalDance": "Bhangra & Classical Music Academy"
  },
  {
    "id": "puducherry",
    "name": "Puducherry",
    "hindiName": "पुदुचेरी",
    "odiaName": "ପୁଦୁଚେରୀ",
    "capital": "Pondicherry",
    "zone": "UT",
    "formationYear": "1 July 1963",
    "officialLanguages": [
      "Tamil",
      "French",
      "Telugu",
      "Malayalam",
      "English"
    ],
    "areaKm2": "492 km²",
    "population": "1.4 Million",
    "literacyRate": "85.8%",
    "tagline": "Give Time a Break · French Riviera of the East",
    "coordinates": {
      "x": 48,
      "y": 80
    },
    "symbols": {
      "bird": {
        "name": "Asian Koel",
        "hindiName": "कोयल",
        "description": "Resident singer across the tree-lined French Quarter streets.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Indian Palm Squirrel",
        "hindiName": "गिलहरी",
        "description": "Three-striped palm squirrel nesting in coastal avenues.",
        "imageUrl": "https://images.unsplash.com/photo-1507666405895-422efe7d0096?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Cannonball Flower (Nagalinga)",
        "hindiName": "नागलिंगम पुष्प",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Bael Tree (Bilva)",
        "hindiName": "बेल का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Promenade Beach & French Quarter (White Town)",
        "hindiName": "प्रोमेनेड बीच एवं फ्रेंच क्वार्टर (व्हाइट टाउन)",
        "category": "Beach",
        "description": "Picturesque 1.5-kilometer seaside boulevard along the Bay of Bengal, lined with pastel yellow and mustard colonial French villas, bougainvillea blooms, chic European cafes, and the 4-meter statue of Mahatma Gandhi.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "French Colonial Architecture & Cobblestone Streets",
          "Evening Traffic-Free Beach Promenade",
          "French Bakeries (Croissants & Espresso)",
          "Bicycle Tours around Heritage White Town"
        ],
        "nearestCity": "Puducherry (City Center)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Auroville & Matrimandir",
        "hindiName": "ऑरोविले एवं मातृमंदिर",
        "category": "Spiritual Shrine",
        "description": "Universal experimental township founded in 1968 by Mirra Alfassa ('The Mother'), dedicated to human unity beyond national barriers. Dominated by Matrimandir, a colossal golden sphere surrounded by 12 petal meditation rooms.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Golden Dome of Matrimandir with 1,414 Gold Discs",
          "Inner Chamber with 70cm Crystal Globe Meditation",
          "Auroville Visitors Centre & Organic Cafes",
          "Sri Aurobindo Ashram in Pondicherry city"
        ],
        "nearestCity": "Auroville / Puducherry (12 km)",
        "entryFee": "Free Entry (Inner chamber booking required)"
      },
      {
        "name": "Paradise Beach & Chunnambar Boat House",
        "hindiName": "पैराडाइज बीच एवं चुन्नंबर बोट हाउस",
        "category": "Beach",
        "description": "Isolated golden sand spit beach accessible only by a scenic 15-minute ferry ride through Chunnambar backwaters and mangrove channels, offering turquoise waters, thatched beach shacks, and water sports.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Chunnambar Backwater Boat Cruise to Island Beach",
          "Pristine Golden Sand & Safe Sea Bathing",
          "Jet Skiing, Banana Rides & Beach Volleyball",
          "Fresh Coconut Water & Seafood Shacks"
        ],
        "nearestCity": "Chunnambar / Puducherry (8 km)",
        "entryFee": "Ferry ₹300 - ₹400 / Person"
      },
      {
        "name": "Arikamedu (Ancient Roman Trading Port)",
        "hindiName": "अरिकामेडु (प्राचीन रोमन व्यापार बंदरगाह)",
        "category": "Historical Monument",
        "description": "2,000-year-old archaeological site on the Ariyankuppam river, a major Indo-Roman bead making and maritime trading port between 2nd century BCE and 8th century CE.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Excavated Roman Amphorae Jars & Beads",
          "Historic Indo-Roman Maritime Port",
          "Ariyankuppam River Estuary Views",
          "Archaeological Museum Artifacts in Town"
        ],
        "nearestCity": "Arikamedu / Puducherry (7 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Gingee River",
      "Chunnambar River"
    ],
    "famousFood": [
      "Croissants and Baguettes",
      "Crepes",
      "Bouillabaisse (Fish stew)",
      "Kothu Parotta",
      "Filter Coffee"
    ],
    "famousFestivals": [
      "Auroville Marathon",
      "Fete de Puducherry",
      "Pongal",
      "Bastille Day (14 July)"
    ],
    "classicalDance": "Bharatanatyam & French Cultural Soirées"
  },
  {
    "id": "andaman_nicobar",
    "name": "Andaman & Nicobar Islands",
    "hindiName": "अंडमान और निकोबार द्वीप समूह",
    "odiaName": "ଆଣ୍ଡାମାନ ଓ ନିକୋବର",
    "capital": "Sri Vijaya Puram (Port Blair)",
    "zone": "UT",
    "formationYear": "1 November 1956",
    "officialLanguages": [
      "Hindi",
      "English",
      "Bengali",
      "Tamil"
    ],
    "areaKm2": "8,249 km² (572 Islands)",
    "population": "400,000",
    "literacyRate": "86.6%",
    "tagline": "Emerald Islands · Land of Kala Pani & Coral Reefs",
    "coordinates": {
      "x": 86,
      "y": 80
    },
    "symbols": {
      "bird": {
        "name": "Andaman Wood Pigeon",
        "hindiName": "अंडमान जंगली कबूतर",
        "description": "Endemic wood pigeon residing in tropical dense rainforests.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Dugong (Sea Cow)",
        "hindiName": "डूगोंग (समुद्री गाय)",
        "description": "Gentle herbivorous marine mammal feeding on seagrass meadows.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Pyinma (Lagerstroemia speciosa)",
        "hindiName": "प्यिनमा पुष्प",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Andaman Padauk",
        "hindiName": "अंडमान पाडौक का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Cellular Jail (Kala Pani), Port Blair",
        "hindiName": "सेलुलर जेल (काला पानी), पोर्ट ब्लेयर",
        "category": "Historical Monument",
        "description": "Sacred national memorial of India's freedom struggle, a 7-wing panopticon colonial prison built by the British between 1896-1906 to exile revolutionary freedom fighters like Veer Savarkar and Batukeshwar Dutt.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Veer Savarkar Solitary Confinement Cell",
          "Moving Evening Sound & Light Show in Hindi/English",
          "Central Watchtower & Gallows Room",
          "Freedom Fighters Photo Gallery & Memorial"
        ],
        "nearestCity": "Port Blair (City Center)",
        "entryFee": "₹30 (Indians) / Sound & Light Show ₹50"
      },
      {
        "name": "Radhanagar Beach, Havelock Island (Swaraj Dweep)",
        "hindiName": "राधानगर बीच, हैवलॉक द्वीप",
        "category": "Beach",
        "description": "Crowned by TIME Magazine as 'Asia's Best Beach' and certified Blue Flag, an idyllic curve of powdery white sands flanked by lush rainforests and crystal turquoise waters offering spectacular sunset vistas.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Ranked Asia's Cleanest White Sand Beach",
          "Gentle Rolling Turquoise Waves for Swimming",
          "World-Class Sunset View over Andaman Sea",
          "Blue Flag Certified Eco Facilities"
        ],
        "nearestCity": "Havelock Island (Swaraj Dweep) / Port Blair (Ferry 90 min)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Elephant Beach & Neil Island (Shaheed Dweep)",
        "hindiName": "एलीफेंट बीच एवं नील द्वीप",
        "category": "Beach",
        "description": "Premier marine adventure hub famous for vibrant shallow coral reefs, sea walking, scuba diving, and snorkeling at Elephant Beach, complemented by Neil Island's natural rock bridge (Howrah Bridge) and Bharatpur Beach.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Underwater Helmet Sea Walking on Coral Reefs",
          "Scuba Diving & Snorkeling with Clownfish & Turtles",
          "Neil Island Natural Geological Rock Arch Bridge",
          "Glass-Bottom Boat Coral Viewing"
        ],
        "nearestCity": "Havelock / Neil Island / Port Blair",
        "entryFee": "Speedboat ₹1,000 / Sea Walk ₹3,500"
      },
      {
        "name": "Ross Island (Netaji Subhash Chandra Bose Dweep)",
        "hindiName": "रॉस द्वीप (नेताजी सुभाष चंद्र बोस द्वीप)",
        "category": "Historical Monument",
        "description": "Former administrative headquarters of the British Penal Settlement, now an enchanting ghost town where ruins of colonial ballrooms, churches, and printing presses are entangled in giant banyan tree roots, with wild deer roaming freely.",
        "imageUrl": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to April",
        "highlights": [
          "Colonial British Ruins Entangled in Banyan Trees",
          "Friendly Spotted Deer & Peacocks Roaming Free",
          "Preserved Victorian Church & Officers' Club Ruins",
          "15-minute Boat Ride from Port Blair Jetty"
        ],
        "nearestCity": "Port Blair (3 km by boat)",
        "entryFee": "Boat ₹300 - ₹500 / Entry ₹50"
      }
    ],
    "majorRivers": [
      "Kalpong River (North Andaman)"
    ],
    "famousFood": [
      "Fresh Grilled Lobster",
      "Coconut Prawn Curry",
      "Fish Amritsari",
      "Chilli Curry",
      "Tandoori Crab"
    ],
    "famousFestivals": [
      "Island Tourism Festival",
      "Monsoon Music Festival",
      "Subhash Mela"
    ],
    "classicalDance": "Nicobari Tribal Dance"
  },
  {
    "id": "lakshadweep",
    "name": "Lakshadweep",
    "hindiName": "लक्षद्वीप",
    "odiaName": "ଲାକ୍ଷାଦ୍ୱୀପ",
    "capital": "Kavaratti",
    "zone": "UT",
    "formationYear": "1 November 1956",
    "officialLanguages": [
      "Malayalam",
      "Jassari",
      "Mahl",
      "English"
    ],
    "areaKm2": "32.62 km² (36 Atolls & Coral Islands)",
    "population": "66,000",
    "literacyRate": "91.8%",
    "tagline": "99% Sea, 1% Land · Coral Paradise of India",
    "coordinates": {
      "x": 24,
      "y": 80
    },
    "symbols": {
      "bird": {
        "name": "Sooty Tern",
        "hindiName": "काली टर्न",
        "description": "Pelagic seabird that nests in huge colonies on Pitti Island bird sanctuary.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Butterfly Fish",
        "hindiName": "बटरफ्लाई फिश (तितली मछली)",
        "description": "Vibrantly patterned coral reef dweller in lagoon waters.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Neelakurinji",
        "hindiName": "नीलकुरिंजी",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Breadfruit Tree",
        "hindiName": "ब्रेडफ्रूट का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Bangaram Island & Lagoon",
        "hindiName": "बंगारम द्वीप एवं लैगून",
        "category": "Beach",
        "description": "Teardrop-shaped uninhabited coral atoll surrounded by a shallow crystal-clear turquoise lagoon, ranked among the top secluded island paradises in the world, featuring phosphorescent night plankton and vibrant coral reefs.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Breathtaking Phosphorescent Bioluminescent Waters",
          "Scuba Diving on Pristine Unspoiled Coral Reefs",
          "Deep Sea Kayaking & Windsurfing",
          "Excursion to Thinnakara & Parali Islands"
        ],
        "nearestCity": "Bangaram / Agatti Airport (Boat 45 min)",
        "entryFee": "Lakshadweep Entry Permit Required"
      },
      {
        "name": "Agatti Island & Lagoon",
        "hindiName": "अगत्ती द्वीप एवं लैगून",
        "category": "Beach",
        "description": "The gateway to Lakshadweep featuring one of the world's most spectacular airstrips surrounded on both sides by turquoise coral waters, white sandy beaches, glass-bottom boats, and sea turtle snorkeling.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Spectacular Coral Airstrip Landing Experience",
          "Glass-Bottom Boat Coral Viewing",
          "Sea Turtle & Manta Ray Snorkeling",
          "Fresh Coconut & Local Tuna Delicacies"
        ],
        "nearestCity": "Agatti (Airport Island)",
        "entryFee": "Lakshadweep Permit Required"
      },
      {
        "name": "Kavaratti Island (Capital Atoll)",
        "hindiName": "कवरत्ती द्वीप",
        "category": "Historical Monument",
        "description": "The administrative capital of Lakshadweep, famous for the Marine Aquarium housing rare coral reef species, 52 historic mosques including the intricately carved 17th-century Ujra Mosque, and water sports at Dolphin Dive Centre.",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "Ujra Mosque Intricate Driftwood Carvings",
          "Lakshadweep Marine Aquarium & Museum",
          "Dolphin Dive Centre PADI Certification",
          "Lagoon Water Sports: Kayaking & Snorkeling"
        ],
        "nearestCity": "Kavaratti (Capital)",
        "entryFee": "Permit Required"
      },
      {
        "name": "Minicoy Island (Maliku)",
        "hindiName": "मिनिकॉय द्वीप",
        "category": "Historical Monument",
        "description": "The southernmost atoll of Lakshadweep having close cultural and linguistic ties with the Maldives (Mahl language), renowned for its historic 1885 British lighthouse, traditional long boat races (Jahadhoni), and tuna fishing culture.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to May",
        "highlights": [
          "1885 Historic 300-foot British Lighthouse",
          "Traditional 30-meter Jahadhoni Snake Boats",
          "Distinctive Maldivian Culture & Architecture",
          "Untouched Coral Atolls & Reef Diving"
        ],
        "nearestCity": "Minicoy / Kochi (Ferry)",
        "entryFee": "Permit Required"
      }
    ],
    "majorRivers": [
      "None (Surrounded by Arabian Sea Lagoons)"
    ],
    "famousFood": [
      "Tuna Curry",
      "Rayereha (Coconut fish curry)",
      "Mus Kavaab",
      "Batla Appam",
      "Kadalakka Halwa"
    ],
    "famousFestivals": [
      "Eid-ul-Fitr",
      "Milad-un-Nabi",
      "Bakrid",
      "Independence Day Regatta"
    ],
    "classicalDance": "Kolkali & Parichakali (Folk stick and shield dance of Minicoy)"
  },
  {
    "id": "dadra_nagar_haveli_daman_diu",
    "name": "Dadra & Nagar Haveli and Daman & Diu",
    "hindiName": "दादरा और नगर हवेली एवं दमन और दीव",
    "odiaName": "ଦାଦ୍ରା ଓ ନଗର ହାବେଳି",
    "capital": "Daman",
    "zone": "UT",
    "formationYear": "26 January 2020 (Merged UT)",
    "officialLanguages": [
      "Gujarati",
      "Hindi",
      "Marathi",
      "English"
    ],
    "areaKm2": "603 km²",
    "population": "615,000",
    "literacyRate": "82.5%",
    "tagline": "Sea, Sun & Portuguese Heritage",
    "coordinates": {
      "x": 26,
      "y": 55
    },
    "symbols": {
      "bird": {
        "name": "Emerald Dove",
        "hindiName": "मरकत कपोत",
        "description": "Pigeon with iridescent green plumage.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
      },
      "animal": {
        "name": "Spotted Deer",
        "hindiName": "चित्तीदार हिरण",
        "description": "Protected in Satmaliya Deer Park.",
        "imageUrl": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80"
      },
      "flower": {
        "name": "Red Hibiscus",
        "hindiName": "गुड़हल का फूल",
        "imageUrl": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80"
      },
      "tree": {
        "name": "Banyan Tree",
        "hindiName": "बरगद का पेड़",
        "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
      }
    },
    "famousPlaces": [
      {
        "name": "Diu Fort & Naida Caves",
        "hindiName": "दीव किला एवं नायडा गुफाएं",
        "category": "Fort & Palace",
        "description": "Imposing 1535 Portuguese sea fortress surrounded by the Arabian Sea on three sides with stone ramparts, historic bronze cannons, lighthouse, paired with Naida Caves—a surreal network of sunlit hollowed caverns carved by the Portuguese.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Ocean-Facing 1535 Fort Ramparts & Cannons",
          "Naida Caves Natural Light Beams Photography",
          "St. Paul's 1601 Baroque Church",
          "Ghoghla Blue Flag Beach Watersports"
        ],
        "nearestCity": "Diu (City Center) / Somnath (85 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Moti Daman & Nani Daman Forts",
        "hindiName": "मोती दमन एवं नानी दमन किला",
        "category": "Fort & Palace",
        "description": "Massive 16th-century Portuguese ramparts guarding the Daman Ganga river, enclosing the Church of Bom Jesus with its intricately carved gilded altarpiece, Governor's Palace, and Nani Daman's St. Jerome Fort.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "16th-Century Gilded Altarpiece at Bom Jesus Church",
          "Twin Fortresses Guarding Daman Ganga River",
          "Jampore Beach Black Sand Shoreline & Water Sports",
          "Devka Beach Amusement Park & Promenade"
        ],
        "nearestCity": "Daman (City Center) / Vapi (12 km) / Mumbai (170 km)",
        "entryFee": "Free Entry"
      },
      {
        "name": "Vanganga Lake Garden & Dudhni, Silvassa",
        "hindiName": "वनगंगा लेक गार्डन एवं दुधनी, सिलवासा",
        "category": "Scenic Wonder",
        "description": "Lush landscape garden in Dadra & Nagar Haveli built around an island lake connected by Japanese bridges, paired with Dudhni Lake water sports resort on the Madhuban reservoir and the Tribal Cultural Museum of Silvassa.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Vanganga Lake Japanese Bridges & Boating",
          "Dudhni Water Sports & Speedboating on Madhuban Dam",
          "Silvassa Tribal Cultural Museum (Warli paintings)",
          "Lion Safari Wildlife Park at Vasona"
        ],
        "nearestCity": "Silvassa (Capital) / Vapi (18 km)",
        "entryFee": "Garden ₹20 / Boating ₹50"
      },
      {
        "name": "Jampore Beach & Church of Our Lady of the Sea",
        "hindiName": "जंपोर बीच एवं चर्च ऑफ अवर लेडी ऑफ द सी",
        "category": "Beach",
        "description": "Serene mud-free beach with casuarina groves on the Arabian Sea famous for parasailing, beach buggies, and the 16th-century Portuguese fortress church within Moti Daman.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "bestTimeToVisit": "October to March",
        "highlights": [
          "Parasailing & Motorboat Sea Rides",
          "Casuarina Plantation Sunset Shade",
          "16th-Century Portuguese Coral Stone Facade",
          "Fresh Fried Pomfret & Prawns Shacks"
        ],
        "nearestCity": "Daman (5 km)",
        "entryFee": "Free Entry"
      }
    ],
    "majorRivers": [
      "Daman Ganga",
      "Kolak"
    ],
    "famousFood": [
      "Cozy Daman Seafood",
      "Chicken Bullet",
      "Val Papdi",
      "Parsi Akuri",
      "Dhokla",
      "Langar Thali"
    ],
    "famousFestivals": [
      "Nariyal Poornima",
      "Festa De Diu (Asia's Longest Beach Festival)",
      "Garba",
      "Christmas"
    ],
    "classicalDance": "Tarpa Tribal Dance & Mando Portuguese Folk Dance"
  }
];
