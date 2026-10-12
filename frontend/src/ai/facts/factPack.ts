/**
 * Verified GK Fact Pack (RAG)
 * From Document 06 §8: The biggest accuracy gain for General Knowledge.
 * Supports multilingual retrieval and localized facts for English, Hindi, and Odia.
 */

import { ARCHIVE_GK_FACTS } from './archiveGkFacts';

export interface LocalizedFactContent {
  answer: string;
  details: string;
  source?: string;
}

export interface VerifiedFact {
  id: string;
  category: string;
  question_variants: string[];
  answer: string;
  details: string;
  source: string;
  verified_on: string;
  valid_until?: string | null;
  image?: string | null;
  translations?: {
    hi?: LocalizedFactContent;
    or?: LocalizedFactContent;
  };
}

export function getLocalizedFact(
  fact: VerifiedFact,
  lang: string
): { answer: string; details: string; source: string } {
  if (lang === 'hi' && fact.translations?.hi) {
    return {
      answer: fact.translations.hi.answer,
      details: fact.translations.hi.details,
      source: fact.translations.hi.source || fact.source,
    };
  }
  if (lang === 'or' && fact.translations?.or) {
    return {
      answer: fact.translations.or.answer,
      details: fact.translations.or.details,
      source: fact.translations.or.source || fact.source,
    };
  }
  return {
    answer: fact.answer,
    details: fact.details,
    source: fact.source,
  };
}

