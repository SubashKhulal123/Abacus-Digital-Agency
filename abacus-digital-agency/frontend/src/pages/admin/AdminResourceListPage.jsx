import { useEffect } from 'react';
import ResourceListPage from '@components/admin/ResourceListPage';
import { ADMIN_RESOURCE_CONFIGS } from '@config/adminResources';

export default function AdminResourceListPage({ configKey }) {
  const config = ADMIN_RESOURCE_CONFIGS[configKey];

  useEffect(() => {
    document.title = `${config.title} — Admin`;
  }, [config]);

  return <ResourceListPage config={config} />;
}
