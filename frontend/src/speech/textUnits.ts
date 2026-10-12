export interface WordUnit {
  word: string;
  start: number;
  end: number;
  index: number;
  sentenceIndex: number;
}

export interface SentenceUnit {
  sentence: string;
  start: number;
  end: number;
  index: number;
  words: WordUnit[];
}

export function splitIntoUnits(text: string): SentenceUnit[] {
  if (!text) return [];

  // Match sentences roughly ending in ., !, ?, or newlines
  const sentenceRegex = /[^.!?\n]+[.!?\n]*/g;
  const sentenceMatches = text.match(sentenceRegex) || [text];

  const sentences: SentenceUnit[] = [];
  let currentOffset = 0;
  let globalWordIndex = 0;

  sentenceMatches.forEach((sText, sIdx) => {
    const sStart = text.indexOf(sText, currentOffset);
    const sEnd = sStart + sText.length;
    currentOffset = sEnd;

    // Split sentence into words
    const words: WordUnit[] = [];
    const wordRegex = /\S+/g;
    let wMatch;

    while ((wMatch = wordRegex.exec(sText)) !== null) {
      const wStart = sStart + wMatch.index;
      const wEnd = wStart + wMatch[0].length;
      words.push({
        word: wMatch[0],
        start: wStart,
        end: wEnd,
        index: globalWordIndex++,
        sentenceIndex: sIdx,
      });
    }

    sentences.push({
      sentence: sText.trim(),
      start: sStart,
      end: sEnd,
      index: sIdx,
      words,
    });
  });

  return sentences;
}
