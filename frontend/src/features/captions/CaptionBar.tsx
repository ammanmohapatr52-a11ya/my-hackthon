import React, { useState } from 'react';
import { Volume2, ChevronUp, ChevronDown, X, Subtitles } from 'lucide-react';
import { useAccessibility } from '../../accessibility/AccessibilityContext';

interface CaptionBarProps {
  currentCaption: string;
  isPlaying: boolean;
  onStop?: () => void;
}

export const CaptionBar: React.FC<CaptionBarProps> = ({
  currentCaption,
  isPlaying,
  onStop,
}) => {
  const { modes } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If captions mode is enabled, or speech is actively playing
  const shouldShow = (modes.captions || isPlaying) && !isDismissed && (currentCaption || isPlaying);

  if (!shouldShow) return null;

  return (
    <aside
      className="caption-bar"
      role="region"
      aria-label="Live Synchronized Captions"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Subtitles size={18} color="var(--accent-primary)" />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--accent-primary)',
            }}
          >
            Live Captions {isPlaying ? '· Speaking' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse caption bar' : 'Expand caption bar'}
            style={{ padding: '4px 8px' }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            <span style={{ fontSize: '0.75rem' }}>{isExpanded ? 'Smaller' : 'Larger'}</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsDismissed(true)}
            aria-label="Close caption bar"
            style={{ padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        style={{
          fontSize: isExpanded ? '1.5rem' : '1.15rem',
          fontWeight: 600,
          color: '#FFFFFF',
          lineHeight: 1.4,
          padding: '0.25rem 0',
          transition: 'font-size 0.2s ease',
        }}
      >
        {currentCaption ? (
          <span>"{currentCaption}"</span>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Ready for spoken text...
          </span>
        )}
      </div>
    </aside>
  );
};
