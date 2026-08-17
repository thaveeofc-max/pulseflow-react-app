import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Clock, 
  Calendar, 
  Palette, 
  Zap,
  Flame,
  RotateCcw
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({ currentTheme, setTheme, isAmbient, toggleAmbient, onResetData }) {
  const [time, setTime] = useState(new Date());
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const themes = [
    { id: 'aurora', label: 'Aurora Dark', icon: '🌌', color: '#6366f1' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '⚡', color: '#ff007f' },
    { id: 'emerald', label: 'Emerald Forest', icon: '🌿', color: '#10b981' },
    { id: 'sunset', label: 'Sunset Glow', icon: '🌅', color: '#f43f5e' },
    { id: 'light', label: 'Frost Light', icon: '☀️', color: '#4f46e5' },
  ];

  const handleThemeChange = (themeId) => {
    sound.playClick();
    setTheme(themeId);
    setIsThemeMenuOpen(false);
  };

  return (
    <header className="navbar glass-card">
      <div className="nav-left">
        <div className="brand-badge">
          <div className="brand-icon-wrapper">
            <Zap className="brand-icon" size={20} />
          </div>
          <div>
            <div className="brand-title">
              Pulse<span>Flow</span>
              <span className="version-pill">v2.5</span>
            </div>
            <p className="brand-subtitle">Smart Focus &amp; Productivity Studio</p>
          </div>
        </div>
      </div>

      <div className="nav-center">
        <div className="live-clock-pill">
          <Clock size={15} className="clock-icon" />
          <span className="live-time">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="divider">|</span>
          <Calendar size={14} className="cal-icon" />
          <span className="live-date">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="nav-right">
        {/* Ambient Sound Toggle */}
        <button 
          className={`nav-action-btn ${isAmbient ? 'active' : ''}`}
          onClick={toggleAmbient}
          title={isAmbient ? "Pause Ambient Focus Sound" : "Play Ambient Rain Sound"}
        >
          {isAmbient ? <Volume2 size={18} className="icon-pulse" /> : <VolumeX size={18} />}
          <span className="btn-label">{isAmbient ? 'Ambient On' : 'Ambient'}</span>
        </button>

        {/* Theme Selector Dropdown */}
        <div className="theme-dropdown-container">
          <button 
            className="nav-action-btn"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            title="Change Theme & Aesthetics"
          >
            <Palette size={18} />
            <span className="btn-label">Theme</span>
          </button>

          {isThemeMenuOpen && (
            <>
              <div className="menu-backdrop" onClick={() => setIsThemeMenuOpen(false)} />
              <div className="theme-dropdown glass-card animate-fade-in">
                <div className="theme-dropdown-header">Select Palette</div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-option ${currentTheme === t.id ? 'selected' : ''}`}
                    onClick={() => handleThemeChange(t.id)}
                  >
                    <span className="theme-emoji">{t.icon}</span>
                    <span className="theme-name">{t.label}</span>
                    <span 
                      className="theme-color-dot" 
                      style={{ backgroundColor: t.color, boxShadow: `0 0 8px ${t.color}` }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Reset / Clear Cache */}
        <button 
          className="btn-icon" 
          onClick={onResetData} 
          title="Reset Dashboard to Default Samples"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
