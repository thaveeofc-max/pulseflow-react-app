import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Hourglass, 
  Sparkles, 
  TrendingUp, 
  RefreshCw,
  Quote
} from 'lucide-react';
import { sound } from '../utils/audio';

const QUOTES = [
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Focus is a muscle. The more you practice it, the stronger it gets.", author: "Cal Newport" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" }
];

export default function StatsBanner({ tasks, focusMinutes, habitStats }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  let greetingEmoji = "🌙";
  if (currentHour < 12) {
    greeting = "Good morning";
    greetingEmoji = "🌅";
  } else if (currentHour < 17) {
    greeting = "Good afternoon";
    greetingEmoji = "☀️";
  }

  const shuffleQuote = () => {
    sound.playClick();
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div className="stats-banner-container">
      {/* Welcome & Motivational Greeting */}
      <div className="welcome-card glass-card">
        <div className="welcome-header">
          <span className="greeting-pill">
            <span>{greetingEmoji}</span> {greeting}, Creator!
          </span>
          <button 
            className="quote-refresh-btn" 
            onClick={shuffleQuote}
            title="Next inspiring thought"
          >
            <RefreshCw size={13} />
            <span>Shuffle</span>
          </button>
        </div>

        <div className="quote-display">
          <Quote size={18} className="quote-icon" />
          <p className="quote-text">"{QUOTES[quoteIndex].text}"</p>
          <span className="quote-author">— {QUOTES[quoteIndex].author}</span>
        </div>
      </div>

      {/* 3 Key Metric Stats Cards */}
      <div className="metrics-grid">
        {/* Task Completion Stat */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-purple">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-top">
              <span className="stat-label">Tasks Progress</span>
              <span className="stat-percentage">{taskProgress}%</span>
            </div>
            <div className="stat-main">
              <span className="stat-number">{completedTasks}</span>
              <span className="stat-total">/ {totalTasks} Done</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Focus Time Stat */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-cyan">
            <Hourglass size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-top">
              <span className="stat-label">Deep Focus Time</span>
              <span className="badge stat-badge">Today</span>
            </div>
            <div className="stat-main">
              <span className="stat-number">{focusMinutes}</span>
              <span className="stat-total">Minutes</span>
            </div>
            <div className="stat-subtext">
              <Sparkles size={13} className="inline-icon" /> 
              {Math.floor(focusMinutes / 25)} Pomodoro Cycles
            </div>
          </div>
        </div>

        {/* Habit Streak Stat */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-pink">
            <Flame size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-top">
              <span className="stat-label">Habit Consistency</span>
              <span className="badge stat-badge">{habitStats.activeStreak} Days</span>
            </div>
            <div className="stat-main">
              <span className="stat-number">{habitStats.completedToday}</span>
              <span className="stat-total">/ {habitStats.totalHabits} Checked</span>
            </div>
            <div className="stat-subtext">
              <TrendingUp size={13} className="inline-icon" />
              {habitStats.streakText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
