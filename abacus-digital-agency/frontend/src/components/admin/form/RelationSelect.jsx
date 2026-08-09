import { useAdminList } from '@hooks/useAdminResource';

/**
 * @param {string} resourceKey - which admin resource to pull options from
 * @param {string} labelField - which field on each option to display
 * @param {boolean} multiple - allow selecting more than one
 * @param {string|string[]} value - selected id(s)
 * @param {(val) => void} onChange
 * @param {Object} [filterParams] - extra query params, e.g. { type: 'project' }
 */
export default function RelationSelect({
  resourceKey,
  labelField = 'name',
  multiple = false,
  value,
  onChange,
  filterParams = {},
  placeholder = 'Select...',
}) {
  const { data, isLoading } = useAdminList(resourceKey, { limit: 100, ...filterParams });
  const options = data?.data || [];

  if (multiple) {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (id) => {
      onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
    };

    return (
      <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-bg-surface/50 p-2">
        {isLoading ? (
          <p className="p-2 text-xs text-text-muted">Loading options...</p>
        ) : options.length === 0 ? (
          <p className="p-2 text-xs text-text-muted">No options available</p>
        ) : (
          options.map((opt) => (
            <label
              key={opt._id}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-bg-surface"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt._id)}
                onChange={() => toggle(opt._id)}
                className="accent-accent"
              />
              {opt[labelField]}
            </label>
          ))
        )}
      </div>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
    >
      <option value="">{isLoading ? 'Loading...' : placeholder}</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt[labelField]}
        </option>
      ))}
    </select>
  );
}
