import React, { useState, useMemo } from 'react';
import { Compass, Sparkles, MapPin, Layers, Info, ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';
import { INDIA_STATES, type IndiaStateData } from './indiaStatesData';

interface IndiaSvgMapProps {
  selectedStateId: string;
  onSelectState: (stateId: string) => void;
}

// Definition for each State and UT mapped to the authentic 821 x 1024 Political Map image
interface StateMapHotspot {
  id: string;
  name: string;
  shortCode: string;
  x: number;
  y: number;
  hitRadius: number;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'UT';
  isUT?: boolean;
}

const STATE_HOTSPOTS: StateMapHotspot[] = [
  // --- NORTHERN REGION & HIMALAYAS ---
  { id: 'ladakh', name: 'Ladakh', shortCode: 'LA', x: 380, y: 85, hitRadius: 42, zone: 'UT', isUT: true },
  { id: 'jammu_kashmir', name: 'Jammu & Kashmir', shortCode: 'JK', x: 310, y: 120, hitRadius: 36, zone: 'UT', isUT: true },
  { id: 'himachal_pradesh', name: 'Himachal Pradesh', shortCode: 'HP', x: 350, y: 175, hitRadius: 32, zone: 'North' },
  { id: 'punjab', name: 'Punjab', shortCode: 'PB', x: 295, y: 205, hitRadius: 30, zone: 'North' },
  { id: 'chandigarh', name: 'Chandigarh', shortCode: 'CH', x: 328, y: 208, hitRadius: 18, zone: 'UT', isUT: true },
  { id: 'uttarakhand', name: 'Uttarakhand', shortCode: 'UK', x: 395, y: 225, hitRadius: 32, zone: 'North' },
  { id: 'haryana', name: 'Haryana', shortCode: 'HR', x: 315, y: 255, hitRadius: 30, zone: 'North' },
  { id: 'delhi', name: 'Delhi (NCT)', shortCode: 'DL', x: 355, y: 260, hitRadius: 20, zone: 'UT', isUT: true },

  // --- WESTERN REGION ---
  { id: 'rajasthan', name: 'Rajasthan', shortCode: 'RJ', x: 240, y: 315, hitRadius: 55, zone: 'West' },
  { id: 'gujarat', name: 'Gujarat', shortCode: 'GJ', x: 175, y: 410, hitRadius: 48, zone: 'West' },
  { id: 'maharashtra', name: 'Maharashtra', shortCode: 'MH', x: 290, y: 510, hitRadius: 55, zone: 'West' },
  { id: 'goa', name: 'Goa', shortCode: 'GA', x: 215, y: 605, hitRadius: 18, zone: 'West' },
  { id: 'dadra_nagar_haveli_daman_diu', name: 'DNH & Daman Diu', shortCode: 'DN', x: 185, y: 485, hitRadius: 20, zone: 'UT', isUT: true },

  // --- CENTRAL REGION ---
  { id: 'madhya_pradesh', name: 'Madhya Pradesh', shortCode: 'MP', x: 385, y: 415, hitRadius: 58, zone: 'Central' },
  { id: 'uttar_pradesh', name: 'Uttar Pradesh', shortCode: 'UP', x: 430, y: 310, hitRadius: 52, zone: 'North' },
  { id: 'chhattisgarh', name: 'Chhattisgarh', shortCode: 'CG', x: 495, y: 450, hitRadius: 42, zone: 'Central' },

  // --- EASTERN REGION ---
  { id: 'bihar', name: 'Bihar', shortCode: 'BR', x: 590, y: 335, hitRadius: 38, zone: 'East' },
  { id: 'jharkhand', name: 'Jharkhand', shortCode: 'JH', x: 580, y: 395, hitRadius: 36, zone: 'East' },
  { id: 'west_bengal', name: 'West Bengal', shortCode: 'WB', x: 650, y: 405, hitRadius: 38, zone: 'East' },
  { id: 'odisha', name: 'Odisha', shortCode: 'OD', x: 575, y: 465, hitRadius: 45, zone: 'East' },

  // --- SOUTHERN REGION ---
  { id: 'telangana', name: 'Telangana', shortCode: 'TS', x: 385, y: 540, hitRadius: 40, zone: 'South' },
  { id: 'andhra_pradesh', name: 'Andhra Pradesh', shortCode: 'AP', x: 425, y: 620, hitRadius: 48, zone: 'South' },
  { id: 'karnataka', name: 'Karnataka', shortCode: 'KA', x: 285, y: 640, hitRadius: 46, zone: 'South' },
  { id: 'tamil_nadu', name: 'Tamil Nadu', shortCode: 'TN', x: 360, y: 735, hitRadius: 45, zone: 'South' },
  { id: 'kerala', name: 'Kerala', shortCode: 'KL', x: 295, y: 745, hitRadius: 32, zone: 'South' },
  { id: 'puducherry', name: 'Puducherry', shortCode: 'PY', x: 435, y: 700, hitRadius: 18, zone: 'UT', isUT: true },

  // --- ISLANDS ---
  { id: 'lakshadweep', name: 'Lakshadweep', shortCode: 'LD', x: 165, y: 735, hitRadius: 28, zone: 'UT', isUT: true },
  { id: 'andaman_nicobar', name: 'Andaman & Nicobar', shortCode: 'AN', x: 815, y: 690, hitRadius: 38, zone: 'UT', isUT: true },

  // --- NORTH-EAST REGION ---
  { id: 'sikkim', name: 'Sikkim', shortCode: 'SK', x: 660, y: 290, hitRadius: 20, zone: 'North-East' },
  { id: 'assam', name: 'Assam', shortCode: 'AS', x: 775, y: 315, hitRadius: 38, zone: 'North-East' },
  { id: 'arunachal_pradesh', name: 'Arunachal Pradesh', shortCode: 'AR', x: 825, y: 255, hitRadius: 38, zone: 'North-East' },
  { id: 'nagaland', name: 'Nagaland', shortCode: 'NL', x: 855, y: 315, hitRadius: 22, zone: 'North-East' },
  { id: 'manipur', name: 'Manipur', shortCode: 'MN', x: 840, y: 355, hitRadius: 22, zone: 'North-East' },
  { id: 'mizoram', name: 'Mizoram', shortCode: 'MZ', x: 825, y: 400, hitRadius: 24, zone: 'North-East' },
  { id: 'tripura', name: 'Tripura', shortCode: 'TR', x: 755, y: 385, hitRadius: 22, zone: 'North-East' },
  { id: 'meghalaya', name: 'Meghalaya', shortCode: 'ML', x: 745, y: 335, hitRadius: 24, zone: 'North-East' },
];

const ZONE_BADGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  North: { bg: 'rgba(56, 189, 248, 0.9)', border: '#38bdf8', text: '#0369a1' },
  South: { bg: 'rgba(245, 158, 11, 0.9)', border: '#f59e0b', text: '#b45309' },
  East: { bg: 'rgba(16, 185, 129, 0.9)', border: '#10b981', text: '#047857' },
  West: { bg: 'rgba(168, 85, 247, 0.9)', border: '#a855f7', text: '#6b21a8' },
  Central: { bg: 'rgba(249, 115, 22, 0.9)', border: '#f97316', text: '#c2410c' },
  'North-East': { bg: 'rgba(236, 72, 153, 0.9)', border: '#ec4899', text: '#be185d' },
  UT: { bg: 'rgba(6, 182, 212, 0.9)', border: '#06b6d4', text: '#0e7490' },
};

