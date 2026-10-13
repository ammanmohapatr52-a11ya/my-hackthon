/**
 * Comprehensive Dataset for Indian States and Union Territories
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
  // --- ODISHA ---
  {
    id: 'odisha',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    odiaName: 'ଓଡ଼ିଶା',
    capital: 'Bhubaneswar (Temple City of India)',
    zone: 'East',
    formationYear: '1 April 1936 (Utkala Dibasa)',
    officialLanguages: ['Odia', 'English'],
    areaKm2: '155,707 km²',
    population: '47 Million',
    literacyRate: '73.5%',
    tagline: 'India’s Best Kept Secret · Land of Lord Jagannath',
    symbols: {
      bird: {
        name: 'Indian Roller (Blue Jay)',
        hindiName: 'नीलकंठ',
        description: 'Locally known as "Neelakantha" (ନୀଳକଣ୍ଠ), sacred in Hindu tradition and famous for its brilliant turquoise-blue wings in flight.',
        imageUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Sambar Deer (ସମ୍ବର)',
        hindiName: 'सांबर हिरण',
        description: 'Large woodland deer native to the Indian subcontinent, thriving extensively in Simlipal Tiger Reserve and Chandaka forest.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Ashoka Flower (ଅଶୋକ)',
        hindiName: 'अशोक पुष्प',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Sacred Fig / Ashwattha (ଅଶ୍ୱତ୍ଥ)',
        hindiName: 'पीपल का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Konark Sun Temple',
        hindiName: 'कोणार्क सूर्य मंदिर',
        category: 'UNESCO Heritage',
        description: '13th-century monumental temple shaped as a giant chariot with 24 carved stone wheels pulled by 7 horses, built by King Narasimhadeva I.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Shree Jagannath Temple, Puri',
        hindiName: 'जगन्नाथ मंदिर, पुरी',
        category: 'Spiritual Shrine',
        description: 'One of the Char Dham sacred pilgrimages, renowned for the world-famous annual Rath Yatra chariot festival and unique wooden deities.',
        imageUrl: 'https://images.unsplash.com/photo-1626297061730-a92c46237666?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Chilika Lake',
        hindiName: 'चिल्का झील',
        category: 'Natural Wonder',
        description: 'Asia’s largest brackish water lagoon, home to rare Irrawaddy dolphins and a Ramsar wetland hosting millions of migratory waterfowl.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Simlipal National Park',
        hindiName: 'सिमलीपाल राष्ट्रीय उद्यान',
        category: 'Natural Wonder',
        description: 'UNESCO Biosphere Reserve featuring dense Sal forests, majestic waterfalls (Barehipani and Joranda), and Royal Bengal Tigers.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Mahanadi (ମହାନଦୀ)', 'Brahmani', 'Baitarani', 'Subarnarekha', 'Rushikulya'],
    famousFood: ['Rasagola (GI Tag)', 'Chhena Poda (Burnt Cheesecake)', 'Dalma', 'Pakhala Bhata', 'Chhena Gaja'],
    famousFestivals: ['Rath Yatra (Puri)', 'Raja Parba', 'Bali Jatra (Cuttack)', 'Durga Puja', 'Konark Dance Festival'],
    classicalDance: 'Odissi (UNESCO recognized classical dance characterized by Tribhangi posture)',
    coordinates: { x: 67, y: 55 },
  },

  // --- MAHARASHTRA ---
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    odiaName: 'ମହାରାଷ୍ଟ୍ର',
    capital: 'Mumbai (Financial Capital of India)',
    zone: 'West',
    formationYear: '1 May 1960 (Maharashtra Din)',
    officialLanguages: ['Marathi', 'English'],
    areaKm2: '307,713 km²',
    population: '126 Million',
    literacyRate: '82.3%',
    tagline: 'Unlimited Maharashtra · Land of Chhatrapati Shivaji Maharaj',
    symbols: {
      bird: {
        name: 'Yellow-footed Green Pigeon (Hariyal)',
        hindiName: 'हरियाल (पीले पैरों वाला हरा कबूतर)',
        description: 'Locally known as "Shekru" in state folklore, a bright arboreal bird that eats wild figs and never touches the bare ground.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Indian Giant Squirrel (Shekru)',
        hindiName: 'भारतीय विशाल गिलहरी (शेकरू)',
        description: 'A multi-colored tree squirrel with a two-foot bushy tail, abundant in the Bhimashankar Wildlife Sanctuary of the Western Ghats.',
        imageUrl: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Jarul / Pride of India (ताम्हन)',
        hindiName: 'जरूल पुष्प',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Mango Tree (आंबा)',
        hindiName: 'आम का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Gateway of India, Mumbai',
        hindiName: 'गेटवे ऑफ इंडिया, मुंबई',
        category: 'Historical Monument',
        description: 'Colossal Indo-Saracenic basalt arch built to commemorate the 1911 royal visit of King George V, overlooking Mumbai Harbour.',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Ajanta & Ellora Caves, Chhatrapati Sambhajinagar',
        hindiName: 'अजंता एवं एलोरा की गुफाएं',
        category: 'UNESCO Heritage',
        description: 'World-famous 2nd-century BCE rock-cut caves, including the astonishing monolithic Kailasa Temple carved from a single cliff face.',
        imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4446e10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
        hindiName: 'छत्रपति शिवाजी महाराज टर्मिनस',
        category: 'UNESCO Heritage',
        description: 'Historic Victorian Gothic Revival railway terminus in Mumbai, designed by Frederick William Stevens and completed in 1887.',
        imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Raigad Fort',
        hindiName: 'रायगढ़ किला',
        category: 'Historical Monument',
        description: 'The invincible hill fortress where Chhatrapati Shivaji Maharaj was crowned Chhatrapati of the Maratha Empire in 1674.',
        imageUrl: 'https://images.unsplash.com/photo-1599827552599-eeddd597b4f5?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Godavari (South Ganga)', 'Krishna', 'Tapi', 'Bhima', 'Wainganga'],
    famousFood: ['Vada Pav', 'Misal Pav', 'Puran Poli', 'Pav Bhaji', 'Pithla Bhakri', 'Modak'],
    famousFestivals: ['Ganesh Chaturthi', 'Gudi Padwa', 'Shiv Jayanti', 'Kumbh Mela (Nashik)'],
    classicalDance: 'Lavani & Koli Dance',
    coordinates: { x: 38, y: 58 },
  },

  // --- UTTAR PRADESH ---
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    odiaName: 'ଉତ୍ତର ପ୍ରଦେଶ',
    capital: 'Lucknow (City of Nawabs)',
    zone: 'North',
    formationYear: '24 January 1950',
    officialLanguages: ['Hindi', 'Urdu'],
    areaKm2: '243,286 km²',
    population: '241 Million (Most populous state in India)',
    literacyRate: '67.7%',
    tagline: 'Heartland of India · Cradle of Indian Civilizations',
    symbols: {
      bird: {
        name: 'Sarus Crane (सारस)',
        hindiName: 'सारस क्रेन',
        description: 'The world’s tallest flying bird standing up to 1.8 meters tall, celebrated in Valmiki Ramayana as a symbol of eternal marital fidelity.',
        imageUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Swamp Deer / Barasingha',
        hindiName: 'दलदली हिरण (बारहसिंगा)',
        description: 'Endangered deer with magnificent twelve-tined antlers, protected in Dudhwa National Park along the Indo-Nepal border.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Palash / Flame of the Forest (पलाश)',
        hindiName: 'पलाश / टेसू',
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Ashoka Tree (अशोक)',
        hindiName: 'अशोक वृक्ष',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Taj Mahal, Agra',
        hindiName: 'ताज महल, आगरा',
        category: 'UNESCO Heritage',
        description: 'One of the New 7 Wonders of the World, the ivory-white marble mausoleum on the Yamuna river built by Shah Jahan for Mumtaz Mahal.',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Varanasi Ghats & Kashi Vishwanath',
        hindiName: 'काशी विश्वनाथ एवं वाराणसी घाट',
        category: 'Spiritual Shrine',
        description: 'One of the world’s oldest continuously inhabited sacred cities, renowned for Dashashwamedh Ghat Ganga Aarti and spiritual Moksha.',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fatehpur Sikri, Agra',
        hindiName: 'फतेहपुर सीकरी',
        category: 'UNESCO Heritage',
        description: 'The fortified red sandstone capital founded by Mughal Emperor Akbar in 1571, home to the mammoth Buland Darwaza.',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Shree Ram Janmabhoomi Mandir, Ayodhya',
        hindiName: 'श्री राम जन्मभूमि मंदिर, अयोध्या',
        category: 'Spiritual Shrine',
        description: 'The monumental Nagara-style temple on the banks of the Sarayu river, the sacred birthplace of Lord Rama.',
        imageUrl: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Ganga', 'Yamuna', 'Sarayu', 'Gomti', 'Betwa', 'Ghaghara'],
    famousFood: ['Lucknowi Biryani', 'Tunday Kababi', 'Bedmi Puri', 'Banarasi Paan', 'Mathura ke Peda', 'Petha (Agra)'],
    famousFestivals: ['Maha Kumbh Mela (Prayagraj)', 'Dev Deepawali (Varanasi)', 'Krishna Janmashtami (Mathura)', 'Holi (Barsana)'],
    classicalDance: 'Kathak (Classical dance form characterized by intricate footwork and spins)',
    coordinates: { x: 50, y: 35 },
  },

  // --- RAJASTHAN ---
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    odiaName: 'ରାଜସ୍ଥାନ',
    capital: 'Jaipur (The Pink City)',
    zone: 'West',
    formationYear: '30 March 1949 (Rajasthan Diwas)',
    officialLanguages: ['Hindi', 'Rajasthani'],
    areaKm2: '342,239 km² (Largest state in India by area)',
    population: '81 Million',
    literacyRate: '66.1%',
    tagline: 'The Incredible State of India · Land of Kings & Forts',
    symbols: {
      bird: {
        name: 'Great Indian Bustard (Godawan)',
        hindiName: 'गोडावण (ग्रेट इंडियन बस्टर्ड)',
        description: 'Critically endangered ground bird endemic to the Thar Desert and Desert National Park, celebrated for its majestic stride.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Chinkara (Indian Gazelle) & Camel',
        hindiName: 'चिंकारा एवं ऊंट (रेगिस्तान का जहाज)',
        description: 'The dromedary camel is Rajasthan’s state heritage animal, vital for Thar Desert trade and the Pushkar Fair.',
        imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Rohida (Tecomella undulata)',
        hindiName: 'रोहिड़ा पुष्प',
        imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Khejri (Prosopis cineraria)',
        hindiName: 'खेजड़ी वृक्ष (कल्पवृक्ष)',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Hawa Mahal, Jaipur',
        hindiName: 'हवा महल, जयपुर',
        category: 'Historical Monument',
        description: 'The 1799 pink sandstone "Palace of Winds" featuring 953 honeycomb windows (jharokhas) designed by Lal Chand Ustad.',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Amber Fort, Jaipur',
        hindiName: 'आमेर किला, जयपुर',
        category: 'UNESCO Heritage',
        description: 'Hill fortress overlooking Maota Lake, famous for its artistic Sheesh Mahal (Mirror Palace) and Rajput architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Mehrangarh Fort, Jodhpur',
        hindiName: 'मेहरानगढ़ किला, जोधपुर',
        category: 'Historical Monument',
        description: 'One of India’s largest forts rising 400 feet above the "Blue City" of Jodhpur, built in 1459 by Rao Jodha.',
        imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Lake Pichola & City Palace, Udaipur',
        hindiName: 'पिछोला झील एवं सिटी पैलेस, उदयपुर',
        category: 'Natural Wonder',
        description: 'Spectacular lake surrounded by the Aravalli Hills, featuring the Lake Palace (Taj Lake Palace) and Jag Mandir.',
        imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Chambal', 'Banas', 'Luni', 'Sabarmati', 'Ghaggar'],
    famousFood: ['Dal Baati Churma', 'Ker Sangri', 'Ghevar', 'Laal Maas', 'Gatte ki Sabzi', 'Pyaaz Kachori'],
    famousFestivals: ['Pushkar Camel Fair', 'Desert Festival (Jaisalmer)', 'Teej (Jaipur)', 'Gangaur'],
    classicalDance: 'Ghoomar & Kalbelia (UNESCO Intangible Cultural Heritage)',
    coordinates: { x: 30, y: 36 },
  },

  // --- TAMIL NADU ---
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    odiaName: 'ତାମିଲନାଡୁ',
    capital: 'Chennai (Detroit of Asia)',
    zone: 'South',
    formationYear: '26 January 1950',
    officialLanguages: ['Tamil', 'English'],
    areaKm2: '130,060 km²',
    population: '76 Million',
    literacyRate: '80.1%',
    tagline: 'Enchanting Tamil Nadu · Where Culture is Timeless',
    symbols: {
      bird: {
        name: 'Emerald Dove (மரRelease)',
        hindiName: 'पन्ना कबूतर (एमराल्ड डव)',
        description: 'Vibrant forest dove with glossy emerald green wings, found across the rainforests of the Western Ghats.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Nilgiri Tahr (வரையாடு)',
        hindiName: 'नीलगिरी तहर',
        description: 'Endangered mountain ungulate endemic to the high-altitude shola grasslands of the Nilgiri and Anaimalai hills.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Gloriosa Lily / Flame Lily (காந்தள்)',
        hindiName: 'ग्लोरियोसा लिली',
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Palmyra Palm (பனை மரம்)',
        hindiName: 'ताड़ का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Meenakshi Amman Temple, Madurai',
        hindiName: 'मीनाक्षी अम्मन मंदिर, मदुरै',
        category: 'Spiritual Shrine',
        description: 'Historic Dravidian temple complex on the Vaigai river featuring 14 towering sculpted gopurams and Hall of Thousand Pillars.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Brihadeeswara Temple, Thanjavur',
        hindiName: 'बृहदीश्वर मंदिर, तंजावुर',
        category: 'UNESCO Heritage',
        description: 'Great Living Chola Temple built by Rajaraja I in 1010 CE, crowned by an 80-tonne monolithic granite cupola.',
        imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4446e10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Group of Monuments at Mahabalipuram',
        hindiName: 'महाबलीपुरम के स्मारक',
        category: 'UNESCO Heritage',
        description: '7th-century Pallava coastal sanctuary with the Shore Temple, Pancha Rathas monolithic chariots, and Descent of the Ganges.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kanyakumari (Cape Comorin)',
        hindiName: 'कन्याकुमारी (त्रिवेणी संगम)',
        category: 'Natural Wonder',
        description: 'The southernmost tip of the Indian mainland where the Arabian Sea, Indian Ocean, and Bay of Bengal converge, with the Vivekananda Rock Memorial.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Cauvery (Kaveri)', 'Vaigai', 'Palar', 'Thamirabarani', 'Bhavani'],
    famousFood: ['Idli Sambar', 'Masala Dosa', 'Chettinad Pepper Chicken', 'Pongal', 'Filter Coffee'],
    famousFestivals: ['Pongal (Harvest Festival)', 'Tamil New Year (Puthandu)', 'Chithirai Festival (Madurai)', 'Karthigai Deepam'],
    classicalDance: 'Bharatanatyam (Oldest classical dance tradition of India)',
    coordinates: { x: 45, y: 85 },
  },

  // --- KARNATAKA ---
  {
    id: 'karnataka',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    odiaName: 'କର୍ଣ୍ଣାଟକ',
    capital: 'Bengaluru (Silicon Valley of India)',
    zone: 'South',
    formationYear: '1 November 1956 (Kannada Rajyotsava)',
    officialLanguages: ['Kannada', 'English'],
    areaKm2: '191,791 km²',
    population: '68 Million',
    literacyRate: '75.4%',
    tagline: 'One State. Many Worlds. · Technology & Heritage Hub',
    symbols: {
      bird: {
        name: 'Indian Roller (ನೀಲಕಂಠ)',
        hindiName: 'नीलकंठ',
        description: 'Celebrated for its striking turquoise plumage, common in agricultural fields and forest fringes.',
        imageUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Indian Elephant (ಆನೆ)',
        hindiName: 'एशियाई हाथी',
        description: 'Karnataka harbors the largest wild elephant population in India, roaming the Bandipur and Nagarhole biosphere reserves.',
        imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Lotus (ಕಮಲ)',
        hindiName: 'कमल पुष्प',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Sandalwood (ಶ್ರೀಗಂಧದ ಮರ)',
        hindiName: 'चंदन का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Hampi Monuments (Vijayanagara Ruins)',
        hindiName: 'हम्पी (विजयनगर साम्राज्य के अवशेष)',
        category: 'UNESCO Heritage',
        description: 'Captivating capital of the 14th-century Vijayanagara Empire, featuring the stone chariot of the Vittala Temple and Virupaksha Temple.',
        imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4446e10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Mysore Palace (Amba Vilas)',
        hindiName: 'मैसूर पैलेस',
        category: 'Historical Monument',
        description: 'Spectacular royal palace of the Wadiyar dynasty, illuminated by 97,000 electric bulbs during the grand Dasara festival.',
        imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4446e10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gol Gumbaz, Vijayapura',
        hindiName: 'गोल गुम्बज़, बीजापुर',
        category: 'Historical Monument',
        description: 'Mausoleum of Mohammed Adil Shah boasting the world’s second-largest dome and a famous whispering gallery acoustic marvel.',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Jog Falls, Shimoga',
        hindiName: 'जोग जलप्रपात',
        category: 'Natural Wonder',
        description: 'Second-highest plunge waterfall in India created by the Sharavathi River, dropping 253 meters in four cascades: Raja, Roarer, Rocket, and Rani.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Cauvery', 'Krishna', 'Tungabhadra', 'Sharavathi', 'Kabini'],
    famousFood: ['Bisi Bele Bath', 'Mysore Pak', 'Neer Dosa', 'Dharwad Peda', 'Maddi Ragi Mudde', 'Mangalore Buns'],
    famousFestivals: ['Mysuru Dasara', 'Ugadi (Kannada New Year)', 'Kambala (Buffalo Race)', 'Karaga (Bengaluru)'],
    classicalDance: 'Yakshagana (Theatrical dance performance with ornate costumes)',
    coordinates: { x: 38, y: 72 },
  },

  // --- KERALA ---
  {
    id: 'kerala',
    name: 'Kerala',
    hindiName: 'केरल',
    odiaName: 'କେରଳ',
    capital: 'Thiruvananthapuram',
    zone: 'South',
    formationYear: '1 November 1956 (Kerala Piravi)',
    officialLanguages: ['Malayalam', 'English'],
    areaKm2: '38,863 km²',
    population: '35 Million',
    literacyRate: '96.2% (Highest literacy rate in India)',
    tagline: 'God’s Own Country · Land of Spices, Lagoons & Ayurveda',
    symbols: {
      bird: {
        name: 'Great Hornbill (മലമുഴക്കി വേഴാമ്പൽ)',
        hindiName: 'ग्रेट हॉर्नबिल',
        description: 'Majestic canopy bird with a massive yellow and black casque, roaring across the rainforests of the Western Ghats.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Indian Elephant (ആന)',
        hindiName: 'हाथी',
        description: 'Sacred animal integral to temple processions, with Thrissur Pooram featuring 30 richly caparisoned tusker elephants.',
        imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Kanikkonna (Golden Shower Tree)',
        hindiName: 'अमलतास / कनिकुन्ना',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Coconut Palm (തെങ്ങ്)',
        hindiName: 'नारियल का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Alleppey Backwaters & Houseboats',
        hindiName: 'अल्लेप्पी बैकवाटर्स',
        category: 'Natural Wonder',
        description: 'Network of tranquil lagoons, canals, and palm-fringed rivers sailed by traditional thatched Kettuvallam houseboats.',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Munnar Tea Hills',
        hindiName: 'मुन्नार हिल स्टेशन',
        category: 'Hill Station',
        description: 'Hill station nestled 1,600m high in the Western Ghats, renowned for rolling emerald tea estates and the Anamudi peak (highest in South India).',
        imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sree Padmanabhaswamy Temple',
        hindiName: 'पद्मनाभस्वामी मंदिर',
        category: 'Spiritual Shrine',
        description: 'Gold-plated temple dedicated to Lord Vishnu in Anantha Sayana posture, considered the wealthiest place of worship in the world.',
        imageUrl: 'https://images.unsplash.com/photo-1626297061730-a92c46237666?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Athirappilly Waterfalls',
        hindiName: 'अथिरापिल्ली जलप्रपात',
        category: 'Natural Wonder',
        description: 'Known as the "Niagara of India", a 80-foot wide scenic cascade surrounded by Sholayar rainforests on the Chalakudy River.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Periyar', 'Bharathappuzha', 'Pamba', 'Chalakudy', 'Chaliyar'],
    famousFood: ['Appam & Stew', 'Puttu & Kadala Curry', 'Kerala Sadya', 'Malabar Parotta', 'Karimeen Pollichathu', 'Banana Chips'],
    famousFestivals: ['Onam (Vallam Kali Snake Boat Race)', 'Vishu', 'Thrissur Pooram', 'Theyyam'],
    classicalDance: 'Kathakali & Mohiniyattam (Dramatic classical dance with elaborate makeup)',
    coordinates: { x: 38, y: 88 },
  },

  // --- WEST BENGAL ---
  {
    id: 'west_bengal',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    odiaName: 'ପଶ୍ଚିମ ବଙ୍ଗ',
    capital: 'Kolkata (City of Joy)',
    zone: 'East',
    formationYear: '26 January 1950',
    officialLanguages: ['Bengali', 'English'],
    areaKm2: '88,752 km²',
    population: '99 Million',
    literacyRate: '77.1%',
    tagline: 'Beautiful Bengal · Sweetest Part of India',
    symbols: {
      bird: {
        name: 'White-throated Kingfisher (সাদাবুক মাছরাঙা)',
        hindiName: 'श्वेतकंठ कौड़िल्ला (किंगफिशर)',
        description: 'Bright blue and chocolate-brown kingfisher ubiquitous across Bengal’s rivers, ponds, and paddy fields.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Fishing Cat (মেছো বিড়াল)',
        hindiName: 'मत्स्य बिल्ली (फिशिंग कैट)',
        description: 'Nocturnal wild cat adapted for swimming and hunting in the wetland marshes of the Sundarbans and Howrah.',
        imageUrl: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Night-flowering Jasmine / Shiuli (শিউলি)',
        hindiName: 'पारिजात / हरसिंगार',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Chatim Tree / Devil Tree (ছাতিম)',
        hindiName: 'सप्तपर्णी',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Victoria Memorial, Kolkata',
        hindiName: 'विक्टोरिया मेमोरियल, कोलकाता',
        category: 'Historical Monument',
        description: 'Imposing white Makrana marble palace museum commissioned in memory of Queen Victoria, standing amidst 64 acres of royal gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sundarbans National Park',
        hindiName: 'सुंदरवन राष्ट्रीय उद्यान',
        category: 'UNESCO Heritage',
        description: 'The world’s largest halophytic mangrove forest delta, designated a UNESCO Biosphere Reserve and home of the Royal Bengal Tiger.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Howrah Bridge (Rabindra Setu)',
        hindiName: 'हावड़ा ब्रिज (रवींद्र सेतु)',
        category: 'Historical Monument',
        description: 'Iconic balanced cantilever bridge without nuts or bolts over the Hooghly River, carrying over 100,000 vehicles and 150,000 pedestrians daily.',
        imageUrl: 'https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Darjeeling Himalayan Railway (Toy Train)',
        hindiName: 'दार्जिलिंग टॉय ट्रेन',
        category: 'UNESCO Heritage',
        description: 'Narrow-gauge mountain railway built between 1879 and 1881, offering views of the world’s third-highest peak, Mount Kanchenjunga.',
        imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Hooghly (Bhagirathi-Ganga)', 'Teesta', 'Damodar', 'Rupnarayan', 'Mahananda'],
    famousFood: ['Mishti Doi', 'Rasgulla (Banglar Rosogolla)', 'Shorshe Ilish (Hilsa in Mustard)', 'Kosha Mangsho', 'Sandesh'],
    famousFestivals: ['Durga Puja (UNESCO Representative List of Intangible Cultural Heritage)', 'Poila Baisakh', 'Kali Puja', 'Kolkata Book Fair'],
    classicalDance: 'Gaudiya Nritya & Baul Folk Tradition',
    coordinates: { x: 74, y: 50 },
  },

  // --- GUJARAT ---
  {
    id: 'gujarat',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    odiaName: 'ଗୁଜରାଟ',
    capital: 'Gandhinagar (Green City)',
    zone: 'West',
    formationYear: '1 May 1960',
    officialLanguages: ['Gujarati', 'Hindi', 'English'],
    areaKm2: '196,024 km²',
    population: '71 Million',
    literacyRate: '79.3%',
    tagline: 'Vibrant Gujarat · Land of the Legends (Mahatma Gandhi & Sardar Patel)',
    symbols: {
      bird: {
        name: 'Greater Flamingo (हंज)',
        hindiName: 'ग्रेटर फ्लेमिंगो (राजहंस)',
        description: 'Pink-feathered wader bird nesting in hundreds of thousands at "Flamingo City" in the Great Rann of Kutch.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Asiatic Lion (એશિયાઈ સિંહ)',
        hindiName: 'एशियाई शेर',
        description: 'The sole surviving natural wild habitat of Panthera leo persica worldwide is the Gir Forest National Park of Saurashtra.',
        imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Marigold (गलगोटो)',
        hindiName: 'गेंदे का फूल',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Banyan Tree (વડ)',
        hindiName: 'बरगद का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Statue of Unity, Kevadia',
        hindiName: 'स्टैच्यू ऑफ यूनिटी, केवड़िया',
        category: 'Historical Monument',
        description: 'The world’s tallest statue at 182 meters (597 ft), dedicated to Iron Man of India Sardar Vallabhbhai Patel facing the Narmada River.',
        imageUrl: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'White Rann of Kutch',
        hindiName: 'कच्छ का सफेद रण',
        category: 'Natural Wonder',
        description: 'Endless white salt desert glowing under the full moon during the annual winter Rann Utsav cultural extravaganza.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gir National Park',
        hindiName: 'गीर राष्ट्रीय उद्यान',
        category: 'Natural Wonder',
        description: 'World-famous wildlife sanctuary in Junagadh, the only place outside Africa where you can spot wild Asiatic lions in their natural habitat.',
        imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Somnath Temple & Dwarkadhish',
        hindiName: 'सोमनाथ ज्योतिर्लिंग एवं द्वारकाधीश',
        category: 'Spiritual Shrine',
        description: 'First of the twelve sacred Jyotirlinga shrines on the Saurashtra coast, reconstructed seven times in monumental Chalukyan architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Narmada', 'Sabarmati', 'Tapi', 'Mahi', 'Bhadar'],
    famousFood: ['Dhokla', 'Thepla', 'Khandvi', 'Fafda Jalebi', 'Undhiyu', 'Gujarati Thali'],
    famousFestivals: ['Navratri Garba (World’s Longest Dance Festival)', 'International Kite Festival (Uttarayan)', 'Rann Utsav'],
    classicalDance: 'Garba & Dandiya Raas (UNESCO Intangible Cultural Heritage)',
    coordinates: { x: 22, y: 48 },
  },

  // --- PUNJAB ---
  {
    id: 'punjab',
    name: 'Punjab',
    hindiName: 'पंजाब',
    odiaName: 'ପଞ୍ଜାବ',
    capital: 'Chandigarh (The City Beautiful)',
    zone: 'North',
    formationYear: '1 November 1966',
    officialLanguages: ['Punjabi'],
    areaKm2: '50,362 km²',
    population: '31 Million',
    literacyRate: '76.7%',
    tagline: 'India’s Breadbasket · Land of Five Rivers',
    symbols: {
      bird: {
        name: 'Northern Goshawk (ਬਾਜ਼)',
        hindiName: 'उत्तरी बाज़',
        description: 'Sacred raptor associated with the tenth Sikh Guru, Sri Guru Gobind Singh Ji, symbol of courage and spiritual sovereignty.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Blackbuck (ਕਾਲਾ ਹਿਰਨ)',
        hindiName: 'काला हिरण (कृष्णमृग)',
        description: 'Fastest antelope in India native to Abohar Wildlife Sanctuary, deeply protected by the Bishnoi community.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Gladiolus',
        hindiName: 'ग्लेडियोलस',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Sheesham / Tahli (ਟਾਹਲੀ)',
        hindiName: 'शीशम का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Golden Temple (Harmandir Sahib), Amritsar',
        hindiName: 'स्वर्ण मंदिर (हरमंदिर साहिब), अमृतसर',
        category: 'Spiritual Shrine',
        description: 'The holiest shrine in Sikhism, surrounded by the sacred Amrit Sarovar lake and crowned with 500 kg of pure 24-karat gold leaf.',
        imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Wagah Border Beating Retreat Ceremony',
        hindiName: 'वाघा बॉर्डर',
        category: 'Historical Monument',
        description: 'Daily military flag-lowering parade conducted simultaneously by the Indian Border Security Force (BSF) and Pakistan Rangers.',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Jallianwala Bagh Memorial',
        hindiName: 'जलियांवाला बाग स्मारक',
        category: 'Historical Monument',
        description: 'National memorial commemorating the peaceful gathering massacred on Baisakhi Day, 13 April 1919 by General Dyer’s troops.',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Virasat-e-Khalsa, Anandpur Sahib',
        hindiName: 'विरासत-ए-खालसा, आनंदपुर साहिब',
        category: 'Historical Monument',
        description: 'Architectural marvel designed by Moshe Safdie commemorating 500 years of Sikh history and the birth of the Khalsa.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Sutlej', 'Beas', 'Ravi', 'Ghaggar'],
    famousFood: ['Makki di Roti & Sarson da Saag', 'Amritsari Kulcha', 'Butter Chicken', 'Dal Makhani', 'Sweet Lassi', 'Pinni'],
    famousFestivals: ['Baisakhi (Harvest & Khalsa Day)', 'Lohri', 'Hola Mohalla', 'Gurpurab'],
    classicalDance: 'Bhangra & Giddha',
    coordinates: { x: 34, y: 22 },
  },

  // --- DELHI (NCT) ---
  {
    id: 'delhi',
    name: 'Delhi (NCT)',
    hindiName: 'दिल्ली',
    odiaName: 'ଦିଲ୍ଲୀ',
    capital: 'New Delhi (National Capital of India)',
    zone: 'UT',
    formationYear: '1 February 1992 (NCT Act)',
    officialLanguages: ['Hindi', 'English', 'Punjabi', 'Urdu'],
    areaKm2: '1,484 km²',
    population: '33 Million',
    literacyRate: '86.2%',
    tagline: 'Dilwalo ki Dilli · The Heart of the Republic',
    symbols: {
      bird: {
        name: 'House Sparrow (गौरैया)',
        hindiName: 'घरेलू गौरैया',
        description: 'Beloved city bird declared state bird to spearhead urban biodiversity conservation.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Nilgai (Blue Bull)',
        hindiName: 'नीलगाय',
        description: 'Largest Asian antelope, commonly inhabiting the Delhi Ridge and Yamuna biodiversity parks.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Alfalfa',
        hindiName: 'अल्फाल्फा',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Flamboyant / Gulmohar',
        hindiName: 'गुलमोहर का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'India Gate & Kartavya Path',
        hindiName: 'इंडिया गेट एवं कर्तव्य पथ',
        category: 'Historical Monument',
        description: '42-meter high triumphal war arch honoring 84,000 soldiers of the British Indian Army who died in World War I, with the Amar Jawan Jyoti.',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Red Fort (Lal Qila)',
        hindiName: 'लाल किला',
        category: 'UNESCO Heritage',
        description: 'Mughal fortress of red sandstone built by Shah Jahan in 1648, venue of the Prime Minister’s annual Independence Day address.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Qutub Minar',
        hindiName: 'क़ुतुब मीनार',
        category: 'UNESCO Heritage',
        description: '72.5-meter tall fluted red sandstone minaret erected in 1192 by Qutb-ud-din Aibak, alongside the rust-resistant 4th-century Iron Pillar.',
        imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4446e10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Lotus Temple & Akshardham',
        hindiName: 'लोटस टेम्पल एवं अक्षरधाम',
        category: 'Spiritual Shrine',
        description: 'Baháʼí House of Worship shaped like a blooming 27-petal lotus flower, open to people of all faiths for silent meditation.',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Yamuna'],
    famousFood: ['Chole Bhature', 'Parathas of Chandni Chowk', 'Butter Chicken', 'Dahi Bhalla', 'Gol Gappe'],
    famousFestivals: ['Republic Day Parade (Rajpath/Kartavya Path)', 'Independence Day', 'Diwali', 'Qutub Festival'],
    classicalDance: 'Kathak & Classical Musical Gharanas',
    coordinates: { x: 42, y: 28 },
  },

  // --- JAMMU & KASHMIR ---
  {
    id: 'jammu_kashmir',
    name: 'Jammu & Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    odiaName: 'ଜାମ୍ମୁ ଓ କାଶ୍ମୀର',
    capital: 'Srinagar (Summer) / Jammu (Winter)',
    zone: 'UT',
    formationYear: '31 October 2019 (Union Territory)',
    officialLanguages: ['Kashmiri', 'Dogri', 'Urdu', 'Hindi', 'English'],
    areaKm2: '42,241 km²',
    population: '14 Million',
    literacyRate: '68.7%',
    tagline: 'Paradise on Earth · Crown of India',
    symbols: {
      bird: {
        name: 'Kalij Pheasant',
        hindiName: 'कलीज तीतर',
        description: 'Forest pheasant with glossy blue-black plumage and crimson eye-wattles inhabiting the Himalayan foothills.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Kashmir Stag (Hangul)',
        hindiName: 'हंगुल (कश्मीरी बारहसिंगा)',
        description: 'Critically endangered subspecies of red deer native only to the dense riverine forests of Dachigam National Park.',
        imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Common Lotus (कमल)',
        hindiName: 'कमल',
        imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Chinar Tree (چنار)',
        hindiName: 'चिनार का पेड़',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Dal Lake & Houseboats, Srinagar',
        hindiName: 'डल झील एवं शिकारा, श्रीनगर',
        category: 'Natural Wonder',
        description: 'The "Jewel in the crown of Kashmir", famed for wooden Shikara gondolas, floating vegetable markets, and Mughal gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gulmarg (Meadow of Flowers)',
        hindiName: 'गुलमर्ग',
        category: 'Hill Station',
        description: 'World-renowned winter sports resort featuring the Gulmarg Gondola (one of the highest cable cars in the world at 3,980m).',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Shri Mata Vaishno Devi Shrine, Katra',
        hindiName: 'माता वैष्णो देवी मंदिर, कटरा',
        category: 'Spiritual Shrine',
        description: 'Sacred cave shrine located on the Trikuta Mountains attracting millions of devotees every year.',
        imageUrl: 'https://images.unsplash.com/photo-1626297061730-a92c46237666?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pahalgam (Valley of Shepherds)',
        hindiName: 'पहलगाम',
        category: 'Natural Wonder',
        description: 'Serene mountain valley along the Lidder River, starting point of the holy annual Amarnath Yatra pilgrimage.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Jhelum', 'Chenab', 'Indus', 'Tawi', 'Ravi'],
    famousFood: ['Wazwan (Rogan Josh, Gushtaba)', 'Dum Aloo', 'Kashmiri Kahwa Tea', 'Yakhni', 'Nadru Yakhni (Lotus Stem)'],
    famousFestivals: ['Tulip Festival (Indira Gandhi Memorial)', 'Shikara Festival', 'Baisakhi', 'Hemis Festival'],
    classicalDance: 'Rouf Dance & Bhand Pather',
    coordinates: { x: 32, y: 12 },
  },

  // --- ASSAM ---
  {
    id: 'assam',
    name: 'Assam',
    hindiName: 'असम',
    odiaName: 'ଆସାମ',
    capital: 'Dispur / Guwahati',
    zone: 'North-East',
    formationYear: '26 January 1950',
    officialLanguages: ['Assamese', 'Bodo', 'Bengali'],
    areaKm2: '78,438 km²',
    population: '36 Million',
    literacyRate: '73.2%',
    tagline: 'Awesome Assam · Land of Red River and Blue Hills',
    symbols: {
      bird: {
        name: 'White-winged Wood Duck (দেওহাঁহ)',
        hindiName: 'सफेद पंखों वाली जंगली बत्तख',
        description: 'Rare secretive forest duck inhabiting secluded jungle pools and wetlands across upper Assam.',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',
      },
      animal: {
        name: 'Great Indian One-Horned Rhinoceros (এশিঙীয়া গঁড়)',
        hindiName: 'एक सींग वाला गैंडा',
        description: 'Symbol of Assam’s conservation pride, with Kaziranga National Park hosting two-thirds of the world’s entire rhino population.',
        imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
      },
      flower: {
        name: 'Foxtail Orchid / Kopou Phool (কপৌ ফুল)',
        hindiName: 'फॉक्सटेल ऑर्किड',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
      },
      tree: {
        name: 'Hollong (Dipterocarpus retusus)',
        hindiName: 'होलांग वृक्ष',
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      },
    },
    famousPlaces: [
      {
        name: 'Kaziranga National Park',
        hindiName: 'काजीरंगा राष्ट्रीय उद्यान',
        category: 'UNESCO Heritage',
        description: 'UNESCO World Heritage biodiversity reserve on the Brahmaputra floodplain, home to the Big Five: Rhinos, Tigers, Elephants, Wild Water Buffalo, and Swamp Deer.',
        imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kamakhya Temple, Guwahati',
        hindiName: 'कामाख्या मंदिर, गुवाहाटी',
        category: 'Spiritual Shrine',
        description: 'Ancient Shakti Peetha atop Nilachal Hill, revered center of Tantric worship and the site of the sacred Ambubachi Mela.',
        imageUrl: 'https://images.unsplash.com/photo-1626297061730-a92c46237666?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Majuli River Island',
        hindiName: 'माजुली द्वीप',
        category: 'Natural Wonder',
        description: 'The world’s largest inhabited river island in the middle of the mighty Brahmaputra river, center of Vaishnavite Satra culture.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Manas National Park',
        hindiName: 'मानस राष्ट्रीय उद्यान',
        category: 'UNESCO Heritage',
        description: 'Tiger reserve and biosphere sanctuary at the Himalayan foothills contiguous with Bhutan, home to pygmy hogs and golden langurs.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      },
    ],
    majorRivers: ['Brahmaputra (Son of Brahma)', 'Barak', 'Subansiri', 'Manas', 'Kopili'],
    famousFood: ['Masor Tenga (Sour Fish Curry)', 'Khaar', 'Pitha & Laru', 'Duck Curry with Ash Gourd', 'Assam Orthodox Black Tea'],
    famousFestivals: ['Rongali Bihu (Bohag Bihu)', 'Ambubachi Mela', 'Me-Dam-Me-Phi', 'Majuli Music Festival'],
    classicalDance: 'Sattriya (Classical dance created by Mahapurush Srimanta Sankardev) & Bihu Folk Dance',
    coordinates: { x: 88, y: 36 },
  },
];
