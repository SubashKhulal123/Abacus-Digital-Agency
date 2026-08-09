import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import { useAdminList, useAdminRemove } from '@hooks/useAdminResource';
import { useUploadMedia } from '@hooks/useAdmin';

export default function MediaLibrary() {
  const { data, isLoading } = useAdminList('media', { limit: 48 });
  const removeMutation = useAdminRemove('media');
  const uploadMutation = useUploadMedia();
  const fileInputRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    document.title = 'Media Library — Admin';
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await uploadMutation.mutateAsync({ file, extra: {} });
    }
    e.target.value = '';
  };

  const copyUrl = (item) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const media = data?.data || [];

  return (
    <div>
      <AdminPageHeader title="Media Library" description="All files uploaded through the admin panel." />

      <div className="mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          <FiUpload className="h-4 w-4" /> {uploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)}
        </div>
      ) : media.length === 0 ? (
        <EmptyState message="No media files yet. Upload your first one above." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {media.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: (i % 12) * 0.03 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border"
            >
              <img src={item.url} alt={item.fileName} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-accent"
                  title="Copy URL"
                >
                  {copiedId === item._id ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setDeleteTarget(item._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-danger"
                  title="Delete"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this file?"
        description="This will permanently remove the file from Cloudinary and the media library."
        isLoading={removeMutation.isPending}
        onConfirm={async () => {
          await removeMutation.mutateAsync(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