export const IndiaSvgMap: React.FC<IndiaSvgMapProps> = ({ selectedStateId, onSelectState }) => {
  const [hoveredSpot, setHoveredSpot] = useState<StateMapHotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPinsOnly, setShowPinsOnly] = useState<boolean>(false);

  // Quick lookup of state data
  const stateDataMap = useMemo(() => {
    const map = new Map<string, IndiaStateData>();
    INDIA_STATES.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  const selectedSpot = useMemo(() => {
    return STATE_HOTSPOTS.find((s) => s.id === selectedStateId);
  }, [selectedStateId]);

  const selectedStateData = useMemo(() => {
    return stateDataMap.get(selectedStateId);
  }, [selectedStateId, stateDataMap]);

  const hoveredStateData = useMemo(() => {
    if (!hoveredSpot) return null;
    return stateDataMap.get(hoveredSpot.id);
  }, [hoveredSpot, stateDataMap]);

  // Handle Mouse Hover
  const handleMouseMove = (e: React.MouseEvent<SVGGElement>, spot: StateMapHotspot) => {
    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHoveredSpot(spot);
  };

  const handleMouseLeave = () => {
    setHoveredSpot(null);
  };

  // Filtered hotspots by zone
  const filteredSpots = useMemo(() => {
    if (selectedZone === 'All') return STATE_HOTSPOTS;
    return STATE_HOTSPOTS.filter((s) => s.zone === selectedZone);
  }, [selectedZone]);

  const zones = ['All', 'North', 'South', 'East', 'West', 'Central', 'North-East', 'UT'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
      }}
    >
      {/* Header Controls: Zone Filters, Zoom Controls, Title */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
                display: 'inline-block',
              }}
            />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              🇮🇳 India Political Map (Official HD)
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              Interactive · 36 States & UTs
            </span>
          </div>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Kisi bhi rajya (state) ya pin par click karein—sabhi famous tourist locations, mandir aur photo turant open honge!
          </p>
        </div>

        {/* Map Controls: Zoom & View toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            title="Zoom In"
            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            title="Zoom Out"
            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ZoomOut size={14} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Zone Quick Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Zones:
        </span>
        {zones.map((zone) => (
          <button
            key={zone}
            type="button"
            onClick={() => setSelectedZone(zone)}
            style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: selectedZone === zone ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedZone === zone ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedZone === zone ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Currently Selected State Quick Banner */}
      {selectedStateData && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="#38bdf8" />
            <div>
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                {selectedStateData.name} ({selectedStateData.hindiName})
              </strong>{' '}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                · Capital: <strong>{selectedStateData.capital}</strong> · Zone: {selectedStateData.zone}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 700,
                background: 'rgba(56, 189, 248, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              🏛️ {selectedStateData.famousPlaces.length} Famous Attractions
            </span>
          </div>
        </div>
      )}

      {/* Interactive Map Visual Area */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          background: '#071120',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.7)',
        }}
      >
        <svg
          viewBox="0 0 821 1024"
          style={{
            width: '100%',
            maxHeight: '740px',
            height: 'auto',
            display: 'block',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <defs>
            {/* Glowing filter for active state pin */}
            <filter id="beacon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle drop shadow for markers */}
            <filter id="marker-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* BASE LAYER: User's Authentic High-Resolution India Political Map Photo */}
          <image
            href="/images/india_political_map.jpg"
            x="0"
            y="0"
            width="821"
            height="1024"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Interactive State Hitspots & Hotspot Badges */}
          {filteredSpots.map((spot) => {
            const isSelected = spot.id === selectedStateId;
            const isHovered = hoveredSpot?.id === spot.id;
            const badgeStyle = ZONE_BADGE_COLORS[spot.zone] || ZONE_BADGE_COLORS.North;

            return (
              <g
                key={spot.id}
                onClick={() => onSelectState(spot.id)}
                onMouseMove={(e) => handleMouseMove(e, spot)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${spot.name}`}
              >
                {/* Invisible Broad Clickable Hit Area */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={spot.hitRadius}
                  fill={isSelected ? 'rgba(56, 189, 248, 0.18)' : isHovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                  stroke={isSelected ? '#38bdf8' : isHovered ? 'rgba(255, 255, 255, 0.4)' : 'transparent'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? '4 2' : undefined}
                />

                {/* State Badge Background Pill */}
                <rect
                  x={spot.x - 17}
                  y={spot.y - 12}
                  width="34"
                  height="24"
                  rx="6"
                  fill={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : 'rgba(15, 23, 42, 0.88)'}
                  stroke={isSelected ? '#ffffff' : badgeStyle.border}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  filter="url(#marker-shadow)"
                  style={{
                    transition: 'all 0.2s ease',
                    transformOrigin: `${spot.x}px ${spot.y}px`,
                    transform: isSelected ? 'scale(1.15)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                />

                {/* State Code Abbreviation */}
                <text
                  x={spot.x}
                  y={spot.y + 4}
                  fill={isSelected ? '#000000' : isHovered ? '#0f172a' : '#ffffff'}
                  fontSize="11"
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  textAnchor="middle"
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    letterSpacing: '0.5px',
                  }}
                >
                  {spot.shortCode}
                </text>
              </g>
            );
          })}

          {/* Active State Animated Pulsing Beacon Ring */}
          {selectedSpot && (
            <g style={{ pointerEvents: 'none' }} filter="url(#beacon-glow)">
              {/* Outer Pulsing Wave 1 */}
              <circle cx={selectedSpot.x} cy={selectedSpot.y} r="20" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.9">
                <animate attributeName="r" values="14;34;14" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.05;0.9" dur="2.2s" repeatCount="indefinite" />
              </circle>

              {/* Outer Pulsing Wave 2 (offset) */}
              <circle cx={selectedSpot.x} cy={selectedSpot.y} r="26" fill="none" stroke="#a855f7" strokeWidth="1.8" opacity="0.6">
                <animate attributeName="r" values="20;44;20" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
              </circle>

              {/* Pointer Center Dot */}
              <circle cx={selectedSpot.x} cy={selectedSpot.y - 20} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Floating Real-Time Hover Tooltip */}
        {hoveredSpot && hoveredStateData && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(tooltipPos.x + 18, 560)}px`,
              top: `${Math.max(tooltipPos.y - 140, 15)}px`,
              pointerEvents: 'none',
              background: 'rgba(15, 23, 42, 0.96)',
              border: '1px solid #38bdf8',
              borderRadius: '10px',
              padding: '10px 14px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(16px)',
              maxWidth: '300px',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.98rem', color: '#ffffff' }}>
                {hoveredStateData.name} ({hoveredStateData.hindiName})
              </strong>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: hoveredSpot.isUT ? 'rgba(6, 182, 212, 0.25)' : 'rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                {hoveredStateData.zone}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🏛️ Capital: <strong>{hoveredStateData.capital}</strong> · Area: {hoveredStateData.areaKm2}
            </div>

            {/* Thumbnail of Top Tourist Landmark */}
            {hoveredStateData.famousPlaces[0] && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  marginTop: '2px',
                }}
              >
                <img
                  src={hoveredStateData.famousPlaces[0].imageUrl}
                  alt={hoveredStateData.famousPlaces[0].name}
                  style={{ width: '52px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.74rem', color: '#E2E8F0', lineHeight: 1.25 }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>{hoveredStateData.famousPlaces[0].name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                    {hoveredStateData.famousPlaces[0].category}
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>🐦 {hoveredStateData.symbols.bird.name.split(' ')[0]}</span>
              <span>🐅 {hoveredStateData.symbols.animal.name.split(' ')[0]}</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Click to View All &rarr;</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Union Territories Selector Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8' }}>
          8 Union Territories (UTs):
        </span>
        {STATE_HOTSPOTS.filter((s) => s.isUT).map((ut) => (
          <button
            key={ut.id}
            type="button"
            onClick={() => onSelectState(ut.id)}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: selectedStateId === ut.id ? 700 : 500,
              background: selectedStateId === ut.id ? '#0284c7' : 'rgba(6, 182, 212, 0.12)',
              border: selectedStateId === ut.id ? '1px solid #38bdf8' : '1px solid rgba(6, 182, 212, 0.25)',
              color: selectedStateId === ut.id ? '#ffffff' : '#7dd3fc',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {ut.name}
          </button>
        ))}
      </div>
    </div>
  );
};