const BUILTIN_FACTS: VerifiedFact[] = [
  {
    id: 'physics-newton-0001',
    category: 'physics_science',
    question_variants: [
      "what is newton's law",
      "what is newtons law",
      "what are newton's laws of motion",
      "newton's laws of motion",
      "newton laws of motion",
      "newton's first law",
      "newton's second law",
      "newton's third law",
      "newton law",
      "newtons laws",
      "law of motion",
      "laws of motion",
      "न्यूटन्स लॉ",
      "न्यूटन के गति के नियम",
      "ନ୍ୟୁଟନଙ୍କ ଗତି ନିୟମ"
    ],
    answer: "Newton's Laws of Motion are three fundamental classical mechanics principles formulated by Sir Isaac Newton: 1) First Law (Inertia): an object remains at rest or in uniform straight-line motion unless acted upon by a net external force. 2) Second Law: F = ma (net force equals mass times acceleration, F = dp/dt). 3) Third Law (Action-Reaction): for every action, there is an equal and opposite reaction.",
    details: "Formulated in 1687 in Philosophiae Naturalis Principia Mathematica. Together with Newton's Law of Universal Gravitation (F = G*m1*m2/r^2), they laid the foundations of classical physics.",
    source: "NCERT Physics Class 11 Chapter 5; NASA Glenn Research Center; Principia Mathematica (1687)",
    verified_on: "2026-10-12",
    valid_until: null,
    translations: {
      hi: {
        answer: "न्यूटन के गति के तीन मूलभूत नियम हैं: 1) प्रथम नियम (जड़त्व का नियम): कोई वस्तु तब तक अपनी विराम अवस्था या एकसमान सरल रेखीय गति में रहती है जब तक उस पर कोई बाह्य असंतुलित बल न लगे। 2) द्वितीय नियम (बल का नियम): संवेग परिवर्तन की दर लगाए गए बल के समानुपाती होती है (F = ma)। 3) तृतीय नियम (क्रिया-प्रतिक्रिया का नियम): प्रत्येक क्रिया की सदैव बराबर एवं विपरीत दिशा में प्रतिक्रिया होती है।",
        details: "सर आइजैक न्यूटन द्वारा 1687 में प्रिंसिपिया मैथमैटिका में प्रतिपादित किए गए। इसके अतिरिक्त सार्वत्रिक गुरुत्वाकर्षण नियम F = G*(m1*m2)/r^2 है।",
        source: "NCERT भौतिकी कक्षा 11 अध्याय 5"
      },
      or: {
        answer: "ନ୍ୟୁଟନଙ୍କ ଗତିର ତିନୋଟି ମୌଳିକ ନିୟମ ରହିଛି: ୧) ପ୍ରଥମ ନିୟମ (ଜଡ଼ତା ନିୟମ): ବାହ୍ୟ ବଳ ପ୍ରୟୋଗ ନହେବା ପର୍ଯ୍ୟନ୍ତ ପ୍ରତ୍ୟେକ ବସ୍ତୁ ନିଜର ସ୍ଥିତି କିମ୍ବା ସମଗତି ଅବସ୍ଥା ବଜାୟ ରଖେ। ୨) ଦ୍ୱିତୀୟ ନିୟମ (ବଳ ନିୟମ): ବସ୍ତୁର ସଂବେଗ ପରିବର୍ତ୍ତନର ହାର ପ୍ରୟୋଗ କରାଯାଇଥିବା ବଳ ସହିତ ସମାନୁପାତୀ (F = ma)। ୩) ତୃତୀୟ ନିୟମ (କ୍ରିୟା-ପ୍ରତିକ୍ରିୟା ନିୟମ): ପ୍ରତ୍ୟେକ କ୍ରିୟାର ଏକ ସମାନ ଏବଂ ବିପରୀତ ପ୍ରତିକ୍ରିୟା ଥାଏ।",
        details: "ସାର୍ ଆଇଜାକ୍ ନ୍ୟୁଟନ୍ ୧୬୮୭ ରେ ପ୍ରିନ୍ସିପିଆରେ ଏହି ନିୟମ ପ୍ରଣୟନ କରିଥିଲେ। ସାର୍ବଜନୀନ ମାଧ୍ୟାକର୍ଷଣ ନିୟମ F = G*(m1*m2)/r^2 ଅଟେ।",
        source: "NCERT ପଦାର୍ଥ ବିଜ୍ଞାନ ଶ୍ରେଣୀ ୧୧"
      }
    }
  },
  {
    id: 'polity-0001',
    category: 'polity_civics',
    question_variants: [
      'when did the indian constitution come into force',
      'republic day date',
      'indian constitution adoption date',
      'constitution of india',
      'ଭାରତର ସମ୍ବିଧାନ କେବେ କାର୍ଯ୍ୟକାରୀ ହୋଇଥିଲା',
      'ଭାରତର ସମ୍ବିଧାନ',
      'ସାଧାରଣତନ୍ତ୍ର ଦିବସ',
      'ସମ୍ବିଧାନ କେବେ ଲାଗୁ ହେଲା',
      'भारत का संविधान कब लागू हुआ था',
      'भारत का संविधान',
      'गणतंत्र दिवस',
      'संविधान कब लागू हुआ',
    ],
    answer: 'The Constitution of India came into force on 26 January 1950.',
    details: 'It was adopted by the Constituent Assembly on 26 November 1949 (celebrated as Constitution Day). 26 January is celebrated nationwide as Republic Day.',
    source: 'Ministry of Law and Justice, Government of India; NCERT Civics Class 9',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'भारत का संविधान 26 जनवरी 1950 को लागू हुआ था।',
        details: 'इसे 26 नवंबर 1949 को संविधान सभा द्वारा अपनाया गया था (संविधान दिवस)। 26 जनवरी को देश भर में गणतंत्र दिवस के रूप में मनाया जाता है।',
        source: 'विधि और न्याय मंत्रालय, भारत सरकार; NCERT नागरिक शास्त्र कक्षा 9',
      },
      or: {
        answer: 'ଭାରତର ସମ୍ବିଧାନ ୨୬ ଜାନୁଆରୀ ୧୯୫୦ ରେ କାର୍ଯ୍ୟକାରୀ ହୋଇଥିଲା।',
        details: 'ଏହା ୨୬ ନଭେମ୍ବର ୧୯୪୯ ରେ ସମ୍ବିଧାନ ସଭା ଦ୍ୱାରା ଗୃହୀତ ହୋଇଥିଲା (ସମ୍ବିଧାନ ଦିବସ)। ୨୬ ଜାନୁଆରୀକୁ ସମଗ୍ର ଦେଶରେ ସାଧାରଣତନ୍ତ୍ର ଦିବସ ଭାବରେ ପାଳନ କରାଯାଏ।',
        source: 'ଭାରତ ସରକାରଙ୍କ ଆଇନ ଓ ନ୍ୟାୟ ମନ୍ତ୍ରଣାଳୟ; NCERT ଶିକ୍ଷା ପୁସ୍ତକ',
      },
    },
  },
  {
    id: 'geo-0001',
    category: 'geography',
    question_variants: [
      'capital of australia',
      'what is the capital of australia',
      'why is sydney the capital of australia',
      'is sydney the capital of australia',
      'ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ',
      'ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ କଣ',
      'ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ ସିଡନୀ କାହିଁକି',
      'ऑस्ट्रेलिया की राजधानी',
      'ऑस्ट्रेलिया की राजधानी क्या है',
      'ऑस्ट्रेलिया की राजधानी सिडनी क्यों है',
    ],
    answer: 'The capital of Australia is Canberra.',
    details: 'Canberra was specifically planned and selected as a compromise between Sydney and Melbourne in 1908. Sydney is the largest city, but not the capital.',
    source: 'National Capital Authority (Australia); Commonwealth Government Directory',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'ऑस्ट्रेलिया की राजधानी कैनबरा है।',
        details: '1908 में सिडनी और मेलबर्न के बीच समझौते के रूप में कैनबरा को विशेष रूप से नियोजित और चुना गया था। सिडनी सबसे बड़ा शहर है, लेकिन राजधानी नहीं है।',
        source: 'राष्ट्रीय राजधानी प्राधिकरण (ऑस्ट्रेलिया)',
      },
      or: {
        answer: 'ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ ହେଉଛି କାନବେରା।',
        details: '୧୯୦୮ ମସିହାରେ ସିଡନୀ ଏବଂ ମେଲବୋର୍ଣ୍ଣ ମଧ୍ୟରେ ଏକ ବୁଝାମଣା ଭାବରେ କାନବେରାକୁ ଯୋଜନାବଦ୍ଧ ଭାବରେ ବଛାଯାଇଥିଲା। ସିଡନୀ ସବୁଠାରୁ ବଡ଼ ସହର, କିନ୍ତୁ ରାଜଧାନୀ ନୁହେଁ।',
        source: 'ଅଷ୍ଟ୍ରେଲିଆ ଜାତୀୟ ରାଜଧାନୀ ପ୍ରାଧିକରଣ',
      },
    },
  },
  {
    id: 'geo-0002',
    category: 'geography',
    question_variants: [
      'capital of canada',
      'what is the capital of canada',
      'is toronto the capital of canada',
      'କାନାଡାର ରାଜଧାନୀ',
      'କାନାଡାର ରାଜଧାନୀ କଣ',
      'कनाडा की राजधानी',
      'कनाडा की राजधानी क्या है',
    ],
    answer: 'The capital of Canada is Ottawa.',
    details: 'Ottawa was chosen by Queen Victoria in 1857. Toronto and Montreal are larger metropolitan cities, but Ottawa is the seat of the federal government.',
    source: 'Parliament of Canada Official Guide',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'कनाडा की राजधानी ओटावा है।',
        details: '1857 में महारानी विक्टोरिया द्वारा ओटावा को चुना गया था। टोरंटो और मॉन्ट्रियल बड़े शहर हैं, लेकिन ओटावा संघीय सरकार का मुख्यालय है।',
        source: 'कनाडा की संसद आधिकारिक गाइड',
      },
      or: {
        answer: 'କାନାଡାର ରାଜଧାନୀ ହେଉଛି ଓଟାୱା।',
        details: '୧୮୫୭ ମସିହାରେ ରାଣୀ ଭିକ୍ଟୋରିଆଙ୍କ ଦ୍ୱାରା ଓଟାୱା ବଛାଯାଇଥିଲା। ଟରୋଣ୍ଟୋ ଏବଂ ମଣ୍ଟ୍ରିଆଲ୍ ବଡ଼ ସହର, କିନ୍ତୁ ଓଟାୱା ଫେଡେରାଲ୍ ସରକାରଙ୍କ ଆସନ ଅଟେ।',
        source: 'କାନାଡା ସଂସଦ ଅଫିସିଆଲ୍ ଗାଇଡ୍',
      },
    },
  },
  {
    id: 'geo-0003',
    category: 'geography',
    question_variants: [
      'longest river in india',
      'which is the longest river flowing in india',
      'length of river ganga',
      'ଭାରତର ଦୀର୍ଘତମ ନଦୀ',
      'ଗଙ୍ଗା ନଦୀ',
      'ଗଙ୍ଗା ନଦୀର ଲମ୍ବ',
      'भारत की सबसे लंबी नदी',
      'गंगा नदी',
      'गंगा नदी की लंबाई',
    ],
    answer: 'The Ganga (Ganges) is the longest river flowing entirely within and from India, with a length of approximately 2,525 km.',
    details: 'It originates from the Gangotri Glacier (Bhagirathi) in Uttarakhand and empties into the Bay of Bengal.',
    source: 'Survey of India; NCERT Geography Class 11 Drainage Systems',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'भारत में बहने वाली सबसे लंबी नदी गंगा है, जिसकी लंबाई लगभग 2,525 किमी है।',
        details: 'यह उत्तराखंड में गंगोत्री हिमनद (भागीरथी) से निकलती है और बंगाल की खाड़ी में गिरती है।',
        source: 'भारतीय सर्वेक्षण विभाग; NCERT भूगोल कक्षा 11',
      },
      or: {
        answer: 'ଭାରତ ମଧ୍ୟରେ ପ୍ରବାହିତ ହେଉଥିବା ଦୀର୍ଘତମ ନଦୀ ହେଉଛି ଗଙ୍ଗା, ଯାହାର ଦୈର୍ଘ୍ୟ ପ୍ରାୟ ୨,୫୨୫ କିଲୋମିଟର।',
        details: 'ଏହା ଉତ୍ତରାଖଣ୍ଡର ଗଙ୍ଗୋତ୍ରୀ ହିମବାହ (ଭାଗୀରଥୀ) ରୁ ଉତ୍ପନ୍ନ ହୋଇ ବଙ୍ଗୋପସାଗରରେ ମିଶିଛି।',
        source: 'ଭାରତୀୟ ସର୍ବେକ୍ଷଣ ବିଭାଗ; NCERT ଭୂଗୋଳ କକ୍ଷା ୧୧',
      },
    },
  },
  {
    id: 'geo-0004',
    category: 'geography',
    question_variants: [
      'highest mountain peak in india',
      'highest peak in india',
      'kanchenjunga',
      'ଭାରତର ସର୍ବୋଚ୍ଚ ଶୃଙ୍ଗ',
      'କାଞ୍ଚନଜଙ୍ଗା',
      'भारत की सबसे ऊंची चोटी',
      'कंचनजंगा',
    ],
    answer: 'Kangchenjunga (8,586 metres / 28,169 ft) is the highest mountain peak located in undisputed Indian territory.',
    details: 'It is situated in Sikkim on the India-Nepal border. K2 (8,611 m) is in Pakistan-administered Kashmir (Gilgit-Baltistan).',
    source: 'Survey of India; NCERT Physical Environment Class 11',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'भारतीय सीमा के भीतर स्थित सबसे ऊंची पर्वत चोटी कंचनजंगा (8,586 मीटर / 28,169 फीट) है।',
        details: 'यह भारत-नेपाल सीमा पर सिक्किम में स्थित है। के2 (8,611 मीटर) पाक-अधिकृत कश्मीर में है।',
        source: 'भारतीय सर्वेक्षण विभाग; NCERT भौतिक पर्यावरण कक्षा 11',
      },
      or: {
        answer: 'ଭାରତୀୟ ସୀମା ମଧ୍ୟରେ ସର୍ବୋଚ୍ଚ ପର୍ବତ ଶୃଙ୍ଗ ହେଉଛି କାଞ୍ଚନଜଙ୍ଗା (୮,୫୮୬ ମିଟର / ୨୮,୧୬୯ ଫୁଟ)।',
        details: 'ଏହା ଭାରତ-ନେପାଳ ସୀମାରେ ସିକ୍କିମରେ ଅବସ୍ଥିତ। K2 (୮,୬୧୧ ମିଟର) ପାକ୍-ଅଧିକୃତ କାଶ୍ମୀରରେ ଅବସ୍ଥିତ।',
        source: 'ଭାରତୀୟ ସର୍ବେକ୍ଷଣ ବିଭାଗ; NCERT',
      },
    },
  },
  {
    id: 'sci-0001',
    category: 'science',
    question_variants: [
      'what is photosynthesis',
      'how does photosynthesis work',
      'photosynthesis equation products',
      'photosynthesis formula',
      'ଆଲୋକ ଶ୍ଳେଷଣ',
      'ଆଲୋକ ଶ୍ଳେଷଣ ପ୍ରକ୍ରିୟା',
      'ଆଲୋକ ଶ୍ଳେଷଣ ସୂତ୍ର',
      'प्रकाश संश्लेषण',
      'प्रकाश संश्लेषण क्या है',
      'प्रकाश संश्लेषण सूत्र',
    ],
    answer: 'Photosynthesis is the biological process by which green plants and organisms convert sunlight, water, and carbon dioxide into glucose and oxygen.',
    details: 'Chemical formula: 6 CO2 + 6 H2O + light energy -> C6H12O6 + 6 O2. Takes place inside the chloroplasts containing chlorophyll.',
    source: 'NCERT Science Class 10 Life Processes; Campbell Biology',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'प्रकाश संश्लेषण वह जैविक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड को ग्लूकोज और ऑक्सीजन में परिवर्तित करते हैं।',
        details: 'रासायनिक सूत्र: 6 CO2 + 6 H2O + प्रकाश ऊर्जा -> C6H12O6 + 6 O2। यह क्लोरोप्लास्ट के अंदर होता है जिसमें क्लोरोफिल मौजूद होता है।',
        source: 'NCERT विज्ञान कक्षा 10 जैव प्रक्रम',
      },
      or: {
        answer: 'ଆଲୋକ ଶ୍ଳେଷଣ ହେଉଛି ଏକ ଜୈବିକ ପ୍ରକ୍ରିୟା ଯାହା ଦ୍ୱାରା ସବୁଜ ଉଦ୍ଭିଦ ସୂର୍ଯ୍ୟାଲୋକ, ଜଳ ଏବଂ ଅଙ୍ଗାରକାମ୍ଳକୁ ଗ୍ଲୁକୋଜ୍ ଏବଂ ଅମ୍ଳଜାନରେ ପରିଣତ କରନ୍ତି।',
        details: 'ରାସାୟନିକ ସୂତ୍ର: 6 CO2 + 6 H2O + ଆଲୋକ ଶକ୍ତି -> C6H12O6 + 6 O2। ଏହା କ୍ଲୋରୋପ୍ଲାଷ୍ଟ ମଧ୍ୟରେ ସଂଘଠିତ ହୋଇଥାଏ।',
        source: 'NCERT ବିଜ୍ଞାନ କକ୍ଷା ୧୦ ଜୀବନ ପ୍ରକ୍ରିୟା',
      },
    },
  },
  {
    id: 'sci-0002',
    category: 'science',
    question_variants: [
      'speed of light',
      'what is the speed of light in vacuum',
      'speed of light in meters per second',
      'ଆଲୋକର ବେଗ',
      'ଶୂନ୍ୟରେ ଆଲୋକର ବେଗ',
      'प्रकाश की गति',
      'निर्वात में प्रकाश की गति',
    ],
    answer: 'The speed of light in a vacuum is exactly 299,792,458 metres per second (approximately 3 × 10^8 m/s).',
    details: 'Denoted by the physical constant c. Defined as the foundation of SI metric length measurement since 1983.',
    source: 'Bureau International des Poids et Mesures (BIPM); NIST Physical Reference Data',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'निर्वात में प्रकाश की गति ठीक 299,792,458 मीटर प्रति सेकंड (लगभग 3 × 10^8 मी/से) है।',
        details: 'इसे भौतिक स्थिरांक c द्वारा दर्शाया जाता है। 1983 से यह SI लंबाई माप का आधार है।',
        source: 'BIPM एवं NIST भौतिक संदर्भ डेटा',
      },
      or: {
        answer: 'ଶୂନ୍ୟସ୍ଥାନରେ ଆଲୋକର ବେଗ ଠିକ୍ ୨୯୯,୭୯୨,୪୫୮ ମିଟର ପ୍ରତି ସେକେଣ୍ଡ (ପ୍ରାୟ ୩ × ୧୦^୮ ମି/ସେ)।',
        details: 'ଏହାକୁ ଭୌତିକ ସ୍ଥିରାଙ୍କ c ଦ୍ୱାରା ସୂଚିତ କରାଯାଏ। ୧୯୮୩ ରୁ ଏହା SI ମାପର ମୂଳଦୁଆ ଅଟେ।',
        source: 'BIPM ଏବଂ NIST ଭୌତିକ ସନ୍ଦର୍ଭ ତଥ୍ୟ',
      },
    },
  },
  {
    id: 'space-0001',
    category: 'science',
    question_variants: [
      'chandrayaan 3 landing date',
      'when did chandrayaan 3 land on the moon',
      'national space day india',
      'ଚନ୍ଦ୍ରଯାନ ୩',
      'ଚନ୍ଦ୍ରଯାନ ୩ ଅବତରଣ',
      'ଜାତୀୟ ମହାକାଶ ଦିବସ',
      'चंद्रयान 3',
      'चंद्रयान 3 लैंडिंग तारीख',
      'राष्ट्रीय अंतरिक्ष दिवस',
    ],
    answer: 'Chandrayaan-3 successfully touched down on the Moon on 23 August 2023 at 18:04 IST.',
    details: 'India became the fourth country to achieve a soft lunar landing and the first near the lunar south pole. The landing site was named Shiv Shakti Point, and August 23 is designated National Space Day.',
    source: 'Indian Space Research Organisation (ISRO) Mission Report',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'चंद्रयान-3 ने 23 अगस्त 2023 को शाम 18:04 IST पर चंद्रमा पर सफलतापूर्वक सॉफ्ट लैंडिंग की।',
        details: 'भारत चंद्रमा के दक्षिणी ध्रुव के पास उतरने वाला पहला देश बना। लैंडिंग स्थल का नाम शिव शक्ति पॉइंट रखा गया और 23 अगस्त को राष्ट्रीय अंतरिक्ष दिवस घोषित किया गया।',
        source: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)',
      },
      or: {
        answer: 'ଚନ୍ଦ୍ରଯାନ-୩ ସଫଳତାର ସହିତ ୨୩ ଅଗଷ୍ଟ ୨୦୨୩ ରେ ସନ୍ଧ୍ୟା ୧୮:୦୪ IST ରେ ଚନ୍ଦ୍ରପୃଷ୍ଠରେ ଅବତରଣ କରିଥିଲା।',
        details: 'ଭାରତ ଚନ୍ଦ୍ରର ଦକ୍ଷିଣ ମେରୁ ନିକଟରେ ଅବତରଣ କରିବାରେ ପ୍ରଥମ ଦେଶ ହୋଇଥିଲା। ଅବତରଣ ସ୍ଥଳକୁ ଶିବ ଶକ୍ତି ପଏଣ୍ଟ ନାମ ଦିଆଯାଇଛି ଏବଂ ୨୩ ଅଗଷ୍ଟକୁ ଜାତୀୟ ମହାକାଶ ଦିବସ ଘୋଷଣା କରାଯାଇଛି।',
        source: 'ଭାରତୀୟ ମହାକାଶ ଗବେଷଣା ସଂସ୍ଥା (ISRO)',
      },
    },
  },
  {
    id: 'symbols-0001',
    category: 'national_symbols',
    question_variants: [
      'national animal of india',
      'national bird of india',
      'national symbols of india',
      'ଭାରତର ଜାତୀୟ ପଶୁ',
      'ଭାରତର ଜାତୀୟ ପକ୍ଷୀ',
      'ଜାତୀୟ ପ୍ରତୀକ',
      'भारत का राष्ट्रीय पशु',
      'भारत का राष्ट्रीय पक्षी',
      'राष्ट्रीय प्रतीक',
    ],
    answer: 'The Royal Bengal Tiger (Panthera tigris) is the National Animal of India, and the Indian Peacock (Pavo cristatus) is the National Bird.',
    details: 'The National Flower is the Lotus (Nelumbo nucifera), and the National Tree is the Banyan (Ficus benghalensis).',
    source: 'Know India Portal, Ministry of Information & Broadcasting, Government of India',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'रॉयल बंगाल टाइगर (बाघ) भारत का राष्ट्रीय पशु है, और भारतीय मोर राष्ट्रीय पक्षी है।',
        details: 'राष्ट्रीय फूल कमल (कमल) है, और राष्ट्रीय वृक्ष बरगद है।',
        source: 'भारत सरकार सूचना एवं प्रसारण मंत्रालय',
      },
      or: {
        answer: 'ରୟାଲ ବେଙ୍ଗଲ ଟାଇଗର (ବାଘ) ଭାରତର ଜାତୀୟ ପଶୁ ଏବଂ ମୟୂର ହେଉଛି ଭାରତର ଜାତୀୟ ପକ୍ଷୀ।',
        details: 'ଜାତୀୟ ଫୁଲ ହେଉଛି ପଦ୍ମ ଏବଂ ଜାତୀୟ ବୃକ୍ଷ ହେଉଛି ବରଗଛ।',
        source: 'ଭାରତ ସରକାର ସୂଚନା ଓ ପ୍ରସାରଣ ମନ୍ତ୍ରଣାଳୟ',
      },
    },
  },
  {
    id: 'polity-0002',
    category: 'polity_civics',
    question_variants: [
      'who wrote the indian constitution',
      'father of the indian constitution',
      'drafting committee chairman',
      'ଭାରତୀୟ ସମ୍ବିଧାନର ଜନକ',
      'ଆମ୍ବେଦକର',
      'भारतीय संविधान के जनक',
      'अम्बेडकर',
    ],
    answer: 'Dr. B. R. Ambedkar is revered as the Chief Architect and Father of the Constitution of India, serving as Chairman of the Drafting Committee.',
    details: 'The Constituent Assembly took 2 years, 11 months, and 18 days to finalize the Constitution with extensive debate.',
    source: 'Constituent Assembly Debates; Lok Sabha Secretariat',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'डॉ. बी. आर. अम्बेडकर को भारत के संविधान के मुख्य शिल्पकार और जनक के रूप में सम्मानित किया जाता है, जिन्होंने प्रारूप समिति के अध्यक्ष के रूप में कार्य किया।',
        details: 'संविधान को अंतिम रूप देने में संविधान सभा को 2 साल, 11 महीने और 18 दिन का समय लगा।',
        source: 'संविधान सभा वाद-विवाद; लोकसभा सचिवालय',
      },
      or: {
        answer: 'ଡକ୍ଟର ବି. ଆର. ଆମ୍ବେଦକରଙ୍କୁ ଭାରତୀୟ ସମ୍ବିଧାନର ମୁଖ୍ୟ ନିର୍ମାତା ଏବଂ ଜନକ ଭାବରେ ସମ୍ମାନିତ କରାଯାଏ, ଯିଏ ଡ୍ରାଫ୍ଟିଂ କମିଟିର ଅଧ୍ୟକ୍ଷ ଥିଲେ।',
        details: 'ସମ୍ବିଧାନ ପ୍ରସ୍ତୁତ କରିବାକୁ ସମ୍ବିଧାନ ସଭାକୁ ୨ ବର୍ଷ ୧୧ ମାସ ୧୮ ଦିନ ସମୟ ଲାଗିଥିଲା।',
        source: 'ସମ୍ବିଧାନ ସଭା ବିବରଣୀ; ଲୋକସଭା ସଚିବାଳୟ',
      },
    },
  },
  {
    id: 'polity-0003',
    category: 'polity_civics',
    question_variants: [
      'who is the current pm of india',
      'who is the current prime minister of india',
      'current pm of india',
      'current prime minister of india',
      'current pm',
      'who is pm of india',
      'who is the pm of india',
      'who is prime minister of india',
      'who is the prime minister of india',
      'prime minister of india now',
      'present prime minister of india',
      'incumbent prime minister of india',
      'bharat ke pradhan mantri kaun hai',
      'bharat ke vartaman pradhan mantri kaun hai',
      'भारत के वर्तमान प्रधानमंत्री कौन हैं',
      'भारत के वर्तमान प्रधानमंत्री',
      'भारत के प्रधानमंत्री कौन हैं',
      'वर्तमान प्रधानमंत्री',
      'ଭାରତର ବର୍ତ୍ତମାନର ପ୍ରଧାନମନ୍ତ୍ରୀ କିଏ',
      'ଭାରତର ବର୍ତ୍ତମାନର ପ୍ରଧାନମନ୍ତ୍ରୀ',
      'ଭାରତର ପ୍ରଧାନମନ୍ତ୍ରୀ କିଏ',
    ],
    answer: 'Narendra Modi (Shri Narendra Damodardas Modi) is the current Prime Minister of India.',
    details: 'Narendra Modi has been serving as the 14th Prime Minister of India since 26 May 2014, leading consecutive governments following the 2014, 2019, and 2024 general elections. He represents Varanasi in the Lok Sabha. (Important: Jawaharlal Nehru was India\'s 1st Prime Minister from 1947–1964, not the current Prime Minister).',
    source: "Prime Minister's Office (PMO India), pmindia.gov.in; Election Commission of India",
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'श्री नरेंद्र मोदी भारत के वर्तमान प्रधानमंत्री हैं।',
        details: 'नरेंद्र मोदी 26 मई 2014 से भारत के 14वें प्रधानमंत्री के रूप में सेवारत हैं (2014, 2019 और 2024 चुनावों में विजयी)। वह लोकसभा में वाराणसी का प्रतिनिधित्व करते हैं। (विशेष ध्यान दें: पंडित जवाहरलाल नेहरू भारत के पहले प्रधानमंत्री थे, वर्तमान नहीं)।',
        source: 'प्रधानमंत्री कार्यालय (PMO भारत), pmindia.gov.in',
      },
      or: {
        answer: 'ଶ୍ରୀ ନରେନ୍ଦ୍ର ମୋଦୀ ଭାରତର ବର୍ତ୍ତମାନର ପ୍ରଧାନମନ୍ତ୍ରୀ ଅଟନ୍ତି।',
        details: 'ନରେନ୍ଦ୍ର ମୋଦୀ ୨୬ ମେ ୨୦୧୪ ଠାରୁ ଭାରତର ପ୍ରଧାନମନ୍ତ୍ରୀ ଅଟନ୍ତି। (ସୂଚନା: ପଣ୍ଡିତ ଜବାହରଲାଲ ନେହେରୁ ଭାରତର ପ୍ରଥମ ପ୍ରଧାନମନ୍ତ୍ରୀ ଥିଲେ, ବର୍ତ୍ତମାନର ନୁହଁନ୍ତି)।',
        source: 'ପ୍ରଧାନମନ୍ତ୍ରୀ କାର୍ଯ୍ୟାଳୟ (PMO)',
      },
    },
  },
  {
    id: 'polity-0004',
    category: 'polity_civics',
    question_variants: [
      'who was the first prime minister of india',
      'who was the first pm of india',
      'first prime minister of india',
      'first pm of india',
      'who is the first prime minister of india',
      'who is the first pm of india',
      'भारत के पहले प्रधानमंत्री कौन थे',
      'भारत के प्रथम प्रधानमंत्री कौन थे',
      'ଭାରତର ପ୍ରଥମ ପ୍ରଧାନମନ୍ତ୍ରୀ କିଏ ଥିଲେ',
    ],
    answer: 'Jawaharlal Nehru (Pandit Jawaharlal Nehru) was the first Prime Minister of India.',
    details: 'Jawaharlal Nehru served as India\'s first Prime Minister from Independence on 15 August 1947 until his demise on 27 May 1964. (Note: The current Prime Minister of India is Narendra Modi).',
    source: 'National Portal of India (india.gov.in); NCERT History',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'पंडित जवाहरलाल नेहरू भारत के पहले प्रधानमंत्री थे।',
        details: 'जवाहरलाल नेहरू ने 15 अगस्त 1947 से 27 मई 1964 तक भारत के प्रथम प्रधानमंत्री के रूप में कार्य किया। (ध्यान दें: वर्तमान प्रधानमंत्री नरेंद्र मोदी हैं)।',
        source: 'राष्ट्रीय अभिलेखागार, भारत सरकार; NCERT',
      },
      or: {
        answer: 'ପଣ୍ଡିତ ଜବାହରଲାଲ ନେହେରୁ ଭାରତର ପ୍ରଥମ ପ୍ରଧାନମନ୍ତ୍ରୀ ଥିଲେ।',
        details: 'ଜବାହରଲାଲ ନେହେରୁ ୧୫ ଅଗଷ୍ଟ ୧୯୪୭ ରୁ ୨୭ ମେ ୧୯୬୪ ପର୍ଯ୍ୟନ୍ତ ଭାରତର ପ୍ରଥମ ପ୍ରଧାନମନ୍ତ୍ରୀ ଥିଲେ। (ସୂଚନା: ବର୍ତ୍ତମାନର ପ୍ରଧାନମନ୍ତ୍ରୀ ନରେନ୍ଦ୍ର ମୋଦୀ ଅଟନ୍ତି)।',
        source: 'ଭାରତ ସରକାର ଜାତୀୟ ପୋର୍ଟାଲ୍',
      },
    },
  },
  {
    id: 'polity-0005',
    category: 'polity_civics',
    question_variants: [
      'who is the current president of india',
      'current president of india',
      'who is president of india',
      'president of india now',
      'present president of india',
      'भारत के वर्तमान राष्ट्रपति कौन हैं',
      'भारत के राष्ट्रपति कौन हैं',
      'ଭାରତର ବର୍ତ୍ତମାନର ରାଷ୍ଟ୍ରପତି କିଏ',
    ],
    answer: 'Droupadi Murmu (Smt. Droupadi Murmu) is the current President of India.',
    details: 'Droupadi Murmu took office as the 15th President of the Republic of India on 25 July 2022. She is the first tribal woman and second woman overall to hold the highest constitutional office. (Note: Dr. Rajendra Prasad was the first President of India).',
    source: 'Rashtrapati Bhavan, presidentofindia.gov.in',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'श्रीमती द्रौपदी मुर्मू भारत की वर्तमान राष्ट्रपति हैं।',
        details: 'द्रौपदी मुर्मू ने 25 जुलाई 2022 को भारत के 15वें राष्ट्रपति के रूप में पदभार ग्रहण किया। (ध्यान दें: डॉ. राजेंद्र प्रसाद भारत के पहले राष्ट्रपति थे)।',
        source: 'राष्ट्रपति भवन सचिवालय, presidentofindia.gov.in',
      },
      or: {
        answer: 'ଶ୍ରୀମତୀ ଦ୍ରୌପଦୀ ମୁର୍ମୁ ଭାରତର ବର୍ତ୍ତମାନର ରାଷ୍ଟ୍ରପତି ଅଟନ୍ତି।',
        details: 'ଦ୍ରୌପଦୀ ମୁର୍ମୁ ୨୫ ଜୁଲାଇ ୨୦୨୨ ରେ ଭାରତର ୧୫ତମ ରାଷ୍ଟ୍ରପତି ଭାବରେ ଦାୟିତ୍ୱ ଗ୍ରହଣ କରିଥିଲେ। (ସୂଚନା: ଡ଼. ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ ଭାରତର ପ୍ରଥମ ରାଷ୍ଟ୍ରପତି ଥିଲେ)।',
        source: 'ରାଷ୍ଟ୍ରପତି ଭବନ ସଚିବାଳୟ',
      },
    },
  },
  {
    id: 'polity-0006',
    category: 'polity_civics',
    question_variants: [
      'who was the first president of india',
      'first president of india',
      'भारत के पहले राष्ट्रपति कौन थे',
      'भारत के प्रथम राष्ट्रपति कौन थे',
      'ଭାରତର ପ୍ରଥମ ରାଷ୍ଟ୍ରପତି କିଏ ଥିଲେ',
    ],
    answer: 'Dr. Rajendra Prasad was the first President of India.',
    details: 'Dr. Rajendra Prasad served as President of India from 26 January 1950 to 13 May 1962, and remains the longest-serving President in Indian history. (Note: The current President is Droupadi Murmu).',
    source: 'Constituent Assembly Records; President of India Secretariat',
    verified_on: '2026-10-11',
    valid_until: null,
    translations: {
      hi: {
        answer: 'डॉ. राजेंद्र प्रसाद भारत के पहले राष्ट्रपति थे।',
        details: 'डॉ. राजेंद्र प्रसाद ने 26 जनवरी 1950 से 13 मई 1962 तक भारत के प्रथम राष्ट्रपति के रूप में कार्य किया। (ध्यान दें: वर्तमान राष्ट्रपति द्रौपदी मुर्मू हैं)।',
        source: 'संविधान सभा अभिलेख',
      },
      or: {
        answer: 'ଡକ୍ଟର ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ ଭାରତର ପ୍ରଥମ ରାଷ୍ଟ୍ରପତି ଥିଲେ।',
        details: 'ଡକ୍ଟର ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ ୨୬ ଜାନୁଆରୀ ୧୯୫୦ ରୁ ୧୩ ମେ ୧୯୬୨ ପର୍ଯ୍ୟନ୍ତ କାର୍ଯ୍ୟ କରିଥିଲେ। (ସୂଚନା: ବର୍ତ୍ତମାନର ରାଷ୍ଟ୍ରପତି ଦ୍ରୌପଦୀ ମୁର୍ମୁ ଅଟନ୍ତି)।',
        source: 'ରାଷ୍ଟ୍ରପତି ଭବନ ରେକର୍ଡ',
      },
    },
  },
  {
    id: 'physics-einstein-0001',
    category: 'physics_science',
    question_variants: [
      'what is mass energy equivalence formula',
      'what is e=mc2',
      'einstein energy equation',
      'speed of light in vacuum',
      'e is equal to mc square',
      'द्रव्यमान ऊर्जा समीकरण क्या है',
      'आइंस्टीन का समीकरण',
      'ଆଇନଷ୍ଟାଇନଙ୍କ ଶକ୍ତି ସମୀକରଣ',
    ],
    answer: 'E = mc² (Energy equals mass times the speed of light squared), formulated by Albert Einstein in 1905.',
    details: 'Demonstrates that mass and energy are interchangeable. The speed of light c in vacuum is exactly 299,792,458 m/s (approximately 3 × 10⁸ m/s).',
    source: 'Annalen der Physik (1905); NCERT Physics Class 12 Chapter 13',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'E = mc² (ऊर्जा = द्रव्यमान × प्रकाश की चाल का वर्ग), जिसे 1905 में अल्बर्ट आइंस्टीन ने प्रतिपादित किया था।',
        details: 'यह दर्शाता है कि द्रव्यमान और ऊर्जा परस्पर परिवर्तनीय हैं। निर्वात में प्रकाश की चाल c = 3 × 10⁸ m/s होती है।',
        source: 'NCERT भौतिकी कक्षा 12',
      },
      or: {
        answer: 'E = mc² (ଶକ୍ତି = ବସ୍ତୁତ୍ୱ × ଆଲୋକର ବେଗର ବର୍ଗ), ଆଲବର୍ଟ ଆଇନଷ୍ଟାଇନ ୧୯୦୫ ରେ ପ୍ରତିପାଦନ କରିଥିଲେ।',
        details: 'ଶୂନ୍ୟସ୍ଥାନରେ ଆଲୋକର ବେଗ ପ୍ରାୟ ୩ × ୧୦⁸ ମି/ସେ ଅଟେ।',
        source: 'NCERT ପଦାର୍ଥ ବିଜ୍ଞାନ',
      },
    },
  },
  {
    id: 'physics-ohm-0001',
    category: 'physics_science',
    question_variants: [
      "what is ohm's law",
      'ohms law formula',
      'v is equal to ir',
      'formula of electric current and voltage',
      'ओम का नियम क्या है',
      'ओम का नियम सूत्र',
      'ଓହ୍ମଙ୍କ ନିୟମ କଣ',
    ],
    answer: "Ohm's Law states that electric current through a conductor is directly proportional to potential difference across it at constant temperature: V = IR.",
    details: 'V is voltage (volts), I is current (amperes), and R is resistance (ohms Ω). Formulated by Georg Simon Ohm in 1827.',
    source: 'NCERT Physics Class 12 Chapter 3; IEEE Standards',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'ओम का नियम: नियत ताप पर चालक के सिरों के बीच विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है (V = IR)।',
        details: 'यहाँ V = विभवांतर (वोल्ट), I = विद्युत धारा (एम्पीयर), R = प्रतिरोध (ओम)।',
        source: 'NCERT भौतिकी कक्षा 12 अध्याय 3',
      },
      or: {
        answer: 'ଓହ୍ମଙ୍କ ନିୟମ: ନିର୍ଦ୍ଦିଷ୍ଟ ତାପମାତ୍ରାରେ ପରିବାହୀର ବିଭବାନ୍ତର ତନ୍ମଧ୍ୟରେ ପ୍ରବାହିତ ବିଦ୍ୟୁତ ସ୍ରୋତ ସହ ସମାନୁପାତୀ (V = IR)।',
        details: 'V = ବିଭବାନ୍ତର, I = ସ୍ରୋତ, R = ପ୍ରତିରୋଧ।',
        source: 'NCERT ବିଜ୍ଞାନ ଶ୍ରେଣୀ ୧୦',
      },
    },
  },
  {
    id: 'math-pythagoras-0001',
    category: 'mathematics',
    question_variants: [
      'what is pythagoras theorem',
      'pythagorean theorem formula',
      'a squared plus b squared equals c squared',
      'hypotenuse formula',
      'पाइथागोरस प्रमेय क्या है',
      'पाइथागोरस का सूत्र',
      'ପାଇଥାଗୋରାସ ଉପପାଦ୍ୟ',
    ],
    answer: 'The Pythagorean Theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c².',
    details: 'For right triangle with legs a and b, hypotenuse c = √(a² + b²). Common integer Pythagorean triples include (3, 4, 5) and (5, 12, 13).',
    source: 'NCERT Mathematics Class 10 Chapter 6; Euclid Elements Book I',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'पाइथागोरस प्रमेय: समकोण त्रिभुज में कर्ण का वर्ग शेष दोनों भुजाओं के वर्गों के योग के बराबर होता है: a² + b² = c² (कर्ण² = लंब² + आधार²)।',
        details: 'कर्ण c = √(a² + b²)। सामान्य त्रिक (3, 4, 5) और (5, 12, 13) हैं।',
        source: 'NCERT गणित कक्षा 10 अध्याय 6',
      },
      or: {
        answer: 'ପାଇଥାଗୋରାସ ଉପପାଦ୍ୟ: ସମକୋଣୀ ତ୍ରିଭୁଜରେ କର୍ଣ୍ଣର ବର୍ଗ ଅନ୍ୟ ଦୁଇ ବାହୁର ବର୍ଗର ସମଷ୍ଟି ସହିତ ସମାନ (a² + b² = c²)।',
        details: 'କର୍ଣ୍ଣ = √(ଲମ୍ବ² + ଭୂମି²)।',
        source: 'NCERT ଗଣିତ ଶ୍ରେଣୀ ୧୦',
      },
    },
  },
  {
    id: 'math-quadratic-formula-0001',
    category: 'mathematics',
    question_variants: [
      'what is quadratic formula',
      'formula to solve quadratic equation',
      'shridharacharya formula',
      'discriminant formula b2 - 4ac',
      'द्विघात समीकरण हल करने का सूत्र',
      'श्रीधराचार्य सूत्र',
      'ଦ୍ୱିଘାତ ସମୀକରଣ ସୂତ୍ର',
    ],
    answer: 'The Quadratic Formula is x = (-b ± √(b² - 4ac)) / (2a) for solving standard quadratic equations ax² + bx + c = 0.',
    details: 'The discriminant Δ = b² - 4ac determines root nature: Δ > 0 gives two real distinct roots; Δ = 0 gives one repeated real root; Δ < 0 gives complex conjugate roots. Known historically in India as Sridhara’s Method (c. 9th century CE).',
    source: 'NCERT Mathematics Class 10 Chapter 4; Bhaskara II Bijaganita',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'द्विघात सूत्र (श्रीधराचार्य सूत्र): x = (-b ± √(b² - 4ac)) / (2a) मानक समीकरण ax² + bx + c = 0 के मूल ज्ञात करने हेतु।',
        details: 'विविक्तकर Δ = b² - 4ac: Δ > 0 होने पर दो भिन्न वास्तविक मूल; Δ = 0 होने पर समान मूल; Δ < 0 होने पर काल्पनिक मूल।',
        source: 'NCERT गणित कक्षा 10 अध्याय 4',
      },
      or: {
        answer: 'ଦ୍ୱିଘାତ ସମୀକରଣ ସୂତ୍ର: x = (-b ± √(b² - 4ac)) / (2a)।',
        details: 'ପ୍ରଭେଦକ Δ = b² - 4ac ଦ୍ୱାରା ମୂଳଦ୍ୱୟର ପ୍ରକୃତି ନିର୍ଦ୍ଧାରଣ ହୁଏ।',
        source: 'NCERT ଗଣିତ ଶ୍ରେଣୀ ୧୦',
      },
    },
  },
  {
    id: 'chemistry-photosynthesis-0001',
    category: 'physics_science',
    question_variants: [
      'what is photosynthesis equation',
      'chemical reaction of photosynthesis',
      'formula of photosynthesis',
      'प्रकाश संश्लेषण का रासायनिक समीकरण',
      'प्रकाश संश्लेषण अभिक्रिया',
      'ଆଲୋକ ଶ୍ଳେଷଣ ରାସାୟନିକ ସମୀକରଣ',
    ],
    answer: 'The balanced chemical equation for photosynthesis is 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂.',
    details: 'Conducted in plant chloroplasts using chlorophyll. Carbon dioxide and water are converted into glucose (energy) and oxygen is released as a byproduct.',
    source: 'NCERT Biology Class 11 Chapter 13',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'प्रकाश संश्लेषण का संतुलित रासायनिक समीकरण: 6CO₂ + 6H₂O + सूर्य का प्रकाश → C₆H₁₂O₆ + 6O₂।',
        details: 'क्लोरोप्लास्ट में क्लोरोफिल की उपस्थिति में पौधे कार्बन डाइऑक्साइड और जल से ग्लूकोज बनाते हैं तथा ऑक्सीजन मुक्त करते हैं।',
        source: 'NCERT जीव विज्ञान कक्षा 11',
      },
      or: {
        answer: 'ଆଲୋକ ଶ୍ଳେଷଣ ସମୀକରଣ: 6CO₂ + 6H₂O + ସୂର୍ଯ୍ୟାଲୋକ → C₆H₁₂O₆ + 6O₂।',
        details: 'ଉଦ୍ଭିଦ କ୍ଲୋରୋଫିଲ୍ ସାହାଯ୍ୟରେ ଗ୍ଲୁକୋଜ୍ ଏବଂ ଅମ୍ଳଜାନ ଉତ୍ପନ୍ନ କରେ।',
        source: 'NCERT ଜୀବ ବିଜ୍ଞାନ',
      },
    },
  },
  {
    id: 'polity-article21-0001',
    category: 'polity_civics',
    question_variants: [
      'what is article 21 of indian constitution',
      'right to life article in india',
      'article 21a right to education',
      'भारतीय संविधान का अनुच्छेद 21 क्या है',
      'जीवन का अधिकार अनुच्छेद',
      'ଅନୁଚ୍ଛେଦ ୨୧ କଣ',
    ],
    answer: 'Article 21 guarantees Protection of Life and Personal Liberty: "No person shall be deprived of his life or personal liberty except according to procedure established by law."',
    details: 'Article 21A (added by 86th Constitutional Amendment 2002) mandates free and compulsory education for all children aged 6 to 14 years as a Fundamental Right.',
    source: 'Constitution of India Part III; Supreme Court of India Landmarks (Maneka Gandhi, 1978)',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'अनुच्छेद 21: प्राण और दैहिक स्वतंत्रता का संरक्षण (विधि द्वारा स्थापित प्रक्रिया के अतिरिक्त किसी को भी उसके जीवन या स्वतंत्रता से वंचित नहीं किया जाएगा)।',
        details: 'अनुच्छेद 21A (86वां संविधान संशोधन 2002) के तहत 6 से 14 वर्ष के बच्चों को मुफ्त एवं अनिवार्य शिक्षा का मौलिक अधिकार दिया गया है।',
        source: 'भारत का संविधान भाग 3',
      },
      or: {
        answer: 'ଅନୁଚ୍ଛେଦ ୨୧: ଜୀବନ ଓ ବ୍ୟକ୍ତିଗତ ସ୍ୱାଧୀନତାର ସୁରକ୍ଷା ଅଟେ।',
        details: 'ଅନୁଚ୍ଛେଦ ୨୧A ଅନୁଯାୟୀ ୬ ରୁ ୧୪ ବର୍ଷର ଶିଶୁଙ୍କୁ ମାଗଣା ଏବଂ ବାଧ୍ୟତାମୂଳକ ଶିକ୍ଷା ମୌଳିକ ଅଧିକାର।',
        source: 'ଭାରତୀୟ ସମ୍ବିଧାନ',
      },
    },
  },
  {
    id: 'space-chandrayaan3-0001',
    category: 'general_knowledge',
    question_variants: [
      'chandrayaan 3 landing date',
      'national space day date india',
      'where did chandrayaan 3 land',
      'shiv shakti point moon',
      'चंद्रयान 3 कब लैंड हुआ था',
      'राष्ट्रीय अंतरिक्ष दिवस',
      'ଚନ୍ଦ୍ରଯାନ ୩ କେବେ ଅବତରଣ କଲା',
    ],
    answer: 'Chandrayaan-3 successfully touched down on the Moon’s South Polar region on 23 August 2023 at the "Shiv Shakti Point".',
    details: 'India became the first nation in history to land near the lunar south pole. The Government of India designated August 23 as "National Space Day".',
    source: 'Indian Space Research Organisation (ISRO); Press Information Bureau (PIB)',
    verified_on: '2026-10-12',
    valid_until: null,
    translations: {
      hi: {
        answer: 'चंद्रयान-3 ने 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव पर "शिव शक्ति पॉइंट" पर सफल सॉफ्ट लैंडिंग की।',
        details: 'भारत चंद्रमा के दक्षिणी ध्रुव पर उतरने वाला विश्व का पहला देश बना। 23 अगस्त को "राष्ट्रीय अंतरिक्ष दिवस" घोषित किया गया।',
        source: 'इसरो (ISRO), भारत सरकार',
      },
      or: {
        answer: 'ଚନ୍ଦ୍ରଯାନ-୩ ୨୩ ଅଗଷ୍ଟ ୨୦୨୩ ରେ ଚନ୍ଦ୍ରର ଦକ୍ଷିଣ ମେରୁ "ଶିବ ଶକ୍ତି ପଏଣ୍ଟ" ରେ ସଫଳ ଅବତରଣ କରିଥିଲା।',
        details: 'ଭାରତ ସରକାର ୨୩ ଅଗଷ୍ଟକୁ "ଜାତୀୟ ମହାକାଶ ଦିବସ" ଭାବରେ ଘୋଷଣା କରିଛନ୍ତି।',
        source: 'ଇସ୍ରୋ (ISRO)',
      },
    },
  },
];

