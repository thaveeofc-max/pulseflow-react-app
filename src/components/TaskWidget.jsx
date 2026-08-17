import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  AlertCircle, 
  ListFilter, 
  Sparkles,
  Calendar,
  CheckCircle,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function TaskWidget({ tasks, setTasks }) {
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('med');
  const [category, setCategory] = useState('Work');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Work', 'Code', 'Design', 'Life', 'Study'];

  const triggerConfetti = (e) => {
    try {
      const rect = e?.target?.getBoundingClientRect();
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
      });
    } catch (err) {
      console.debug('Confetti error:', err);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sound.playClick();
    const newTask = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const toggleTask = (id, event) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          sound.playComplete();
          triggerConfetti(event);
        } else {
          sound.playClick();
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updated);
  };

  const deleteTask = (id) => {
    sound.playClick();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    sound.playClick();
    setTasks(tasks.filter(t => !t.completed));
  };

  // Filter & Search
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  return (
    <div className="task-widget glass-card">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-box icon-purple">
            <CheckCircle size={18} />
          </div>
          <div>
            <h3>Task Manager</h3>
            <p className="widget-subtitle">Organize, execute and achieve goals</p>
          </div>
        </div>

        {tasks.some(t => t.completed) && (
          <button 
            className="clear-completed-btn" 
            onClick={clearCompleted}
            title="Clean up completed items"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} className="task-input-form">
        <div className="input-main-row">
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task or mission..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn-primary add-task-btn" disabled={!inputText.trim()}>
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>

        <div className="task-meta-row">
          {/* Priority Select */}
          <div className="meta-group">
            <span className="meta-label">Priority:</span>
            <div className="priority-pill-selector">
              {['low', 'med', 'high'].map(p => (
                <button
                  type="button"
                  key={p}
                  className={`priority-pill ${priority === p ? 'active' : ''} ${p}`}
                  onClick={() => { sound.playClick(); setPriority(p); }}
                >
                  <span className={`priority-dot ${p}`} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Select */}
          <div className="meta-group">
            <span className="meta-label">Tag:</span>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="category-dropdown"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Search & Filter Controls */}
      <div className="task-controls">
        <div className="search-bar-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'high', label: 'Urgent' }
          ].map(f => (
            <button
              key={f.id}
              className={`filter-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => { sound.playClick(); setFilter(f.id); }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks-state">
            <div className="empty-icon-circle">
              <Sparkles size={24} />
            </div>
            <p className="empty-title">
              {searchQuery ? 'No matching tasks found' : 'All clear! No tasks here'}
            </p>
            <p className="empty-subtitle">
              {searchQuery ? 'Try another keyword' : 'Create a new task above to stay productive.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <button 
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={(e) => toggleTask(task.id, e)}
                title={task.completed ? "Mark as active" : "Mark as done"}
              >
                {task.completed ? <Check size={14} /> : null}
              </button>

              <div className="task-body" onClick={(e) => toggleTask(task.id, e)}>
                <span className="task-text">{task.text}</span>
                <div className="task-tags">
                  <span className={`priority-tag ${task.priority}`}>
                    <span className={`priority-dot ${task.priority}`} />
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="category-tag">
                    <Tag size={11} /> {task.category}
                  </span>
                </div>
              </div>

              <button 
                className="task-delete-btn"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
