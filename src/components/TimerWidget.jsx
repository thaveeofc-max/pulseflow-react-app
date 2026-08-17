import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Flame, 
  Coffee, 
  Zap, 
  Award,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

const MODES = {
  focus: { label: 'Deep Focus', minutes: 25, icon: Zap, color: '#6366f1' },
  shortBreak: { label: 'Short Rest', minutes: 5, icon: Coffee, color: '#10b981' },
  longBreak: { label: 'Long Rest', minutes: 15, icon: Award, color: '#06b6d4' },
  sprint: { label: 'Power Sprint', minutes: 45, icon: Flame, color: '#f43f5e' }
};

export default function TimerWidget({ onSessionComplete }) {
  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const totalTime = MODES[currentMode].minutes * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sound.playTimerBell();
      
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (currentMode === 'focus' || currentMode === 'sprint') {
        const mins = MODES[currentMode].minutes;
        setCompletedSessions((c) => c + 1);
        if (onSessionComplete) onSessionComplete(mins);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentMode, onSessionComplete]);

  const switchMode = (modeKey) => {
    sound.playClick();
    setCurrentMode(modeKey);
    setIsRunning(false);
    setTimeLeft(MODES[modeKey].minutes * 60);
  };

  const toggleTimer = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(MODES[currentMode].minutes * 60);
  };

  const skipTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // SVG Circle calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="timer-widget glass-card">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-box icon-cyan">
            <Zap size={18} />
          </div>
          <div>
            <h3>Focus Timer</h3>
            <p className="widget-subtitle">Pomodoro flow technique</p>
          </div>
        </div>

        <div className="session-count-badge">
          <Award size={14} />
          <span>{completedSessions} Sessions Completed</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="timer-modes-bar">
        {Object.entries(MODES).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              className={`timer-mode-btn ${currentMode === key ? 'active' : ''}`}
              onClick={() => switchMode(key)}
            >
              <Icon size={14} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Circular Timer Visual */}
      <div className="timer-display-wrap">
        <svg className="timer-svg" viewBox="0 0 220 220">
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            className="timer-track"
          />

          {/* Animated Progress Ring */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            className="timer-progress"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 110 110)"
          />
        </svg>

        {/* Center Content */}
        <div className="timer-center-info">
          <div className="time-numbers font-mono">{formatTime(timeLeft)}</div>
          <span className="current-state-label">
            {isRunning ? 'Flow state active' : 'Paused / Ready'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="timer-controls">
        <button 
          className="btn-icon timer-secondary-btn" 
          onClick={resetTimer}
          title="Reset session"
        >
          <RotateCcw size={18} />
        </button>

        <button 
          className={`btn-primary timer-play-btn ${isRunning ? 'running' : ''}`}
          onClick={toggleTimer}
        >
          {isRunning ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '2px' }} />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button 
          className="btn-icon timer-secondary-btn" 
          onClick={skipTimer}
          title="Skip session"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
