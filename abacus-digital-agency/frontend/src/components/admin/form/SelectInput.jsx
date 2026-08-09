export default function SelectInput({ value, onChange, options = [], placeholder, ...props }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
