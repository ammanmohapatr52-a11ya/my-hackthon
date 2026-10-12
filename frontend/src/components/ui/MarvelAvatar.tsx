import React from 'react';

export type MarvelHeroId =
  | 'ironman'
  | 'cap'
  | 'spiderman'
  | 'thor'
  | 'strange'
  | 'jarvis'
  | 'panther'
  | 'hulk';

export type MarvelHero = MarvelHeroId;

interface MarvelAvatarProps {
  hero: MarvelHeroId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

const SIZE_MAP = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 42,
  xl: 54,
};

const HERO_CONFIG: Record<
  MarvelHeroId,
  {
    name: string;
    image?: string;
    borderColor: string;
    glowColor: string;
    bgGradient: string;
    fallbackEmoji: string;
  }
> = {
  ironman: {
    name: 'Iron Man (Stark Arc Reactor)',
    image: '/images/ironman_avatar.jpg',
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.75)',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #f59e0b 100%)',
    fallbackEmoji: '🦾',
  },
  cap: {
    name: 'Captain America (Vibranium Shield)',
    image: '/images/cap_avatar.jpg',
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    bgGradient: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
    fallbackEmoji: '🛡️',
  },
  spiderman: {
    name: 'Spider-Man (Web Slinger)',
    borderColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.65)',
    bgGradient: 'linear-gradient(135deg, #e11d48 0%, #1e40af 100%)',
    fallbackEmoji: '🕷️',
  },
  thor: {
    name: 'Thor (Mjolnir Thunder)',
    borderColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.65)',
    bgGradient: 'linear-gradient(135deg, #ca8a04 0%, #0284c7 100%)',
    fallbackEmoji: '⚡',
  },
  strange: {
    name: 'Doctor Strange (Eye of Agamotto)',
    borderColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.65)',
    bgGradient: 'linear-gradient(135deg, #059669 0%, #ea580c 100%)',
    fallbackEmoji: '🔮',
  },
  jarvis: {
    name: 'J.A.R.V.I.S. (Holographic AI)',
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.8)',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    fallbackEmoji: '🤖',
  },
  panther: {
    name: 'Black Panther (Wakanda Vibranium)',
    borderColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    bgGradient: 'linear-gradient(135deg, #7e22ce 0%, #1e1b4b 100%)',
    fallbackEmoji: '🐾',
  },
  hulk: {
    name: 'Hulk (Gamma Radiation)',
    borderColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.65)',
    bgGradient: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)',
    fallbackEmoji: '💪',
  },
};

export const MarvelAvatar: React.FC<MarvelAvatarProps> = ({
  hero,
  size = 'md',
  glow = true,
  className = '',
  style = {},
  title,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const px = SIZE_MAP[size];
  const config = HERO_CONFIG[hero] || HERO_CONFIG.ironman;

  return (
    <div
      className={`marvel-hero-avatar ${className}`}
      title={title || config.name}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        minWidth: `${px}px`,
        minHeight: `${px}px`,
        borderRadius: '50%',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${config.borderColor}`,
        boxShadow: glow
          ? `0 0 10px ${config.glowColor}, inset 0 0 6px ${config.glowColor}`
          : '0 2px 6px rgba(0,0,0,0.4)',
        background: config.bgGradient,
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {config.image && !imgFailed ? (
        <img
          src={config.image}
          alt={config.name}
          onError={() => setImgFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      ) : (
        <span
          style={{
            fontSize: `${px * 0.55}px`,
            lineHeight: 1,
            filter: glow ? `drop-shadow(0 0 4px ${config.borderColor})` : 'none',
          }}
        >
          {config.fallbackEmoji}
        </span>
      )}
    </div>
  );
};

interface AvatarHighlightProps {
  hero?: MarvelHeroId;
  label?: string;
  badgeText?: string;
  variant?: 'badge' | 'card' | 'pill' | 'step';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable AvatarHighlight component
 * Accents any element, card, or math step with a superhero avatar and glowing Stark halo
 */
export const AvatarHighlight: React.FC<AvatarHighlightProps> = ({
  hero = 'ironman',
  label,
  badgeText,
  variant = 'badge',
  children,
  style = {},
  className = '',
}) => {
  const config = HERO_CONFIG[hero] || HERO_CONFIG.ironman;

  if (variant === 'pill') {
    return (
      <div
        className={`avatar-highlight-pill ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px 4px 6px',
          borderRadius: '9999px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: `1.5px solid ${config.borderColor}`,
          boxShadow: `0 0 14px ${config.glowColor}`,
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#f8fafc',
          ...style,
        }}
      >
        <MarvelAvatar hero={hero} size="xs" />
        <span>{children}</span>
        {badgeText && (
          <span
            style={{
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: '999px',
              background: config.glowColor,
              color: '#ffffff',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'step') {
    return (
      <div
        className={`avatar-highlight-step ${className}`}
        style={{
          position: 'relative',
          borderLeft: `4px solid ${config.borderColor}`,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 16px ${config.glowColor}`,
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <MarvelAvatar hero={hero} size="sm" />
          {label && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: config.borderColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {label}
            </span>
          )}
          {badgeText && (
            <span style={{ fontSize: '0.72rem', padding: '1px 7px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 600 }}>
              {badgeText}
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }

  // Default 'card' variant
  return (
    <div
      className={`avatar-highlight-card ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.9) 100%)',
        backdropFilter: 'blur(14px)',
        border: `1.5px solid ${config.borderColor}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${config.glowColor}`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <MarvelAvatar hero={hero} size="md" />
        <div>
          {label && (
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: config.borderColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </div>
          )}
          {badgeText && (
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
              {badgeText}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default MarvelAvatar;
