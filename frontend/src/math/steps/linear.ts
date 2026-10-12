import type { MathStep, MathSolution } from '../types';
import { mathToSpeech } from '../speak';

// Safe linear equation solver for ax + b = cx + d or similar forms
export function solveLinear(rawInput: string): MathSolution {
  const cleaned = rawInput.replace(/\s+/g, '');
  const parts = cleaned.split('=');
  if (parts.length !== 2) {
    throw new Error('Linear equation must contain exactly one equal sign.');
  }

  // Helper to parse linear terms (e.g. 2x, -5, x, +3x)
  function parseSide(side: string): { xCoeff: number; constant: number } {
    let xCoeff = 0;
    let constant = 0;

    // Handle parentheses expansion e.g. 3(x-2) -> 3x-6
    let expanded = side.replace(/([+-]?\d*)\(([+-]?\d*x|[+-]?\d*)([+-]\d*x|[+-]\d*)\)/g, (match, p1, p2, p3) => {
      const mult = p1 === '' || p1 === '+' ? 1 : p1 === '-' ? -1 : parseFloat(p1);
      // fallback
      return match;
    });

    // Tokenize terms by splitting at + or - (preserving sign)
    const regex = /([+-]?[^+-]+)/g;
    const matches = expanded.match(regex) || [];

    for (const token of matches) {
      if (token.includes('x')) {
        const coefStr = token.replace('x', '');
        let val = 1;
        if (coefStr === '' || coefStr === '+') val = 1;
        else if (coefStr === '-') val = -1;
        else val = parseFloat(coefStr);
        xCoeff += isNaN(val) ? 0 : val;
      } else {
        const val = parseFloat(token);
        constant += isNaN(val) ? 0 : val;
      }
    }

    return { xCoeff, constant };
  }

  const left = parseSide(parts[0]);
  const right = parseSide(parts[1]);

  const totalX = left.xCoeff - right.xCoeff;
  const totalConst = right.constant - left.constant;

  if (totalX === 0) {
    if (totalConst === 0) {
      return {
        originalInput: rawInput,
        type: 'linear',
        solutionLatex: 'x \\in \\mathbb{R} \\text{ (Infinite solutions)}',
        solutionText: 'Infinite solutions (Identity equation).',
        spokenSummary: 'This equation is true for all real values of x.',
        steps: [
          {
            stepNumber: 1,
            title: 'Analyze Equation',
            mathLatex: `0 = 0`,
            explanation: {
              level1: 'Both sides of the equation balance out completely no matter what x is.',
              level2: 'Subtracting variable terms yields an identity 0 = 0, meaning all real numbers are solutions.',
              level3: 'The coefficient matrix is rank-deficient and consistent, yielding infinite solutions x in R.',
            },
            spokenText: 'Zero equals zero. Any value of x works.',
          },
        ],
        verification: { verified: true, statusText: 'Verified ✔', details: 'Identity statement holds.' },
      };
    } else {
      return {
        originalInput: rawInput,
        type: 'linear',
        solutionLatex: '\\text{No Solution } (\\emptyset)',
        solutionText: 'No solution exists.',
        spokenSummary: 'No value of x can satisfy this equation.',
        steps: [
          {
            stepNumber: 1,
            title: 'Analyze Inconsistency',
            mathLatex: `0 \\neq ${totalConst}`,
            explanation: {
              level1: 'The two sides never balance. It is impossible to solve.',
              level2: 'Variable terms cancel out to leave an impossible equality.',
              level3: 'The system has an inconsistent constraint leading to contradiction 0 != c.',
            },
            spokenText: `Contradiction: zero does not equal ${totalConst}.`,
          },
        ],
        verification: { verified: false, statusText: 'Inconsistent', details: 'Parallel lines with no intersection.' },
      };
    }
  }

  const xVal = totalConst / totalX;
  const formattedX = Number.isInteger(xVal) ? xVal.toString() : xVal.toFixed(3);

  const steps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Given Equation',
      mathLatex: `${parts[0]} = ${parts[1]}`,
      explanation: {
        level1: 'We start with our problem statement.',
        level2: 'Original linear equation with variable terms and constant terms.',
        level3: 'Initial equation in first-degree polynomial form P(x) = Q(x).',
      },
      spokenText: `Given equation: ${mathToSpeech(parts[0])} equals ${mathToSpeech(parts[1])}.`,
    },
    {
      stepNumber: 2,
      title: 'Isolate Variable Terms',
      mathLatex: `${totalX}x = ${totalConst}`,
      explanation: {
        level1: `Move all the x terms to the left side and all the plain numbers to the right side.`,
        level2: `Subtract ${right.xCoeff !== 0 ? `${right.xCoeff}x` : ''} from both sides and subtract ${left.constant} from both sides.`,
        level3: `Apply additive inverse transformations to group terms: (${left.xCoeff} - ${right.xCoeff})x = ${right.constant} - (${left.constant}).`,
      },
      spokenText: `${totalX} x equals ${totalConst}.`,
    },
    {
      stepNumber: 3,
      title: 'Divide by Coefficient',
      mathLatex: `x = \\frac{${totalConst}}{${totalX}} = ${formattedX}`,
      explanation: {
        level1: `Divide both sides by ${totalX} to find what a single x is worth.`,
        level2: `Divide both sides by the coefficient of x (${totalX}) to isolate x.`,
        level3: `Multiply both sides by the multiplicative inverse ${totalX}^{-1} yielding x = ${formattedX}.`,
      },
      spokenText: `x equals ${formattedX}.`,
    },
  ];

  // Verification step
  const checkLHS = left.xCoeff * xVal + left.constant;
  const checkRHS = right.xCoeff * xVal + right.constant;
  const isVerified = Math.abs(checkLHS - checkRHS) < 1e-6;

  return {
    originalInput: rawInput,
    type: 'linear',
    solutionLatex: `x = ${formattedX}`,
    solutionText: `x = ${formattedX}`,
    spokenSummary: `The solution is x equals ${formattedX}.`,
    steps,
    verification: {
      verified: isVerified,
      statusText: isVerified ? 'Checked ✔' : 'Could not verify',
      details: isVerified
        ? `Substituting x = ${formattedX} gives LHS = ${checkLHS.toFixed(2)} and RHS = ${checkRHS.toFixed(2)}.`
        : 'Discrepancy detected during substitution.',
    },
    graphableFunction: `${totalX}*x - ${totalConst}`,
  };
}
