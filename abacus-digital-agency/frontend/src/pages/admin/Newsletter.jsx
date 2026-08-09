import { useEffect, useRef, useState } from 'react';
import { FiUpload, FiDownload, FiCheckCircle } from 'react-icons/fi';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import DataTable from '@components/admin/DataTable';
import { useAdminList, useAdminRemove, useAdminBulkRemove, useAdminExportCSV } from '@hooks/useAdminResource';
import { useImportNewsletter } from '@hooks/useAdmin';

export default function Newsletter() {
  const [query, setQuery] = useState({ page: 1 });
  const { data, isLoading } = useAdminList('newsletter', query);
  const removeMutation = useAdminRemove('newsletter');
  const bulkRemoveMutation = useAdminBulkRemove('newsletter');
  const exportMutation = useAdminExportCSV('newsletter');
  const importMutation = useImportNewsletter();
  const fileInputRef = useRef(null);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    document.title = 'Newsletter — Admin';
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importMutation.mutateAsync(file);
    setImportResult(res.data);
    e.target.value = '';
  };

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'source', label: 'Source' },
    {
      key: 'isSubscribed',
      label: 'Status',
      render: (r) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.isSubscribed ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
          {r.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Joined', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="Manage your email newsletter list."
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importMutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <FiUpload className="h-4 w-4" /> {importMutation.isPending ? 'Importing...' : 'Import CSV'}
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />

        <button
          onClick={() => exportMutation.mutate()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <FiDownload className="h-4 w-4" /> Export CSV
        </button>

        {importResult && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
            <FiCheckCircle className="h-3.5 w-3.5" />
            Imported {importResult.imported}, skipped {importResult.skipped} duplicates
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        meta={data?.meta}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onDelete={(id) => removeMutation.mutateAsync(id)}
        onBulkDelete={(ids) => bulkRemoveMutation.mutateAsync(ids)}
      />
    </div>
  );
}
