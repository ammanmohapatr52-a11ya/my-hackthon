export type OllamaConnectionStatus = 'checking' | 'connected' | 'no-model' | 'unreachable' | 'blocked';

export interface OllamaModelInfo {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export interface OllamaHealthResult {
  status: OllamaConnectionStatus;
  models: string[];
  message: string;
}

export async function checkOllamaHealth(baseUrl = 'http://localhost:11434'): Promise<OllamaHealthResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const modelNames = (data.models || []).map((m: any) => m.name || m.model);

      if (modelNames.length === 0) {
        return {
          status: 'no-model',
          models: [],
          message: 'Ollama is running, but no models are installed yet. Run "ollama pull llama3" in your terminal.',
        };
      }

      return {
        status: 'connected',
        models: modelNames,
        message: `Connected to Ollama with ${modelNames.length} model(s) available.`,
      };
    } else {
      return {
        status: 'blocked',
        models: [],
        message: `Ollama returned status ${res.status}. Check CORS / OLLAMA_ORIGINS configuration.`,
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        status: 'unreachable',
        models: [],
        message: 'Ollama connection timed out (3s). Ensure Ollama is running on your machine.',
      };
    }

    // Check for mixed content / network blocked
    const msg = err.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return {
        status: 'unreachable',
        models: [],
        message: 'Ollama is unreachable at localhost:11434. Make sure "ollama serve" is running.',
      };
    }

    return {
      status: 'unreachable',
      models: [],
      message: `Could not connect to Ollama: ${msg}`,
    };
  }
}
