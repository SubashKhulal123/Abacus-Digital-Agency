import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminPageHeader({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </Link>
      )}
    </motion.div>
  );
}
