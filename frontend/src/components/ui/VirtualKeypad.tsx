import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Calculator, Sparkles, Hash, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface VirtualKeypadProps {
  onInsert: (text: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const VirtualKeypad: React.FC<VirtualKeypadProps> = ({
  onInsert,
  isOpen = true,
  onToggle,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'math' | 'numbers' | 'starters'>('math');

  // Math and Scientific Notation Symbols
  const mathSymbols = [
    { label: 'x²', insert: '²' },
    { label: 'x³', insert: '³' },
    { label: '√', insert: '√' },
    { label: 'π', insert: 'π' },
    { label: 'θ', insert: 'θ' },
    { label: '±', insert: '±' },
    { label: '×', insert: '×' },
    { label: '÷', insert: '÷' },
    { label: '≠', insert: '≠' },
    { label: '≤', insert: '≤' },
    { label: '≥', insert: '≥' },
    { label: '≈', insert: '≈' },
    { label: '∞', insert: '∞' },
    { label: '°', insert: '°' },
    { label: 'Δ', insert: 'Δ' },
    { label: 'α', insert: 'α' },
    { label: 'β', insert: 'β' },
    { label: 'λ', insert: 'λ' },
    { label: '½', insert: '½' },
    { label: '¼', insert: '¼' },
    { label: '( )', insert: '()' },
    { label: '[ ]', insert: '[]' },
    { label: '→', insert: '→' },
    { label: '∑', insert: '∑' },
    { label: '∫', insert: '∫' },
    { label: '^', insert: '^' },
  ];

  // Number & Basic Operator Pad
  const numPad = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  // Common Academic Sentence Starters
  const getStarters = () => {
    if (language === 'or') {
      return [
        { label: "ଏହାର ସୂତ୍ର କ'ଣ...", insert: "ଏହାର ସୂତ୍ର କ'ଣ? " },
        { label: "ଏହାର ସଂଜ୍ଞା କ'ଣ...", insert: "ଏହାର ସଂଜ୍ଞା ଓ ଅର୍ଥ କ'ଣ? " },
        { label: "କାହିଁକି ଘଟେ...", insert: "ଏହା କାହିଁକି ଏବଂ କିପରି ଘଟେ? " },
        { label: "ମୁଖ୍ୟ ନିୟମ କ'ଣ...", insert: "ଏହାର ମୁଖ୍ୟ ନିୟମ ଉଲ୍ଲେଖ କରନ୍ତୁ: " },
        { label: "ପାର୍ଥକ୍ୟ ଦର୍ଶାନ୍ତୁ...", insert: "ଉଭୟ ମଧ୍ୟରେ ମୁଖ୍ୟ ପାର୍ଥକ୍ୟ କ'ଣ? " },
        { label: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କାର୍ଯ୍ୟ...", insert: "ଏହାର ପ୍ରଧାନ କାର୍ଯ୍ୟଗୁଡ଼ିକ କ'ଣ? " },
      ];
    }
    if (language === 'hi') {
      return [
        { label: "इसका सूत्र क्या है...", insert: "इसका मुख्य सूत्र क्या है? " },
        { label: "इसकी परिभाषा क्या है...", insert: "इसकी सटीक परिभाषा बताएं: " },
        { label: "यह क्यों और कैसे होता है...", insert: "यह प्रक्रिया क्यों और कैसे होती है? " },
        { label: "मुख्य नियम बताएं...", insert: "इसका वैज्ञानिक नियम क्या है? " },
        { label: "अंतर स्पष्ट करें...", insert: "इन दोनों के बीच मुख्य अंतर क्या है? " },
        { label: "मुख्य कार्य क्या हैं...", insert: "इसके प्रमुख कार्य और उपयोग क्या हैं? " },
      ];
    }
    return [
      { label: "What is the formula for...", insert: "What is the formula for " },
      { label: "Define the concept of...", insert: "Define the concept of " },
      { label: "Explain why and how...", insert: "Explain why and how " },
      { label: "State the law of...", insert: "State the fundamental law of " },
      { label: "What are the key functions of...", insert: "What are the main functions of " },
      { label: "What is the difference between...", insert: "What is the key difference between " },
    ];
  };

  const starters = getStarters();

  return (
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem',
        marginTop: '0.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header bar with Tab switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.6rem',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ⌨️ {t('keypad.title', 'Easy On-Screen Writing & Symbols')}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'math' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('math')}
            style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}
          >
            <Calculator size={13} /> {t('keypad.tab_math', 'Symbols')}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'numbers' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('numbers')}
            style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}
          >
            <Hash size={13} /> {t('keypad.tab_numbers', '123')}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'starters' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('starters')}
            style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}
          >
            <Sparkles size={13} /> {t('keypad.tab_starters', 'Phrases')}
          </button>
        </div>
      </div>

      {/* Math Symbols Tab */}
      {activeTab === 'math' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
            gap: '5px',
          }}
        >
          {mathSymbols.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(item.insert)}
              title={`Insert ${item.label}`}
              aria-label={`Insert symbol ${item.label}`}
              style={{
                height: '36px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-elevated)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Numbers & Arithmetic Tab */}
      {activeTab === 'numbers' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '5px',
            maxWidth: '240px',
            margin: '0 auto',
          }}
        >
          {numPad.map((num, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(num)}
              style={{
                height: '36px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-elevated)';
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Academic Question Starters Tab */}
      {activeTab === 'starters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {starters.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(item.insert)}
              style={{
                padding: '6px 10px',
                textAlign: 'left',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-elevated)';
              }}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>+ Add</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
