import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import FormField from './form/FormField';
import TextInput from './form/TextInput';
import TextareaInput from './form/TextareaInput';
import SelectInput from './form/SelectInput';
import ToggleInput from './form/ToggleInput';
import TagsInput from './form/TagsInput';
import ImageUploadField from './form/ImageUploadField';
import RelationSelect from './form/RelationSelect';
import RichTextEditor from './form/RichTextEditor';
import { useAdminOne, useAdminCreate, useAdminUpdate } from '@hooks/useAdminResource';

const IMAGE_FIELD_TYPES = ['image'];

function buildInitialState(fields, existingDoc) {
  const state = {};
  fields.forEach((f) => {
    if (existingDoc && existingDoc[f.name] !== undefined) {
      if (f.type === 'relation' && typeof existingDoc[f.name] === 'object' && existingDoc[f.name]?._id) {
        state[f.name] = existingDoc[f.name]._id;
      } else if (f.type === 'relation-multi') {
        state[f.name] = (existingDoc[f.name] || []).map((v) => (typeof v === 'object' ? v._id : v));
      } else if (f.type === 'json') {
        state[f.name] = JSON.stringify(existingDoc[f.name] ?? f.defaultValue ?? {}, null, 2);
      } else {
        state[f.name] = existingDoc[f.name];
      }
    } else {
      state[f.name] = f.defaultValue !== undefined ? f.defaultValue : f.type === 'tags' || f.type === 'relation-multi' ? [] : f.type === 'toggle' ? false : '';
    }
  });
  return state;
}

/**
 * @param {Object} config
 * @param {string} config.resourceKey
 * @param {string} config.title
 * @param {string} [config.singularLabel]
 * @param {Object[]} config.fields - field schema, see field type components above
 */
export default function ResourceForm({ config }) {
  const { resourceKey, fields, title, singularLabel = 'Item' } = config;
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingDoc, isLoading: isLoadingDoc } = useAdminOne(resourceKey, id);
  const createMutation = useAdminCreate(resourceKey);
  const updateMutation = useAdminUpdate(resourceKey);

  const [values, setValues] = useState(() => buildInitialState(fields, null));
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(!isEdit);

  useEffect(() => {
    if (isEdit && existingDoc && !initialized) {
      setValues(buildInitialState(fields, existingDoc));
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingDoc, isEdit, initialized]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const hasFile = fields.some((f) => IMAGE_FIELD_TYPES.includes(f.type) && values[f.name] instanceof File);

    let payload;
    if (hasFile) {
      payload = new FormData();
      fields.forEach((f) => {
        const val = values[f.name];
        if (IMAGE_FIELD_TYPES.includes(f.type)) {
          if (val instanceof File) payload.append(f.name, val);
          else if (val && typeof val === 'object') payload.append(f.name, JSON.stringify(val));
        } else if (f.type === 'json') {
          try {
            payload.append(f.name, JSON.stringify(JSON.parse(val || '{}')));
          } catch (_) {
            payload.append(f.name, '{}');
          }
        } else if (Array.isArray(val)) {
          payload.append(f.name, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(f.name, val);
        }
      });
    } else {
      payload = {};
      fields.forEach((f) => {
        if (IMAGE_FIELD_TYPES.includes(f.type)) return; // no file, leave image untouched on update
        if (f.type === 'json') {
          try {
            payload[f.name] = JSON.parse(values[f.name] || '{}');
          } catch (_) {
            payload[f.name] = {};
          }
        } else {
          payload[f.name] = values[f.name];
        }
      });
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, data: payload, isMultipart: hasFile });
      } else {
        await createMutation.mutateAsync({ data: payload, isMultipart: hasFile });
      }
      toast.success(`${singularLabel} saved successfully`);
      navigate(`/admin/${resourceKey}`);
    } catch (err) {
      const message = err.message || 'Something went wrong. Please check your input and try again.';
      setError(message);
      toast.error(message);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingDoc && !initialized) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FiLoader className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link
        to={`/admin/${resourceKey}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to {title}
      </Link>

      <h1 className="mb-8 font-display text-2xl font-semibold">
        {isEdit ? `Edit ${singularLabel}` : `New ${singularLabel}`}
      </h1>

      <form onSubmit={handleSubmit} className="glass-panel space-y-6 rounded-2xl p-6 sm:p-8">
        {fields.map((f) => (
          <FormField key={f.name} label={f.label} htmlFor={f.name} required={f.required} hint={f.hint} className={f.fullWidth ? '' : ''}>
            {f.type === 'text' && (
              <TextInput id={f.name} value={values[f.name]} onChange={(v) => setField(f.name, v)} placeholder={f.placeholder} required={f.required} />
            )}
            {f.type === 'email' && (
              <TextInput id={f.name} type="email" value={values[f.name]} onChange={(v) => setField(f.name, v)} placeholder={f.placeholder} required={f.required} />
            )}
            {f.type === 'number' && (
              <TextInput id={f.name} type="number" value={values[f.name]} onChange={(v) => setField(f.name, v)} placeholder={f.placeholder} />
            )}
            {f.type === 'date' && (
              <TextInput id={f.name} type="date" value={values[f.name]?.slice ? values[f.name].slice(0, 10) : values[f.name]} onChange={(v) => setField(f.name, v)} />
            )}
            {f.type === 'textarea' && (
              <TextareaInput id={f.name} value={values[f.name]} onChange={(v) => setField(f.name, v)} placeholder={f.placeholder} rows={f.rows} />
            )}
            {f.type === 'richtext' && (
              <RichTextEditor value={values[f.name]} onChange={(v) => setField(f.name, v)} />
            )}
            {f.type === 'select' && (
              <SelectInput id={f.name} value={values[f.name]} onChange={(v) => setField(f.name, v)} options={f.options} placeholder={f.placeholder} />
            )}
            {f.type === 'toggle' && (
              <ToggleInput id={f.name} value={values[f.name]} onChange={(v) => setField(f.name, v)} label={f.toggleLabel} />
            )}
            {f.type === 'tags' && (
              <TagsInput value={values[f.name] || []} onChange={(v) => setField(f.name, v)} placeholder={f.placeholder} />
            )}
            {f.type === 'image' && (
              <ImageUploadField
                value={values[f.name]}
                existingUrl={typeof values[f.name] === 'object' && values[f.name]?.url}
                onChange={(v) => setField(f.name, v)}
              />
            )}
            {f.type === 'relation' && (
              <RelationSelect
                resourceKey={f.resourceKey}
                labelField={f.labelField}
                filterParams={f.filterParams}
                value={values[f.name]}
                onChange={(v) => setField(f.name, v)}
                placeholder={f.placeholder}
              />
            )}
            {f.type === 'relation-multi' && (
              <RelationSelect
                resourceKey={f.resourceKey}
                labelField={f.labelField}
                filterParams={f.filterParams}
                multiple
                value={values[f.name]}
                onChange={(v) => setField(f.name, v)}
              />
            )}
            {f.type === 'json' && (
              <TextareaInput
                id={f.name}
                value={values[f.name]}
                onChange={(v) => setField(f.name, v)}
                rows={f.rows || 6}
                placeholder={f.placeholder || '{ }'}
                className="font-mono text-xs"
              />
            )}
          </FormField>
        ))}

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-border-subtle pt-6">
          <Link
            to={`/admin/${resourceKey}`}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-bg-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            <FiSave className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
