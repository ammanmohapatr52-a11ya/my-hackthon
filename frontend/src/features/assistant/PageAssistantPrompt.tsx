import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  X,
  Sparkles,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { useAccessibility } from '../../accessibility/AccessibilityContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { getCurrentAuthUser } from '../../services/userService';
import { assistantVoice } from '../../services/assistantVoice';
import { MarvelAvatar } from '../../components/ui/MarvelAvatar';

export interface PageAssistantConfig {
  headline: string;
  spokenText: string;
  subPrompt: string;
  quickActions: Array<{
    label: string;
    action: (navigate: (path: string, options?: any) => void) => void;
  }>;
}

export function getSirTitle(userName?: string, lang: 'en' | 'hi' | 'or' = 'en'): string {
  if (lang === 'hi') {
    return userName ? `सर ${userName}` : 'सर';
  }
  if (lang === 'or') {
    return userName ? `ସାର୍ ${userName}` : 'ସାର୍';
  }
  return userName ? `Sir ${userName}` : 'Sir';
}

export function getQuestionHeadline(sirTitle: string, lang: 'en' | 'hi' | 'or' = 'en'): string {
  if (lang === 'hi') {
    return `"${sirTitle}, आप क्या चाहते हैं?"`;
  }
  if (lang === 'or') {
    return `"${sirTitle}, ଆପଣ କ'ଣ ଚାହାଁନ୍ତି?"`;
  }
  return `"${sirTitle}, what did you want?"`;
}

