import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Pin, 
  PinOff, 
  Sparkles,
  Search
} from 'lucide-react';
import { sound } from '../utils/audio';

const NOTE_COLORS = [
  { id: 'indigo', name: 'Indigo Glow', bg: 'rgba(99, 102, 241, 0.18)', border: 'rgba(99, 102, 241, 0.4)', text: '#e0e7ff' },
  { id: 'rose', name: 'Rose Blossom', bg: 'rgba(244, 63, 94, 0.18)', border: 'rgba(244, 63, 94, 0.4)', text: '#ffe4e6' },
  { id: 'cyan', name: 'Cyan Breeze', bg: 'rgba(6, 182, 212, 0.18)', border: 'rgba(6, 182, 212, 0.4)', text: '#cffafe' },
  { id: 'emerald', name: 'Emerald Mint', bg: 'rgba(16, 185, 129, 0.18)', border: 'rgba(16, 185, 129, 0.4)', text: '#d1fae5' },
  { id: 'amber', name: 'Amber Solar', bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.4)', text: '#fef3c7' }
];

export default function NotesWidget({ notes, setNotes }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    sound.playClick();
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle.trim() || 'Quick Memo',
      content: noteContent.trim(),
      color: selectedColor,
      pinned: false,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    setNotes([newNote, ...notes]);
    setNoteTitle('');
    setNoteContent('');
  };

  const deleteNote = (id) => {
    sound.playClick();
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    sound.playClick();
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const copyNote = (note) => {
    sound.playClick();
    navigator.clipboard.writeText(`${note.title}\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Sort pinned to top & filter
  const filteredNotes = notes
    .filter(n => 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="notes-widget glass-card">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-box icon-amber">
            <StickyNote size={18} />
          </div>
          <div>
            <h3>Quick Scratchpad</h3>
            <p className="widget-subtitle">Capture inspirations &amp; snippets</p>
          </div>
        </div>
      </div>

      {/* Note Creation Card */}
      <form onSubmit={handleAddNote} className="note-input-form">
        <input
          type="text"
          placeholder="Note title (optional)..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="note-title-input"
        />
        <textarea
          placeholder="Write thoughts, snippets, links or ideas..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="note-textarea"
          rows={2}
        />

        <div className="note-form-footer">
          <div className="color-picker-row">
            {NOTE_COLORS.map(c => (
              <button
                type="button"
                key={c.id}
                className={`color-pick-dot ${selectedColor === c.id ? 'active' : ''}`}
                style={{ backgroundColor: c.bg, borderColor: c.border }}
                onClick={() => { sound.playClick(); setSelectedColor(c.id); }}
                title={c.name}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="btn-primary note-add-btn" 
            disabled={!noteContent.trim()}
          >
            <Plus size={15} />
            <span>Save Note</span>
          </button>
        </div>
      </form>

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="empty-notes-state">
            <Sparkles size={20} />
            <p>No scratchpad notes yet. Jot down something brilliant above!</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const colorTheme = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
            return (
              <div 
                key={note.id} 
                className={`note-card ${note.pinned ? 'pinned' : ''}`}
                style={{ 
                  backgroundColor: colorTheme.bg, 
                  borderColor: colorTheme.border 
                }}
              >
                <div className="note-card-header">
                  <div className="note-header-left">
                    <span className="note-date">{note.date}</span>
                    <h4 className="note-card-title">{note.title}</h4>
                  </div>

                  <div className="note-actions">
                    <button 
                      className="note-action-btn"
                      onClick={() => togglePin(note.id)}
                      title={note.pinned ? "Unpin note" : "Pin to top"}
                    >
                      {note.pinned ? <Pin size={13} className="pinned-icon" /> : <Pin size={13} />}
                    </button>
                    <button 
                      className="note-action-btn"
                      onClick={() => copyNote(note)}
                      title="Copy to clipboard"
                    >
                      {copiedId === note.id ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                    </button>
                    <button 
                      className="note-action-btn"
                      onClick={() => deleteNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="note-card-content">{note.content}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
