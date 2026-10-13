import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Layers, Info } from 'lucide-react';
import { INDIA_STATES, type IndiaStateData } from './indiaStatesData';

interface IndiaSvgMapProps {
  selectedStateId: string;
  onSelectState: (stateId: string) => void;
}

// Visual definition for each State and UT on the SVG map (viewBox: 0 0 920 1000)
interface StateMapRegion {
  id: string;
  name: string;
  shortCode: string;
  labelX: number;
  labelY: number;
  path: string;
  zone: string;
  isUT?: boolean;
}

const STATE_REGIONS: StateMapRegion[] = [
  // --- NORTHERN REGION ---
  {
    id: 'ladakh',
    name: 'Ladakh',
    shortCode: 'LA',
    labelX: 400,
    labelY: 95,
    zone: 'UT',
    isUT: true,
    path: 'M 330,30 L 460,35 L 530,95 L 490,165 L 430,165 L 390,140 L 335,110 Z',
  },
  {
    id: 'jammu_kashmir',
    name: 'Jammu & Kashmir',
    shortCode: 'JK',
    labelX: 285,
    labelY: 115,
    zone: 'UT',
    isUT: true,
    path: 'M 330,30 L 335,110 L 290,145 L 240,135 L 235,95 L 280,65 Z',
  },
  {
    id: 'himachal_pradesh',
    name: 'Himachal Pradesh',
    shortCode: 'HP',
    labelX: 365,
    labelY: 185,
    zone: 'North',
    path: 'M 290,145 L 390,140 L 430,165 L 420,215 L 375,230 L 325,200 L 315,170 Z',
  },
  {
    id: 'punjab',
    name: 'Punjab',
    shortCode: 'PB',
    labelX: 285,
    labelY: 220,
    zone: 'North',
    path: 'M 240,135 L 290,145 L 315,170 L 325,200 L 315,245 L 255,255 L 235,195 Z',
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    shortCode: 'CH',
    labelX: 325,
    labelY: 220,
    zone: 'UT',
    isUT: true,
    path: 'M 320,215 L 335,215 L 335,225 L 320,225 Z',
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    shortCode: 'UK',
    labelX: 435,
    labelY: 225,
    zone: 'North',
    path: 'M 420,215 L 485,210 L 495,260 L 440,270 L 395,255 L 375,230 Z',
  },
  {
    id: 'haryana',
    name: 'Haryana',
    shortCode: 'HR',
    labelX: 325,
    labelY: 275,
    zone: 'North',
    path: 'M 315,245 L 375,230 L 395,255 L 380,310 L 310,315 L 285,280 L 255,255 Z',
  },
  {
    id: 'delhi',
    name: 'Delhi (NCT)',
    shortCode: 'DL',
    labelX: 350,
    labelY: 288,
    zone: 'UT',
    isUT: true,
    path: 'M 342,282 L 358,282 L 358,296 L 342,296 Z',
  },

  // --- WESTERN REGION ---
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    shortCode: 'RJ',
    labelX: 230,
    labelY: 345,
    zone: 'West',
    path: 'M 255,255 L 285,280 L 310,315 L 325,370 L 305,430 L 225,435 L 155,390 L 140,320 L 205,275 Z',
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    shortCode: 'GJ',
    labelX: 180,
    labelY: 470,
    zone: 'West',
    path: 'M 155,390 L 225,435 L 265,445 L 275,520 L 240,545 L 180,540 L 140,520 L 95,470 L 105,435 L 145,435 Z',
  },
  {
    id: 'dadra_nagar_haveli_daman_diu',
    name: 'DNH & Daman Diu',
    shortCode: 'DD',
    labelX: 205,
    labelY: 535,
    zone: 'UT',
    isUT: true,
    path: 'M 195,530 L 215,530 L 215,545 L 195,545 Z',
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    shortCode: 'MH',
    labelX: 325,
    labelY: 595,
    zone: 'West',
    path: 'M 240,545 L 275,520 L 375,510 L 440,540 L 445,615 L 380,665 L 290,665 L 245,630 L 235,570 Z',
  },
  {
    id: 'goa',
    name: 'Goa',
    shortCode: 'GA',
    labelX: 265,
    labelY: 695,
    zone: 'West',
    path: 'M 255,685 L 275,685 L 275,705 L 255,705 Z',
  },

  // --- CENTRAL REGION ---
  {
    id: 'madhya_pradesh',
    name: 'Madhya Pradesh',
    shortCode: 'MP',
    labelX: 385,
    labelY: 450,
    zone: 'Central',
    path: 'M 325,370 L 440,355 L 475,385 L 515,415 L 505,480 L 440,540 L 375,510 L 265,445 L 305,430 Z',
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    shortCode: 'CG',
    labelX: 520,
    labelY: 535,
    zone: 'Central',
    path: 'M 505,480 L 555,470 L 575,525 L 550,600 L 515,625 L 465,585 L 445,615 L 440,540 Z',
  },
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    shortCode: 'UP',
    labelX: 460,
    labelY: 335,
    zone: 'North',
    path: 'M 380,310 L 395,255 L 440,270 L 495,260 L 565,300 L 585,360 L 530,390 L 475,385 L 440,355 L 325,370 Z',
  },

  // --- EASTERN REGION ---
  {
    id: 'bihar',
    name: 'Bihar',
    shortCode: 'BR',
    labelX: 615,
    labelY: 365,
    zone: 'East',
    path: 'M 565,300 L 675,320 L 685,385 L 635,405 L 585,360 Z',
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    shortCode: 'JH',
    labelX: 615,
    labelY: 445,
    zone: 'East',
    path: 'M 585,360 L 635,405 L 675,425 L 655,490 L 580,485 L 555,470 L 530,390 Z',
  },
  {
    id: 'west_bengal',
    name: 'West Bengal',
    shortCode: 'WB',
    labelX: 685,
    labelY: 450,
    zone: 'East',
    path: 'M 675,320 L 710,325 L 705,370 L 735,440 L 725,520 L 665,525 L 655,490 L 675,425 L 685,385 Z',
  },
  {
    id: 'odisha',
    name: 'Odisha',
    shortCode: 'OD',
    labelX: 595,
    labelY: 550,
    zone: 'East',
    path: 'M 580,485 L 655,490 L 665,525 L 660,585 L 610,620 L 555,600 L 575,525 Z',
  },

  // --- SOUTHERN REGION ---
  {
    id: 'telangana',
    name: 'Telangana',
    shortCode: 'TG',
    labelX: 435,
    labelY: 660,
    zone: 'South',
    path: 'M 445,615 L 465,585 L 515,625 L 500,695 L 440,710 L 380,665 Z',
  },
  {
    id: 'andhra_pradesh',
    name: 'Andhra Pradesh',
    shortCode: 'AP',
    labelX: 475,
    labelY: 745,
    zone: 'South',
    path: 'M 515,625 L 555,600 L 610,620 L 560,705 L 505,795 L 445,795 L 440,710 L 500,695 Z',
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    shortCode: 'KA',
    labelX: 345,
    labelY: 740,
    zone: 'South',
    path: 'M 290,665 L 380,665 L 440,710 L 445,795 L 395,820 L 325,820 L 305,760 L 275,705 Z',
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    shortCode: 'TN',
    labelX: 430,
    labelY: 870,
    zone: 'South',
    path: 'M 445,795 L 505,795 L 495,870 L 445,950 L 400,940 L 385,865 L 395,820 Z',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    shortCode: 'KL',
    labelX: 355,
    labelY: 885,
    zone: 'South',
    path: 'M 325,820 L 395,820 L 385,865 L 400,940 L 360,945 L 335,885 Z',
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    shortCode: 'PY',
    labelX: 475,
    labelY: 840,
    zone: 'UT',
    isUT: true,
    path: 'M 468,832 L 482,832 L 482,846 L 468,846 Z',
  },

  // --- NORTH-EASTERN REGION ---
  {
    id: 'sikkim',
    name: 'Sikkim',
    shortCode: 'SK',
    labelX: 690,
    labelY: 295,
    zone: 'North-East',
    path: 'M 675,280 L 705,280 L 710,325 L 675,320 Z',
  },
  {
    id: 'assam',
    name: 'Assam',
    shortCode: 'AS',
    labelX: 805,
    labelY: 375,
    zone: 'North-East',
    path: 'M 735,340 L 815,335 L 855,345 L 860,390 L 810,405 L 755,395 L 735,440 L 705,370 Z',
  },
  {
    id: 'arunachal_pradesh',
    name: 'Arunachal Pradesh',
    shortCode: 'AR',
    labelX: 835,
    labelY: 285,
    zone: 'North-East',
    path: 'M 735,340 L 780,270 L 875,250 L 910,295 L 880,345 L 855,345 L 815,335 Z',
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    shortCode: 'NL',
    labelX: 875,
    labelY: 395,
    zone: 'North-East',
    path: 'M 855,345 L 880,345 L 900,395 L 865,420 L 860,390 Z',
  },
  {
    id: 'manipur',
    name: 'Manipur',
    shortCode: 'MN',
    labelX: 865,
    labelY: 450,
    zone: 'North-East',
    path: 'M 865,420 L 895,440 L 880,480 L 845,475 L 845,430 Z',
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    shortCode: 'MZ',
    labelX: 835,
    labelY: 510,
    zone: 'North-East',
    path: 'M 845,475 L 870,490 L 855,545 L 820,530 L 825,480 Z',
  },
  {
    id: 'tripura',
    name: 'Tripura',
    shortCode: 'TR',
    labelX: 785,
    labelY: 485,
    zone: 'North-East',
    path: 'M 770,465 L 805,465 L 805,510 L 775,510 Z',
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    shortCode: 'ML',
    labelX: 775,
    labelY: 415,
    zone: 'North-East',
    path: 'M 735,440 L 810,405 L 815,435 L 755,445 Z',
  },

  // --- ISLANDS (INSETS) ---
  {
    id: 'andaman_nicobar',
    name: 'Andaman & Nicobar',
    shortCode: 'AN',
    labelX: 855,
    labelY: 820,
    zone: 'UT',
    isUT: true,
    path: 'M 840,740 L 855,740 L 855,860 L 840,860 Z M 850,875 L 865,875 L 865,920 L 850,920 Z',
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    shortCode: 'LD',
    labelX: 215,
    labelY: 840,
    zone: 'UT',
    isUT: true,
    path: 'M 205,800 L 225,800 L 225,875 L 205,875 Z',
  },
];