// Multi-language route-specific prompts for the Personal Assistant
export const ROUTE_CONFIGS: Record<'en' | 'hi' | 'or', Record<string, PageAssistantConfig>> = {
  en: {
    '/': {
      headline: 'Sir, what did you want to explore today?',
      spokenText: 'Sir, what did you want? Did you want to solve math, ask an AI question, or scan study notes today?',
      subPrompt: 'Did you want to solve math, ask an AI question, or scan study notes today?',
      quickActions: [
        { label: '📐 Solve Math Problem', action: (nav) => nav('/solve') },
        { label: '🤖 Ask AI Question', action: (nav) => nav('/ask') },
        { label: '📄 Scan PDF Notes', action: (nav) => nav('/scan') },
        { label: '🃏 Review Flashcards', action: (nav) => nav('/flashcards') },
      ],
    },
    '/solve': {
      headline: 'Sir, what did you want to solve on this page?',
      spokenText: 'Sir, what did you want? Did you want to solve an equation, evaluate a quadratic, or calculate a derivative?',
      subPrompt: 'Did you want to solve an equation, evaluate a quadratic, or calculate a derivative?',
      quickActions: [
        {
          label: 'Linear: 2x + 6 = 14',
          action: (nav) => nav('/solve', { state: { initialProblem: '2x + 6 = 14' } }),
        },
        {
          label: 'Quadratic: x^2 - 5x + 6 = 0',
          action: (nav) => nav('/solve', { state: { initialProblem: 'x^2 - 5x + 6 = 0' } }),
        },
        {
          label: 'Derivative: d/dx(3x^2)',
          action: (nav) => nav('/solve', { state: { initialProblem: 'd/dx(3x^2)' } }),
        },
      ],
    },
    '/ask': {
      headline: 'Sir, what did you want to ask today?',
      spokenText: 'Sir, what did you want? Did you want to ask an academic question, explore a science concept, or try deep research?',
      subPrompt: 'Did you want to ask an academic question, explore a science concept, or try deep research?',
      quickActions: [
        {
          label: 'Laws of Motion',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: "What are Newton's three laws of motion?" } }),
        },
        {
          label: 'Photosynthesis Cycle',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'Explain the process of photosynthesis.' } }),
        },
        {
          label: 'Indian Constitution',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'When did the Indian Constitution come into force?' } }),
        },
      ],
    },
    '/scan': {
      headline: 'Sir, what did you want to scan or upload?',
      spokenText: 'Sir, what did you want? Did you want to upload a lecture PDF, extract textbook equations, or analyze exam questions?',
      subPrompt: 'Did you want to upload a lecture PDF, extract textbook equations, or analyze exam questions?',
      quickActions: [
        {
          label: '📤 Upload Academic PDF',
          action: () => {
            const input = document.getElementById('pdf-file-input');
            if (input) input.click();
          },
        },
        { label: '📐 Go to Math Solver', action: (nav) => nav('/solve') },
      ],
    },
    '/graph': {
      headline: 'Sir, what did you want to plot or sonify?',
      spokenText: 'Sir, what did you want? Did you want to plot a mathematical curve or listen to pitch sonification?',
      subPrompt: 'Did you want to plot a mathematical curve or listen to pitch sonification?',
      quickActions: [
        { label: 'Sine Wave: sin(x)', action: (nav) => nav('/graph') },
        { label: 'Parabola: x^2 - 4', action: (nav) => nav('/graph') },
      ],
    },
    '/flashcards': {
      headline: 'Sir, what did you want to review in flashcards?',
      spokenText: 'Sir, what did you want? Did you want to review your scheduled cards or practice active recall today?',
      subPrompt: 'Did you want to review your scheduled cards or practice active recall today?',
      quickActions: [
        { label: '⚡ Practice Due Cards', action: (nav) => nav('/flashcards') },
        { label: '➕ Create New Card', action: (nav) => nav('/flashcards') },
      ],
    },
    '/voice-learning': {
      headline: 'Sir, what did you want to practice with voice?',
      spokenText: 'Sir, what did you want? Did you want to practice synchronized word-by-word reading aloud with live captions?',
      subPrompt: 'Did you want to practice synchronized word-by-word reading aloud with live captions?',
      quickActions: [
        { label: '🎙 Open Voice Command', action: () => window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal')) },
        { label: '🔊 Play Study Passage', action: (nav) => nav('/voice-learning') },
      ],
    },
    '/history': {
      headline: 'Sir, what did you want to inspect in your history?',
      spokenText: 'Sir, what did you want? Did you want to inspect your past solved problems, search explanations, or export data?',
      subPrompt: 'Did you want to inspect your past solved problems, search explanations, or export data?',
      quickActions: [
        { label: '📥 Export Study Data', action: (nav) => nav('/history') },
        { label: '📐 New Math Problem', action: (nav) => nav('/solve') },
      ],
    },
    '/settings': {
      headline: 'Sir, what did you want to configure in settings?',
      spokenText: 'Sir, what did you want? Did you want to adjust high contrast, change font size, or customize speech voice rate?',
      subPrompt: 'Did you want to adjust high contrast, change font size, or customize speech voice rate?',
      quickActions: [
        { label: '🎨 High Contrast Toggle', action: (nav) => nav('/settings') },
        { label: '🗣 Voice Preferences', action: (nav) => nav('/settings') },
      ],
    },
    '/admin': {
      headline: 'Sir, what did you want to check in the admin console?',
      spokenText: 'Sir, what did you want? Did you want to inspect model status, review registered users, or run evaluation benchmarks?',
      subPrompt: 'Did you want to inspect model status, review registered users, or run evaluation benchmarks?',
      quickActions: [
        { label: '📊 System Status', action: (nav) => nav('/admin') },
        { label: '🧪 Run Evaluation', action: (nav) => nav('/admin') },
      ],
    },
  },
  hi: {
    '/': {
      headline: 'सर, आज आप क्या देखना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप आज गणित हल करना चाहते हैं, AI से प्रश्न पूछना चाहते हैं, या अध्ययन नोट्स स्कैन करना चाहते हैं?',
      subPrompt: 'क्या आप आज गणित हल करना चाहते हैं, AI से प्रश्न पूछना चाहते हैं, या अध्ययन नोट्स स्कैन करना चाहते हैं?',
      quickActions: [
        { label: '📐 गणित हल करें', action: (nav) => nav('/solve') },
        { label: '🤖 AI प्रश्न पूछें', action: (nav) => nav('/ask') },
        { label: '📄 PDF स्कैन करें', action: (nav) => nav('/scan') },
        { label: '🃏 फ़्लैशकार्ड देखें', action: (nav) => nav('/flashcards') },
      ],
    },
    '/solve': {
      headline: 'सर, आप इस पेज पर क्या हल करना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप रैखिक समीकरण, द्विघात समीकरण या अवकलन हल करना चाहते हैं?',
      subPrompt: 'क्या आप रैखिक समीकरण, द्विघात समीकरण या अवकलन हल करना चाहते हैं?',
      quickActions: [
        {
          label: 'रैखिक: 2x + 6 = 14',
          action: (nav) => nav('/solve', { state: { initialProblem: '2x + 6 = 14' } }),
        },
        {
          label: 'द्विघात: x^2 - 5x + 6 = 0',
          action: (nav) => nav('/solve', { state: { initialProblem: 'x^2 - 5x + 6 = 0' } }),
        },
        {
          label: 'अवकलन: d/dx(3x^2)',
          action: (nav) => nav('/solve', { state: { initialProblem: 'd/dx(3x^2)' } }),
        },
      ],
    },
    '/ask': {
      headline: 'सर, आज आप क्या पूछना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप कोई शैक्षणिक प्रश्न, विज्ञान की अवधारणा या गहन शोध करना चाहते हैं?',
      subPrompt: 'क्या आप कोई शैक्षणिक प्रश्न, विज्ञान की अवधारणा या गहन शोध करना चाहते हैं?',
      quickActions: [
        {
          label: 'गति के नियम',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: "What are Newton's three laws of motion?" } }),
        },
        {
          label: 'प्रकाश संश्लेषण',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'Explain the process of photosynthesis.' } }),
        },
        {
          label: 'भारतीय संविधान',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'When did the Indian Constitution come into force?' } }),
        },
      ],
    },
    '/scan': {
      headline: 'सर, आप क्या स्कैन या अपलोड करना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप व्याख्यान PDF अपलोड करना चाहते हैं या पाठ्यपुस्तक समीकरण निकालना चाहते हैं?',
      subPrompt: 'क्या आप व्याख्यान PDF अपलोड करना चाहते हैं या पाठ्यपुस्तक समीकरण निकालना चाहते हैं?',
      quickActions: [
        {
          label: '📤 PDF अपलोड करें',
          action: () => {
            const input = document.getElementById('pdf-file-input');
            if (input) input.click();
          },
        },
        { label: '📐 गणित सॉल्वर पर जाएं', action: (nav) => nav('/solve') },
      ],
    },
    '/graph': {
      headline: 'सर, आप क्या प्लॉट या सुनना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप गणितीय वक्र बनाना चाहते हैं या पिच सोनिफिकेशन सुनना चाहते हैं?',
      subPrompt: 'क्या आप गणितीय वक्र बनाना चाहते हैं या पिच सोनिफिकेशन सुनना चाहते हैं?',
      quickActions: [
        { label: 'साइन वेव: sin(x)', action: (nav) => nav('/graph') },
        { label: 'परवलय: x^2 - 4', action: (nav) => nav('/graph') },
      ],
    },
    '/flashcards': {
      headline: 'सर, आप फ़्लैशकार्ड में क्या देखना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप निर्धारित कार्ड दोहराना चाहते हैं या अभ्यास करना चाहते हैं?',
      subPrompt: 'क्या आप निर्धारित कार्ड दोहराना चाहते हैं या अभ्यास करना चाहते हैं?',
      quickActions: [
        { label: '⚡ अभ्यास करें', action: (nav) => nav('/flashcards') },
        { label: '➕ नया कार्ड बनाएं', action: (nav) => nav('/flashcards') },
      ],
    },
    '/voice-learning': {
      headline: 'सर, आप आवाज़ से क्या सीखना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप लाइव उपशीर्षक के साथ बोलकर पढ़ने का अभ्यास करना चाहते हैं?',
      subPrompt: 'क्या आप लाइव उपशीर्षक के साथ बोलकर पढ़ने का अभ्यास करना चाहते हैं?',
      quickActions: [
        { label: '🎙 वॉयस कमांड', action: () => window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal')) },
        { label: '🔊 पाठ सुनें', action: (nav) => nav('/voice-learning') },
      ],
    },
    '/history': {
      headline: 'सर, आप इतिहास में क्या देखना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप पूर्व में हल किए गए प्रश्न देखना चाहते हैं या डेटा निर्यात करना चाहते हैं?',
      subPrompt: 'क्या आप पूर्व में हल किए गए प्रश्न देखना चाहते हैं या डेटा निर्यात करना चाहते हैं?',
      quickActions: [
        { label: '📥 डेटा निर्यात करें', action: (nav) => nav('/history') },
        { label: '📐 नया गणित प्रश्न', action: (nav) => nav('/solve') },
      ],
    },
    '/settings': {
      headline: 'सर, आप सेटिंग्स में क्या बदलना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप उच्च कंट्रास्ट, फ़ॉन्ट आकार या आवाज़ की गति बदलना चाहते हैं?',
      subPrompt: 'क्या आप उच्च कंट्रास्ट, फ़ॉन्ट आकार या आवाज़ की गति बदलना चाहते हैं?',
      quickActions: [
        { label: '🎨 कंट्रास्ट टॉगल', action: (nav) => nav('/settings') },
        { label: '🗣 आवाज़ प्राथमिकताएं', action: (nav) => nav('/settings') },
      ],
    },
    '/admin': {
      headline: 'सर, आप व्यवस्थापक कंसोल में क्या जाँचना चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? क्या आप मॉडल स्थिति या पंजीकृत उपयोगकर्ताओं की समीक्षा करना चाहते हैं?',
      subPrompt: 'क्या आप मॉडल स्थिति या पंजीकृत उपयोगकर्ताओं की समीक्षा करना चाहते हैं?',
      quickActions: [
        { label: '📊 सिस्टम स्थिति', action: (nav) => nav('/admin') },
        { label: '🧪 बेंचमार्क चलाएं', action: (nav) => nav('/admin') },
      ],
    },
  },
  or: {
    '/': {
      headline: 'ସାର୍, ଆଜି ଆପଣ କ\'ଣ ଶିଖିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଆଜି ଗଣିତ ସମାଧାନ କରିବାକୁ, AI ପ୍ରଶ୍ନ ପଚାରିବାକୁ କିମ୍ବା ନୋଟ୍ ସ୍କାନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଆଜି ଗଣିତ ସମାଧାନ କରିବାକୁ, AI ପ୍ରଶ୍ନ ପଚାରିବାକୁ କିମ୍ବା ନୋଟ୍ ସ୍କାନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '📐 ଗଣିତ ସମାଧାନ କରନ୍ତୁ', action: (nav) => nav('/solve') },
        { label: '🤖 AI ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ', action: (nav) => nav('/ask') },
        { label: '📄 PDF ନୋଟ୍ ସ୍କାନ କରନ୍ତୁ', action: (nav) => nav('/scan') },
        { label: '🃏 ଫ୍ଲାସକାର୍ଡ୍ ଦେଖନ୍ତୁ', action: (nav) => nav('/flashcards') },
      ],
    },
    '/solve': {
      headline: 'ସାର୍, ଆପଣ ଏହି ପୃଷ୍ଠାରେ କ\'ଣ ସମାଧାନ କରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଏକ ରୈଖିକ ସମୀକରଣ, ଦ୍ୱିଘାତ ସମୀକରଣ କିମ୍ବା ଅବକଳନ ସମାଧାନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଏକ ରୈଖିକ ସମୀକରଣ, ଦ୍ୱିଘାତ ସମୀକରଣ କିମ୍ବା ଅବକଳନ ସମାଧାନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        {
          label: 'ରୈଖିକ: 2x + 6 = 14',
          action: (nav) => nav('/solve', { state: { initialProblem: '2x + 6 = 14' } }),
        },
        {
          label: 'ଦ୍ୱିଘାତ: x^2 - 5x + 6 = 0',
          action: (nav) => nav('/solve', { state: { initialProblem: 'x^2 - 5x + 6 = 0' } }),
        },
        {
          label: 'ଅବକଳନ: d/dx(3x^2)',
          action: (nav) => nav('/solve', { state: { initialProblem: 'd/dx(3x^2)' } }),
        },
      ],
    },
    '/ask': {
      headline: 'ସାର୍, ଆଜି ଆପଣ କ\'ଣ ପଚାରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ କୌଣସି ପାଠ୍ୟକ୍ରମ ପ୍ରଶ୍ନ, ବିଜ୍ଞାନ ଧାରଣା କିମ୍ବା ଗବେଷଣା କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ କୌଣସି ପାଠ୍ୟକ୍ରମ ପ୍ରଶ୍ନ, ବିଜ୍ଞାନ ଧାରଣା କିମ୍ବା ଗବେଷଣା କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        {
          label: 'ଗତିର ନିୟମ',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: "What are Newton's three laws of motion?" } }),
        },
        {
          label: 'ଆଲୋକ ସଂଶ୍ଳେଷଣ',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'Explain the process of photosynthesis.' } }),
        },
        {
          label: 'ଭାରତୀୟ ସମ୍ବିଧାନ',
          action: (nav) => nav('/ask', { state: { prefilledQuestion: 'When did the Indian Constitution come into force?' } }),
        },
      ],
    },
    '/scan': {
      headline: 'ସାର୍, ଆପଣ କ\'ଣ ସ୍କାନ କିମ୍ବା ଅପଲୋଡ୍ କରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଏକ ଶିକ୍ଷଣ PDF ଅପଲୋଡ୍ କରିବାକୁ କିମ୍ବା ପାଠ୍ୟପୁସ୍ତକ ସମୀକରଣ ବାହାର କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଏକ ଶିକ୍ଷଣ PDF ଅପଲୋଡ୍ କରିବାକୁ କିମ୍ବା ପାଠ୍ୟପୁସ୍ତକ ସମୀକରଣ ବାହାର କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        {
          label: '📤 PDF ଅପଲୋଡ୍ କରନ୍ତୁ',
          action: () => {
            const input = document.getElementById('pdf-file-input');
            if (input) input.click();
          },
        },
        { label: '📐 ଗଣିତ ସଲଭରକୁ ଯାଆନ୍ତୁ', action: (nav) => nav('/solve') },
      ],
    },
    '/graph': {
      headline: 'ସାର୍, ଆପଣ କ\'ଣ ପ୍ଲଟ୍ କିମ୍ବା ଶୁଣିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଏକ ଗାଣିତିକ ବକ୍ର ପ୍ଲଟ୍ କରିବାକୁ କିମ୍ବା ଅଡିଓ ଫ୍ରିକ୍ୱେନ୍ସି ଶୁଣିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଏକ ଗାଣିତିକ ବକ୍ର ପ୍ଲଟ୍ କରିବାକୁ କିମ୍ବା ଅଡିଓ ଫ୍ରିକ୍ୱେନ୍ସି ଶୁଣିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: 'ସାଇନ୍ ତରଙ୍ଗ: sin(x)', action: (nav) => nav('/graph') },
        { label: 'ପାରାବୋଲା: x^2 - 4', action: (nav) => nav('/graph') },
      ],
    },
    '/flashcards': {
      headline: 'ସାର୍, ଆପଣ ଫ୍ଲାସକାର୍ଡରେ କ\'ଣ ଦେଖିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଆଜି ନିର୍ଦ୍ଧାରିତ କାର୍ଡ୍ ପୁନରାବୃତ୍ତି କରିବାକୁ କିମ୍ବା ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଆଜି ନିର୍ଦ୍ଧାରିତ କାର୍ଡ୍ ପୁନରାବୃତ୍ତି କରିବାକୁ କିମ୍ବା ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '⚡ ଅଭ୍ୟାସ କରନ୍ତୁ', action: (nav) => nav('/flashcards') },
        { label: '➕ ନୂଆ କାର୍ଡ୍ ତିଆରି', action: (nav) => nav('/flashcards') },
      ],
    },
    '/voice-learning': {
      headline: 'ସାର୍, ଆପଣ ସ୍ୱର ସହିତ କ\'ଣ ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ଲାଇଭ୍ କ୍ୟାପସନ୍ ସହିତ ପଢ଼ିବା ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ଲାଇଭ୍ କ୍ୟାପସନ୍ ସହିତ ପଢ଼ିବା ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '🎙 ଭଏସ୍ କମାଣ୍ଡ', action: () => window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal')) },
        { label: '🔊 ପାଠ ଶୁଣନ୍ତୁ', action: (nav) => nav('/voice-learning') },
      ],
    },
    '/history': {
      headline: 'ସାର୍, ଆପଣ ଇତିହାସରେ କ\'ଣ ଦେଖିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ପୂର୍ବ ସମାଧାନ ହୋଇଥିବା ପ୍ରଶ୍ନ ଦେଖିବାକୁ କିମ୍ବା ତଥ୍ୟ ରପ୍ତାନି କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ପୂର୍ବ ସମାଧାନ ହୋଇଥିବା ପ୍ରଶ୍ନ ଦେଖିବାକୁ କିମ୍ବା ତଥ୍ୟ ରପ୍ତାନି କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '📥 ତଥ୍ୟ ରପ୍ତାନି କରନ୍ତୁ', action: (nav) => nav('/history') },
        { label: '📐 ନୂଆ ଗଣିତ ପ୍ରଶ୍ନ', action: (nav) => nav('/solve') },
      ],
    },
    '/settings': {
      headline: 'ସାର୍, ଆପଣ ସେଟିଙ୍ଗସରେ କ\'ଣ ପରିବର୍ତ୍ତନ କରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ କଣ୍ଟ୍ରାଷ୍ଟ, ଫଣ୍ଟ ଆକାର କିମ୍ବା ସ୍ୱରର ଗତି ପରିବର୍ତ୍ତନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ କଣ୍ଟ୍ରାଷ୍ଟ, ଫଣ୍ଟ ଆକାର କିମ୍ବା ସ୍ୱରର ଗତି ପରିବର୍ତ୍ତନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '🎨 କଣ୍ଟ୍ରାଷ୍ଟ ଟଗଲ୍', action: (nav) => nav('/settings') },
        { label: '🗣 ସ୍ୱର ପସନ୍ଦ', action: (nav) => nav('/settings') },
      ],
    },
    '/admin': {
      headline: 'ସାର୍, ଆପଣ ଆଡମିନ୍ କନସୋଲରେ କ\'ଣ ଯାଞ୍ଚ କରିବାକୁ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଆପଣ ମଡେଲ୍ ସ୍ଥିତି କିମ୍ବା ପଞ୍ଜୀକୃତ ଉପଭୋକ୍ତା ଯାଞ୍ଚ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      subPrompt: 'ଆପଣ ମଡେଲ୍ ସ୍ଥିତି କିମ୍ବା ପଞ୍ଜୀକୃତ ଉପଭୋକ୍ତା ଯାଞ୍ଚ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      quickActions: [
        { label: '📊 ସିଷ୍ଟମ୍ ସ୍ଥିତି', action: (nav) => nav('/admin') },
        { label: '🧪 ମୂଲ୍ୟାୟନ ପରୀକ୍ଷା', action: (nav) => nav('/admin') },
      ],
    },
  },
};

