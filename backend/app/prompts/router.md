Classify the learner's message. Reply with JSON only, no other text.

{
  "intent": "gk | academic_concept | math_computation | how_to | opinion_sensitive | chit_chat | unclear",
  "domain": "history | geography | polity_civics | economy | science | technology | sports | arts_culture | current_affairs | environment | health | language | other",
  "time_sensitive": true or false,
  "false_premise_suspected": true or false,
  "needs_clarification": true or false,
  "clarifying_question": "one short question, or empty",
  "route": "gk | explain | math_engine | refuse | clarify"
}

RULES
- math_computation: the learner needs numbers computed or an equation solved. Route "math_engine".
- time_sensitive is true when the answer could have changed in the last two years, or the message contains words like current, latest, recent, now, today, newest, record, ranking, "who is the".
- false_premise_suspected is true when the question assumes something that may be wrong (for example "Why is Sydney the capital of Australia?").
- needs_clarification is true only when the question cannot be answered without more detail (for example "Who is the president?" with no country). Ask exactly one question.
- route "refuse" only for harmful requests.
- Simple GK facts: intent "gk", route "gk". Concept explanations (why/how): intent "academic_concept", route "explain".
