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
  {
    "id": "geography-0001",
    "category": "geography",
    "question_variants": [
      "What is the capital of Australia?",
      "Is Sydney the capital of Australia?",
      "Why is Sydney the capital of Australia?",
      "Capital of Australia"
    ],
    "answer": "The capital of Australia is Canberra.",
    "details": "Canberra is located in the Australian Capital Territory between Sydney and Melbourne. It was selected as a compromise between the two rival cities in 1908 and formally opened in 1927.",
    "source": "Geoscience Australia · Australian Government",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "science-0001",
    "category": "science",
    "question_variants": [
      "What is the chemical formula for water?",
      "Formula of water",
      "Chemical symbol of water"
    ],
    "answer": "The chemical formula for water is H2O.",
    "details": "A single molecule of water consists of two hydrogen atoms covalently bonded to one oxygen atom.",
    "source": "IUPAC Gold Book · Compendium of Chemical Terminology",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "science-0002",
    "category": "science",
    "question_variants": [
      "What is the speed of light in vacuum?",
      "Speed of light",
      "c constant value"
    ],
    "answer": "The speed of light in vacuum is exactly 299,792,458 metres per second (about 300,000 kilometres per second).",
    "details": "It is denoted by the universal physical constant 'c'. In scientific notation, it is approximately 3.00 × 10^8 m/s.",
    "source": "NIST Reference on Constants, Units, and Uncertainty (CODATA)",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "symbols-0002",
    "category": "polity_civics",
    "question_variants": [
      "Who composed the National Anthem of India?",
      "Who wrote Jana Gana Mana?",
      "Composer of Indian National Anthem"
    ],
    "answer": "Rabindranath Tagore composed 'Jana Gana Mana', the National Anthem of India.",
    "details": "It was officially adopted by the Constituent Assembly as the National Anthem on 24 January 1950. The formal playing time is approximately 52 seconds.",
    "source": "Know India Portal · National Identity Elements · Govt of India",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "geography-0002",
    "category": "geography",
    "question_variants": [
      "What is the highest mountain peak in the world?",
      "Mount Everest height",
      "Tallest mountain on Earth"
    ],
    "answer": "Mount Everest is the highest mountain peak above sea level, standing at 8,848.86 metres.",
    "details": "It is located in the Mahalangur Himal sub-range of the Himalayas on the border of Nepal and China (Tibet).",
    "source": "Survey of Nepal & Ministry of Natural Resources of China joint announcement (2020)",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "history-0001",
    "category": "history",
    "question_variants": [
      "When did India gain independence?",
      "Indian Independence Day date",
      "15 August 1947"
    ],
    "answer": "India gained independence from British rule on 15 August 1947.",
    "details": "The Indian Independence Act 1947 ended British rule. Jawaharlal Nehru became the first Prime Minister of independent India and delivered the 'Tryst with Destiny' address.",
    "source": "National Archives of India · Ministry of Culture",
    "verified_on": "2026-10-11",
    "valid_until": null
  },
  {
    "id": "demographics-0001",
    "category": "economy",
    "question_variants": [
      "What is the population of India?",
      "Current population of India",
      "Most populous country in the world"
    ],
    "answer": "India has approximately 1.4 billion people and is the most populous country in the world according to UN estimates.",
    "details": "UN DESA estimates indicated India surpassed China in population around April 2023. India's last official national census was conducted in 2011.",
    "source": "United Nations Population Fund (UNFPA) State of World Population Report",
    "verified_on": "2026-10-11",
    "valid_until": "2027-01-01"
  },
  {
    "id": "physics-thermo-0001",
    "category": "physics_science",
    "question_variants": [
      "What is the first law of thermodynamics?",
      "First law of thermodynamics formula",
      "Conservation of energy in thermodynamics",
      "Delta U = Q - W",
      "ऊष्मागतिकी का प्रथम नियम",
      "थर्मोडायनामिक्स का पहला नियम"
    ],
    "answer": "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed: the change in internal energy (ΔU) of a closed system equals heat added (Q) minus work done by the system (W), expressed as ΔU = Q - W.",
    "details": "It is an adaptation of the universal Law of Conservation of Energy for thermodynamic systems. It establishes that internal energy is a state function.",
    "source": "NCERT Physics Class 11 Chapter 12; Halliday & Resnick Fundamentals of Physics",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "physics-thermo-0002",
    "category": "physics_science",
    "question_variants": [
      "What is the second law of thermodynamics?",
      "Second law of thermodynamics",
      "What is entropy in thermodynamics?",
      "Clausius and Kelvin Planck statements",
      "ऊष्मागतिकी का द्वितीय नियम"
    ],
    "answer": "The Second Law of Thermodynamics states that the total entropy of an isolated system always increases over time (ΔS ≥ 0), and heat cannot spontaneously flow from a colder body to a hotter body without external work.",
    "details": "Formulated via the Kelvin-Planck statement (no heat engine can achieve 100% thermal efficiency, η < 1) and Clausius statement (heat cannot spontaneously flow from cold to hot). Carnot cycle efficiency is η = 1 - (Tc/Th).",
    "source": "NCERT Physics Class 11 Chapter 12; Feynman Lectures on Physics Vol 1",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "physics-optics-0001",
    "category": "physics_science",
    "question_variants": [
      "What is Snell's law of refraction?",
      "Snell's law formula",
      "Law of refraction of light",
      "n1 sin theta1 = n2 sin theta2",
      "स्नेल का नियम क्या है",
      "प्रकाश के अपवर्तन का नियम"
    ],
    "answer": "Snell's Law states that the ratio of the sine of the angle of incidence (θ1) to the sine of the angle of refraction (θ2) is equal to the ratio of refractive indices: n1 * sin(θ1) = n2 * sin(θ2).",
    "details": "Named after Willebrord Snellius (1621). It governs the bending of light at the boundary between two isotropic media with different optical densities and determines the critical angle for total internal reflection: sin(θc) = n2 / n1.",
    "source": "NCERT Physics Class 12 Chapter 9; Optics by Eugene Hecht",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "physics-em-0001",
    "category": "physics_science",
    "question_variants": [
      "What is Coulomb's law?",
      "Coulomb's law formula for electrostatic force",
      "Electrostatic force between two charges",
      "F = k q1 q2 / r^2",
      "कूलॉम का नियम क्या है"
    ],
    "answer": "Coulomb's Law states that the electrostatic force of attraction or repulsion between two point electric charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them: F = (1 / 4πε₀) * (|q1 * q2| / r²).",
    "details": "Formulated by Charles-Augustin de Coulomb in 1785. The electrostatic constant k = 1 / (4πε₀) is approximately 8.98755 × 10⁹ N·m²/C² in vacuum.",
    "source": "NCERT Physics Class 12 Chapter 1; CODATA Recommended Values",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "physics-em-0002",
    "category": "physics_science",
    "question_variants": [
      "What is Faraday's law of electromagnetic induction?",
      "Faraday's law and Lenz's law",
      "Electromagnetic induction formula",
      "Induced emf formula",
      "फैराडे का विद्युत चुम्बकीय प्रेरण का नियम"
    ],
    "answer": "Faraday's Law of Electromagnetic Induction states that the magnitude of induced electromotive force (EMF) in a circuit is directly proportional to the time rate of change of magnetic flux through the circuit: ε = -N * (dΦB / dt).",
    "details": "The negative sign represents Lenz's Law (conservation of energy), stating that the direction of the induced current always opposes the change in magnetic flux that produced it.",
    "source": "NCERT Physics Class 12 Chapter 6; Griffiths Introduction to Electrodynamics",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "physics-modern-0001",
    "category": "physics_science",
    "question_variants": [
      "What is the photoelectric effect?",
      "Einstein's photoelectric equation",
      "Threshold frequency and work function",
      "E = h nu = phi + KE_max",
      "प्रकाश वैद्युत प्रभाव क्या है"
    ],
    "answer": "The Photoelectric Effect is the emission of electrons from a metallic surface when electromagnetic radiation of frequency greater than a threshold frequency (ν₀) strikes it, governed by Einstein's equation: hν = Φ + KE_max, where Φ is the metal's work function.",
    "details": "Albert Einstein won the 1921 Nobel Prize in Physics for explaining this phenomenon in 1905, establishing the particle nature of light (photons) with energy E = hν, where h is Planck's constant (6.626 × 10⁻³⁴ J·s).",
    "source": "NCERT Physics Class 12 Chapter 11; Nobel Prize in Physics 1921 Citation",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "chem-gas-0001",
    "category": "chemistry",
    "question_variants": [
      "What is the ideal gas equation?",
      "Ideal gas law formula",
      "PV = nRT explanation",
      "Universal gas constant R value",
      "आदर्श गैस समीकरण क्या है"
    ],
    "answer": "The Ideal Gas Law is the equation of state for a hypothetical ideal gas: PV = nRT, where P is pressure, V is volume, n is moles of gas, R is the universal gas constant (8.314 J/(mol·K)), and T is absolute temperature in Kelvin.",
    "details": "It synthesizes Boyle's Law (P ∝ 1/V), Charles's Law (V ∝ T), and Avogadro's Law (V ∝ n). Real gases deviate at high pressures and low temperatures, described by the van der Waals equation.",
    "source": "NCERT Chemistry Class 11 Chapter 5; IUPAC Quantities, Units and Symbols",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "chem-thermo-0001",
    "category": "chemistry",
    "question_variants": [
      "What is Le Chatelier's principle?",
      "Le Chatelier's principle definition and examples",
      "Chemical equilibrium shift with temperature and pressure",
      "ला शातेलिए का सिद्धांत क्या है"
    ],
    "answer": "Le Chatelier's Principle states that when a chemical system at equilibrium is subjected to a disturbance in temperature, pressure, or concentration, the system shifts its equilibrium position in the direction that counteracts the change.",
    "details": "Formulated by Henri Louis Le Chatelier in 1884. For example, in an exothermic reaction (ΔH < 0), increasing temperature shifts the equilibrium towards the reactants (endothermic direction).",
    "source": "NCERT Chemistry Class 11 Chapter 7; Physical Chemistry by Atkins",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "chem-thermo-0002",
    "category": "chemistry",
    "question_variants": [
      "What is Gibbs free energy formula?",
      "Gibbs free energy and reaction spontaneity",
      "Delta G = Delta H - T Delta S",
      "Conditions for spontaneous chemical reaction",
      "गिब्स मुक्त ऊर्जा समीकरण"
    ],
    "answer": "Gibbs Free Energy is given by ΔG = ΔH - TΔS, where ΔH is change in enthalpy, T is temperature in Kelvin, and ΔS is change in entropy; a reaction is thermodynamically spontaneous at constant T and P when ΔG < 0.",
    "details": "If ΔG = 0, the system is in dynamic equilibrium. If ΔG > 0, the reaction is non-spontaneous in the forward direction. Named after American physicist Josiah Willard Gibbs.",
    "source": "NCERT Chemistry Class 11 Chapter 6; IUPAC Gold Book",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "chem-periodic-0001",
    "category": "chemistry",
    "question_variants": [
      "What are periodic table trends?",
      "Electronegativity trend across periodic table",
      "Ionization energy and atomic radius trends",
      "आवर्त सारणी के आवर्ती गुण क्या हैं"
    ],
    "answer": "In the modern periodic table: Electronegativity and Ionization Energy increase from left to right across a period and decrease down a group; Atomic Radius decreases across a period (due to increasing effective nuclear charge Z_eff) and increases down a group.",
    "details": "Fluorine is the most electronegative element (Pauling scale 3.98). Francium/Cesium have the lowest ionization energies. The table organizes elements by atomic number Z per Moseley's Law.",
    "source": "NCERT Chemistry Class 11 Chapter 3; Royal Society of Chemistry Periodic Table",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "chem-acidbase-0001",
    "category": "chemistry",
    "question_variants": [
      "What is pH and how is it calculated?",
      "pH formula",
      "Definition of acids and bases Bronsted Lewis",
      "pH scale range",
      "pH मान का सूत्र और परिभाषा"
    ],
    "answer": "pH is the negative logarithm (base 10) of hydrogen ion activity: pH = -log₁₀[H⁺]. On the standard scale at 25°C: pH < 7 is acidic, pH = 7 is neutral (pure water, [H⁺] = 10⁻⁷ M), and pH > 7 is basic/alkaline.",
    "details": "Introduced by Danish biochemist Søren Sørensen in 1909. Brønsted-Lowry defines acids as proton (H⁺) donors; Lewis defines acids as electron-pair acceptors.",
    "source": "NCERT Chemistry Class 11 Chapter 7; IUPAC Compendium of Analytical Nomenclature",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "math-calc-0001",
    "category": "mathematics",
    "question_variants": [
      "What is the fundamental theorem of calculus?",
      "Fundamental theorem of calculus part 1 and part 2",
      "Relationship between derivative and integral",
      "कलन का मूलभूत प्रमेय"
    ],
    "answer": "The Fundamental Theorem of Calculus connects differentiation and integration: Part 1 states that if f is continuous on [a,b] and F(x) = ∫[a to x] f(t)dt, then F'(x) = f(x); Part 2 states that ∫[a to b] f(x)dx = F(b) - F(a), where F is any antiderivative of f.",
    "details": "Developed independently by Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th century, showing that integration and differentiation are inverse operations.",
    "source": "NCERT Mathematics Class 12 Chapter 7; Stewart Calculus 8th Edition",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "math-calc-0002",
    "category": "mathematics",
    "question_variants": [
      "What are the derivative rules in calculus?",
      "Power rule product rule quotient rule chain rule",
      "Calculus differentiation formulas",
      "अवकलन के प्रमुख सूत्र"
    ],
    "answer": "Key calculus differentiation rules: Power Rule: d/dx(x^n) = n*x^(n-1); Product Rule: (u*v)' = u'*v + u*v'; Quotient Rule: (u/v)' = (u'*v - u*v') / v²; Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x).",
    "details": "The derivative represents the instantaneous rate of change of a function, defined formally as f'(x) = lim[h→0] (f(x+h) - f(x)) / h.",
    "source": "NCERT Mathematics Class 12 Chapter 5; Thomas' Calculus",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "math-quad-0001",
    "category": "mathematics",
    "question_variants": [
      "What is the quadratic formula?",
      "Roots of quadratic equation ax^2 + bx + c = 0",
      "Discriminant formula for quadratic equation",
      "द्विघात समीकरण का सूत्र श्रीधराचार्य नियम"
    ],
    "answer": "The roots of a standard quadratic equation ax² + bx + c = 0 (where a ≠ 0) are given by the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a), with discriminant Δ = b² - 4ac.",
    "details": "Discriminant nature of roots: If Δ > 0, two distinct real roots exist; if Δ = 0, exactly one real repeated root exists (x = -b / (2a)); if Δ < 0, two complex conjugate roots exist. In India, historically formulated by ancient mathematician Sridhara (Sridharacharya's rule).",
    "source": "NCERT Mathematics Class 10 Chapter 4; Hall & Knight Higher Algebra",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "math-matrix-0001",
    "category": "mathematics",
    "question_variants": [
      "What is an eigenvalue and eigenvector?",
      "Characteristic equation of matrix det(A - lambda I) = 0",
      "Eigenvalues definition in linear algebra",
      "आइगेन मान और आइगेन वेक्टर क्या हैं"
    ],
    "answer": "In linear algebra, an eigenvector of a square matrix A is a non-zero vector v such that multiplying A by v yields a scalar multiple of v: A*v = λ*v, where scalar λ is the corresponding eigenvalue.",
    "details": "Eigenvalues are found by solving the characteristic polynomial det(A - λI) = 0, where I is the identity matrix. They are foundational in quantum mechanics, PCA dimensionality reduction, and dynamic stability analysis.",
    "source": "NCERT Mathematics Class 12 Chapter 4; Gilbert Strang Linear Algebra and Its Applications",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "math-prob-0001",
    "category": "mathematics",
    "question_variants": [
      "What is Bayes' theorem?",
      "Bayes theorem formula conditional probability",
      "P(A|B) = P(B|A) P(A) / P(B)",
      "बेयस प्रमेय क्या है"
    ],
    "answer": "Bayes' Theorem calculates conditional probability: P(A|B) = [P(B|A) * P(A)] / P(B), where P(A|B) is the posterior probability of event A given evidence B, P(A) is prior probability, and P(B|A) is the likelihood.",
    "details": "Named after English statistician Thomas Bayes (1763). Under the Law of Total Probability, P(B) = ∑ P(B|Ai) * P(Ai). It forms the mathematical foundation of Bayesian machine learning, medical diagnostic testing, and spam filtering.",
    "source": "NCERT Mathematics Class 12 Chapter 13; Sheldon Ross A First Course in Probability",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "bio-cell-0001",
    "category": "biology",
    "question_variants": [
      "What is the powerhouse of the cell?",
      "Mitochondria function in cell",
      "Where is ATP produced in eukaryotic cells?",
      "कोशिका का पावरहाउस किसे कहते हैं",
      "माइटोकॉन्ड्रिया का कार्य क्या है"
    ],
    "answer": "Mitochondria are the 'powerhouse of the cell' because they generate most of the chemical energy required for cellular processes in the form of Adenosine Triphosphate (ATP) via oxidative phosphorylation and the Krebs cycle.",
    "details": "Mitochondria are double-membrane organelles containing their own circular mitochondrial DNA (mtDNA) and 70S ribosomes, supporting the endosymbiotic theory of eukaryotic evolution.",
    "source": "NCERT Biology Class 11 Chapter 8; Campbell Biology 12th Edition",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "bio-photosyn-0001",
    "category": "biology",
    "question_variants": [
      "What is photosynthesis equation and stages?",
      "Chemical equation of photosynthesis",
      "Light reaction and Calvin cycle difference",
      "प्रकाश संश्लेषण की रासायनिक समीकरण और क्रियाविधि"
    ],
    "answer": "Photosynthesis converts light energy into chemical energy: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. It occurs in two stages: Light-dependent reactions (in chloroplast thylakoids, photolysis of water producing ATP and NADPH) and the Calvin cycle (in stroma, CO₂ fixation by RuBisCO into glucose).",
    "details": "Chlorophyll-a is the primary photosynthetic pigment absorbing blue and red wavelengths while reflecting green. Oxygen released during photosynthesis originates exclusively from the photolysis of water.",
    "source": "NCERT Biology Class 11 Chapter 13; Lehninger Principles of Biochemistry",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "bio-genetics-0001",
    "category": "biology",
    "question_variants": [
      "What is the central dogma of molecular biology?",
      "Central dogma DNA to RNA to protein",
      "Transcription and translation explanation",
      "आणविक जीव विज्ञान का केंद्रीय सिद्धांत सेंट्रल डोग्मा"
    ],
    "answer": "The Central Dogma of Molecular Biology states that genetic information flows in one direction: DNA is transcribed into messenger RNA (mRNA) in the nucleus, which is then translated into functional proteins by ribosomes in the cytoplasm: DNA → RNA → Protein.",
    "details": "Proposed by Francis Crick in 1958. Reverse transcription (RNA → DNA) observed in retroviruses (like HIV via reverse transcriptase) is a recognized specialized modification to the dogma.",
    "source": "NCERT Biology Class 12 Chapter 6; Nature (Crick, 1970)",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "cs-ml-0001",
    "category": "computer_science",
    "question_variants": [
      "What is overfitting and underfitting in machine learning?",
      "Overfitting vs underfitting difference",
      "How to prevent overfitting and underfitting",
      "Bias variance tradeoff in ML",
      "मशीन लर्निंग में ओवरफिटिंग और अंडरफिटिंग क्या है"
    ],
    "answer": "In Machine Learning: Underfitting (High Bias) occurs when a model is too simple to capture the underlying patterns, performing poorly on both training and test data; Overfitting (High Variance) occurs when a model memorizes training noise and outliers, performing exceptionally on training data but generalizing poorly to unseen test data.",
    "details": "To prevent underfitting: increase model capacity, add relevant features, reduce regularization. To prevent overfitting: use L1/L2 regularization, dropout, cross-validation (k-fold), early stopping, prune decision trees, and gather diverse, balanced training data.",
    "source": "Goodfellow et al. Deep Learning (MIT Press); Christopher Bishop Pattern Recognition and Machine Learning",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "cs-algo-0001",
    "category": "computer_science",
    "question_variants": [
      "What is Big-O notation?",
      "Big O time complexity of sorting algorithms",
      "Asymptotic analysis Big O definition",
      "बड़ा ओ नोटेशन और एल्गोरिथम कॉम्प्लेक्सिटी क्या है"
    ],
    "answer": "Big-O Notation describes the upper bound asymptotic time or space complexity of an algorithm as input size n grows to infinity: O(1) constant, O(log n) logarithmic (e.g. binary search), O(n) linear, O(n log n) linearithmic (e.g. mergesort, heapsort), and O(n²) quadratic (e.g. bubble sort).",
    "details": "Formal mathematical definition: f(n) = O(g(n)) if there exist positive constants c and n₀ such that 0 ≤ f(n) ≤ c * g(n) for all n ≥ n₀. It focuses on growth rate while ignoring constant multiplicative factors.",
    "source": "Cormen, Leiserson, Rivest, Stein (CLRS) Introduction to Algorithms 4th Edition",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "cs-algo-0002",
    "category": "computer_science",
    "question_variants": [
      "What is Dijkstra's algorithm?",
      "Dijkstra's shortest path algorithm",
      "Time complexity of Dijkstra algorithm",
      "डिजक्स्ट्रा एल्गोरिदम क्या है"
    ],
    "answer": "Dijkstra's Algorithm is a greedy graph search algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.",
    "details": "Conceived by Edsger W. Dijkstra in 1956. With a min-priority queue (Fibonacci heap), its time complexity is O(|E| + |V| log |V|). It does not work on graphs with negative weight edges, for which Bellman-Ford algorithm is used.",
    "source": "CLRS Introduction to Algorithms Chapter 24; Communications of the ACM",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "polity-rights-0001",
    "category": "polity_civics",
    "question_variants": [
      "What are the Fundamental Rights in Indian Constitution?",
      "Fundamental Rights Articles 12 to 35",
      "Which article is called heart and soul of Indian Constitution?",
      "Article 32 constitutional remedies",
      "भारतीय संविधान के मौलिक अधिकार कौन से हैं",
      "संविधान की आत्मा अनुच्छेद 32"
    ],
    "answer": "Part III (Articles 12-35) of the Constitution of India guarantees 6 Fundamental Rights: 1) Right to Equality (14-18), 2) Right to Freedom (19-22), 3) Right against Exploitation (23-24), 4) Right to Freedom of Religion (25-28), 5) Cultural and Educational Rights (29-30), and 6) Right to Constitutional Remedies (Article 32).",
    "details": "Dr. B.R. Ambedkar famously called Article 32 the 'heart and soul of the Constitution' because it empowers citizens to petition the Supreme Court directly via prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) to enforce their fundamental rights.",
    "source": "Constitution of India Part III; Supreme Court of India Historical Rulings; NCERT Civics Class 11",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "polity-basic-0001",
    "category": "polity_civics",
    "question_variants": [
      "What is the basic structure doctrine of Indian Constitution?",
      "Kesavananda Bharati case 1973 summary",
      "Can Parliament amend fundamental rights basic structure?",
      "मूल संरचना सिद्धांत और केशवानंद भारती केस 1973"
    ],
    "answer": "The Basic Structure Doctrine, established by a landmark 13-judge constitutional bench of the Supreme Court of India in Kesavananda Bharati v. State of Kerala (24 April 1973), holds that while Parliament has wide power to amend the Constitution under Article 368, it cannot alter or destroy its 'basic structure'.",
    "details": "Basic features recognized include the supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers, judicial review, and federalism.",
    "source": "Supreme Court of India AIR 1973 SC 1461; Ministry of Law and Justice",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "history-ivc-0001",
    "category": "history",
    "question_variants": [
      "What is the Indus Valley Civilization?",
      "Harappa and Mohenjo-daro features",
      "Features of Indus Valley Civilization Great Bath town planning",
      "सिंधु घाटी सभ्यता की प्रमुख विशेषताएं"
    ],
    "answer": "The Indus Valley Civilization (mature period c. 2600-1900 BCE) was a Bronze Age civilization in northwestern South Asia noted for advanced urban grid town planning, baked brick architecture, covered drainage systems, the Great Bath at Mohenjo-daro, standard weights and measures, and undeciphered script.",
    "details": "Major archaeological sites include Harappa (excavated 1921 by Daya Ram Sahni), Mohenjo-daro (1922 by R.D. Banerji), Lothal (dockyard in Gujarat), Kalibangan (ploughed field), and Dholavira (UNESCO World Heritage water management system).",
    "source": "Archaeological Survey of India (ASI); NCERT History Class 12 Chapter 1",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "history-maurya-0001",
    "category": "history",
    "question_variants": [
      "Who founded the Mauryan Empire and who was Ashoka?",
      "Chandragupta Maurya and Chanakya Arthashastra",
      "Kalinga War date 261 BCE and Ashoka edicts",
      "मौर्य साम्राज्य के संस्थापक और सम्राट अशोक कलिंग युद्ध"
    ],
    "answer": "The Mauryan Empire was founded in 322 BCE by Chandragupta Maurya with guidance from his prime minister Chanakya (Kautilya, author of the Arthashastra). His grandson Emperor Ashoka the Great embraced Buddhism and the philosophy of Dhamma following the devastating Kalinga War in 261 BCE.",
    "details": "Ashoka inscribed edicts in Prakrit (Brahmi script), Greek, and Aramaic on rock faces and pillars across the subcontinent. The Lion Capital of Ashoka at Sarnath was adopted as the State Emblem of India in 1950.",
    "source": "NCERT History Class 12 Chapter 2; Archaeological Survey of India",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "history-freedom-0001",
    "category": "history",
    "question_variants": [
      "What was the Dandi March Salt Satyagraha?",
      "Dandi March date 1930 Gandhi",
      "Civil Disobedience Movement Salt March",
      "दांडी यात्रा नमक सत्याग्रह 1930 गांधी जी"
    ],
    "answer": "The Dandi March (Salt Satyagraha) was a nonviolent civil disobedience campaign led by Mahatma Gandhi from 12 March to 6 April 1930, marching 240 miles (385 km) from Sabarmati Ashram to the coastal village of Dandi, Gujarat to produce salt from seawater in defiance of the British salt monopoly.",
    "details": "It initiated the nationwide Civil Disobedience Movement, leading to widespread mass protests, the boycott of foreign goods, and the Gandhi-Irwin Pact of March 1931.",
    "source": "National Gandhi Museum; NCERT History Class 12 Chapter 13",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "geo-atmos-0001",
    "category": "geography",
    "question_variants": [
      "What are the layers of Earth's atmosphere?",
      "Atmosphere layers in order from ground up",
      "Where is the ozone layer located?",
      "Troposphere stratosphere mesosphere thermosphere",
      "वायुमंडल की परतें क्षोभमंडल समतापमंडल"
    ],
    "answer": "Earth's atmosphere consists of five primary layers in ascending order: 1) Troposphere (0-12 km, where weather occurs), 2) Stratosphere (12-50 km, contains the protective Ozone Layer absorbing UV radiation), 3) Mesosphere (50-85 km, where meteors burn up), 4) Thermosphere (85-600 km, contains the Ionosphere and Auroras), and 5) Exosphere (600+ km, merges with outer space).",
    "details": "Nitrogen makes up approximately 78% of dry air, Oxygen 21%, Argon 0.93%, and Carbon Dioxide 0.04% along with trace gases.",
    "source": "NASA Earth Observatory; NCERT Geography Class 11 Chapter 8",
    "verified_on": "2026-10-13",
    "valid_until": null
  },
  {
    "id": "geo-rivers-0001",
    "category": "geography",
    "question_variants": [
      "What are the major river systems of India?",
      "Difference between Himalayan and Peninsular rivers of India",
      "Ganga Indus Brahmaputra Godavari origin",
      "भारत की प्रमुख नदियां और उनके उद्गम"
    ],
    "answer": "India's drainage system is divided into: 1) Himalayan Rivers (Ganga, Indus, Brahmaputra) which are perennial, fed by both snowmelt glaciers and rainfall; and 2) Peninsular Rivers (Godavari, Krishna, Cauvery, Mahanadi, Narmada, Tapti) which are seasonal and rain-fed.",
    "details": "The Ganga originates from the Gangotri Glacier at Gaumukh as the Bhagirathi and is the longest river in India (2,525 km). The Godavari is the longest Peninsular river (1,465 km), often termed 'Dakshin Ganga'. Narmada and Tapti flow west into the Arabian Sea through rift valleys.",
    "source": "Survey of India; Central Water Commission; NCERT Geography Class 9 Chapter 3",
    "verified_on": "2026-10-13",
    "valid_until": null
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