export function getPromptConfig(pathname: string, lang: 'en' | 'hi' | 'or' = 'en'): PageAssistantConfig {
  const langDict = ROUTE_CONFIGS[lang] || ROUTE_CONFIGS.en;
  if (langDict[pathname]) {
    return langDict[pathname];
  }
  if (lang === 'hi') {
    return {
      headline: 'सर, आप इस पेज पर क्या चाहते हैं?',
      spokenText: 'सर, आप क्या चाहते हैं? मैं इस पेज पर आपकी पढ़ाई में कैसे सहायता कर सकता हूँ?',
      subPrompt: 'मैं इस पेज पर आपकी पढ़ाई में कैसे सहायता कर सकता हूँ?',
      quickActions: [
        { label: '📐 गणित हल करें', action: (nav) => nav('/solve') },
        { label: '🤖 प्रश्न पूछें', action: (nav) => nav('/ask') },
      ],
    };
  }
  if (lang === 'or') {
    return {
      headline: 'ସାର୍, ଆପଣ ଏହି ପୃଷ୍ଠାରେ କ\'ଣ ଚାହାଁନ୍ତି?',
      spokenText: 'ସାର୍, ଆପଣ କ\'ଣ ଚାହାଁନ୍ତି? ଏହି ପୃଷ୍ଠାରେ ଆପଣଙ୍କ ଅଧ୍ୟୟନରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
      subPrompt: 'ଏହି ପୃଷ୍ଠାରେ ଆପଣଙ୍କ ଅଧ୍ୟୟନରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
      quickActions: [
        { label: '📐 ଗଣିତ ସମାଧାନ', action: (nav) => nav('/solve') },
        { label: '🤖 ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ', action: (nav) => nav('/ask') },
      ],
    };
  }
  return {
    headline: 'Sir, what did you want on this page?',
    spokenText: 'Sir, what did you want? How may I assist you with your studies on this page?',
    subPrompt: 'How may I assist you with your studies on this page?',
    quickActions: [
      { label: '📐 Solve Math', action: (nav) => nav('/solve') },
      { label: '🤖 Ask Question', action: (nav) => nav('/ask') },
    ],
  };
}

