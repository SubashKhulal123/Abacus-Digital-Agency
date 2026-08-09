import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiX, FiFolder, FiFileText, FiBriefcase, FiUser, FiCornerDownLeft } from 'react-icons/fi';
import { searchApi } from '@api/searchApi';
import { useDebounce } from '@hooks/useDebounce';

const GROUPS = [
  { key: 'projects', label: 'Projects', icon: FiFolder, path: (r) => `/portfolio/${r.slug}` },
  { key: 'blogs', label: 'Blog Posts', icon: FiFileText, path: (r) => `/blog/${r.slug}` },
  { key: 'services', label: 'Services', icon: FiBriefcase, path: (r) => `/services/${r.slug}` },
  { key: 'developers', label: 'Team', icon: FiUser, path: () => `/about#team` },
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isFetching } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => searchApi.search(debouncedQuery).then((res) => res.data),
    enabled: open && debouncedQuery.trim().length >= 2,
  });

  const flatResults = GROUPS.flatMap((group) =>
    (data?.[group.key] || []).map((item) => ({ ...item, __group: group }))
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  const goTo = (result) => {
    navigate(result.__group.path(result));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && flatResults[activeIndex]) {
      goTo(flatResults[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-4">
              <FiSearch className="h-4 w-4 text-text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, blog posts, services, team..."
                aria-label="Search the site"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
              />
              <button onClick={onClose} className="text-text-muted hover:text-text">
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {debouncedQuery.trim().length < 2 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">
                  Type at least 2 characters to search...
                </p>
              ) : isFetching ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">Searching...</p>
              ) : flatResults.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">
                  No results for &quot;{debouncedQuery}&quot;
                </p>
              ) : (
                GROUPS.map((group) => {
                  const items = data?.[group.key] || [];
                  if (items.length === 0) return null;
                  return (
                    <div key={group.key} className="mb-2">
                      <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                        {group.label}
                      </p>
                      {items.map((item) => {
                        const globalIndex = flatResults.findIndex((r) => r._id === item._id);
                        const isActive = globalIndex === activeIndex;
                        return (
                          <button
                            key={item._id}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                            onClick={() => goTo({ ...item, __group: group })}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              isActive ? 'bg-accent/10 text-accent' : 'hover:bg-bg-surface'
                            }`}
                          >
                            <group.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 truncate">{item.title || item.name}</span>
                            {isActive && <FiCornerDownLeft className="h-3.5 w-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
