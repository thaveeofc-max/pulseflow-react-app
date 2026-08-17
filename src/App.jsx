import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import TaskWidget from './components/TaskWidget';
import TimerWidget from './components/TimerWidget';
import HabitsWidget from './components/HabitsWidget';
import NotesWidget from './components/NotesWidget';
import AmbientWidget from './components/AmbientWidget';
import { sound } from './utils/audio';
import './App.css';

// Initial sample data for instant wow effect
const INITIAL_TASKS = [
  { id: '1', text: 'Design UI mockup for client portal in Figma', completed: true, priority: 'high', category: 'Design', createdAt: new Date().toISOString() },
  { id: '2', text: 'Build React components with glassmorphism styles', completed: true, priority: 'high', category: 'Code', createdAt: new Date().toISOString() },
  { id: '3', text: 'Setup responsive grid layout & theme provider', completed: false, priority: 'med', category: 'Code', createdAt: new Date().toISOString() },
  { id: '4', text: 'Review performance optimization & accessibility', completed: false, priority: 'low', category: 'Work', createdAt: new Date().toISOString() },
  { id: '5', text: 'Plan weekend sprint & meditation session', completed: false, priority: 'low', category: 'Life', createdAt: new Date().toISOString() },
];

const INITIAL_HABITS = [
  { id: '1', name: 'Code 1 Hour Daily', emoji: '💻', streak: 12, days: [true, true, true, true, true, false, false] },
  { id: '2', name: 'Drink 2.5L Water', emoji: '💧', streak: 5, days: [true, true, true, true, false, false, false] },
  { id: '3', name: 'Read Tech Articles / Books', emoji: '📚', streak: 8, days: [true, true, false, true, true, false, false] },
];

const INITIAL_NOTES = [
  { 
    id: '1', 
    title: '🚀 Frontend Best Practices', 
    content: 'Always prefer semantic HTML, keep component props minimal, and optimize state re-renders with local memoization.', 
    color: 'indigo', 
    pinned: true, 
    date: 'Aug 17' 
  },
  { 
    id: '2', 
    title: '💡 Project Brainstorm', 
    content: 'Implement AI assistant integration with custom keyboard shortcuts for lightning-fast command palettes.', 
    color: 'emerald', 
    pinned: false, 
    date: 'Aug 17' 
  }
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulseflow_theme') || 'aurora';
  });

  // Data states with LocalStorage persistence
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pulseflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('pulseflow_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('pulseflow_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [focusMinutes, setFocusMinutes] = useState(() => {
    const saved = localStorage.getItem('pulseflow_focus_mins');
    return saved ? JSON.parse(saved) : 50;
  });

  const [isAmbient, setIsAmbient] = useState(false);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulseflow_theme', theme);
  }, [theme]);

  // Sync data changes
  useEffect(() => {
    localStorage.setItem('pulseflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pulseflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('pulseflow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('pulseflow_focus_mins', JSON.stringify(focusMinutes));
  }, [focusMinutes]);

  const handleSessionComplete = (minutes) => {
    setFocusMinutes((prev) => prev + minutes);
  };

  const handleToggleAmbient = () => {
    const next = sound.toggleAmbient('rain', 0.25);
    setIsAmbient(next);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks, notes and habits back to default demo samples?')) {
      sound.playClick();
      setTasks(INITIAL_TASKS);
      setHabits(INITIAL_HABITS);
      setNotes(INITIAL_NOTES);
      setFocusMinutes(50);
      localStorage.clear();
    }
  };

  // Compute habit stats for overview
  const todayIdx = (new Date().getDay() + 6) % 7;
  const completedTodayHabits = habits.filter(h => h.days[todayIdx]).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const habitStats = {
    totalHabits: habits.length,
    completedToday: completedTodayHabits,
    activeStreak: maxStreak,
    streakText: maxStreak > 7 ? 'Super Consistent 🔥' : 'Building Momentum ⚡'
  };

  return (
    <div className="app-wrapper">
      {/* Dynamic Background Glow Orbs */}
      <div className="bg-glow-orb bg-orb-1" />
      <div className="bg-glow-orb bg-orb-2" />
      <div className="bg-glow-orb bg-orb-3" />

      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar 
          currentTheme={theme} 
          setTheme={setTheme}
          isAmbient={isAmbient}
          toggleAmbient={handleToggleAmbient}
          onResetData={handleResetData}
        />

        {/* Top Overview & Motivation Banner */}
        <main className="main-content">
          <StatsBanner 
            tasks={tasks} 
            focusMinutes={focusMinutes}
            habitStats={habitStats}
          />

          {/* Bento Grid Layout */}
          <div className="bento-dashboard-grid">
            {/* Column 1: Task Manager (Large Span) */}
            <div className="grid-cell cell-tasks">
              <TaskWidget 
                tasks={tasks} 
                setTasks={setTasks} 
              />
            </div>

            {/* Column 2: Focus Timer */}
            <div className="grid-cell cell-timer">
              <TimerWidget 
                onSessionComplete={handleSessionComplete} 
              />
            </div>

            {/* Column 3: Daily Habits */}
            <div className="grid-cell cell-habits">
              <HabitsWidget 
                habits={habits} 
                setHabits={setHabits} 
              />
            </div>

            {/* Column 4: Notes Scratchpad */}
            <div className="grid-cell cell-notes">
              <NotesWidget 
                notes={notes} 
                setNotes={setNotes} 
              />
            </div>

            {/* Column 5: Ambient Sound Player */}
            <div className="grid-cell cell-ambient">
              <AmbientWidget 
                isAmbient={isAmbient} 
                setIsAmbient={setIsAmbient} 
              />
            </div>
          </div>
        </main>

        {/* Modern Sleek Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-left">
              Crafted with 💖 in React + Vite • <strong>PulseFlow Studio</strong>
            </p>
            <div className="footer-pills">
              <span className="footer-tag">⚡ 60 FPS Smooth</span>
              <span className="footer-tag">💾 Local Storage Active</span>
              <span className="footer-tag">🎵 Web Audio Synth</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