export const VERIFIED_FACTS: VerifiedFact[] = [...BUILTIN_FACTS, ...ARCHIVE_GK_FACTS];

const STOP_WORDS = new Set([
  'who', 'is', 'the', 'of', 'in', 'what', 'a', 'an', 'are', 'was', 'were', 'for', 'to',
  'and', 'on', 'at', 'which', 'by', 'this', 'that', 'with', 'from', 'as', 'it'
]);

const CURRENT_KEYWORDS = ['current', 'present', 'now', 'today', 'incumbent', 'latest', 'वर्तमान', 'बर्त्तमान', 'ବର୍ତ୍ତମାନ'];
const PAST_FIRST_KEYWORDS = ['first', 'former', '1947', 'past', 'history', 'who was', 'was the', 'earliest', 'पहले', 'प्रथम', 'ପ୍ରଥମ'];

/**
 * Normalizes query string with abbreviation expansions (e.g. pm -> prime minister)
 */
function normalizeQuery(q: string): { cleanQ: string; expandedQ: string; tokens: string[] } {
  const clean = q.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').trim();
  // Expand abbreviations
  const expanded = clean
    .replace(/\bpm\b/g, 'prime minister pm')
    .replace(/\bcm\b/g, 'chief minister cm')
    .replace(/\bcji\b/g, 'chief justice of india cji');

  const tokens = expanded
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  return { cleanQ: clean, expandedQ: expanded, tokens };
}

