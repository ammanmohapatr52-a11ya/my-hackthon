import type { MathProblemType } from './types';

export function classifyProblem(input: string): MathProblemType {
  const cleaned = input.trim().toLowerCase();

  // 1. Derivative check
  if (cleaned.includes('d/dx') || cleaned.includes('derivative') || cleaned.startsWith('diff(')) {
    return 'derivative';
  }

  // 2. Calculus Integral check
  if (
    cleaned.includes('\\int') ||
    cleaned.startsWith('integrate') ||
    cleaned.startsWith('int(') ||
    /int\s+/.test(cleaned) ||
    cleaned.endsWith(' dx')
  ) {
    return 'integral';
  }

  // 3. Trigonometry check: sin(30), cos(45), tan(60), sin^2 + cos^2
  if (
    /(sin|cos|tan|cot|sec|csc)\s*\(?/i.test(cleaned) ||
    (cleaned.includes('sin^2') && cleaned.includes('cos^2'))
  ) {
    return 'trigonometry';
  }

  // 4. Logarithm and Radicals: log(100), ln(e), sqrt(144), 2^x = 16
  if (
    /(log|ln|sqrt|√)\s*\(?/i.test(cleaned) ||
    /^[0-9\.]+\s*\^\s*[a-z]\s*=\s*[0-9\.]+$/i.test(cleaned)
  ) {
    return 'logarithm';
  }

  // 5. Advanced arithmetic: percent, factorial, gcd, lcm
  if (
    cleaned.includes('%') ||
    cleaned.includes('!') ||
    /(gcd|hcf|lcm)\s*\(?/i.test(cleaned)
  ) {
    return 'arithmetic_advanced';
  }

  // 6. System of 2 equations check (contains separator like comma or semicolon or newline, and both x and y)
  if ((cleaned.includes(',') || cleaned.includes(';') || cleaned.includes('\n')) && cleaned.includes('=')) {
    const parts = cleaned.split(/[,;\n]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 2 && parts[0].includes('=') && parts[1].includes('=')) {
      return 'system2x2';
    }
  }

  // 7. Quadratic check
  if (
    cleaned.includes('=') &&
    (cleaned.includes('x^2') || cleaned.includes('x²') || cleaned.includes('x*x') || /x\s*\^\s*2/.test(cleaned))
  ) {
    return 'quadratic';
  }

  // 8. Linear equation check (contains '=' and variable 'x' or 'y')
  if (cleaned.includes('=') && /[a-z]/i.test(cleaned)) {
    return 'linear';
  }

  // 9. Simplification of algebraic expression (no '=')
  if (/[a-z]/i.test(cleaned) && !cleaned.includes('=')) {
    return 'simplify';
  }

  // 10. Pure arithmetic evaluation (e.g. 14 + 5 * 2)
  if (/^[\d\s\+\-\*\/\^\(\)\.\%]+$/.test(cleaned)) {
    return 'expression';
  }

  return 'unsupported';
}
