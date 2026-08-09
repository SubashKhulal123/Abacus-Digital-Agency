import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import AdminLayout from '@layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';
import PageTransition from '@components/common/PageTransition';
import AdminResourceListPage from '@pages/admin/AdminResourceListPage';
import AdminResourceFormPage from '@pages/admin/AdminResourceFormPage';

// ---------------------------------------------------------------------------
// Public site pages — lazy-loaded, one chunk each
// ---------------------------------------------------------------------------
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Services = lazy(() => import('@pages/Services'));
const ServiceDetail = lazy(() => import('@pages/ServiceDetail'));
const Portfolio = lazy(() => import('@pages/Portfolio'));
const ProjectDetail = lazy(() => import('@pages/ProjectDetail'));
const Blog = lazy(() => import('@pages/Blog'));
const BlogDetail = lazy(() => import('@pages/BlogDetail'));
const Careers = lazy(() => import('@pages/Careers'));
const JobDetail = lazy(() => import('@pages/JobDetail'));
const Contact = lazy(() => import('@pages/Contact'));
const NotFound = lazy(() => import('@pages/NotFound'));

// ---------------------------------------------------------------------------
// Admin pages — lazy-loaded
// ---------------------------------------------------------------------------
const AdminLogin = lazy(() => import('@pages/admin/Login'));
const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const AdminMessages = lazy(() => import('@pages/admin/Messages'));
const AdminMessageDetail = lazy(() => import('@pages/admin/MessageDetail'));
const AdminApplications = lazy(() => import('@pages/admin/Applications'));
const AdminApplicationDetail = lazy(() => import('@pages/admin/ApplicationDetail'));
const AdminNewsletter = lazy(() => import('@pages/admin/Newsletter'));
const AdminMediaLibrary = lazy(() => import('@pages/admin/MediaLibrary'));
const AdminSettings = lazy(() => import('@pages/admin/Settings'));
const AdminAuditLogs = lazy(() => import('@pages/admin/AuditLogs'));
const AdminSystemLogs = lazy(() => import('@pages/admin/SystemLogs'));
const AdminProfile = lazy(() => import('@pages/admin/Profile'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-bg">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
  </div>
);

const withPage = (Component, props) => (
  <Suspense fallback={<PageLoader />}>
    <PageTransition>
      <Component {...props} />
    </PageTransition>
  </Suspense>
);

const RootLayout = () => (
  <>
    <ScrollToTop />
    <MainLayout />
  </>
);

// Every simple CRUD resource gets the same 3 routes (list, new, edit) via
// the generic AdminResourceListPage/AdminResourceFormPage components —
// see src/config/adminResources.js for each resource's field schema.
const CRUD_RESOURCE_KEYS = [
  'developers', 'services', 'projects', 'blogs', 'testimonials',
  'clients', 'technologies', 'categories', 'faqs', 'statistics', 'jobs',
];

const crudRoutes = CRUD_RESOURCE_KEYS.flatMap((key) => [
  { path: key, element: withPage(AdminResourceListPage, { configKey: key }) },
  { path: `${key}/new`, element: withPage(AdminResourceFormPage, { configKey: key }) },
  { path: `${key}/:id/edit`, element: withPage(AdminResourceFormPage, { configKey: key }) },
]);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withPage(Home) },
      { path: 'about', element: withPage(About) },
      { path: 'services', element: withPage(Services) },
      { path: 'services/:slug', element: withPage(ServiceDetail) },
      { path: 'portfolio', element: withPage(Portfolio) },
      { path: 'portfolio/:slug', element: withPage(ProjectDetail) },
      { path: 'blog', element: withPage(Blog) },
      { path: 'blog/:slug', element: withPage(BlogDetail) },
      { path: 'careers', element: withPage(Careers) },
      { path: 'careers/:slug', element: withPage(JobDetail) },
      { path: 'contact', element: withPage(Contact) },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: withPage(AdminDashboard) },
          ...crudRoutes,
          { path: 'messages', element: withPage(AdminMessages) },
          { path: 'messages/:id', element: withPage(AdminMessageDetail) },
          { path: 'applications', element: withPage(AdminApplications) },
          { path: 'applications/:id', element: withPage(AdminApplicationDetail) },
          { path: 'newsletter', element: withPage(AdminNewsletter) },
          { path: 'media', element: withPage(AdminMediaLibrary) },
          { path: 'settings', element: withPage(AdminSettings) },
          { path: 'audit-logs', element: withPage(AdminAuditLogs) },
          { path: 'logs', element: withPage(AdminSystemLogs) },
          { path: 'profile', element: withPage(AdminProfile) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <>
        <ScrollToTop />
        <MainLayout />
      </>
    ),
    children: [{ path: '*', element: withPage(NotFound) }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
