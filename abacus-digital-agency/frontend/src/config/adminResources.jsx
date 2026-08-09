import { FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';

const activeBadge = (row) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
      row.isActive ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'
    }`}
  >
    {row.isActive ? <FiCheckCircle className="h-3 w-3" /> : <FiXCircle className="h-3 w-3" />}
    {row.isActive ? 'Active' : 'Inactive'}
  </span>
);

const featuredBadge = (row) =>
  row.isFeatured ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
      <FiStar className="h-3 w-3" /> Featured
    </span>
  ) : null;

const thumb = (url, alt) => (
  <img src={url} alt={alt} className="h-10 w-10 rounded-lg object-cover" />
);

// ---------------------------------------------------------------------------
// Developers
// ---------------------------------------------------------------------------
export const developersConfig = {
  resourceKey: 'developers',
  title: 'Developers',
  singularLabel: 'Developer',
  description: 'Manage your team members shown on the About/Team pages.',
  exportable: true,
  columns: [
    { key: 'avatar', label: '', render: (r) => thumb(r.avatar?.url, r.name) },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'designation', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'isFeatured', label: 'Featured', render: featuredBadge },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g. Lead Frontend Engineer' },
    { name: 'bio', label: 'Bio', type: 'textarea', required: true, rows: 4 },
    { name: 'avatar', label: 'Avatar', type: 'image' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'department', label: 'Department', type: 'select', options: ['engineering', 'design', 'marketing', 'management', 'qa'].map((v) => ({ value: v, label: v })) },
    { name: 'experienceYears', label: 'Years of Experience', type: 'number' },
    { name: 'skills', label: 'Skills', type: 'tags', placeholder: 'Add a skill...' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isFeatured', label: 'Featured', type: 'toggle', toggleLabel: 'Show on homepage team section', defaultValue: false },
    { name: 'isActive', label: 'Active', type: 'toggle', toggleLabel: 'Visible on the site', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const servicesConfig = {
  resourceKey: 'services',
  title: 'Services',
  singularLabel: 'Service',
  description: 'Manage the services offered on the Services page.',
  exportable: true,
  columns: [
    { key: 'coverImage', label: '', render: (r) => thumb(r.coverImage?.url, r.title) },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'shortDescription', label: 'Summary', render: (r) => <span className="line-clamp-1 max-w-xs text-text-secondary">{r.shortDescription}</span> },
    { key: 'isFeatured', label: 'Featured', render: featuredBadge },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'icon', label: 'Icon (react-icons Fi name)', type: 'text', placeholder: 'FiCode' },
    { name: 'shortDescription', label: 'Short Description', type: 'textarea', required: true, rows: 2 },
    { name: 'description', label: 'Full Description', type: 'textarea', required: true, rows: 5 },
    { name: 'coverImage', label: 'Cover Image', type: 'image' },
    { name: 'features', label: 'Features', type: 'tags', placeholder: 'Add a feature...' },
    { name: 'process', label: 'Process Steps (JSON array)', type: 'json', hint: '[{ "step": 1, "title": "...", "description": "..." }]', rows: 6 },
    { name: 'technologies', label: 'Technologies', type: 'relation-multi', resourceKey: 'technologies', labelField: 'name' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isFeatured', label: 'Featured', type: 'toggle', defaultValue: false },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projectsConfig = {
  resourceKey: 'projects',
  title: 'Projects',
  singularLabel: 'Project',
  description: 'Manage portfolio case studies.',
  exportable: false,
  columns: [
    { key: 'thumbnail', label: '', render: (r) => thumb(r.thumbnail?.url, r.title) },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', render: (r) => r.category?.name || '—' },
    { key: 'views', label: 'Views', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            r.status === 'published' ? 'bg-success/10 text-success' : r.status === 'draft' ? 'bg-warning/10 text-warning' : 'bg-text-muted/10 text-text-muted'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'shortDescription', label: 'Short Description', type: 'textarea', required: true, rows: 2 },
    { name: 'description', label: 'Full Description', type: 'textarea', required: true, rows: 5 },
    { name: 'thumbnail', label: 'Thumbnail', type: 'image' },
    { name: 'category', label: 'Category', type: 'relation', resourceKey: 'categories', labelField: 'name', filterParams: { type: 'project' }, required: true },
    { name: 'technologies', label: 'Technologies', type: 'relation-multi', resourceKey: 'technologies', labelField: 'name' },
    { name: 'client', label: 'Client', type: 'relation', resourceKey: 'clients', labelField: 'name' },
    { name: 'developers', label: 'Team Members', type: 'relation-multi', resourceKey: 'developers', labelField: 'name' },
    { name: 'liveUrl', label: 'Live URL', type: 'text' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'text' },
    { name: 'features', label: 'Key Features', type: 'tags' },
    { name: 'challenges', label: 'The Challenge', type: 'textarea', rows: 3 },
    { name: 'solutions', label: 'Our Solution', type: 'textarea', rows: 3 },
    { name: 'results', label: 'Results (JSON array)', type: 'json', hint: '[{ "metric": "Load time", "value": "-64%" }]', rows: 4 },
    { name: 'durationWeeks', label: 'Duration (weeks)', type: 'number' },
    { name: 'teamSize', label: 'Team Size', type: 'number' },
    { name: 'completedAt', label: 'Completed Date', type: 'date' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ],
      defaultValue: 'draft',
    },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isFeatured', label: 'Featured', type: 'toggle', defaultValue: false },
  ],
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------
export const blogsConfig = {
  resourceKey: 'blogs',
  title: 'Blog Posts',
  singularLabel: 'Blog Post',
  description: 'Write and manage blog content with the rich text editor.',
  exportable: false,
  columns: [
    { key: 'coverImage', label: '', render: (r) => thumb(r.coverImage?.url, r.title) },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', render: (r) => r.category?.name || '—' },
    { key: 'views', label: 'Views', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            r.status === 'published' ? 'bg-success/10 text-success' : r.status === 'draft' ? 'bg-warning/10 text-warning' : 'bg-text-muted/10 text-text-muted'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, rows: 2 },
    { name: 'content', label: 'Content', type: 'richtext', required: true },
    { name: 'coverImage', label: 'Cover Image', type: 'image', required: true },
    { name: 'category', label: 'Category', type: 'relation', resourceKey: 'categories', labelField: 'name', filterParams: { type: 'blog' }, required: true },
    { name: 'tags', label: 'Tags', type: 'tags' },
    { name: 'readTimeMinutes', label: 'Read Time (minutes)', type: 'number', defaultValue: 5 },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ],
      defaultValue: 'draft',
    },
    { name: 'isFeatured', label: 'Featured', type: 'toggle', defaultValue: false },
    { name: 'seo', label: 'SEO (JSON)', type: 'json', hint: '{ "title": "...", "description": "...", "keywords": [] }', rows: 4 },
  ],
};

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export const testimonialsConfig = {
  resourceKey: 'testimonials',
  title: 'Testimonials',
  singularLabel: 'Testimonial',
  description: 'Manage client testimonials shown across the site.',
  exportable: true,
  columns: [
    { key: 'clientAvatar', label: '', render: (r) => thumb(r.clientAvatar?.url, r.clientName) },
    { key: 'clientName', label: 'Client', sortable: true },
    { key: 'clientCompany', label: 'Company' },
    { key: 'rating', label: 'Rating' },
    { key: 'isFeatured', label: 'Featured', render: featuredBadge },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'clientName', label: 'Client Name', type: 'text', required: true },
    { name: 'clientDesignation', label: 'Designation', type: 'text', required: true },
    { name: 'clientCompany', label: 'Company', type: 'text', required: true },
    { name: 'clientAvatar', label: 'Client Avatar', type: 'image' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5 },
    { name: 'message', label: 'Testimonial', type: 'textarea', required: true, rows: 4 },
    { name: 'project', label: 'Related Project', type: 'relation', resourceKey: 'projects', labelField: 'title' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isFeatured', label: 'Featured', type: 'toggle', defaultValue: false },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
export const clientsConfig = {
  resourceKey: 'clients',
  title: 'Clients',
  singularLabel: 'Client',
  description: 'Manage client logos shown in the trust bar.',
  exportable: true,
  columns: [
    { key: 'logo', label: '', render: (r) => thumb(r.logo?.url, r.name) },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'industry', label: 'Industry' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'name', label: 'Client Name', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'image', required: true },
    { name: 'website', label: 'Website', type: 'text' },
    { name: 'industry', label: 'Industry', type: 'text' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Technologies
// ---------------------------------------------------------------------------
export const technologiesConfig = {
  resourceKey: 'technologies',
  title: 'Technologies',
  singularLabel: 'Technology',
  description: 'Manage the tech stack shown across the site.',
  exportable: true,
  columns: [
    { key: 'color', label: '', render: (r) => <span className="block h-6 w-6 rounded-full" style={{ backgroundColor: r.color }} /> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: ['frontend', 'backend', 'database', 'devops', 'design', 'mobile', 'other'].map((v) => ({ value: v, label: v })),
    },
    { name: 'color', label: 'Brand Color (hex)', type: 'text', placeholder: '#6366f1', defaultValue: '#6366f1' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categoriesConfig = {
  resourceKey: 'categories',
  title: 'Categories',
  singularLabel: 'Category',
  description: 'Manage project and blog categories.',
  exportable: false,
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [{ value: 'project', label: 'Project' }, { value: 'blog', label: 'Blog' }],
    },
    { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
    { name: 'icon', label: 'Icon (react-icons Fi name)', type: 'text' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export const faqsConfig = {
  resourceKey: 'faqs',
  title: 'FAQs',
  singularLabel: 'FAQ',
  description: 'Manage frequently asked questions.',
  exportable: false,
  columns: [
    { key: 'question', label: 'Question', render: (r) => <span className="line-clamp-1 max-w-md">{r.question}</span> },
    { key: 'category', label: 'Category' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true, rows: 4 },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: ['general', 'pricing', 'process', 'technical', 'support'].map((v) => ({ value: v, label: v })),
      defaultValue: 'general',
    },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------
export const statisticsConfig = {
  resourceKey: 'statistics',
  title: 'Statistics',
  singularLabel: 'Statistic',
  description: 'Manage homepage achievement counters.',
  exportable: false,
  columns: [
    { key: 'label', label: 'Label', sortable: true },
    { key: 'value', label: 'Value' },
    { key: 'suffix', label: 'Suffix' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. Projects Delivered' },
    { name: 'value', label: 'Value', type: 'number', required: true },
    { name: 'prefix', label: 'Prefix', type: 'text', placeholder: '$' },
    { name: 'suffix', label: 'Suffix', type: 'text', placeholder: '+' },
    { name: 'icon', label: 'Icon (react-icons Fi name)', type: 'text' },
    { name: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Job Posts
// ---------------------------------------------------------------------------
export const jobsConfig = {
  resourceKey: 'jobs',
  title: 'Job Posts',
  singularLabel: 'Job Post',
  description: 'Manage open career listings.',
  exportable: false,
  columns: [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
    { key: 'applicationsCount', label: 'Applicants' },
    { key: 'isActive', label: 'Status', render: activeBadge },
  ],
  fields: [
    { name: 'title', label: 'Job Title', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    {
      name: 'type',
      label: 'Employment Type',
      type: 'select',
      required: true,
      options: ['full-time', 'part-time', 'contract', 'internship', 'remote'].map((v) => ({ value: v, label: v })),
    },
    { name: 'location', label: 'Location', type: 'text', required: true },
    {
      name: 'experienceLevel',
      label: 'Experience Level',
      type: 'select',
      options: ['entry', 'mid', 'senior', 'lead'].map((v) => ({ value: v, label: v })),
      defaultValue: 'mid',
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 4 },
    { name: 'responsibilities', label: 'Responsibilities', type: 'tags' },
    { name: 'requirements', label: 'Requirements', type: 'tags' },
    { name: 'niceToHave', label: 'Nice to Have', type: 'tags' },
    { name: 'salaryRange', label: 'Salary Range (JSON)', type: 'json', hint: '{ "min": 100000, "max": 140000, "currency": "USD", "isPublic": true }', rows: 3 },
    { name: 'applicationDeadline', label: 'Application Deadline', type: 'date' },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ],
};

export const ADMIN_RESOURCE_CONFIGS = {
  developers: developersConfig,
  services: servicesConfig,
  projects: projectsConfig,
  blogs: blogsConfig,
  testimonials: testimonialsConfig,
  clients: clientsConfig,
  technologies: technologiesConfig,
  categories: categoriesConfig,
  faqs: faqsConfig,
  statistics: statisticsConfig,
  jobs: jobsConfig,
};