// Zone styling configuration
const ZONE_COLORS: Record<string, { fill: string; stroke: string; hover: string }> = {
  North: { fill: 'rgba(56, 189, 248, 0.22)', stroke: '#38bdf8', hover: 'rgba(56, 189, 248, 0.55)' },
  South: { fill: 'rgba(245, 158, 11, 0.22)', stroke: '#f59e0b', hover: 'rgba(245, 158, 11, 0.55)' },
  East: { fill: 'rgba(16, 185, 129, 0.22)', stroke: '#10b981', hover: 'rgba(16, 185, 129, 0.55)' },
  West: { fill: 'rgba(168, 85, 247, 0.22)', stroke: '#a855f7', hover: 'rgba(168, 85, 247, 0.55)' },
  Central: { fill: 'rgba(251, 146, 60, 0.22)', stroke: '#fb923c', hover: 'rgba(251, 146, 60, 0.55)' },
  'North-East': { fill: 'rgba(236, 72, 153, 0.22)', stroke: '#ec4899', hover: 'rgba(236, 72, 153, 0.55)' },
  UT: { fill: 'rgba(6, 182, 212, 0.35)', stroke: '#06b6d4', hover: 'rgba(6, 182, 212, 0.75)' },
};

export const IndiaSvgMap: React.FC<IndiaSvgMapProps> = ({ selectedStateId, onSelectState }) => {
  const [hoveredRegion, setHoveredRegion] = useState<StateMapRegion | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<'all' | 'states' | 'uts'>('all');

  const selectedRegion = STATE_REGIONS.find((r) => r.id === selectedStateId);
  const activeStateData = INDIA_STATES.find((s) => s.id === selectedStateId);
  const hoveredStateData = hoveredRegion ? INDIA_STATES.find((s) => s.id === hoveredRegion.id) : null;

  const filteredRegions = STATE_REGIONS.filter((r) => {
    if (filterType === 'states') return !r.isUT;
    if (filterType === 'uts') return r.isUT;
    return true;
  });

  const handleMouseMove = (e: React.MouseEvent<any>, reg: StateMapRegion) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredRegion(reg);
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
  };

  // Quick list of 8 Union Territories
  const unionTerritories = STATE_REGIONS.filter((r) => r.isUT);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Top Filter and Quick Union Territories Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md, 10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="var(--accent-primary, #38BDF8)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
            Interactive Vector Map of India (36 States & UTs)
          </span>
        </div>

        {/* Filter Switcher: All | 28 States | 8 UTs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: 'All 36' },
            { id: 'states', label: '28 States' },
            { id: 'uts', label: '8 Union Territories' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`btn btn-sm ${filterType === f.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '3px 10px', fontSize: '0.78rem' }}
              onClick={() => setFilterType(f.id as any)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Union Territories Quick Access Chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px dashed rgba(6, 182, 212, 0.35)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md, 8px)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase' }}>
          🏛️ 8 Union Territories:
        </span>
        {unionTerritories.map((ut) => {
          const isSelected = ut.id === selectedStateId;
          return (
            <button
              key={ut.id}
              type="button"
              onClick={() => onSelectState(ut.id)}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '999px',
                border: isSelected ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.12)',
                background: isSelected ? '#06B6D4' : 'rgba(15, 23, 42, 0.6)',
                color: isSelected ? '#000' : '#E2E8F0',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {ut.name}
            </button>
          );
        })}
      </div>

      {/* Main Interactive SVG Canvas */}
      <div
        style={{
          position: 'relative',
          background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)',
          borderRadius: 'var(--radius-lg, 14px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          padding: '10px',
        }}
      >
        <svg
          viewBox="0 0 920 1000"
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '720px' }}
          role="img"
          aria-label="Clickable SVG Map of India"
        >
          <defs>
            {/* Glow Filter for Active State */}
            <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern grid for Indian Ocean Background */}
            <pattern id="ocean-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background water pattern */}
          <rect width="920" height="1000" fill="url(#ocean-grid)" />

          {/* Geographical Water Body Labels */}
          <text x="140" y="660" fill="rgba(255, 255, 255, 0.12)" fontSize="16" fontWeight="bold" letterSpacing="4">
            ARABIAN SEA
          </text>
          <text x="640" y="660" fill="rgba(255, 255, 255, 0.12)" fontSize="16" fontWeight="bold" letterSpacing="4">
            BAY OF BENGAL
          </text>
          <text x="360" y="985" fill="rgba(255, 255, 255, 0.12)" fontSize="16" fontWeight="bold" letterSpacing="4">
            INDIAN OCEAN
          </text>

          {/* Inset Borders for Islands */}
          {/* Lakshadweep Inset */}
          <rect
            x="180"
            y="770"
            width="80"
            height="130"
            fill="rgba(6, 182, 212, 0.05)"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeDasharray="4 4"
            rx="6"
          />
          <text x="220" y="762" fill="rgba(6, 182, 212, 0.8)" fontSize="10" fontWeight="bold" textAnchor="middle">
            LAKSHADWEEP (UT)
          </text>

          {/* Andaman & Nicobar Inset */}
          <rect
            x="825"
            y="710"
            width="75"
            height="230"
            fill="rgba(6, 182, 212, 0.05)"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeDasharray="4 4"
            rx="6"
          />
          <text x="862" y="702" fill="rgba(6, 182, 212, 0.8)" fontSize="10" fontWeight="bold" textAnchor="middle">
            ANDAMAN & NICOBAR (UT)
          </text>

          {/* Render All State & UT Regions */}
          {filteredRegions.map((reg) => {
            const isSelected = reg.id === selectedStateId;
            const isHovered = hoveredRegion?.id === reg.id;
            const styling = ZONE_COLORS[reg.zone] || ZONE_COLORS.North;

            return (
              <g
                key={reg.id}
                onClick={() => onSelectState(reg.id)}
                onMouseMove={(e) => handleMouseMove(e, reg)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${reg.name}`}
              >
                {/* State Boundary Path */}
                <path
                  d={reg.path}
                  fill={isSelected ? '#38bdf8' : isHovered ? styling.hover : styling.fill}
                  stroke={isSelected ? '#ffffff' : styling.stroke}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.25}
                  strokeLinejoin="round"
                  filter={isSelected ? 'url(#active-glow)' : undefined}
                />

                {/* State Abbreviation Code Label */}
                <text
                  x={reg.labelX}
                  y={reg.labelY}
                  fill={isSelected ? '#000000' : '#FFFFFF'}
                  fontSize={reg.isUT ? '9' : '11'}
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    textShadow: isSelected ? 'none' : '0 1px 3px rgba(0,0,0,0.85)',
                  }}
                >
                  {reg.shortCode}
                </text>
              </g>
            );
          })}

          {/* Active State Animated Beacon Indicator */}
          {selectedRegion && (
            <g style={{ pointerEvents: 'none' }}>
              <circle
                cx={selectedRegion.labelX}
                cy={selectedRegion.labelY - 14}
                r="10"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                opacity="0.8"
              >
                <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={selectedRegion.labelX}
                cy={selectedRegion.labelY - 14}
                r="4.5"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Real-Time Hover Tooltip */}
        {hoveredRegion && hoveredStateData && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(tooltipPos.x + 15, 620)}px`,
              top: `${Math.max(tooltipPos.y - 120, 10)}px`,
              pointerEvents: 'none',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #38bdf8',
              borderRadius: '10px',
              padding: '10px 14px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              maxWidth: '280px',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.95rem', color: '#fff' }}>
                {hoveredStateData.name} ({hoveredStateData.hindiName})
              </strong>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: hoveredRegion.isUT ? 'rgba(6, 182, 212, 0.25)' : 'rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                {hoveredStateData.zone}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🏛️ Capital: <strong>{hoveredStateData.capital}</strong>
            </div>

            {/* Thumbnail of Famous Monument */}
            {hoveredStateData.famousPlaces[0] && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <img
                  src={hoveredStateData.famousPlaces[0].imageUrl}
                  alt={hoveredStateData.famousPlaces[0].name}
                  style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.72rem', color: '#E2E8F0', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>{hoveredStateData.famousPlaces[0].name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{hoveredStateData.famousPlaces[0].category}</div>
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4px' }}>
              🐦 Bird: {hoveredStateData.symbols.bird.name} · 🐅 Animal: {hoveredStateData.symbols.animal.name}
            </div>
          </div>
        )}
      </div>

      {/* Map Zone Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <span style={{ fontWeight: 700, color: '#fff' }}>Zones:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#38bdf8' }} /> North
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#f59e0b' }} /> South
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#10b981' }} /> East
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#a855f7' }} /> West
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#fb923c' }} /> Central
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#ec4899' }} /> North-East
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: '#06b6d4' }} /> Union Territory (UT)
        </span>
      </div>
    </div>
  );
};
