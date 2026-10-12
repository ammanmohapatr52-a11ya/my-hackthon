import type { MathSolution } from './types';
import { classifyProblem } from './classify';
import { solveLinear } from './steps/linear';
import { solveQuadratic } from './steps/quadratic';
import { solveSystem2x2 } from './steps/system2x2';
import { solveDerivative } from './steps/derivative';
import { solveSimplify } from './steps/simplify';
import { solveExpression } from './steps/expression';
import { solveTrigonometry } from './steps/trigonometry';
import { solveLogarithm } from './steps/logarithm';
import { solveIntegral } from './steps/integral';
import { solveArithmeticAdvanced } from './steps/arithmeticAdvanced';

export function solveMathProblem(input: string): MathSolution {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Please enter a mathematical expression or equation.');
  }

  const type = classifyProblem(trimmed);

  try {
    switch (type) {
      case 'linear':
        return solveLinear(trimmed);
      case 'quadratic':
        return solveQuadratic(trimmed);
      case 'system2x2':
        return solveSystem2x2(trimmed);
      case 'derivative':
        return solveDerivative(trimmed);
      case 'integral':
        return solveIntegral(trimmed);
      case 'trigonometry':
        return solveTrigonometry(trimmed);
      case 'logarithm':
        return solveLogarithm(trimmed);
      case 'arithmetic_advanced':
        return solveArithmeticAdvanced(trimmed);
      case 'simplify':
        return solveSimplify(trimmed);
      case 'expression':
        return solveExpression(trimmed);
      case 'unsupported':
      default:
        return {
          originalInput: trimmed,
          type: 'unsupported',
          solutionLatex: '\\text{Unsupported Problem Type}',
          solutionText: 'This specific problem type is not currently in the deterministic math rulebook. You can solve it using our AI Mathematical Reasoning Engine.',
          spokenSummary: 'This problem type can be solved using our AI Mathematical Reasoning Engine.',
          steps: [],
          verification: {
            verified: false,
            statusText: 'AI Solver Available',
            details: 'Supported deterministic types: Linear, Quadratic, 2x2 Systems, Derivatives, Integrals, Trigonometry, Logarithms, Percentages/Factorials, and Arithmetic.',
          },
        };
    }
  } catch (err: any) {
    return {
      originalInput: trimmed,
      type: 'unsupported',
      solutionLatex: '\\text{Could not parse}',
      solutionText: err.message || 'Unable to solve this expression.',
      spokenSummary: 'Could not solve this expression. Please check the equation formatting or use AI Reasoning.',
      steps: [],
      verification: {
        verified: false,
        statusText: 'Parse Error',
        details: err.message || 'Syntax error encountered during parsing.',
      },
    };
  }
}
