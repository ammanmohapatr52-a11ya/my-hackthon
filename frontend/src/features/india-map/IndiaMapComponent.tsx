import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Compass,
  Feather,
  Award,
  BookOpen,
  Eye,
  ExternalLink,
  ChevronRight,
  Info,
  X,
  Maximize2,
  Globe2,
} from 'lucide-react';
import { INDIA_STATES, type IndiaStateData } from './indiaStatesData';
import { IndiaSvgMap } from './IndiaSvgMap';
import { useLanguage } from '../../i18n/LanguageContext';
import { assistantVoice } from '../../services/assistantVoice';

export const IndiaMapComponent: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [selectedStateId, setSelectedStateId] = useState<string>('odisha');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [activeTab, setActiveTab] = useState<'overview' | 'symbols' | 'places' | 'culture'>('places');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Fullscreen photo lightbox modal
  const [lightbox, setLightbox] = useState<{
    url: string;
    title: string;
    category?: string;
    description?: string;
  } | null>(null);

  // Filtered states for search & zone
  const filteredStates = useMemo(() => {
    return INDIA_STATES.filter((st) => {
      const matchesZone = selectedZone === 'All' || st.zone === selectedZone;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        st.name.toLowerCase().includes(q) ||
        st.hindiName.toLowerCase().includes(q) ||
        st.odiaName.toLowerCase().includes(q) ||
        st.capital.toLowerCase().includes(q) ||
        st.symbols.bird.name.toLowerCase().includes(q) ||
        st.symbols.animal.name.toLowerCase().includes(q) ||
        st.famousPlaces.some((p) => p.name.toLowerCase().includes(q));
      return matchesZone && matchesSearch;
    });
  }, [selectedZone, searchQuery]);

  const activeState = useMemo(() => {
    return INDIA_STATES.find((s) => s.id === selectedStateId) || INDIA_STATES[0];
  }, [selectedStateId]);

  // Voice narration of active state
  const handleNarrate = () => {
    if (isSpeaking) {
      assistantVoice.stop();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (language === 'hi') {
      speechText = `${activeState.hindiName}: राजधानी ${activeState.capital} है। राज्य पक्षी ${activeState.symbols.bird.name} है, और राज्य पशु ${activeState.symbols.animal.name} है। प्रमुख दर्शनीय स्थल: ${activeState.famousPlaces.map((p) => p.name).join(', ')}।`;
    } else if (language === 'or') {
      speechText = `${activeState.odiaName}: ରାଜଧାନୀ ${activeState.capital} ଅଟେ। ରାଜ୍ୟ ପକ୍ଷୀ ${activeState.symbols.bird.name} ଏବଂ ରାଜ୍ୟ ପଶୁ ${activeState.symbols.animal.name} ଅଟେ। ପ୍ରମୁଖ ସ୍ଥାନଗୁଡ଼ିକ: ${activeState.famousPlaces.map((p) => p.name).join(', ')}।`;
    } else {
      speechText = `${activeState.name}: The capital is ${activeState.capital}. The state bird is the ${activeState.symbols.bird.name}, and the state animal is the ${activeState.symbols.animal.name}. Famous attractions include ${activeState.famousPlaces.map((p) => p.name).join(', ')}.`;
    }

    setIsSpeaking(true);
    assistantVoice.speak(speechText, false, language);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 14000);
  };

  const zones = ['All', 'North', 'South', 'East', 'West', 'Central', 'North-East', 'UT'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Filter and View Mode Switcher */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '420px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search 36 states & UTs, monuments, birds, animals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            aria-label="Search Indian States and Union Territories"
          />
        </div>

        {/* View Mode Toggle & Zone Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Map vs Grid Toggle */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '3px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('map')}
              style={{ padding: '3px 12px', fontSize: '0.78rem', borderRadius: '999px' }}
            >
              🗺️ Visual Map of India
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('grid')}
              style={{ padding: '3px 12px', fontSize: '0.78rem', borderRadius: '999px' }}
            >
              📋 State Cards ({filteredStates.length})
            </button>
          </div>

          {/* Zones */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Zone:</span>
            {zones.map((z) => (
              <button
                key={z}
                type="button"
                className={`btn btn-sm ${selectedZone === z ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedZone(z)}
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: selectedZone === z ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container: Map/Selector on Left & Comprehensive Dossier on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Interactive Map of India or State Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {viewMode === 'map' ? (
            <IndiaSvgMap selectedStateId={selectedStateId} onSelectState={setSelectedStateId} />
          ) : (
            <div
              className="card"
              style={{
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '760px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                    States & Union Territories ({filteredStates.length})
                  </h2>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click to view details</span>
              </div>

              <div
                style={{
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  paddingRight: '4px',
                }}
              >
                {filteredStates.map((st) => {
                  const isSelected = st.id === selectedStateId;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStateId(st.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(2, 132, 199, 0.12) 100%)'
                          : 'rgba(30, 41, 59, 0.4)',
                        boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {st.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                            {st.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({st.hindiName})</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            Capital: {st.capital.split(' ')[0]} · {st.zone} India
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={16} color={isSelected ? '#38bdf8' : 'var(--text-muted)'} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Comprehensive State Dossier with Real Photos & Symbols */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Header Banner with State Title & Narration */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {activeState.zone} India
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Formed: {activeState.formationYear}
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 2px 0', color: '#ffffff' }}>
                {activeState.name}{' '}
                <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  ({activeState.hindiName} · {activeState.odiaName})
                </span>
              </h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                "{activeState.tagline}"
              </p>
            </div>

            {/* Action Buttons: Audio Voice Speak & AI Ask */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                className={`btn btn-sm ${isSpeaking ? 'btn-secondary' : 'btn-outline'}`}
                onClick={handleNarrate}
                title="Listen to State Overview"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen'}</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() =>
                  navigate('/ask', {
                    state: {
                      initialQuestion: `Tell me about the history, geography, state symbols, and famous places of ${activeState.name}.`,
                    },
                  })
                }
                title="Ask AI Tutor about this State"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={15} />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capital</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{activeState.capital}</div>
            </div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Population</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{activeState.population}</div>
            </div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Area</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{activeState.areaKm2}</div>
            </div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Literacy</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>{activeState.literacyRate}</div>
            </div>
          </div>

          {/* Sub-Tabs: Famous Places (Default), State Symbols, Culture */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'places' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('places')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Award size={15} />
              <span>Famous Buildings & Monuments ({activeState.famousPlaces.length})</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'symbols' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('symbols')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Feather size={15} />
              <span>Official State Symbols (Bird, Animal, Tree)</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'culture' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('culture')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe2 size={15} />
              <span>Culture, Rivers & Cuisine</span>
            </button>
          </div>

          {/* Tab 1: Famous Places & Buildings with REAL High-Resolution Imagery */}
          {activeTab === 'places' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="var(--accent-primary)" />
                    Famous Buildings, Monuments & Heritage of {activeState.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click photo to expand</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {activeState.famousPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onClick={() =>
                        setLightbox({
                          url: place.imageUrl,
                          title: place.name,
                          category: place.category,
                          description: place.description,
                        })
                      }
                      title="Click to view real high-resolution photo"
                    >
                      <div style={{ height: '160px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                          loading="lazy"
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(8px)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                          }}
                        >
                          {place.category}
                        </span>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.65)',
                            padding: '4px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                          }}
                        >
                          <Maximize2 size={13} />
                        </div>
                      </div>

                      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                          {place.name}
                          {place.hindiName && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>
                              {place.hindiName}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {place.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Official State Symbols with Real Pictures */}
          {activeTab === 'symbols' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Feather size={18} color="var(--accent-primary)" />
                Official State Emblems & Natural Heritage
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                }}
              >
                {/* State Bird */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.65)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setLightbox({
                      url: activeState.symbols.bird.imageUrl,
                      title: `Official State Bird: ${activeState.symbols.bird.name}`,
                      category: 'State Bird (राज्य पक्षी)',
                      description: activeState.symbols.bird.description,
                    })
                  }
                >
                  <div style={{ height: '150px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={activeState.symbols.bird.imageUrl}
                      alt={activeState.symbols.bird.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Official State Bird (राज्य पक्षी)
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {activeState.symbols.bird.name}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {activeState.symbols.bird.description}
                    </p>
                  </div>
                </div>

                {/* State Animal */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.65)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setLightbox({
                      url: activeState.symbols.animal.imageUrl,
                      title: `Official State Animal: ${activeState.symbols.animal.name}`,
                      category: 'State Animal (राज्य पशु)',
                      description: activeState.symbols.animal.description,
                    })
                  }
                >
                  <div style={{ height: '150px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={activeState.symbols.animal.imageUrl}
                      alt={activeState.symbols.animal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Official State Animal (राज्य पशु)
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {activeState.symbols.animal.name}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {activeState.symbols.animal.description}
                    </p>
                  </div>
                </div>

                {/* State Flower */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.65)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setLightbox({
                      url: activeState.symbols.flower.imageUrl,
                      title: `Official State Flower: ${activeState.symbols.flower.name}`,
                      category: 'State Flower (राज्य पुष्प)',
                    })
                  }
                >
                  <div style={{ height: '150px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={activeState.symbols.flower.imageUrl}
                      alt={activeState.symbols.flower.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase' }}>
                      Official State Flower (राज्य पुष्प)
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {activeState.symbols.flower.name}
                    </div>
                  </div>
                </div>

                {/* State Tree */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.65)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setLightbox({
                      url: activeState.symbols.tree.imageUrl,
                      title: `Official State Tree: ${activeState.symbols.tree.name}`,
                      category: 'State Tree (राज्य वृक्ष)',
                    })
                  }
                >
                  <div style={{ height: '150px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={activeState.symbols.tree.imageUrl}
                      alt={activeState.symbols.tree.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                      Official State Tree (राज्य वृक्ष)
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {activeState.symbols.tree.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Culture, Rivers, Cuisines & Festivals */}
          {activeTab === 'culture' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {/* Rivers */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
                  🌊 Major Rivers
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {activeState.majorRivers.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Famous Cuisine */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  🍲 Famous Cuisines & Delicacies
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeState.famousFood.map((f, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        color: '#fbbf24',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Festivals */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ec4899', marginBottom: '0.5rem' }}>
                  🎉 Major Festivals
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {activeState.famousFestivals.map((fest, i) => (
                    <li key={i}>{fest}</li>
                  ))}
                </ul>
              </div>

              {/* Classical Dance */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7', marginBottom: '0.5rem' }}>
                  🎭 Classical Dance & Performing Arts
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {activeState.classicalDance}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Fullscreen Image Lightbox Modal */}
      {lightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              background: 'rgba(15, 23, 42, 0.98)',
              borderRadius: 'var(--radius-lg, 16px)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Close photo view"
            >
              <X size={20} />
            </button>

            {/* High-Resolution Image */}
            <div style={{ maxHeight: '520px', width: '100%', overflow: 'hidden', background: '#000' }}>
              <img
                src={lightbox.url}
                alt={lightbox.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Photo Caption & Context */}
            <div style={{ padding: '1.25rem' }}>
              {lightbox.category && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  {lightbox.category}
                </span>
              )}
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '8px 0 4px 0', color: '#fff' }}>
                {lightbox.title}
              </h3>
              {lightbox.description && (
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {lightbox.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
