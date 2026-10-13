/**
 * Comprehensive Dataset for ALL 28 Indian States and 8 Union Territories
 * Covers official State Symbols (Bird, Animal, Flower, Tree),
 * Famous places and UNESCO Heritage sites with real authentic imagery,
 * Culture, Rivers, Foods, and multilingual translations.
 */

export interface StateFamousPlace {
  name: string;
  hindiName?: string;
  category: 'UNESCO Heritage' | 'Historical Monument' | 'Natural Wonder' | 'Spiritual Shrine' | 'Hill Station';
  description: string;
  imageUrl: string;
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
  coordinates: { x: number; y: number }; // Relative position on India SVG (0-100 scale)
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
        "description": "13th-century Black Pagoda designed as a colossal 24-wheeled chariot of Surya with exquisite stone carvings.",
        "imageUrl": "https://images.unsplash.com/photo-1626279930777-628e9999e037?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Jagannath Temple Puri",
        "hindiName": "जगन्नाथ मंदिर पुरी",
        "category": "Spiritual Shrine",
        "description": "Char Dham spiritual epicenter famous for the world-renowned Ratha Yatra and the kitchen feeding 50,000 pilgrims daily.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Chilika Lake",
        "hindiName": "चिल्लिका झील",
        "category": "Natural Wonder",
        "description": "Asia's largest brackish water lagoon, home to rare Irrawaddy dolphins and millions of migratory birds at Nalabana.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Gateway of India Mumbai",
        "hindiName": "गेटवे ऑफ इंडिया मुंबई",
        "category": "Historical Monument",
        "description": "Iconic 26-meter arch monument built on the Mumbai Apollo Bunder waterfront facing the Arabian Sea.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Ajanta & Ellora Caves",
        "hindiName": "अजंता और एलोरा की गुफाएं",
        "category": "UNESCO Heritage",
        "description": "Rock-cut ancient Buddhist, Hindu and Jain caves featuring the single-rock megalith Kailash Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Chhatrapati Shivaji Maharaj Terminus",
        "hindiName": "सीएसएमटी रेलवे स्टेशन",
        "category": "UNESCO Heritage",
        "description": "Victorian Gothic Revival historic terminal railway station showcasing outstanding high-Victorian architecture.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Hawa Mahal Jaipur",
        "hindiName": "हवा महल जयपुर",
        "category": "Historical Monument",
        "description": "Palace of Winds built with red and pink sandstone featuring 953 intricate jharokha casements.",
        "imageUrl": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Mehrangarh Fort Jodhpur",
        "hindiName": "मेहरानगढ़ किला जोधपुर",
        "category": "Historical Monument",
        "description": "One of India's largest formidable hill forts rising 410 feet above the Blue City of Jodhpur.",
        "imageUrl": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Amber Palace Jaipur",
        "hindiName": "आमेर किला जयपुर",
        "category": "UNESCO Heritage",
        "description": "Majestic fort with Sheesh Mahal (Mirror Palace) overlooking Maota Lake.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Taj Mahal Agra",
        "hindiName": "ताजमहल आगरा",
        "category": "UNESCO Heritage",
        "description": "Universal jewel of Muslim art in India and 7th Wonder of the World built in ivory-white marble by Shah Jahan.",
        "imageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kashi Vishwanath Temple Varanasi",
        "hindiName": "काशी विश्वनाथ मंदिर वाराणसी",
        "category": "Spiritual Shrine",
        "description": "Spiritual heart of Hinduism on the holy banks of the Ganges River, dedicated to Lord Shiva.",
        "imageUrl": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Bara Imambara Lucknow",
        "hindiName": "बड़ा इमामबाड़ा लखनऊ",
        "category": "Historical Monument",
        "description": "Architectural marvel with the famous Bhulbhulaiya (labyrinth) built without external beams or iron pillars.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Meenakshi Amman Temple Madurai",
        "hindiName": "मीनाक्षी अम्मन मंदिर मदुरै",
        "category": "Spiritual Shrine",
        "description": "Historic Dravidian temple complex featuring 14 soaring gopurams decorated with thousands of painted stone figures.",
        "imageUrl": "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Brihadeeswarar Temple Thanjavur",
        "hindiName": "बृहदीश्वर मंदिर तंजावुर",
        "category": "UNESCO Heritage",
        "description": "1,000-year-old Big Temple built by Rajaraja Chola I completely out of granite with an 80-tonne single-stone vimana dome.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Shore Temple Mahabalipuram",
        "hindiName": "महाबलीपुरम शोर मंदिर",
        "category": "UNESCO Heritage",
        "description": "8th-century Pallava structural temple overlooking the roaring waves of the Bay of Bengal.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Mysore Palace",
        "hindiName": "मैसूर पैलेस",
        "category": "Historical Monument",
        "description": "Indo-Saracenic royal residence of the Wadiyar dynasty illuminated by 100,000 light bulbs during Dussehra.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f4433149?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Hampi Ruins",
        "hindiName": "हम्पी के खंडहर",
        "category": "UNESCO Heritage",
        "description": "Spectacular boulder-strewn capital of the Vijayanagara Empire with stone chariot and Virupaksha Temple.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Gol Gumbaz Bijapur",
        "hindiName": "गोल गुम्बज़ बीजापुर",
        "category": "Historical Monument",
        "description": "Mausoleum with the second largest dome in the world, renowned for its acoustic Whispering Gallery.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Padmanabhaswamy Temple",
        "hindiName": "पद्मनाभस्वामी मंदिर",
        "category": "Spiritual Shrine",
        "description": "Wealthiest temple in the world with underground treasure vaults and Gopuram in Travancore style.",
        "imageUrl": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Alleppey Backwaters",
        "hindiName": "अलप्पुझा बैकवाटर्स",
        "category": "Natural Wonder",
        "description": "Venice of the East featuring a labyrinth of palm-fringed canals, lagoons, and traditional Kettuvallam houseboats.",
        "imageUrl": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Munnar Tea Gardens",
        "hindiName": "मुन्नार चाय बागान",
        "category": "Hill Station",
        "description": "Rolling emerald hills in the Western Ghats producing high-altitude tea near Anamudi peak.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Victoria Memorial Kolkata",
        "hindiName": "विक्टोरिया मेमोरियल कोलकाता",
        "category": "Historical Monument",
        "description": "Large white Makrana marble building dedicated to Queen Victoria, now an extensive museum.",
        "imageUrl": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sundarbans National Park",
        "hindiName": "सुंदरबन राष्ट्रीय उद्यान",
        "category": "UNESCO Heritage",
        "description": "World's largest tidal halophytic mangrove forest and habitat of the swimming Royal Bengal Tiger.",
        "imageUrl": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Howrah Bridge",
        "hindiName": "हावड़ा ब्रिज",
        "category": "Historical Monument",
        "description": "Balanced cantilever bridge suspended over the Hooghly River carrying over 100,000 vehicles daily.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Statue of Unity",
        "hindiName": "स्टैच्यू ऑफ यूनिटी",
        "category": "Historical Monument",
        "description": "Colossal 182-meter statue honoring Sardar Vallabhbhai Patel on the Narmada River, the tallest statue in the world.",
        "imageUrl": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Somnath Temple",
        "hindiName": "सोमनाथ ज्योतिर्लिंग मंदिर",
        "category": "Spiritual Shrine",
        "description": "First among the 12 sacred Jyotirlinga shrines of Lord Shiva situated by the Arabian Sea shore.",
        "imageUrl": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sun Temple Modhera",
        "hindiName": "सूर्य मंदिर मोढेरा",
        "category": "Historical Monument",
        "description": "11th-century Solanki dynasty temple with a stepped tank (Surya Kund) where the equinox sun illuminates the sanctum.",
        "imageUrl": "https://images.unsplash.com/photo-1626279930777-628e9999e037?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Golden Temple Amritsar (Harmandir Sahib)",
        "hindiName": "स्वर्ण मंदिर अमृतसर",
        "category": "Spiritual Shrine",
        "description": "Holiest gurdwara of Sikhism covered with pure gold leaf, hosting the world's largest free community kitchen (Langar).",
        "imageUrl": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Wagah Border",
        "hindiName": "वाघा बॉर्डर",
        "category": "Historical Monument",
        "description": "Daily military flag-lowering beating retreat ceremony conducted by the Border Security Force and Pakistan Rangers.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Jallianwala Bagh",
        "hindiName": "जलियांवाला बाग",
        "category": "Historical Monument",
        "description": "National memorial commemorating the 1919 martyrs of the Indian freedom movement.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Khajuraho Temples",
        "hindiName": "खजुराहो के मंदिर",
        "category": "UNESCO Heritage",
        "description": "Nagara-style Hindu and Jain temples famous for stunning architectural sculpture and intricate nagara spires.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sanchi Stupa",
        "hindiName": "सांची का महान स्तूप",
        "category": "UNESCO Heritage",
        "description": "Oldest stone structure in India commissioned by Emperor Ashoka in 3rd century BCE with four carved Torana gateways.",
        "imageUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Gwalior Fort",
        "hindiName": "ग्वालियर का किला",
        "category": "Historical Monument",
        "description": "Perched on a sandstone plateau, hailed as the 'Pearl amongst fortresses in India' by Emperor Babur.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Charminar Hyderabad",
        "hindiName": "चारमीनार हैदराबाद",
        "category": "Historical Monument",
        "description": "Iconic 1591 monument with four 56-meter minarets built by Sultan Muhammad Quli Qutb Shah.",
        "imageUrl": "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Golconda Fort",
        "hindiName": "गोलकोंडा किला",
        "category": "Historical Monument",
        "description": "Medieval diamond capital fort famous for acoustic clapping systems and source of the Koh-i-Noor diamond.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Ramappa Temple",
        "hindiName": "रामप्पा मंदिर",
        "category": "UNESCO Heritage",
        "description": "Kakatiya era 13th-century Shiva temple built with floating bricks and sandbox foundation engineering.",
        "imageUrl": "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Tirupati Balaji Temple (Venkateswara)",
        "hindiName": "तिरुपति बालाजी मंदिर",
        "category": "Spiritual Shrine",
        "description": "World's most visited Hindu temple atop the sacred Seven Hills of Tirumala.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Lepakshi Veerabhadra Temple",
        "hindiName": "लेपाक्षी वीरभद्र मंदिर",
        "category": "Historical Monument",
        "description": "16th-century Vijayanagara architectural wonder renowned for its hanging pillar and massive monolithic Nandi.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Araku Valley & Borra Caves",
        "hindiName": "अराकू घाटी और बोर्रा गुफाएं",
        "category": "Natural Wonder",
        "description": "Scenic hill station in the Eastern Ghats with 150-million-year-old million-year-old limestone stalactite caves.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Nalanda Mahavihara",
        "hindiName": "नालंदा महाविहार (प्राचीन विश्वविद्यालय)",
        "category": "UNESCO Heritage",
        "description": "Ancient 5th-century university which taught 10,000 international scholars with 9 million manuscripts.",
        "imageUrl": "https://images.unsplash.com/photo-1622396636133-ba43f812dd3b?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Mahabodhi Temple Bodh Gaya",
        "hindiName": "महाबोधि मंदिर बोधगया",
        "category": "UNESCO Heritage",
        "description": "Sacred site where Siddhartha Gautama attained enlightenment beneath the revered Bodhi Tree.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Golghar Patna",
        "hindiName": "गोलघर पटना",
        "category": "Historical Monument",
        "description": "Beehive-shaped massive granary built in 1786 offering panoramic views of the Ganges River.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
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
        "description": "Hosts two-thirds of the world's Great One-horned Rhinoceroses along the mighty Brahmaputra riverbanks.",
        "imageUrl": "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kamakhya Temple Guwahati",
        "hindiName": "कामाख्या मंदिर गुवाहाटी",
        "category": "Spiritual Shrine",
        "description": "Ancient Shakti Peeth atop Nilachal Hill celebrating the feminine power of creation during Ambubachi Mela.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Rang Ghar Sibsagar",
        "hindiName": "रंग घर शिवसागर",
        "category": "Historical Monument",
        "description": "Two-storied amphitheatre built by the Ahom dynasty kings in 1746, one of Asia's earliest sports pavilions.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Dal Lake Srinagar",
        "hindiName": "डल झील श्रीनगर",
        "category": "Natural Wonder",
        "description": "Jewel in the crown of Kashmir featuring traditional wooden Shikaras, floating markets, and houseboats.",
        "imageUrl": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Vaishno Devi Shrine",
        "hindiName": "माता वैष्णो देवी कटरा",
        "category": "Spiritual Shrine",
        "description": "Holy Hindu cave temple in the Trikuta Mountains visited by millions of pilgrims annually.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Gulmarg Ski Resort",
        "hindiName": "गुलमर्ग हिल स्टेशन",
        "category": "Hill Station",
        "description": "Meadow of Flowers home to the world's highest operational cable car (Gulmarg Gondola at 3,979m).",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "category": "Natural Wonder",
        "description": "Breathtaking endorheic saline lake changing shades from turquoise to azure at 4,225 meters altitude.",
        "imageUrl": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Thiksey Monastery",
        "hindiName": "थिक्से मठ लेह",
        "category": "Historical Monument",
        "description": "12-story whitewashed Gelug monastery resembling the Potala Palace of Lhasa with a 49-foot Maitreya statue.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Khardung La Pass",
        "hindiName": "खारदुंग ला दर्रा",
        "category": "Hill Station",
        "description": "Legendary mountain motorable pass at 17,982 feet connecting Leh to Nubra Valley.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "hindiName": "लाल किला दिल्ली",
        "category": "UNESCO Heritage",
        "description": "Historic red sandstone fortress of the Mughal emperors from where the Prime Minister addresses the nation on Independence Day.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Qutub Minar",
        "hindiName": "कुतुब मीनार",
        "category": "UNESCO Heritage",
        "description": "World's tallest brick minaret standing 72.5 meters tall, built in 1192 by Qutb-ud-din Aibak.",
        "imageUrl": "https://images.unsplash.com/photo-1585136917228-26cf01fbca00?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "India Gate & Kartavya Path",
        "hindiName": "इंडिया गेट एवं कर्तव्य पथ",
        "category": "Historical Monument",
        "description": "National war memorial arch honoring 84,000 soldiers with the eternal flame Amar Jawan Jyoti.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Basilica of Bom Jesus",
        "hindiName": "बेसिलिका ऑफ बॉम जीसस",
        "category": "UNESCO Heritage",
        "description": "Baroque Catholic basilica holding the sacred mortal remains of Saint Francis Xavier.",
        "imageUrl": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Aguada Fort & Lighthouse",
        "hindiName": "अगुआडा किला और लाइटहाउस",
        "category": "Historical Monument",
        "description": "17th-century Portuguese fortress overlooking Sinquerim Beach and the Arabian Sea.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dudhsagar Waterfalls",
        "hindiName": "दूधसागर जलप्रपात",
        "category": "Natural Wonder",
        "description": "Four-tiered majestic 310-meter waterfall appearing like a sea of white milk cascading through the Western Ghats.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Kedarnath Temple",
        "hindiName": "केदारनाथ ज्योतिर्लिंग मंदिर",
        "category": "Spiritual Shrine",
        "description": "Holiest Shiva temple situated at 3,583 meters near the Mandakini River flanked by snow-capped peaks.",
        "imageUrl": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Badrinath Temple",
        "hindiName": "बद्रीनाथ धाम",
        "category": "Spiritual Shrine",
        "description": "Primary Char Dham pilgrimage dedicated to Lord Vishnu on the banks of the Alaknanda River.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Valley of Flowers",
        "hindiName": "फूलों की घाटी",
        "category": "UNESCO Heritage",
        "description": "Alpine valley famous for endemic blooms carpeted against Nanda Devi Biosphere Reserve.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Jakhoo Temple & Ridge Shimla",
        "hindiName": "जाखू मंदिर व रिज शिमला",
        "category": "Spiritual Shrine",
        "description": "Colonial Mall Road and the giant 108-foot Lord Hanuman statue on Jakhoo Hill overlooking snowy peaks.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Hidimba Devi Temple Manali",
        "hindiName": "हिडिम्बा देवी मंदिर मनाली",
        "category": "Historical Monument",
        "description": "Ancient 1553 pagoda-style wooden temple nestled amidst cedar forests in Manali.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Atal Tunnel Rohtang",
        "hindiName": "अटल टनल रोहतांग",
        "category": "Historical Monument",
        "description": "World's longest highway single-tube tunnel above 10,000 feet connecting Manali to Lahaul-Spiti valley.",
        "imageUrl": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Brahma Sarovar Kurukshetra",
        "hindiName": "ब्रह्म सरोवर कुरुक्षेत्र",
        "category": "Spiritual Shrine",
        "description": "Ancient sacred water reservoir where millions take holy dips during solar eclipses, site of the Mahabharata war.",
        "imageUrl": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sheikh Chilli Tomb Thanesar",
        "hindiName": "शेख चिल्ली का मकबरा",
        "category": "Historical Monument",
        "description": "Magnificent buff sandstone Mughal mausoleum with Persian garden layouts.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sultanpur National Park",
        "hindiName": "सुल्तानपुर राष्ट्रीय उद्यान",
        "category": "Natural Wonder",
        "description": "Ramsar wetland sanctuary hosting thousands of migratory birds from Siberia and Central Asia.",
        "imageUrl": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Baidyanath Jyotirlinga Deoghar",
        "hindiName": "बैद्यनाथ ज्योतिर्लिंग देवघर",
        "category": "Spiritual Shrine",
        "description": "One of the 12 sacred Jyotirlingas where millions of Kanwariyas bring holy Ganga water during Shravan.",
        "imageUrl": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Hundru & Dassam Falls Ranchi",
        "hindiName": "हुंडरू और दसम जलप्रपात",
        "category": "Natural Wonder",
        "description": "Spectacular 98-meter cascades falling from the Subarnarekha River over eroded rocks.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Parasnath Hill (Shikharji)",
        "hindiName": "पारसनाथ पर्वत (सम्मेद शिखरजी)",
        "category": "Spiritual Shrine",
        "description": "Holiest Jain pilgrimage mountain where 20 of the 24 Tirthankaras attained Moksha.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Chitrakote Falls",
        "hindiName": "चित्रकोट जलप्रपात (भारत का नियाग्रा)",
        "category": "Natural Wonder",
        "description": "Widest waterfall in India (300 meters horseshoe shape) on the Indravati River in Bastar.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Bhoramdeo Temple",
        "hindiName": "भोरमदेव मंदिर",
        "category": "Historical Monument",
        "description": "11th-century Nagara temple complex celebrated as the 'Khajuraho of Chhattisgarh'.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sirpur Heritage Monuments",
        "hindiName": "सिरपुर ऐतिहासिक स्मारक",
        "category": "Historical Monument",
        "description": "7th-century Laxman Temple built with red bricks and intricate carvings.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Khangchendzonga National Park",
        "hindiName": "कंचनजंगा राष्ट्रीय उद्यान",
        "category": "UNESCO Heritage",
        "description": "India's first Mixed UNESCO World Heritage site centered on Mount Kangchenjunga (8,586m), world's 3rd highest peak.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Rumtek Monastery",
        "hindiName": "रुमटेक मठ गंगटोक",
        "category": "Spiritual Shrine",
        "description": "Dharma Chakra Centre seat of the Gyalwang Karmapa, largest monastery in Sikkim.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Nathu La Pass & Tsomgo Lake",
        "hindiName": "नाथू ला दर्रा और त्सोमगो झील",
        "category": "Hill Station",
        "description": "Historic Old Silk Route pass at 14,140 feet on the Indo-China border with glacial turquoise lake.",
        "imageUrl": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Living Root Bridges of Cherrapunji",
        "hindiName": "जीवित जड़ पुल चेरापूंजी",
        "category": "Natural Wonder",
        "description": "Ficus elastica tree roots bio-engineered by the indigenous Khasi tribe into double-decker living suspension bridges.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Nohkalikai Falls",
        "hindiName": "नोहकलीकाई जलप्रपात",
        "category": "Natural Wonder",
        "description": "Tallest plunge waterfall in India dropping 340 meters straight into a turquoise pool.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dawki Umngot River",
        "hindiName": "डावकी उम्नगोत नदी",
        "category": "Natural Wonder",
        "description": "Crystal-clear glass river where wooden boats appear floating directly in mid-air.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Ujjayanta Palace Agartala",
        "hindiName": "उज्जयंत पैलेस अगरतला",
        "category": "Historical Monument",
        "description": "Neo-classical royal palace of the Manikya dynasty set in Mughal-style gardens on two lakes.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Neermahal Water Palace",
        "hindiName": "नीरमहल जल महल",
        "category": "Historical Monument",
        "description": "Lake palace built in Rudrasagar Lake blending Hindu and Islamic architectural forms.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Unakoti Rock Carvings",
        "hindiName": "उनाकोटी रॉक नक्काशी",
        "category": "Historical Monument",
        "description": "Bas-relief stone carvings of Lord Shiva dating to 7th-9th century meaning 'one less than a crore'.",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
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
        "hindiName": "तवांग मठ (भारत का सबसे बड़ा मठ)",
        "category": "Historical Monument",
        "description": "India's largest Buddhist monastery and birth site of the 6th Dalai Lama, perched at 10,000 feet.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sela Pass & Sela Lake",
        "hindiName": "सेला दर्रा और सेला झील",
        "category": "Natural Wonder",
        "description": "High-altitude pass at 13,700 feet with 101 sacred lakes in Tibetan Buddhist tradition.",
        "imageUrl": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Ziro Valley",
        "hindiName": "जीरो वैली",
        "category": "Hill Station",
        "description": "World heritage cultural landscape inhabited by the Apatani tribe famous for sustainable pine paddy fish farming.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Loktak Floating Lake & Keibul Lamjao",
        "hindiName": "लोकतक झील एवं केबुल लामजाओ",
        "category": "Natural Wonder",
        "description": "Largest freshwater lake in Northeast India, home to the world's only floating national park on Phumdis.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kangla Fort Imphal",
        "hindiName": "कांगला किला इंफाल",
        "category": "Historical Monument",
        "description": "Ancient royal seat of the Kingdom of Manipur containing royal coronation halls and sacred shrines.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Ima Keithel (Mother's Market)",
        "hindiName": "इमा कैथेल (महिला बाजार)",
        "category": "Historical Monument",
        "description": "500-year-old market run exclusively by 5,000+ women entrepreneurs, largest all-women market in Asia.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Hornbill Festival Kisama Heritage Village",
        "hindiName": "हॉर्नबिल फेस्टिवल किसामा",
        "category": "Historical Monument",
        "description": "Festival of Festivals celebrated every December uniting 16 indigenous Naga tribes with music, dance, and warrior heritage.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kohima War Cemetery",
        "hindiName": "कोहिमा युद्ध स्मारक",
        "category": "Historical Monument",
        "description": "World War II memorial bearing the famous epitaph: 'When you go home, tell them of us and say, for your tomorrow we gave our today'.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dzukou Valley",
        "hindiName": "द्ज़ुकोउ घाटी",
        "category": "Natural Wonder",
        "description": "Enchanting valley on the Nagaland-Manipur border famous for its rare Dzukou lily and rolling green hills.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Solomon's Temple Aizawl",
        "hindiName": "सोलोमन टेम्पल आइजोल",
        "category": "Spiritual Shrine",
        "description": "Impressive 2,000-seat white marble church building constructed over 20 years by the Kohhran Thianghlim.",
        "imageUrl": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Phawngpui Peak (Blue Mountain)",
        "hindiName": "फावंगपुई (ब्लू माउंटेन)",
        "category": "Natural Wonder",
        "description": "Highest mountain peak in Mizoram (2,157m) venerated as the abode of benign hill spirits.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Reiek Heritage Village",
        "hindiName": "रेइक हेरिटेज विलेज",
        "category": "Hill Station",
        "description": "Model village showcasing authentic traditional Mizo huts, bachelor quarters, and sweeping views of Bangladesh plains.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Rock Garden of Chandigarh",
        "hindiName": "रॉक गार्डन चंडीगढ़",
        "category": "Historical Monument",
        "description": "Acclaimed 40-acre sculpture garden created secretly by Nek Chand purely from industrial and domestic waste products.",
        "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Capitol Complex (Le Corbusier)",
        "hindiName": "कैपिटल कॉम्प्लेक्स",
        "category": "UNESCO Heritage",
        "description": "Modernist architectural masterwork housing the Open Hand Monument, High Court, and Legislative Assembly.",
        "imageUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sukhna Lake",
        "hindiName": "सुखना झील",
        "category": "Natural Wonder",
        "description": "Pristine 3 km² man-made reservoir at the foothills of the Shivalik Himalayas.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Matrimandir Auroville",
        "hindiName": "मातृमंदिर ऑरोविले",
        "category": "Spiritual Shrine",
        "description": "Golden geodesic dome pavilion dedicated to human unity with the world's largest optically pure glass globe crystal.",
        "imageUrl": "https://images.unsplash.com/photo-1600100397608-f010f4433149?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Promenade Beach & White Town",
        "hindiName": "प्रोमेनेड बीच एवं फ्रेंच क्वार्टर",
        "category": "Historical Monument",
        "description": "Colonial French villas with bright yellow facades, bougainvillea, and sea-facing Gandhi statue.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sri Aurobindo Ashram",
        "hindiName": "श्री अरविंद आश्रम",
        "category": "Spiritual Shrine",
        "description": "Spiritual retreat established in 1926 by Sri Aurobindo and Mirra Alfassa (The Mother).",
        "imageUrl": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Cellular Jail National Memorial (Kala Pani)",
        "hindiName": "सेलुलर जेल (काला पानी)",
        "category": "Historical Monument",
        "description": "Historic colonial prison where Indian freedom fighters including Veer Savarkar and Batukeshwar Dutt were exiled.",
        "imageUrl": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Radhanagar Beach Havelock (Swaraj Dweep)",
        "hindiName": "राधानगर बीच हैवलॉक",
        "category": "Natural Wonder",
        "description": "Crowned Asia's Best Beach by Time Magazine with powder-white sands and turquoise coral waters.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Barren Island Active Volcano",
        "hindiName": "बैरन द्वीप सक्रिय ज्वालामुखी",
        "category": "Natural Wonder",
        "description": "Only confirmed active volcano in South Asia rising out of the Andaman Sea.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Bangaram Atoll & Coral Lagoon",
        "hindiName": "बंगारम एटोल एवं प्रवाल लैगून",
        "category": "Natural Wonder",
        "description": "Teardrop-shaped uninhabited island surrounded by calm turquoise coral lagoons, bioluminescent beaches, and manta rays.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kavaratti Marine Aquarium & Lighthouse",
        "hindiName": "कवरत्ती समुद्री एक्वेरियम और लाइटहाउस",
        "category": "Historical Monument",
        "description": "Capital island featuring the Ujra Mosque, coastal lighthouse, and rich live coral conservation exhibits.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Agatti Island Airstrip",
        "hindiName": "अगत्ती द्वीप हवाई पट्टी",
        "category": "Natural Wonder",
        "description": "One of the most scenic airport runways in the world completely surrounded by the sparkling blue Arabian Sea.",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
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
        "name": "Diu Fort & Lighthouse",
        "hindiName": "दीव किला और लाइटहाउस",
        "category": "Historical Monument",
        "description": "Colossal 1535 Portuguese sea fortress surrounded by the Arabian Sea on three sides with old bronze cannons.",
        "imageUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Moti Daman Fort & Cathedral of Bom Jesus",
        "hindiName": "मोती दमन किला",
        "category": "Historical Monument",
        "description": "Imposing ramparts housing 16th-century churches with intricately carved golden Portuguese altars.",
        "imageUrl": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dudhni Lake Silvassa",
        "hindiName": "दुधनी झील सिलवासा",
        "category": "Natural Wonder",
        "description": "Watersports destination nestled in the foothills of the Western Ghats on Madhuban reservoir.",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
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
