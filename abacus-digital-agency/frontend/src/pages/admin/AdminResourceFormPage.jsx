import { useEffect } from 'react';
import ResourceForm from '@components/admin/ResourceForm';
import { ADMIN_RESOURCE_CONFIGS } from '@config/adminResources';

export default function AdminResourceFormPage({ configKey }) {
  const config = ADMIN_RESOURCE_CONFIGS[configKey];

  useEffect(() => {
    document.title = `${config.title} — Admin`;
  }, [config]);

  return <ResourceForm config={config} />;
}