/**
 * 1. Prominent Top Banner placed right at the top of every interface:
 * Directly greets and asks: "Sir, what did you want?" in the active language
 */
export const AssistantPageBanner: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(assistantVoice.isSpeaking());
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('neurobridge_assistant_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('neurobridge_assistant_banner_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<any>(() => getCurrentAuthUser());
  const config = getPromptConfig(location.pathname, language);

  // Sync auth changes
  useEffect(() => {
    const handleAuth = () => setCurrentUser(getCurrentAuthUser());
    window.addEventListener('neurobridge_auth_changed', handleAuth);
    return () => window.removeEventListener('neurobridge_auth_changed', handleAuth);
  }, []);

  // Sync voice service state
  useEffect(() => {
    return assistantVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  const userName = currentUser?.name || currentUser?.username;
  const sirTitle = getSirTitle(userName, language);
  const headlineText = getQuestionHeadline(sirTitle, language);
  const displaySpoken = config.spokenText.replace(/^(Sir|सर|ସାର୍)\b/, sirTitle);

  const handleSpeakAloud = () => {
    assistantVoice.speak(displaySpoken, true, language);
  };

  const handleOpenVoice = () => {
    assistantVoice.stop();
    window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal'));
  };

  const handleDismissPermanently = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('neurobridge_assistant_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('neurobridge_assistant_banner_collapsed', next ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  // Sleek single-line Copilot Bar when collapsed
  if (isCollapsed) {
    return (
      <div
        role="region"
        aria-label="Assistant Copilot Bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '9999px',
          padding: '6px 14px',
          margin: '0.5rem 0 1rem 0',
          fontSize: '0.82rem',
          color: '#cbd5e1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MarvelAvatar hero="ironman" size="xs" />
          <span style={{ fontWeight: 600, color: '#38bdf8' }}>AI Assistant:</span>
          <span style={{ color: '#94a3b8' }}>{headlineText}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handleSpeakAloud}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <Volume2 size={13} />
            <span>Hear</span>
          </button>
          <button
            type="button"
            onClick={handleToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '4px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px 8px',
              fontSize: '0.74rem',
            }}
          >
            Expand
          </button>
          <button
            type="button"
            onClick={handleDismissPermanently}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '2px',
            }}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      role="region"
      aria-label="Assistant Welcome Prompt"
      style={{
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.16) 0%, rgba(15, 23, 42, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        margin: '0.75rem 0 1.5rem 0',
        boxShadow: isSpeaking
          ? '0 8px 24px rgba(56, 189, 248, 0.25), 0 0 20px rgba(56, 189, 248, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left: Avatar & Spoken Question */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px' }}>
          <div style={{ position: 'relative' }}>
            <MarvelAvatar hero="ironman" size="lg" title="Stark Arc AI Assistant" />
            {isSpeaking && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #0f172a',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  lineHeight: 1.25,
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {headlineText}
              </h2>
              {isSpeaking && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(56, 189, 248, 0.25)',
                    color: '#7dd3fc',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Radio size={12} className="animate-pulse" />
                  {t('assistant.speaking_aloud', 'Speaking Voice Aloud')}
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: '0.875rem',
                color: '#e2e8f0',
                margin: '4px 0 0 0',
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              {config.subPrompt}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Voice Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Quick Screen Action Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {config.quickActions.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => item.action(navigate)}
                style={{
                  background: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  color: '#f1f5f9',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.color = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.color = '#f1f5f9';
                }}
              >
                <span>{item.label}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>

          {/* Voice Speak Replay Button */}
          <button
            type="button"
            onClick={handleSpeakAloud}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'rgba(56, 189, 248, 0.5)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title={t('assistant.hear_voice', 'Hear Voice')}
            aria-label={t('assistant.hear_voice', 'Hear Voice')}
          >
            <Volume2 size={15} />
            <span>{t('assistant.hear_voice', 'Hear Voice')}</span>
          </button>

          {/* Speak Back Button */}
          <button
            type="button"
            onClick={handleOpenVoice}
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title={t('assistant.speak_answer', 'Speak Answer')}
            aria-label={t('assistant.speak_answer', 'Speak Answer')}
          >
            <Mic size={15} />
            <span>{t('assistant.speak_answer', 'Speak Answer')}</span>
          </button>

          {/* Minimize / Collapse Button */}
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="btn btn-ghost btn-sm"
            style={{
              padding: '6px 10px',
              color: '#94a3b8',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
            }}
            title="Minimize to top bar"
            aria-label="Minimize assistant prompt"
          >
            Minimize
          </button>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismissPermanently}
            className="btn btn-ghost btn-sm"
            style={{
              padding: '6px',
              color: '#94a3b8',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * 2. Floating AI Assistant Widget docked at bottom-right
 * Manages auto-speaking on every route change with persistent utterance protection
 */
export const PageAssistantPrompt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAccessibility();
  const { language, t } = useLanguage();

  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('neurobridge_assistant_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(assistantVoice.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(assistantVoice.isSpeaking());
  const [currentUser, setCurrentUser] = useState<any>(() => getCurrentAuthUser());
  const lastSpokenPathRef = useRef<string | null>(null);
  const lastSpokenLangRef = useRef<string | null>(null);

  // Sync auth
  useEffect(() => {
    const handleAuth = () => setCurrentUser(getCurrentAuthUser());
    window.addEventListener('neurobridge_auth_changed', handleAuth);
    return () => window.removeEventListener('neurobridge_auth_changed', handleAuth);
  }, []);

  // Sync speech state
  useEffect(() => {
    return assistantVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
      setVoiceEnabled(assistantVoice.isVoiceEnabled());
    });
  }, []);

  const config = getPromptConfig(location.pathname, language);
  const userName = currentUser?.name || currentUser?.username;
  const sirTitle = getSirTitle(userName, language);
  const headlineText = getQuestionHeadline(sirTitle, language);
  const fullSpokenText = config.spokenText.replace(/^(Sir|सर|ସାର୍)\b/, sirTitle);

  /**
   * Automatically speak: "Sir, what did you want?"
   * whenever a new interface/route is opened or language is switched
   */
  useEffect(() => {
    // Only speak once per route change or language change, never on generic re-render
    if (lastSpokenPathRef.current === location.pathname && lastSpokenLangRef.current === language) {
      return;
    }
    lastSpokenPathRef.current = location.pathname;
    lastSpokenLangRef.current = language;

    if (profile === 'deaf-hoh') {
      return;
    }

    // Small 250ms tick allows new route to paint
    const timer = setTimeout(() => {
      assistantVoice.speak(fullSpokenText, false, language);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, language, profile, fullSpokenText]);

  const toggleVoice = () => {
    const nextVal = !voiceEnabled;
    assistantVoice.setVoiceEnabled(nextVal);
    setVoiceEnabled(nextVal);
    if (nextVal) {
      const confirmation =
        language === 'hi'
          ? `${sirTitle}, आवाज़ सक्षम हो गई है।`
          : language === 'or'
          ? `${sirTitle}, ସ୍ୱର ସକ୍ରିୟ ହୋଇଛି।`
          : `${sirTitle}, what did you want? Voice enabled.`;
      assistantVoice.speak(confirmation, true, language);
    }
  };

  const toggleMinimize = (minimized: boolean) => {
    setIsMinimized(minimized);
    try {
      localStorage.setItem('neurobridge_assistant_minimized', String(minimized));
    } catch {}
  };

  const handleOpenVoice = () => {
    assistantVoice.stop();
    window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal'));
  };

  return (
    <aside
      aria-label="Personal AI Voice Assistant"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 850,
        maxWidth: '430px',
        width: isMinimized ? 'auto' : 'calc(100vw - 48px)',
        pointerEvents: 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {isMinimized ? (
          /* Minimized Floating Orb */
          <button
            type="button"
            onClick={() => {
              toggleMinimize(false);
              assistantVoice.speak(fullSpokenText, true, language);
            }}
            aria-label="Expand AI Assistant prompt"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: isSpeaking ? '2px solid #38bdf8' : '1.5px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '9999px',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#f8fafc',
              cursor: 'pointer',
              boxShadow: isSpeaking
                ? '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.5)'
                : '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 16px rgba(56, 189, 248, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <MarvelAvatar hero="ironman" size="sm" title="Stark AI Assistant" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                {headlineText}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {isSpeaking
                  ? (language === 'hi' ? 'आवाज़ में बोल रहा है...' : language === 'or' ? 'ସ୍ୱରରେ କୁହାଯାଉଛି...' : 'Speaking prompt aloud...')
                  : (language === 'hi' ? 'सुनने और बात करने के लिए क्लिक करें' : language === 'or' ? 'ଶୁଣିବା ଓ କଥା ହେବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ' : 'Click to hear & interact')}
              </div>
            </div>
          </button>
        ) : (
          /* Expanded Floating Assistant Card */
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isSpeaking ? '1.5px solid #38bdf8' : '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: isSpeaking
                ? '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 28px rgba(56, 189, 248, 0.3)'
                : '0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(56, 189, 248, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              position: 'relative',
              overflow: 'hidden',
              animation: 'assistantFadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MarvelAvatar hero="ironman" size="md" title="Stark AI Assistant" />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>
                      {t('assistant.voice_assistant', 'Voice Assistant')}
                    </span>
                    {isSpeaking && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          background: 'rgba(56, 189, 248, 0.25)',
                          color: '#38bdf8',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Radio size={10} className="animate-pulse" />
                        {t('assistant.speaking_aloud', 'Speaking Aloud')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                    {t('assistant.asks_every_page', 'Asks on every interface')}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {/* Voice Speak / Mute Toggle */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px',
                    color: voiceEnabled ? '#38bdf8' : '#94a3b8',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title={voiceEnabled ? 'Mute assistant voice' : 'Unmute assistant voice'}
                  aria-label={voiceEnabled ? 'Mute assistant voice' : 'Unmute assistant voice'}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                {/* Repeat Prompt Button */}
                <button
                  type="button"
                  onClick={() => assistantVoice.speak(fullSpokenText, true, language)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px',
                    color: '#38bdf8',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title="Ask me aloud again"
                  aria-label="Repeat spoken question"
                >
                  <RotateCcw size={15} />
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => toggleMinimize(true)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px',
                    color: '#94a3b8',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title="Minimize assistant card"
                  aria-label="Minimize assistant card"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Question Balloon */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  lineHeight: 1.35,
                  marginBottom: '4px',
                }}
              >
                {headlineText}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#f1f5f9', fontWeight: 500, lineHeight: 1.45 }}>
                {config.subPrompt}
              </div>
            </div>

            {/* Quick Actions Suggestions */}
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                }}
              >
                {t('assistant.quick_actions', 'Quick actions for this screen:')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {config.quickActions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.action(navigate)}
                    style={{
                      background: 'rgba(30, 41, 59, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      color: '#e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#38bdf8';
                      e.currentTarget.style.color = '#38bdf8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#e2e8f0';
                    }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => assistantVoice.speak(fullSpokenText, true, language)}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                }}
              >
                <Volume2 size={13} />
                <span>{t('assistant.hear_voice', 'Hear Voice')}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenVoice}
                className="btn btn-primary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Mic size={14} />
                <span>{t('assistant.speak_answer', 'Speak Answer')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes assistantFadeUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </aside>
  );
};

export default PageAssistantPrompt;
