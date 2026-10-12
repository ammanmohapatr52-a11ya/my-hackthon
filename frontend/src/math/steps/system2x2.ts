import type { MathStep, MathSolution } from '../types';

export function solveSystem2x2(rawInput: string): MathSolution {
  const parts = rawInput.split(/[,;\n]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) {
    throw new Error('System of 2 equations requires two equations separated by comma or semicolon.');
  }

  function parseEquation(eqStr: string): { a: number; b: number; c: number } {
    const sides = eqStr.replace(/\s+/g, '').split('=');
    if (sides.length !== 2) throw new Error(`Invalid equation: ${eqStr}`);

    let a = 0;
    let b = 0;
    let c = 0;

    const regex = /([+-]?[^+-]+)/g;
    const tokens = sides[0].match(regex) || [];

    for (const token of tokens) {
      if (token.includes('x')) {
        const coefStr = token.replace('x', '');
        let val = 1;
        if (coefStr === '' || coefStr === '+') val = 1;
        else if (coefStr === '-') val = -1;
        else val = parseFloat(coefStr);
        a += isNaN(val) ? 0 : val;
      } else if (token.includes('y')) {
        const coefStr = token.replace('y', '');
        let val = 1;
        if (coefStr === '' || coefStr === '+') val = 1;
        else if (coefStr === '-') val = -1;
        else val = parseFloat(coefStr);
        b += isNaN(val) ? 0 : val;
      } else {
        const val = parseFloat(token);
        c -= isNaN(val) ? 0 : val;
      }
    }

    const rhs = parseFloat(sides[1]);
    c += isNaN(rhs) ? 0 : rhs;

    return { a, b, c };
  }

  const eq1 = parseEquation(parts[0]);
  const eq2 = parseEquation(parts[1]);

  // Determinant D = a1*b2 - a2*b1
  const D = eq1.a * eq2.b - eq2.a * eq1.b;
  const Dx = eq1.c * eq2.b - eq2.c * eq1.b;
  const Dy = eq1.a * eq2.c - eq2.a * eq1.c;

  if (D === 0) {
    if (Dx === 0 && Dy === 0) {
      return {
        originalInput: rawInput,
        type: 'system2x2',
        solutionLatex: '\\text{Infinite Solutions (Dependent Lines)}',
        solutionText: 'Infinite solutions exist along the coincident line.',
        spokenSummary: 'The two equations describe the same line, resulting in infinite solutions.',
        steps: [],
        verification: { verified: true, statusText: 'Verified ✔', details: 'System is linearly dependent.' },
      };
    } else {
      return {
        originalInput: rawInput,
        type: 'system2x2',
        solutionLatex: '\\text{No Solution (Parallel Lines)}',
        solutionText: 'No common intersection point exists.',
        spokenSummary: 'The equations represent parallel lines that never intersect.',
        steps: [],
        verification: { verified: false, statusText: 'Inconsistent', details: 'Determinant is zero with non-zero numerator.' },
      };
    }
  }

  const x = Dx / D;
  const y = Dy / D;

  const fmtX = Number.isInteger(x) ? x.toString() : x.toFixed(2);
  const fmtY = Number.isInteger(y) ? y.toString() : y.toFixed(2);

  const steps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Given System of Equations',
      mathLatex: `\\begin{cases} ${parts[0]} \\\\ ${parts[1]} \\end{cases}`,
      explanation: {
        level1: 'We have two equations with two mystery variables, x and y.',
        level2: `Equation 1: ${parts[0]} and Equation 2: ${parts[1]}. We can solve by substitution or elimination.`,
        level3: 'A system of linear equations in matrix form AX = B where det(A) != 0 guarantees a unique solution vector.',
      },
      spokenText: `Given system of equations: ${parts[0]}, and ${parts[1]}.`,
    },
    {
      stepNumber: 2,
      title: "Eliminate Variable / Cramer's Rule",
      mathLatex: `D = (${eq1.a})(${eq2.b}) - (${eq2.a})(${eq1.b}) = ${D}`,
      explanation: {
        level1: 'Combine equations to cancel out one of the variables.',
        level2: `Calculate determinant D = ${D}. Since D != 0, a unique pair (x, y) exists.`,
        level3: `det(A) = a1*b2 - a2*b1 = ${D}.`,
      },
      spokenText: `The determinant D equals ${D}.`,
    },
    {
      stepNumber: 3,
      title: 'Solve for x and y',
      mathLatex: `x = \\frac{D_x}{D} = \\frac{${Dx}}{${D}} = ${fmtX}, \\quad y = \\frac{D_y}{D} = \\frac{${Dy}}{${D}} = ${fmtY}`,
      explanation: {
        level1: `We find that x = ${fmtX} and y = ${fmtY}.`,
        level2: `Divide the determinants to yield x = ${fmtX} and y = ${fmtY}.`,
        level3: `The intersection coordinates of the two linear subspaces are (${fmtX}, ${fmtY}).`,
      },
      spokenText: `x equals ${fmtX}, and y equals ${fmtY}.`,
    },
  ];

  // Verify
  const check1 = Math.abs(eq1.a * x + eq1.b * y - eq1.c) < 1e-4;
  const check2 = Math.abs(eq2.a * x + eq2.b * y - eq2.c) < 1e-4;
  const isVerified = check1 && check2;

  return {
    originalInput: rawInput,
    type: 'system2x2',
    solutionLatex: `(x, y) = (${fmtX}, ${fmtY})`,
    solutionText: `x = ${fmtX}, y = ${fmtY}`,
    spokenSummary: `The solution is x equals ${fmtX} and y equals ${fmtY}.`,
    steps,
    verification: {
      verified: isVerified,
      statusText: isVerified ? 'Checked ✔' : 'Could not verify',
      details: isVerified
        ? `Both equations hold: ${eq1.a}(${fmtX}) + ${eq1.b}(${fmtY}) = ${eq1.c} and ${eq2.a}(${fmtX}) + ${eq2.b}(${fmtY}) = ${eq2.c}.`
        : 'Discrepancy in system verification.',
    },
  };
}
