/**
 * Converts mathematical expressions / LaTeX to natural English spoken sentences for TTS.
 */
export function mathToSpeech(input: string): string {
  if (!input) return '';

  let text = input;

  // Replace common LaTeX constructs
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2');
  text = text.replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1');
  text = text.replace(/\\pm/g, 'plus or minus');
  text = text.replace(/\\cdot/g, ' times ');
  text = text.replace(/\\times/g, ' times ');
  text = text.replace(/\\approx/g, ' approximately equals ');
  text = text.replace(/\\neq/g, ' is not equal to ');
  text = text.replace(/\\le|\\leq/g, ' is less than or equal to ');
  text = text.replace(/\\ge|\\geq/g, ' is greater than or equal to ');
  text = text.replace(/\\Delta/g, 'delta');
  text = text.replace(/\\pi/g, 'pi');

  // Powers and exponents
  text = text.replace(/([a-zA-Z0-9]+)\^2/g, '$1 squared');
  text = text.replace(/([a-zA-Z0-9]+)\^3/g, '$1 cubed');
  text = text.replace(/([a-zA-Z0-9]+)\^\{([^}]+)\}/g, '$1 to the power of $2');
  text = text.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '$1 to the power of $2');

  // Derivatives
  text = text.replace(/d\/dx/g, 'the derivative with respect to x of');
  text = text.replace(/\\frac\{d\}\{dx\}/g, 'the derivative with respect to x of');

  // Operations
  text = text.replace(/\+/g, ' plus ');
  text = text.replace(/-/g, ' minus ');
  text = text.replace(/\*/g, ' times ');
  text = text.replace(/\//g, ' divided by ');
  text = text.replace(/=/g, ' equals ');

  // Coefficients (e.g. 2x -> 2 x)
  text = text.replace(/(\d+)([a-zA-Z])/g, '$1 $2');

  // Clean up excess spacing
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
