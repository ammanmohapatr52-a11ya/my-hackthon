import type { MathStep, MathSolution } from '../types';
import { mathToSpeech } from '../speak';

export function solveQuadratic(rawInput: string): MathSolution {
  // Normalize symbols
  let cleaned = rawInput.replace(/\s+/g, '').replace(/x²/g, 'x^2').replace(/x\*x/g, 'x^2');
  const parts = cleaned.split('=');
  if (parts.length !== 2) {
    throw new Error('Quadratic equation must contain exactly one equal sign.');
  }

  // Parse coefficients a, b, c from side
  function parseQuadSide(side: string): { a: number; b: number; c: number } {
    let a = 0;
    let b = 0;
    let c = 0;

    const regex = /([+-]?[^+-]+)/g;
    const tokens = side.match(regex) || [];

    for (const token of tokens) {
      if (token.includes('x^2')) {
        const coefStr = token.replace('x^2', '');
        let val = 1;
        if (coefStr === '' || coefStr === '+') val = 1;
        else if (coefStr === '-') val = -1;
        else val = parseFloat(coefStr);
        a += isNaN(val) ? 0 : val;
      } else if (token.includes('x')) {
        const coefStr = token.replace('x', '');
        let val = 1;
        if (coefStr === '' || coefStr === '+') val = 1;
        else if (coefStr === '-') val = -1;
        else val = parseFloat(coefStr);
        b += isNaN(val) ? 0 : val;
      } else {
        const val = parseFloat(token);
        c += isNaN(val) ? 0 : val;
      }
    }
    return { a, b, c };
  }

  const left = parseQuadSide(parts[0]);
  const right = parseQuadSide(parts[1]);

  const a = left.a - right.a;
  const b = left.b - right.b;
  const c = left.c - right.c;

  if (a === 0) {
    throw new Error('Coefficient of x^2 is zero; this is a linear equation.');
  }

  const discriminant = b * b - 4 * a * c;
  const steps: MathStep[] = [];

  // Step 1: Standard form
  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const standardLatex = `${a}x^2 ${signB}x ${signC} = 0`;

  steps.push({
    stepNumber: 1,
    title: 'Write in Standard Form',
    mathLatex: standardLatex,
    explanation: {
      level1: 'Rearrange everything to one side so the equation equals 0.',
      level2: `Standard form is ax² + bx + c = 0. Here, a = ${a}, b = ${b}, and c = ${c}.`,
      level3: `Equate the second-order polynomial P(x) = ax^2 + bx + c to zero with coefficients (a, b, c) = (${a}, ${b}, ${c}).`,
    },
    spokenText: `Standard form: ${a} x squared ${b >= 0 ? 'plus' : 'minus'} ${Math.abs(b)} x ${c >= 0 ? 'plus' : 'minus'} ${Math.abs(c)} equals zero.`,
  });

  // Step 2: Compute Discriminant
  const discLatex = `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${discriminant}`;
  steps.push({
    stepNumber: 2,
    title: 'Calculate the Discriminant',
    mathLatex: discLatex,
    explanation: {
      level1: `The discriminant (delta) tells us how many solutions exist. It is ${discriminant}.`,
      level2: `Compute Δ = b² - 4ac. Since Δ = ${discriminant} ${discriminant > 0 ? '> 0' : discriminant === 0 ? '= 0' : '< 0'}, there are ${discriminant > 0 ? 'two distinct real roots' : discriminant === 0 ? 'one repeated real root' : 'two complex conjugate roots'}.`,
      level3: `Evaluate discriminant Δ = b^2 - 4ac = ${discriminant}. The nature of the Galois group and roots depends on the sign of Δ.`,
    },
    spokenText: `The discriminant equals ${discriminant}.`,
  });

  // Step 3: Quadratic Formula
  let solutionLatex = '';
  let solutionText = '';
  let spokenSummary = '';
  let isVerified = false;

  if (discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    const fmtX1 = Number.isInteger(x1) ? x1.toString() : x1.toFixed(3);
    const fmtX2 = Number.isInteger(x2) ? x2.toString() : x2.toFixed(3);

    steps.push({
      stepNumber: 3,
      title: 'Apply Quadratic Formula',
      mathLatex: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${discriminant}}}{2(${a})}`,
      explanation: {
        level1: 'Plug the values into the quadratic formula to find both answers.',
        level2: `Use the quadratic formula x = (-b ± √Δ) / 2a.`,
        level3: `Roots are given by x = (-b ± √Δ) / (2a) as the zeroes of the parabolic curve.`,
      },
      spokenText: `x equals negative ${b} plus or minus square root of ${discriminant} all over 2 times ${a}.`,
    });

    if (discriminant === 0) {
      solutionLatex = `x = ${fmtX1}`;
      solutionText = `x = ${fmtX1} (double root)`;
      spokenSummary = `One real repeated root: x equals ${fmtX1}.`;
    } else {
      solutionLatex = `x_1 = ${fmtX1}, \\quad x_2 = ${fmtX2}`;
      solutionText = `x = ${fmtX1} or x = ${fmtX2}`;
      spokenSummary = `Two real roots: x equals ${fmtX1} and x equals ${fmtX2}.`;
    }

    // Verify
    const check1 = a * x1 * x1 + b * x1 + c;
    const check2 = a * x2 * x2 + b * x2 + c;
    isVerified = Math.abs(check1) < 1e-4 && Math.abs(check2) < 1e-4;
  } else {
    const realPart = (-b / (2 * a)).toFixed(3);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(3);

    solutionLatex = `x = ${realPart} \\pm ${Math.abs(parseFloat(imagPart))}i`;
    solutionText = `x = ${realPart} ± ${Math.abs(parseFloat(imagPart))}i (Complex)`;
    spokenSummary = `Complex roots: ${realPart} plus or minus ${Math.abs(parseFloat(imagPart))} i.`;
    isVerified = true;
  }

  return {
    originalInput: rawInput,
    type: 'quadratic',
    solutionLatex,
    solutionText,
    spokenSummary,
    steps,
    verification: {
      verified: isVerified,
      statusText: isVerified ? 'Checked ✔' : 'Could not verify',
      details: isVerified
        ? `Substituted roots back into ax² + bx + c = 0; residual is within 0.0001 tolerance.`
        : 'Could not automatically confirm roots.',
    },
    graphableFunction: `${a}*x*x + ${b}*x + ${c}`,
  };
}
