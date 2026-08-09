export default function FormField({ label, error, required, hint, children, className, htmlFor }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-danger" role="alert">{error}</p>}
    </div>
  );
}
