import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import AdminPageHeader from './AdminPageHeader';
import DataTable from './DataTable';
import { useAdminList, useAdminRemove, useAdminBulkRemove, useAdminExportCSV } from '@hooks/useAdminResource';

/**
 * @param {Object} config
 * @param {string} config.resourceKey
 * @param {string} config.title
 * @param {string} [config.description]
 * @param {Object[]} config.columns
 * @param {boolean} [config.exportable]
 */
export default function ResourceListPage({ config }) {
  const { resourceKey, title, description, columns, exportable } = config;
  const [query, setQuery] = useState({ page: 1, sort: '-createdAt' });

  const { data, isLoading } = useAdminList(resourceKey, query);
  const removeMutation = useAdminRemove(resourceKey);
  const bulkRemoveMutation = useAdminBulkRemove(resourceKey);
  const exportMutation = useAdminExportCSV(resourceKey);

  const rows = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        action={{ label: `Add ${config.singularLabel || title}`, to: `/admin/${resourceKey}/new`, icon: FiPlus }}
      />
      <DataTable
        columns={columns}
        rows={rows}
        meta={meta}
        isLoading={isLoading}
        onQueryChange={setQuery}
        editPath={(id) => `/admin/${resourceKey}/${id}/edit`}
        onDelete={(id) => removeMutation.mutateAsync(id)}
        onBulkDelete={(ids) => bulkRemoveMutation.mutateAsync(ids)}
        onExport={exportable ? () => exportMutation.mutate() : undefined}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
}
