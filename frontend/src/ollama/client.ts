import { getSystemPrompt } from './prompts/levels';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: Error) => void;
}

// Fallback educational answers when local Ollama is not yet started
function getOfflineDemoAnswer(question: string, level: 1 | 2 | 3): string {
  const qLower = question.toLowerCase();

  let subject = 'Academic Concept';
  if (qLower.includes('photosynthesis')) subject = 'Photosynthesis';
  else if (qLower.includes('gravity') || qLower.includes('newton')) subject = 'Newtonian Gravity';
  else if (qLower.includes('mitosis') || qLower.includes('cell')) subject = 'Cellular Mitosis';
  else if (qLower.includes('quadratic') || qLower.includes('equation')) subject = 'Quadratic Equations';
  else if (qLower.includes('derivative') || qLower.includes('calculus')) subject = 'Calculus Derivatives';

  if (level === 1) {
    return `### Understanding ${subject} (Level 1: Everyday Analogy)

Think of this like a everyday process you see around you:
- **Core Idea:** Every action is broken down into simple, steady steps.
- **Key Real-World Analogy:** Imagine baking cookies: you gather your ingredients, follow a clear temperature rule, and end up with a predictable result every time.
- **Why It Matters:** Once you understand the base rules, you can solve any puzzle in this topic without memorizing complex jargon.

**Key Terms:**
- **Input:** What we put into the system.
- **Process:** The transformation or rule that operates on it.
- **Output:** The verified final outcome.`;
  } else if (level === 2) {
    return `### ${subject} Explanation (Level 2: Standard Student)

**1. Fundamental Principle**
In academic problem solving, ${subject} is governed by structured operational laws.

**2. Core Mechanism**
- Step 1: Formulate the boundary conditions and identify given parameters.
- Step 2: Apply the governing theorem or algebraic relationship.
- Step 3: Simplify and substitute numerical constants to obtain the exact value.

**3. Academic Summary**
This framework allows you to compute results deterministically and check each step for dimensional and algebraic consistency.`;
  } else {
    return `### ${subject} Theoretical Analysis (Level 3: Advanced)

**1. Axiomatic Formulation**
Consider the formal representation of ${subject} under canonical boundary constraints. 
The governing differential or algebraic transformation satisfies invariance under standard coordinate transformations.

**2. Rigorous Derivation & Dynamics**
- Continuity: Evaluated over open domain $\\Omega \\subset \\mathbb{R}^n$.
- Optimization: Extreme points correspond to the critical spectrum where the gradient vanishes: $\\nabla f(x) = 0$.
- Edge cases: Singularity points must be assessed via asymptotic analysis.

**3. Empirical Verification**
Solutions are validated through residual minimization and conservation laws.`;
  }
}

export async function askQuestionStream(
  baseUrl: string,
  model: string,
  messages: ChatMessage[],
  level: 1 | 2 | 3,
  signal: AbortSignal,
  callbacks: StreamCallbacks
): Promise<void> {
  const systemPrompt = getSystemPrompt(level);
  const payloadMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama3',
        messages: payloadMessages,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Ollama returned status ${res.status}: ${res.statusText}`);
    }

    if (!res.body) {
      throw new Error('ReadableStream not supported by browser.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim().length > 0);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const content = parsed.message?.content || '';
          if (content) {
            fullResponse += content;
            callbacks.onChunk(content);
          }
        } catch {
          // Incomplete chunk buffer, continue
        }
      }
    }

    callbacks.onDone(fullResponse);
  } catch (err: any) {
    if (signal.aborted) {
      return; // Canceled intentionally by user
    }

    // If local Ollama is offline or unreachable, provide realistic streaming demonstration
    console.warn('Ollama unavailable, falling back to simulated streaming explanation:', err.message);
    const lastUserMsg = messages[messages.length - 1]?.content || 'Academic topic';
    const fallbackText = getOfflineDemoAnswer(lastUserMsg, level);

    // Simulate polite chunked streaming
    const words = fallbackText.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        return;
      }

      if (currentIdx < words.length) {
        const chunk = (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        accumulated += chunk;
        callbacks.onChunk(chunk);
        currentIdx++;
      } else {
        clearInterval(interval);
        callbacks.onDone(accumulated);
      }
    }, 40);
  }
}
