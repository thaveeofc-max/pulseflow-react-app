import React, { useState } from 'react';
import { 
  CloudRain, 
  Waves, 
  Radio, 
  Volume2, 
  VolumeX, 
  Play, 
  Square,
  Sparkles,
  Headphones
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function AmbientWidget({ isAmbient, setIsAmbient }) {
  const [ambientType, setAmbientType] = useState('rain');
  const [volume, setVolume] = useState(25);

  const sounds = [
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain, desc: 'Calming rainfall for deep focus' },
    { id: 'waves', label: 'Ocean Waves', icon: Waves, desc: 'Rhythmic tide flow & serenity' },
    { id: 'drone', label: 'Deep Zen Drone', icon: Radio, desc: 'Low frequency alpha waves' },
  ];

  const handleToggle = (type) => {
    sound.playClick();
    if (isAmbient && ambientType === type) {
      sound.stopAmbient();
      setIsAmbient(false);
    } else {
      setAmbientType(type);
      sound.startAmbient(type, volume / 100);
      setIsAmbient(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    sound.setAmbientVolume(val / 100);
  };

  return (
    <div className="ambient-widget glass-card">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-box icon-emerald">
            <Headphones size={18} />
          </div>
          <div>
            <h3>Ambient Soundscapes</h3>
            <p className="widget-subtitle">Synthesized generative focus audio</p>
          </div>
        </div>

        {isAmbient && (
          <div className="audio-live-pill">
            <span className="live-dot" />
            <span className="live-text">Playing</span>
            <div className="equalizer-bars">
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
            </div>
          </div>
        )}
      </div>

      {/* Sound Cards Grid */}
      <div className="soundscapes-grid">
        {sounds.map((s) => {
          const Icon = s.icon;
          const isSelected = isAmbient && ambientType === s.id;
          return (
            <button
              key={s.id}
              className={`soundscape-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleToggle(s.id)}
            >
              <div className="soundscape-top">
                <div className="soundscape-icon-wrap">
                  <Icon size={20} />
                </div>
                <div className="soundscape-play-status">
                  {isSelected ? <Square size={14} /> : <Play size={14} />}
                </div>
              </div>
              <div className="soundscape-info">
                <h4 className="soundscape-name">{s.label}</h4>
                <p className="soundscape-desc">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume Slider Bar */}
      <div className="ambient-volume-bar">
        <Volume2 size={16} className="volume-icon" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <span className="volume-value">{volume}%</span>
      </div>
    </div>
  );
}
