import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiDownload, FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import ConfirmDialog from './ConfirmDialog';

/**
 * @param {Object[]} columns - [{ key, label, render?(row), sortable? }]
 * @param {Object[]} rows
 * @param {Object} meta - { page, limit, total, totalPages }
 * @param {boolean} isLoading
 * @param {(query: object) => void} onQueryChange - called with { search, sort, page }
 * @param {(id: string) => string} editPath - returns the edit URL for a row
 * @param {(id: string) => void} onDelete
 * @param {(ids: string[]) => void} onBulkDelete
 * @param {() => void} [onExport]
 */
export default function DataTable({
  columns,
  rows = [],
  meta,
  isLoading,
  onQueryChange,
  editPath,
  onDelete,
  onBulkDelete,
  onExport,
  isExporting = false,
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState('-createdAt');
  const [confirmTarget, setConfirmTarget] = useState(null); // { type: 'single'|'bulk', id? }
  const [isDeleting, setIsDeleting] = useState(false);

  const allSelected = rows.length > 0 && selected.length === rows.length;

  const handleSearch = (e) => {
    e.preventDefault();
    onQueryChange({ search, sort, page: 1 });
  };

  const handleSort = (key) => {
    const next = sort === key ? `-${key}` : key;
    setSort(next);
    onQueryChange({ search, sort: next, page: 1 });
  };

  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r._id));
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (confirmTarget.type === 'single') {
        await onDelete(confirmTarget.id);
        toast.success('Deleted successfully');
      } else {
        await onBulkDelete(selected);
        toast.success(`${selected.length} item(s) deleted`);
        setSelected([]);
      }
      setConfirmTarget(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </form>

        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button
              onClick={() => setConfirmTarget({ type: 'bulk' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <FiTrash2 className="h-3.5 w-3.5" /> Delete ({selected.length})
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <FiDownload className="h-3.5 w-3.5" /> {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all rows" className="accent-accent" />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? 'cursor-pointer select-none px-4 py-3 hover:text-accent' : 'px-4 py-3'}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border-subtle">
                  <td className="px-4 py-4" colSpan={columns.length + 2}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-10">
                  <EmptyState message="No records found." />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id} className="border-b border-border-subtle transition-colors hover:bg-bg-surface/60">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(row._id)}
                      onChange={() => toggleOne(row._id)}
                      aria-label="Select row"
                      className="accent-accent"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editPath && (
                        <Link
                          to={editPath(row._id)}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:border-accent hover:text-accent"
                        >
                          <FiEdit2 className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setConfirmTarget({ type: 'single', id: row._id })}
                          aria-label="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:border-danger hover:text-danger"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
          <p className="text-xs text-text-muted">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => onQueryChange({ search, sort, page: meta.page - 1 })}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => onQueryChange({ search, sort, page: meta.page + 1 })}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title={confirmTarget?.type === 'bulk' ? `Delete ${selected.length} items?` : 'Delete this item?'}
        description="This will permanently remove the record from the database."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
