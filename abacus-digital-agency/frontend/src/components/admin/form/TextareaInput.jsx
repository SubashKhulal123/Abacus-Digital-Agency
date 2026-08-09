export default function TextareaInput({ value, onChange, rows = 4, placeholder, ...props }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent"
      {...props}
    />
  );
}
