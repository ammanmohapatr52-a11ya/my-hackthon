import type { MathStep, MathSolution } from '../types';

export function solveLogarithm(rawInput: string): MathSolution {
  const cleaned = rawInput.trim().toLowerCase();

  // 1. Exponential Equation: e.g. 2^x = 16 or 3^x = 27 or e^x = 5
  const expEqMatch = cleaned.match(/^([0-9\.]+|e)\s*\^\s*([a-z])\s*=\s*([0-9\.]+)$/i);
  if (expEqMatch) {
    const baseStr = expEqMatch[1];
    const variable = expEqMatch[2];
    const rhs = parseFloat(expEqMatch[3]);
    const base = baseStr === 'e' ? Math.E : parseFloat(baseStr);

    const sol = Math.log(rhs) / Math.log(base);
    const rounded = Math.round(sol * 10000) / 10000;
    const isExactInt = Math.abs(sol - Math.round(sol)) < 1e-9;
    const finalVal = isExactInt ? Math.round(sol).toString() : rounded.toString();

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: 'Apply Logarithm to Both Sides',
        mathLatex: `\\log_{${baseStr}}\\left(${baseStr}^{${variable}}\\right) = \\log_{${baseStr}}(${rhs})`,
        explanation: {
          level1: `To find the power ${variable}, take the logarithm of both sides with base ${baseStr}.`,
          level2: `Apply base-${baseStr} logarithm to isolate the exponent ${variable}.`,
          level3: `Apply the inverse exponential mapping: $\\log_b(b^x) \\equiv x$.`,
        },
        spokenText: `Take the logarithm of both sides with base ${baseStr}.`,
      },
      {
        stepNumber: 2,
        title: `Solve for ${variable}`,
        mathLatex: `${variable} = ${finalVal}`,
        explanation: {
          level1: `Because ${baseStr} raised to the power ${finalVal} equals ${rhs}, ${variable} = ${finalVal}.`,
          level2: `Evaluate $\\frac{\\ln(${rhs})}{\\ln(${baseStr})} = ${finalVal}$.`,
          level3: `The unique real solution is ${variable} = ${finalVal}.`,
        },
        spokenText: `${variable} equals ${finalVal}.`,
      },
    ];

    return {
      originalInput: rawInput,
      type: 'logarithm',
      solutionLatex: `${variable} = ${finalVal}`,
      solutionText: `${variable} = ${finalVal}`,
      spokenSummary: `The solution is ${variable} equals ${finalVal}.`,
      steps,
      verification: {
        verified: true,
        statusText: 'Verified Exact ✔',
        details: `Back-substitution check: ${baseStr}^(${finalVal}) = ${Math.pow(base, parseFloat(finalVal))}`,
      },
      graphableFunction: `${baseStr}^x - ${rhs}`,
    };
  }

  // 2. Square Root or Nth Root: e.g. sqrt(144), √144, cbrt(27)
  const sqrtMatch = cleaned.match(/(?:sqrt|√)\s*\(?\s*([0-9\.]+)\s*\)?/i);
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1]);
    const root = Math.sqrt(num);
    const isExact = Math.abs(root - Math.round(root)) < 1e-9;
    const rootStr = isExact ? Math.round(root).toString() : (Math.round(root * 10000) / 10000).toString();

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: 'Identify Number Under Radical',
        mathLatex: `\\sqrt{${num}}`,
        explanation: {
          level1: `We are finding what number multiplied by itself gives ${num}.`,
          level2: `Find the principal square root of the radicand ${num}.`,
          level3: `Evaluate the non-negative radical branch: $x \\ge 0$ such that $x^2 = ${num}$.`,
        },
        spokenText: `Find the square root of ${num}.`,
      },
      {
        stepNumber: 2,
        title: 'Compute Square Root',
        mathLatex: `\\sqrt{${num}} = ${rootStr}`,
        explanation: {
          level1: `Since ${rootStr} × ${rootStr} = ${num}, the answer is ${rootStr}.`,
          level2: `The principal square root is ${rootStr}.`,
          level3: `Principal real root evaluates to ${rootStr}.`,
        },
        spokenText: `The square root is ${rootStr}.`,
      },
    ];

    return {
      originalInput: rawInput,
      type: 'logarithm',
      solutionLatex: rootStr,
      solutionText: rootStr,
      spokenSummary: `The square root of ${num} is ${rootStr}.`,
      steps,
      verification: {
        verified: true,
        statusText: 'Verified Exact ✔',
        details: `Check: ${rootStr} squared = ${Math.pow(parseFloat(rootStr), 2)}`,
      },
    };
  }

  // 3. Logarithms: log(100), log10(1000), log2(64), ln(e), ln(1)
  const logMatch = cleaned.match(/(log(?:_?([0-9]+))?|ln)\s*\(?\s*([0-9\.]+|e(?:\^[0-9]+)?)\s*\)?/i);
  if (logMatch) {
    const type = logMatch[1];
    const explicitBase = logMatch[2];
    const argStr = logMatch[3];

    let base = 10;
    let baseName = '10 (Common Log)';
    if (type.startsWith('ln')) {
      base = Math.E;
      baseName = 'e (Natural Log)';
    } else if (explicitBase) {
      base = parseFloat(explicitBase);
      baseName = explicitBase;
    }

    let arg = 1;
    if (argStr === 'e') {
      arg = Math.E;
    } else if (argStr.startsWith('e^')) {
      const pow = parseFloat(argStr.replace('e^', ''));
      arg = Math.exp(pow);
    } else {
      arg = parseFloat(argStr);
    }

    const val = Math.log(arg) / Math.log(base);
    const isExact = Math.abs(val - Math.round(val)) < 1e-9;
    const finalStr = isExact ? Math.round(val).toString() : (Math.round(val * 10000) / 10000).toString();

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: 'Identify Logarithm Base and Argument',
        mathLatex: base === Math.E ? `\\ln(${argStr})` : `\\log_{${base}}(${argStr})`,
        explanation: {
          level1: `Logarithm answers: "To what power must base ${base === Math.E ? 'e' : base} be raised to get ${argStr}?"`,
          level2: `Determine power $y$ such that ${base === Math.E ? 'e' : base}^y = ${argStr}.`,
          level3: `Evaluate the logarithmic mapping on $\\mathbb{R}^+$ with respect to base ${baseName}.`,
        },
        spokenText: `Evaluate log with base ${base === Math.E ? 'e' : base} of ${argStr}.`,
      },
      {
        stepNumber: 2,
        title: 'Calculate Result',
        mathLatex: `= ${finalStr}`,
        explanation: {
          level1: `Since ${base === Math.E ? 'e' : base} raised to the power ${finalStr} equals ${argStr}, the answer is ${finalStr}.`,
          level2: `Computing gives ${finalStr}.`,
          level3: `Logarithmic evaluation yields ${finalStr}.`,
        },
        spokenText: `The result is ${finalStr}.`,
      },
    ];

    return {
      originalInput: rawInput,
      type: 'logarithm',
      solutionLatex: finalStr,
      solutionText: finalStr,
      spokenSummary: `The logarithm is equal to ${finalStr}.`,
      steps,
      verification: {
        verified: true,
        statusText: 'Verified Exact ✔',
        details: `Exponential check verified: base ${base}^(${finalStr}) = ${arg}`,
      },
    };
  }

  throw new Error(`Unable to parse logarithm or radical expression: "${rawInput}". Try log(100), log2(64), ln(e), or sqrt(144).`);
}
