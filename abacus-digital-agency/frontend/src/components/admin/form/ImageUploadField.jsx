import { useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

/**
 * Handles a single image field. `value` can be either an existing
 * { url, publicId } object (from the DB) or a File the user just picked.
 * Emits the raw File via onChange when a new file is selected — the
 * parent form decides how to submit it (multipart).
 */
export default function ImageUploadField({ value, onChange, existingUrl }) {
  const inputRef = useRef(null);

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : existingUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-bg-surface/50">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <FiImage className="h-6 w-6 text-text-muted" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <FiUpload className="h-4 w-4" /> {previewUrl ? 'Replace image' : 'Upload image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-danger"
          >
            <FiX className="h-3 w-3" /> Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
        />
      </div>
    </div>
  );
}
