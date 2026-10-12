/**
 * P2 — Router / classifier prompt
 * From Document 06: AI Prompt Pack, GK Improvement Plan and Backend Build Prompt
 */

export interface RouterResult {
  intent: 'gk' | 'academic_concept' | 'math_computation' | 'how_to' | 'opinion_sensitive' | 'chit_chat' | 'unclear';
  domain: string;
  time_sensitive: boolean;
  false_premise_suspected: boolean;
  needs_clarification: boolean;
  clarifying_question: string;
  route: 'gk' | 'explain' | 'math_engine' | 'refuse' | 'clarify';
}

export const ROUTER_PROMPT = `Classify the learner's message. Reply with JSON only, no other text.

{
  "intent": "gk | academic_concept | math_computation | how_to | opinion_sensitive | chit_chat | unclear",
  "domain": "history | geography | polity_civics | economy | science | technology | sports | arts_culture | current_affairs | environment | health | language | other",
  "time_sensitive": true,
  "false_premise_suspected": false,
  "needs_clarification": false,
  "clarifying_question": "one short question, or empty",
  "route": "gk | explain | math_engine | refuse | clarify"
}

RULES
- math_computation: the learner needs numbers computed or an equation solved. Route "math_engine".
- time_sensitive is true when the answer could have changed in the last two years, or the message contains words like current, latest, recent, now, today, newest, record, ranking, "who is the".
- false_premise_suspected is true when the question assumes something that may be wrong (for example "Why is Sydney the capital of Australia?").
- needs_clarification is true only when the question cannot be answered without more detail (for example "Who is the president?" with no country). Ask exactly one question.
- route "refuse" only for harmful requests.
- Simple GK facts: intent "gk", route "gk". Concept explanations (why/how): intent "academic_concept", route "explain".`;

/**
 * Fast client-side heuristics router to classify intents without roundtrip latency
 */
export function fastClassifyQuery(query: string): RouterResult {
  const q = query.trim().toLowerCase();

  // 1. Math computation check (FR-MATH / Truth Rule 6)
  const isEquation = q.includes('=') && (/[0-9]/.test(q) || /[xyz]/i.test(q));
  const isCalculus = q.includes('d/dx') || q.includes('derivative') || q.startsWith('diff(') || q.includes('integral');
  const isSolveCmd = q.startsWith('solve ') || q.startsWith('evaluate ') || q.startsWith('calculate ') || q.startsWith('compute ');
  const hasArithmeticOps = /^[\d\s\+\-\*\/\^\(\)\.\%=]+$/.test(q);

  if (isEquation || isCalculus || isSolveCmd || hasArithmeticOps) {
    return {
      intent: 'math_computation',
      domain: 'science',
      time_sensitive: false,
      false_premise_suspected: false,
      needs_clarification: false,
      clarifying_question: '',
      route: 'math_engine',
    };
  }

  // 2. False premise check (e.g. Sydney capital of Australia, Sun orbits Earth)
  const falsePremise =
    (q.includes('sydney') && q.includes('capital') && q.includes('australia')) ||
    (q.includes('sun') && q.includes('revolve') && q.includes('earth'));

  // 3. Time sensitive check
  const timeKeywords = ['current', 'latest', 'recent', 'now', 'today', 'newest', 'record', 'ranking', 'who is the president', 'who is the prime minister'];
  const isTimeSensitive = timeKeywords.some((w) => q.includes(w));

  // 4. Clarification check
  let needsClarification = false;
  let clarifyingQuestion = '';
  if (q === 'who is the president' || q === 'who is the prime minister' || q === 'what is the capital') {
    needsClarification = true;
    clarifyingQuestion = 'Which country or state are you asking about?';
  }

  // 5. General concept vs GK fact
  const isConcept = q.startsWith('how ') || q.startsWith('why ') || q.includes('explain') || q.includes('difference between');

  return {
    intent: isConcept ? 'academic_concept' : 'gk',
    domain: 'general',
    time_sensitive: isTimeSensitive,
    false_premise_suspected: falsePremise,
    needs_clarification: needsClarification,
    clarifying_question: clarifyingQuestion,
    route: needsClarification ? 'clarify' : isConcept ? 'explain' : 'gk',
  };
}
