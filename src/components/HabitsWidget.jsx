import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles, 
  CalendarDays,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HabitsWidget({ habits, setHabits }) {
  const [newHabitText, setNewHabitText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('⚡');

  const emojis = ['⚡', '💧', '🏃', '📚', '🧘', '💻', '🎨', '🥗'];

  // Current day of the week index (0 = Monday ... 6 = Sunday)
  const todayIndex = (new Date().getDay() + 6) % 7;

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;

    sound.playClick();
    const newHabit = {
      id: Date.now().toString(),
      name: newHabitText.trim(),
      emoji: selectedEmoji,
      streak: 1,
      // Array of 7 booleans for the current week
      days: [false, false, false, false, false, false, false]
    };
    newHabit.days[todayIndex] = true;

    setHabits([...habits, newHabit]);
    setNewHabitText('');
  };

  const toggleDay = (habitId, dayIndex, event) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const nextDays = [...h.days];
        const isTurningOn = !nextDays[dayIndex];
        nextDays[dayIndex] = isTurningOn;

        let newStreak = h.streak;
        if (isTurningOn) {
          sound.playComplete();
          if (dayIndex === todayIndex) {
            newStreak += 1;
            try {
              confetti({
                particleCount: 35,
                spread: 50,
                origin: { y: 0.7 }
              });
            } catch (e) {}
          }
        } else {
          sound.playClick();
          if (dayIndex === todayIndex && newStreak > 0) {
            newStreak -= 1;
          }
        }

        return { ...h, days: nextDays, streak: Math.max(0, newStreak) };
      }
      return h;
    });

    setHabits(updated);
  };

  const deleteHabit = (id) => {
    sound.playClick();
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="habits-widget glass-card">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-box icon-pink">
            <Target size={18} />
          </div>
          <div>
            <h3>Daily Habits &amp; Streaks</h3>
            <p className="widget-subtitle">Build consistent routines everyday</p>
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      <form onSubmit={handleAddHabit} className="habit-input-form">
        <div className="emoji-select-row">
          {emojis.map((em) => (
            <button
              type="button"
              key={em}
              className={`emoji-btn ${selectedEmoji === em ? 'active' : ''}`}
              onClick={() => { sound.playClick(); setSelectedEmoji(em); }}
            >
              {em}
            </button>
          ))}
        </div>

        <div className="habit-input-row">
          <input
            type="text"
            placeholder="e.g. Read 20 mins, Drink 3L Water..."
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            className="habit-text-input"
          />
          <button type="submit" className="btn-primary add-habit-btn" disabled={!newHabitText.trim()}>
            <Plus size={16} />
            <span>Track</span>
          </button>
        </div>
      </form>

      {/* Week Header Days */}
      <div className="habits-list-container">
        <div className="habits-list-header">
          <span className="col-habit-name">Habit</span>
          <div className="col-days-wrapper">
            {DAYS_SHORT.map((day, idx) => (
              <span 
                key={idx} 
                className={`day-column-label ${idx === todayIndex ? 'is-today' : ''}`}
              >
                {day}
              </span>
            ))}
          </div>
          <span className="col-streak-label">Streak</span>
        </div>

        {/* Habit Rows */}
        <div className="habits-rows">
          {habits.length === 0 ? (
            <div className="empty-habits-state">
              <Sparkles size={20} />
              <p>No habits tracked yet. Add your first habit above!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="habit-row">
                <div className="habit-name-group">
                  <span className="habit-emoji">{habit.emoji}</span>
                  <span className="habit-title">{habit.name}</span>
                </div>

                <div className="habit-days-grid">
                  {habit.days.map((checked, dIdx) => (
                    <button
                      key={dIdx}
                      className={`habit-day-dot ${checked ? 'checked' : ''} ${dIdx === todayIndex ? 'today' : ''}`}
                      onClick={(e) => toggleDay(habit.id, dIdx, e)}
                      title={`Day ${DAYS_SHORT[dIdx]} ${checked ? '(Completed)' : '(Click to mark)'}`}
                    >
                      {checked && <Check size={12} />}
                    </button>
                  ))}
                </div>

                <div className="habit-streak-group">
                  <div className="streak-badge">
                    <Flame size={13} className="flame-icon" />
                    <span>{habit.streak}d</span>
                  </div>
                  <button 
                    className="habit-delete-btn"
                    onClick={() => deleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
