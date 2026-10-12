export type MathProblemType =
  | 'linear'
  | 'quadratic'
  | 'system2x2'
  | 'derivative'
  | 'simplify'
  | 'expression'
  | 'trigonometry'
  | 'logarithm'
  | 'integral'
  | 'arithmetic_advanced'
  | 'ai_reasoning'
  | 'unsupported';

export interface MathStep {
  stepNumber: number;
  title: string;
  mathLatex: string;
  explanation: {
    level1: string; // Very simple / intuitive
    level2: string; // Standard student
    level3: string; // Advanced / formal
  };
  spokenText: string;
}

export interface VerificationResult {
  verified: boolean;
  statusText: string;
  details: string;
}

export interface MathSolution {
  originalInput: string;
  type: MathProblemType;
  solutionLatex: string;
  solutionText: string;
  spokenSummary: string;
  steps: MathStep[];
  verification: VerificationResult;
  graphableFunction?: string; // e.g. for quadratic or linear functions
}
