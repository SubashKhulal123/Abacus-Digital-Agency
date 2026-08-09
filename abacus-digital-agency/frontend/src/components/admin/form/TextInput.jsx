export default function TextInput({ value, onChange, type = 'text', placeholder, ...props }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent"
      {...props}
    />
  );
}
