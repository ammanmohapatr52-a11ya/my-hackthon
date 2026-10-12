/**
 * AI-Powered Flashcard Generator & Ready-to-Use Academic Card Library
 * Gives diverse learners zero-effort instant flashcard creation without manual typing.
 */

import { getSetting } from '../storage/settingsStore';
import { DEFAULT_OPENROUTER_KEY, DEFAULT_OPENROUTER_MODEL } from '../ai/llmClient';

export interface PreMadeCard {
  id: string;
  category: string;
  subjectIcon: string;
  front: string;
  back: string;
  language: 'en' | 'hi' | 'or';
}

export const READY_FLASHCARD_LIBRARY: PreMadeCard[] = [
  // Physics (English, Hindi, Odia)
  {
    id: 'phy-1',
    category: 'Physics',
    subjectIcon: '⚡',
    front: "What is Newton's Second Law of Motion?",
    back: "Force = mass × acceleration (F = m · a). The acceleration of an object depends directly upon the net force and inversely upon mass.",
    language: 'en',
  },
  {
    id: 'phy-2',
    category: 'Physics',
    subjectIcon: '⚡',
    front: "What is the principle of Conservation of Energy?",
    back: "Energy can neither be created nor destroyed; it can only transform from one form to another. Total energy remains constant.",
    language: 'en',
  },
  {
    id: 'phy-3',
    category: 'Physics',
    subjectIcon: '⚡',
    front: "ନିଉଟନଙ୍କ ଗତିର ଦ୍ୱିତୀୟ ନିୟମ କ'ଣ?",
    back: "ବଳ = ବସ୍ତୁତ୍ୱ × ତ୍ୱରଣ (F = m · a)। ବସ୍ତୁ ଉପରେ ପ୍ରୟୋଗ କରାଯାଇଥିବା ବଳ ଏହାର ସଂବେଗ ପରିବର୍ତ୍ତନର ହାର ସହିତ ସମାନୁପାତୀ।",
    language: 'or',
  },
  {
    id: 'phy-4',
    category: 'Physics',
    subjectIcon: '⚡',
    front: "न्यूटन का गति का दूसरा नियम क्या है?",
    back: "बल = द्रव्यमान × त्वरण (F = m · a)। किसी वस्तु पर लगाया गया बल उसके संवेग परिवर्तन की दर के समानुपाती होता है।",
    language: 'hi',
  },

  // Chemistry (English, Hindi, Odia)
  {
    id: 'chem-1',
    category: 'Chemistry',
    subjectIcon: '🧪',
    front: "What is Avogadro's Number and what does it represent?",
    back: "6.022 × 10²³ mol⁻¹. It represents the number of constituent particles (atoms, molecules, or ions) in one mole of a substance.",
    language: 'en',
  },
  {
    id: 'chem-2',
    category: 'Chemistry',
    subjectIcon: '🧪',
    front: "What is the difference between an Acid and a Base according to Arrhenius?",
    back: "Acids produce hydrogen ions (H⁺) in water, while Bases produce hydroxide ions (OH⁻) in aqueous solution.",
    language: 'en',
  },
  {
    id: 'chem-3',
    category: 'Chemistry',
    subjectIcon: '🧪',
    front: "ଅମ୍ଳ ଏବଂ କ୍ଷାର ମଧ୍ୟରେ ମୁଖ୍ୟ ପାର୍ଥକ୍ୟ କ'ଣ?",
    back: "ଅମ୍ଳ ଜଳୀୟ ଦ୍ରବଣରେ H⁺ ଆୟନ ଦିଏ (pH < 7), ଏବଂ କ୍ଷାର ଜଳୀୟ ଦ୍ରବଣରେ OH⁻ ଆୟନ ଦିଏ (pH > 7)।",
    language: 'or',
  },
  {
    id: 'chem-4',
    category: 'Chemistry',
    subjectIcon: '🧪',
    front: "अम्ल और क्षार में क्या अंतर है?",
    back: "अम्ल जलीय विलयन में H⁺ आयन देते हैं (pH < 7), जबकि क्षार जलीय विलयन में OH⁻ आयन देते हैं (pH > 7)।",
    language: 'hi',
  },

  // Mathematics (English, Hindi, Odia)
  {
    id: 'math-1',
    category: 'Mathematics',
    subjectIcon: '📐',
    front: "What is the Quadratic Formula for ax² + bx + c = 0?",
    back: "x = (-b ± √(b² - 4ac)) / (2a). The discriminant Δ = b² - 4ac determines nature of roots.",
    language: 'en',
  },
  {
    id: 'math-2',
    category: 'Mathematics',
    subjectIcon: '📐',
    front: "State the Pythagorean Theorem.",
    back: "In any right-angled triangle, hypotenuse² = base² + perpendicular² (a² + b² = c²).",
    language: 'en',
  },
  {
    id: 'math-3',
    category: 'Mathematics',
    subjectIcon: '📐',
    front: "ପିଥାଗୋରାସ୍ ଉପପାଦ୍ୟ କ'ଣ?",
    back: "ଏକ ସମକୋଣୀ ତ୍ରିଭୁଜରେ, କର୍ଣ୍ଣ² = ଭୂମି² + ଲମ୍ବ² (c² = a² + b²)।",
    language: 'or',
  },
  {
    id: 'math-4',
    category: 'Mathematics',
    subjectIcon: '📐',
    front: "पाइथागोरस प्रमेय क्या है?",
    back: "किसी समकोण त्रिभुज में: कर्ण² = आधार² + लम्ब² (c² = a² + b²)।",
    language: 'hi',
  },

  // Biology (English, Hindi, Odia)
  {
    id: 'bio-1',
    category: 'Biology',
    subjectIcon: '🧬',
    front: "Why is Mitochondria known as the Powerhouse of the Cell?",
    back: "Because it produces adenosine triphosphate (ATP), the primary cellular energy currency, through aerobic cellular respiration.",
    language: 'en',
  },
  {
    id: 'bio-2',
    category: 'Biology',
    subjectIcon: '🧬',
    front: "କୋଷର ଶକ୍ତି କେନ୍ଦ୍ର (Powerhouse) କାହାକୁ କୁହାଯାଏ ଏବଂ କାହିଁକି?",
    back: "ମାଇଟୋକଣ୍ଡ୍ରିଆ (Mitochondria)। ଏହା କୋଷୀୟ ଶ୍ୱସନ ମାଧ୍ୟମରେ ATP ଶକ୍ତି ଉତ୍ପନ୍ନ କରୁଥିବାରୁ ଏହାକୁ ଶକ୍ତି କେନ୍ଦ୍ର କୁହାଯାଏ।",
    language: 'or',
  },
  {
    id: 'bio-3',
    category: 'Biology',
    subjectIcon: '🧬',
    front: "कोशिका का ऊर्जा गृह (पावरहाउस) किसे कहते हैं?",
    back: "माइटोकॉन्ड्रिया (Mitochondria)। यह कोशिकीय श्वसन द्वारा ATP के रूप में ऊर्जा उत्पन्न करता है।",
    language: 'hi',
  },

  // Computer Science (English, Hindi, Odia)
  {
    id: 'cs-1',
    category: 'Computer Science',
    subjectIcon: '💻',
    front: "What is the difference between RAM and ROM?",
    back: "RAM is volatile, high-speed read/write working memory. ROM is non-volatile permanent memory used for firmware/BIOS boot instructions.",
    language: 'en',
  },
  {
    id: 'cs-2',
    category: 'Computer Science',
    subjectIcon: '💻',
    front: "What is Binary Search and its time complexity?",
    back: "An efficient search algorithm on sorted lists dividing the interval in half repeatedly. Time complexity is O(log n).",
    language: 'en',
  },
  {
    id: 'cs-3',
    category: 'Computer Science',
    subjectIcon: '💻',
    front: "RAM ଏବଂ ROM ମଧ୍ୟରେ ପାର୍ଥକ୍ୟ କ'ଣ?",
    back: "RAM ହେଉଛି ଅସ୍ଥାୟୀ (volatile) କାର୍ଯ୍ୟକାରୀ ମେମୋରୀ। ROM ହେଉଛି ସ୍ଥାୟୀ (non-volatile) ମେମୋରୀ ଯାହା ବୁଟ୍ ନିର୍ଦ୍ଦେଶ ସଂରକ୍ଷଣ କରେ।",
    language: 'or',
  },

  // History & Geography (English, Hindi, Odia)
  {
    id: 'hist-1',
    category: 'History',
    subjectIcon: '📜',
    front: "When was the Constitution of India adopted and enacted?",
    back: "Adopted by the Constituent Assembly on November 26, 1949, and came into full legal effect on January 26, 1950 (Republic Day).",
    language: 'en',
  },
  {
    id: 'geo-1',
    category: 'Geography',
    subjectIcon: '🌍',
    front: "What is the Mariana Trench and where is it located?",
    back: "The deepest oceanic trench on Earth (Challenger Deep ~10,994 m), located in the western Pacific Ocean.",
    language: 'en',
  },
  {
    id: 'gk-1',
    category: 'General Knowledge',
    subjectIcon: '🧠',
    front: "Which planet is known as the Red Planet and why?",
    back: "Mars. Its surface appears red because of the abundance of iron oxide (rust) in its soil and atmosphere.",
    language: 'en',
  },
  {
    id: 'gk-2',
    category: 'General Knowledge',
    subjectIcon: '🧠',
    front: "କେଉଁ ଗ୍ରହକୁ ଲାଲ ଗ୍ରହ କୁହାଯାଏ ଏବଂ କାହିଁକି?",
    back: "ମଙ୍ଗଳ ଗ୍ରହ (Mars)। ଏହାର ପୃଷ୍ଠଭାଗରେ ପ୍ରଚୁର ପରିମାଣରେ ଆଇରନ ଅକ୍ସାଇଡ୍ (ଲୁହା କଳଙ୍କି) ଥିବାରୁ ଏହା ଲାଲ୍ ଦେଖାଯାଏ।",
    language: 'or',
  },
  {
    id: 'gk-3',
    category: 'General Knowledge',
    subjectIcon: '🧠',
    front: "सौरमंडल का लाल ग्रह किसे कहा जाता है?",
    back: "मंगल ग्रह (Mars)। इसकी सतह पर भारी मात्रा में आयरन ऑक्साइड (लोहे का जंग) होने के कारण यह लाल दिखता है।",
    language: 'hi',
  },
];

