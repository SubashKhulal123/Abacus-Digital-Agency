import { useState } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Editable list of plain strings (tags, features, requirements, etc.).
 * Press Enter or comma to add an item.
 */
export default function TagsInput({ value = [], onChange, placeholder = 'Type and press Enter...' }) {
  const [draft, setDraft] = useState('');

  const addItem = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
  };

  const removeItem = (item) => onChange(value.filter((v) => v !== item));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addItem();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[46px] flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-surface/50 px-3 py-2 focus-within:border-accent">
      {value.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent"
        >
          {item}
          <button type="button" onClick={() => removeItem(item)}>
            <FiX className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        placeholder={value.length ? '' : placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
