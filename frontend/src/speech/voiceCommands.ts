export type VoiceIntent =
  | { type: 'solve'; payload: string }
  | { type: 'ask'; payload: string }
  | { type: 'navigate'; path: string }
  | { type: 'read' }
  | { type: 'stop' }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'repeat' }
  | { type: 'unknown'; raw: string };

export function parseVoiceCommand(text: string): VoiceIntent {
  const clean = text.trim().toLowerCase();

  // Solve Command (English, Hindi, Odia)
  if (
    clean.startsWith('solve') ||
    clean.startsWith('हल करो') ||
    clean.startsWith('समाधान करो') ||
    clean.startsWith('ସମାଧାନ କରନ୍ତୁ') ||
    clean.startsWith('ସମାଧାନ')
  ) {
    const payload = text
      .replace(/^(solve|हल करो|समाधान करो|ସମାଧାନ କରନ୍ତୁ|ସମାଧାନ)/i, '')
      .trim();
    return { type: 'solve', payload };
  }

  // Ask Command (English, Hindi, Odia)
  if (
    clean.startsWith('ask') ||
    clean.startsWith('पूछो') ||
    clean.startsWith('सवाल') ||
    clean.startsWith('प्रश्न') ||
    clean.startsWith('ପଚାରନ୍ତୁ') ||
    clean.startsWith('ପ୍ରଶ୍ନ')
  ) {
    const payload = text
      .replace(/^(ask|पूछो|सवाल|प्रश्न|ପଚାରନ୍ତୁ|ପ୍ରଶ୍ନ)/i, '')
      .trim();
    return { type: 'ask', payload };
  }

  // Navigation: Home
  if (
    clean.includes('go to home') ||
    clean === 'home' ||
    clean.includes('होम') ||
    clean.includes('ମୂଳପୃଷ୍ଠା')
  ) {
    return { type: 'navigate', path: '/' };
  }

  // Navigation: Math Solver
  if (
    clean.includes('go to math') ||
    clean.includes('solve math') ||
    clean.includes('math problem') ||
    clean.includes('गणित') ||
    clean.includes('ଗଣିତ')
  ) {
    return { type: 'navigate', path: '/solve' };
  }

  // Navigation: Ask AI
  if (
    clean.includes('go to ask') ||
    clean.includes('ask question') ||
    clean.includes('एआई से पूछो') ||
    clean.includes('ପଚାରନ୍ତୁ')
  ) {
    return { type: 'navigate', path: '/ask' };
  }

  // Navigation: PDF Scan
  if (
    clean.includes('scan') ||
    clean.includes('pdf') ||
    clean.includes('स्कैन') ||
    clean.includes('ସ୍କାନ')
  ) {
    return { type: 'navigate', path: '/scan' };
  }

  // Navigation: Graph
  if (
    clean.includes('go to graph') ||
    clean.includes('graph and sound') ||
    clean.includes('ग्राफ') ||
    clean.includes('ଗ୍ରାଫ')
  ) {
    return { type: 'navigate', path: '/graph' };
  }

  // Navigation: Flashcards
  if (
    clean.includes('go to flashcards') ||
    clean.includes('flash cards') ||
    clean.includes('फ़्लैशकार्ड') ||
    clean.includes('ଫ୍ଲାସକାର୍ଡ')
  ) {
    return { type: 'navigate', path: '/flashcards' };
  }

  // Navigation: Voice Learning
  if (
    clean.includes('go to voice') ||
    clean.includes('voice learning') ||
    clean.includes('listen') ||
    clean.includes('आवाज़') ||
    clean.includes('ସ୍ୱର')
  ) {
    return { type: 'navigate', path: '/voice-learning' };
  }

  // Navigation: History
  if (
    clean.includes('go to history') ||
    clean.includes('my history') ||
    clean.includes('इतिहास') ||
    clean.includes('ଇତିହାସ')
  ) {
    return { type: 'navigate', path: '/history' };
  }

  // Navigation: Settings
  if (
    clean.includes('go to settings') ||
    clean.includes('accessibility settings') ||
    clean.includes('सेटिंग्स') ||
    clean.includes('ସେଟିଙ୍ଗସ')
  ) {
    return { type: 'navigate', path: '/settings' };
  }

  // Read aloud command
  if (
    clean.includes('read this') ||
    clean.includes('read aloud') ||
    clean === 'read' ||
    clean.includes('पढ़ो') ||
    clean.includes('ପଢ଼ନ୍ତୁ')
  ) {
    return { type: 'read' };
  }

  // Stop / Pause command
  if (
    clean.includes('stop') ||
    clean.includes('pause') ||
    clean.includes('quiet') ||
    clean.includes('रुको') ||
    clean.includes('बन्द करो') ||
    clean.includes('ବନ୍ଦ କରନ୍ତୁ') ||
    clean.includes('ଥମନ୍ତୁ')
  ) {
    return { type: 'stop' };
  }

  // Next step
  if (clean.includes('next step') || clean === 'next' || clean.includes('अगला') || clean.includes('ପରବର୍ତ୍ତୀ')) {
    return { type: 'next' };
  }

  // Previous step
  if (
    clean.includes('previous step') ||
    clean === 'previous' ||
    clean === 'back' ||
    clean.includes('पिछला') ||
    clean.includes('ପୂର୍ବ')
  ) {
    return { type: 'previous' };
  }

  // Repeat
  if (
    clean.includes('repeat') ||
    clean.includes('say again') ||
    clean.includes('दोहराओ') ||
    clean.includes('ପୁନର୍ବାର')
  ) {
    return { type: 'repeat' };
  }

  return { type: 'unknown', raw: text };
}