/**
 * AI Flashcard Question & Answer Generator
 * Generates front and back automatically without manual typing.
 */
export async function generateFlashcardWithAI(
  subject: string,
  topicKeyword = '',
  language: 'en' | 'hi' | 'or' = 'en'
): Promise<{ front: string; back: string }> {
  const cleanSubject = subject.trim() || 'General Science';
  const cleanTopic = topicKeyword.trim();

  // Try calling AI LLM service if API configured
  try {
    const apiKey = (await getSetting<string>('openRouterApiKey', DEFAULT_OPENROUTER_KEY)) || DEFAULT_OPENROUTER_KEY;
    const model = (await getSetting<string>('openRouterModel', DEFAULT_OPENROUTER_MODEL)) || DEFAULT_OPENROUTER_MODEL;

    const langInstruction =
      language === 'or'
        ? 'Compose strictly in natural ODIA (ଓଡ଼ିଆ) language using Odia script.'
        : language === 'hi'
        ? 'Compose strictly in natural HINDI (हिन्दी) language using Devanagari script.'
        : 'Compose in clear, standard English.';

    const prompt = `You are an expert academic tutor. Create 1 high-yield, exam-worthy study flashcard for the subject "${cleanSubject}" ${
      cleanTopic ? `specifically about topic: "${cleanTopic}"` : ''
    }.
${langInstruction}

Return ONLY a valid JSON object matching this structure:
{
  "front": "A clear, concise test question or concept prompt",
  "back": "A precise, accurate 1-2 sentence verified answer or formula explanation"
}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://neurobridge.edu',
        'X-Title': 'Neurobridge Flashcard Generator',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.front && parsed.back) {
          return { front: parsed.front.trim(), back: parsed.back.trim() };
        }
      }
    }
  } catch (err) {
    console.warn('Online flashcard generation fallback to local synthesis:', err);
  }

  // Instant High-Quality Academic Fallback
  const matchingFromLibrary = READY_FLASHCARD_LIBRARY.find(
    (c) =>
      c.language === language &&
      c.category.toLowerCase().includes(cleanSubject.toLowerCase())
  );

  if (matchingFromLibrary) {
    return { front: matchingFromLibrary.front, back: matchingFromLibrary.back };
  }

  // Generalized multilingual template fallback
  if (language === 'or') {
    return {
      front: `${cleanSubject} ର ମୁଖ୍ୟ ସୂତ୍ର ଏବଂ ମୌଳିକ ନିୟମ କ'ଣ?`,
      back: `${cleanSubject} ଶୈକ୍ଷିକ ବିଷୟର ମୁଖ୍ୟ ଧାରଣା ଏବଂ ନିୟମ ସତ୍ୟାପିତ ଭାବେ ଅଧ୍ୟୟନ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ।`,
    };
  }

  if (language === 'hi') {
    return {
      front: `${cleanSubject} का मुख्य नियम और परिभाषा क्या है?`,
      back: `${cleanSubject} का यह सिद्धांत मौलिक वैज्ञानिक और शैक्षणिक समझ पर आधारित है।`,
    };
  }

  return {
    front: `What is the fundamental principle of ${cleanSubject}${cleanTopic ? ` (${cleanTopic})` : ''}?`,
    back: `The fundamental principle of ${cleanSubject} establishes verified laws, definitions, and exact mathematical models.`,
  };
}