/**
 * Smart semantic & keyword matcher with temporal contradiction guards and strict relevance scoring.
 */
export function retrieveFactsForQuery(query: string, maxResults = 3): VerifiedFact[] {
  const { cleanQ, expandedQ, tokens } = normalizeQuery(query);
  if (tokens.length === 0 && cleanQ.length < 2) return [];

  const queryIsCurrent = CURRENT_KEYWORDS.some((kw) => cleanQ.includes(kw));
  const queryIsFirst = PAST_FIRST_KEYWORDS.some((kw) => cleanQ.includes(kw));

  const scored = VERIFIED_FACTS.map((fact) => {
    let bestVariantScore = 0;

    for (const variant of fact.question_variants) {
      const { expandedQ: variantExpanded, tokens: varTokens } = normalizeQuery(variant);
      const variantClean = variant.toLowerCase().trim();

      // Check temporal contradiction
      const variantIsFirst = PAST_FIRST_KEYWORDS.some((kw) => variantClean.includes(kw));
      const variantIsCurrent = CURRENT_KEYWORDS.some((kw) => variantClean.includes(kw));

      if (queryIsCurrent && variantIsFirst) continue;
      if (queryIsFirst && variantIsCurrent) continue;

      let vScore = 0;

      // 1. Exact match
      if (cleanQ === variantClean) {
        vScore = 100;
      } 
      // 2. High-confidence phrase containment
      else if (cleanQ.length >= 8 && variantClean.length >= 8 && (cleanQ.includes(variantClean) || variantClean.includes(cleanQ))) {
        vScore = 75;
      } else if (expandedQ.length >= 8 && variantExpanded.length >= 8 && (expandedQ.includes(variantExpanded) || variantExpanded.includes(expandedQ))) {
        vScore = 65;
      } else {
        // 3. Multi-token overlap with coverage check
        const commonTokens = tokens.filter((t) => varTokens.includes(t) || variantExpanded.includes(t));
        const tokenCoverage = tokens.length > 0 ? commonTokens.length / tokens.length : 0;
        
        // Require at least 2 tokens overlap OR 100% of a short query overlaps
        if (commonTokens.length >= 2) {
          vScore = 30 + commonTokens.length * 10 * tokenCoverage;
        } else if (commonTokens.length === 1 && tokens.length === 1 && variantClean.length < 30) {
          vScore = 35;
        }
      }

      if (vScore > bestVariantScore) {
        bestVariantScore = vScore;
      }
    }

    let finalScore = bestVariantScore;
    if (bestVariantScore >= 25) {
      const allAnswers = [
        fact.answer,
        fact.details,
        fact.translations?.hi?.answer || '',
        fact.translations?.or?.answer || '',
      ]
        .join(' ')
        .toLowerCase();

      for (const token of tokens) {
        if (allAnswers.includes(token)) {
          finalScore += 2;
        }
      }
    }

    return { fact, score: finalScore };
  });

  // Strict cutoff: Score must be at least 30 to qualify as a verified RAG match!
  return scored
    .filter((s) => s.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.fact);
}

export function formatFactsBlock(facts: VerifiedFact[], lang = 'en'): string {
  if (facts.length === 0) return '';
  return facts
    .map((f, i) => {
      const loc = getLocalizedFact(f, lang);
      return `[${i + 1}] ${loc.answer} ${loc.details} (Source: ${loc.source}, verified: ${f.verified_on})`;
    })
    .join('\n');
}
