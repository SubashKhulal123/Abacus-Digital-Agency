import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './richTextEditor.css';

const MODULES = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

/**
 * Produces HTML — matches the Blog model's `content` field, which the
 * public site renders directly (see BlogDetail.jsx).
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Write your post...' }) {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={MODULES}
        placeholder={placeholder}
      />
    </div>
  );
}
