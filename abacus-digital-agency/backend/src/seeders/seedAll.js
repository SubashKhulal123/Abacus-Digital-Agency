/**
 * Seeds realistic, professional demo content across every public-facing
 * CMS collection so the frontend has real data to render against.
 * Destructive by design for these collections (idempotent re-seed) —
 * does NOT touch Admin accounts. Run with: npm run seed:all
 */
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const logger = require('../utils/logger');

const Admin = require('../models/Admin.model');
const Category = require('../models/Category.model');
const Technology = require('../models/Technology.model');
const Developer = require('../models/Developer.model');
const Client = require('../models/Client.model');
const Project = require('../models/Project.model');
const Service = require('../models/Service.model');
const Testimonial = require('../models/Testimonial.model');
const Blog = require('../models/Blog.model');
const FAQ = require('../models/FAQ.model');
const Statistic = require('../models/Statistic.model');
const JobPost = require('../models/JobPost.model');
const SiteSettings = require('../models/SiteSettings.model');

const img = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const run = async () => {
  await connectDB();

  const admin = await Admin.findOne();
  if (!admin) {
    logger.error('No admin account found. Run `npm run seed:admin` first.');
    process.exit(1);
  }

  logger.info('Clearing existing CMS content...');
  await Promise.all([
    Category.deleteMany({}),
    Technology.deleteMany({}),
    Developer.deleteMany({}),
    Client.deleteMany({}),
    Project.deleteMany({}),
    Service.deleteMany({}),
    Testimonial.deleteMany({}),
    Blog.deleteMany({}),
    FAQ.deleteMany({}),
    Statistic.deleteMany({}),
    JobPost.deleteMany({}),
  ]);

  // ---------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------
  const projectCategories = await Category.insertMany([
    { name: 'Web Applications', slug: 'web-applications', type: 'project', icon: 'FiGlobe', order: 1 },
    { name: 'Mobile Apps', slug: 'mobile-apps', type: 'project', icon: 'FiSmartphone', order: 2 },
    { name: 'E-Commerce', slug: 'e-commerce', type: 'project', icon: 'FiShoppingCart', order: 3 },
    { name: 'SaaS Platforms', slug: 'saas-platforms', type: 'project', icon: 'FiLayers', order: 4 },
    { name: 'AI & Automation', slug: 'ai-automation', type: 'project', icon: 'FiCpu', order: 5 },
    { name: 'Brand & Identity', slug: 'brand-identity', type: 'project', icon: 'FiFeather', order: 6 },
  ]);

  const blogCategories = await Category.insertMany([
    { name: 'Engineering', slug: 'engineering', type: 'blog', icon: 'FiCode', order: 1 },
    { name: 'Design', slug: 'design', type: 'blog', icon: 'FiPenTool', order: 2 },
    { name: 'Product', slug: 'product', type: 'blog', icon: 'FiBox', order: 3 },
    { name: 'Case Studies', slug: 'case-studies', type: 'blog', icon: 'FiFileText', order: 4 },
    { name: 'Careers', slug: 'careers-blog', type: 'blog', icon: 'FiUsers', order: 5 },
  ]);

  const catBySlug = (list, slug) => list.find((c) => c.slug === slug);

  // ---------------------------------------------------------------
  // Technologies
  // ---------------------------------------------------------------
  const techs = await Technology.insertMany([
    { name: 'React', slug: 'react', category: 'frontend', color: '#61DAFB', order: 1 },
    { name: 'Next.js', slug: 'nextjs', category: 'frontend', color: '#FFFFFF', order: 2 },
    { name: 'Vue.js', slug: 'vuejs', category: 'frontend', color: '#42B883', order: 3 },
    { name: 'TypeScript', slug: 'typescript', category: 'frontend', color: '#3178C6', order: 4 },
    { name: 'TailwindCSS', slug: 'tailwindcss', category: 'frontend', color: '#38BDF8', order: 5 },
    { name: 'Node.js', slug: 'nodejs', category: 'backend', color: '#3C873A', order: 6 },
    { name: 'NestJS', slug: 'nestjs', category: 'backend', color: '#E0234E', order: 7 },
    { name: 'Python', slug: 'python', category: 'backend', color: '#3776AB', order: 8 },
    { name: 'Django', slug: 'django', category: 'backend', color: '#092E20', order: 9 },
    { name: 'GraphQL', slug: 'graphql', category: 'backend', color: '#E10098', order: 10 },
    { name: 'MongoDB', slug: 'mongodb', category: 'database', color: '#47A248', order: 11 },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'database', color: '#4169E1', order: 12 },
    { name: 'Redis', slug: 'redis', category: 'database', color: '#DC382D', order: 13 },
    { name: 'Docker', slug: 'docker', category: 'devops', color: '#2496ED', order: 14 },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'devops', color: '#326CE5', order: 15 },
    { name: 'AWS', slug: 'aws', category: 'devops', color: '#FF9900', order: 16 },
    { name: 'Figma', slug: 'figma', category: 'design', color: '#F24E1E', order: 17 },
    { name: 'React Native', slug: 'react-native', category: 'mobile', color: '#61DAFB', order: 18 },
    { name: 'Flutter', slug: 'flutter', category: 'mobile', color: '#02569B', order: 19 },
    { name: 'Swift', slug: 'swift', category: 'mobile', color: '#F05138', order: 20 },
  ]);

  const techBySlug = (slug) => techs.find((t) => t.slug === slug)._id;

  // ---------------------------------------------------------------
  // Developers
  // ---------------------------------------------------------------
  const developers = await Developer.insertMany([
    {
      name: 'Maya Chen',
      slug: 'maya-chen',
      designation: 'Founding Partner & Design Director',
      bio: 'Maya has led design for venture-backed startups and Fortune 500 redesigns alike. She founded Abacus in 2018 to prove that agency-quality craft and product-team-quality process aren\u2019t mutually exclusive.',
      avatar: { url: img('maya-chen', 500, 500), publicId: 'seed/maya-chen' },
      skills: ['Design Systems', 'Brand Strategy', 'Figma', 'Motion Design'],
      technologies: [techBySlug('figma')],
      experienceYears: 12,
      socialLinks: { linkedin: 'https://linkedin.com/in/mayachen', dribbble: 'https://dribbble.com/mayachen' },
      department: 'design',
      isFeatured: true,
      order: 1,
    },
    {
      name: 'Jordan Ellis',
      slug: 'jordan-ellis',
      designation: 'Lead Full-Stack Engineer',
      bio: 'Jordan has shipped production systems handling millions of requests a day. He specializes in turning ambitious product visions into fast, reliable, maintainable code.',
      avatar: { url: img('jordan-ellis', 500, 500), publicId: 'seed/jordan-ellis' },
      skills: ['React', 'Node.js', 'System Design', 'Performance Engineering'],
      technologies: [techBySlug('react'), techBySlug('nodejs'), techBySlug('typescript')],
      experienceYears: 10,
      socialLinks: { github: 'https://github.com/jordanellis', linkedin: 'https://linkedin.com/in/jordanellis' },
      department: 'engineering',
      isFeatured: true,
      order: 2,
    },
    {
      name: 'Priya Raman',
      slug: 'priya-raman',
      designation: 'Senior Backend Architect',
      bio: 'Priya designs data models and API architectures that hold up under real production load. Previously led platform engineering at a Series C fintech startup.',
      avatar: { url: img('priya-raman', 500, 500), publicId: 'seed/priya-raman' },
      skills: ['Node.js', 'MongoDB', 'System Architecture', 'Security'],
      technologies: [techBySlug('nodejs'), techBySlug('mongodb'), techBySlug('postgresql')],
      experienceYears: 9,
      socialLinks: { github: 'https://github.com/priyaraman', linkedin: 'https://linkedin.com/in/priyaraman' },
      department: 'engineering',
      isFeatured: true,
      order: 3,
    },
    {
      name: 'Lucas Ferreira',
      slug: 'lucas-ferreira',
      designation: 'Senior Frontend Engineer',
      bio: 'Lucas obsesses over the last 10% of polish — the animation timing, the layout shift, the interaction that makes an interface feel alive.',
      avatar: { url: img('lucas-ferreira', 500, 500), publicId: 'seed/lucas-ferreira' },
      skills: ['React', 'GSAP', 'Framer Motion', 'WebGL'],
      technologies: [techBySlug('react'), techBySlug('nextjs'), techBySlug('typescript')],
      experienceYears: 7,
      socialLinks: { github: 'https://github.com/lucasferreira', portfolio: 'https://lucasferreira.dev' },
      department: 'engineering',
      isFeatured: true,
      order: 4,
    },
    {
      name: 'Sofia Novak',
      slug: 'sofia-novak',
      designation: 'Product Designer',
      bio: 'Sofia bridges research and visual design — she\u2019s as comfortable running a usability test as she is shipping a component library.',
      avatar: { url: img('sofia-novak', 500, 500), publicId: 'seed/sofia-novak' },
      skills: ['UX Research', 'Prototyping', 'Design Systems'],
      technologies: [techBySlug('figma')],
      experienceYears: 6,
      socialLinks: { dribbble: 'https://dribbble.com/sofianovak', linkedin: 'https://linkedin.com/in/sofianovak' },
      department: 'design',
      isFeatured: true,
      order: 5,
    },
    {
      name: 'Amir Hassan',
      slug: 'amir-hassan',
      designation: 'DevOps & Infrastructure Lead',
      bio: 'Amir keeps every client\u2019s infrastructure boring — in the best way. Zero-downtime deploys, real monitoring, and incident response that actually works at 3am.',
      avatar: { url: img('amir-hassan', 500, 500), publicId: 'seed/amir-hassan' },
      skills: ['AWS', 'Kubernetes', 'CI/CD', 'Observability'],
      technologies: [techBySlug('aws'), techBySlug('docker'), techBySlug('kubernetes')],
      experienceYears: 11,
      socialLinks: { github: 'https://github.com/amirhassan', linkedin: 'https://linkedin.com/in/amirhassan' },
      department: 'engineering',
      isFeatured: false,
      order: 6,
    },
    {
      name: 'Emily Zhang',
      slug: 'emily-zhang',
      designation: 'Mobile Engineer',
      bio: 'Emily has shipped a dozen apps across iOS and Android, with a focus on offline-first architecture and buttery-smooth native interactions.',
      avatar: { url: img('emily-zhang', 500, 500), publicId: 'seed/emily-zhang' },
      skills: ['React Native', 'Swift', 'Flutter'],
      technologies: [techBySlug('react-native'), techBySlug('swift'), techBySlug('flutter')],
      experienceYears: 5,
      socialLinks: { github: 'https://github.com/emilyzhang' },
      department: 'engineering',
      isFeatured: false,
      order: 7,
    },
  ]);

  const devBySlug = (slug) => developers.find((d) => d.slug === slug)._id;

  // ---------------------------------------------------------------
  // Clients
  // ---------------------------------------------------------------
  const clients = await Client.insertMany([
    { name: 'Northwind Logistics', logo: { url: img('northwind-logo', 300, 120), publicId: 'seed/northwind' }, industry: 'Logistics', website: 'https://northwindlogistics.example.com', order: 1 },
    { name: 'Solace Health', logo: { url: img('solace-logo', 300, 120), publicId: 'seed/solace' }, industry: 'Healthcare', website: 'https://solacehealth.example.com', order: 2 },
    { name: 'Fintra Bank', logo: { url: img('fintra-logo', 300, 120), publicId: 'seed/fintra' }, industry: 'Fintech', website: 'https://fintra.example.com', order: 3 },
    { name: 'Wandermap Travel', logo: { url: img('wandermap-logo', 300, 120), publicId: 'seed/wandermap' }, industry: 'Travel', website: 'https://wandermap.example.com', order: 4 },
    { name: 'Bellweather Retail', logo: { url: img('bellweather-logo', 300, 120), publicId: 'seed/bellweather' }, industry: 'Retail', website: 'https://bellweather.example.com', order: 5 },
    { name: 'Orbit Robotics', logo: { url: img('orbit-logo', 300, 120), publicId: 'seed/orbit' }, industry: 'Robotics', website: 'https://orbitrobotics.example.com', order: 6 },
    { name: 'Crestline Capital', logo: { url: img('crestline-logo', 300, 120), publicId: 'seed/crestline' }, industry: 'Finance', website: 'https://crestlinecapital.example.com', order: 7 },
    { name: 'Fernwood Studios', logo: { url: img('fernwood-logo', 300, 120), publicId: 'seed/fernwood' }, industry: 'Media', website: 'https://fernwoodstudios.example.com', order: 8 },
  ]);

  const clientByName = (name) => clients.find((c) => c.name === name)._id;

  // ---------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------
  const projects = await Project.insertMany([
    {
      title: 'Real-Time Fleet Operations Platform',
      slug: 'northwind-fleet-operations-platform',
      shortDescription: 'A live dispatch and tracking system managing 4,000+ vehicles across 12 regional hubs.',
      description: 'Northwind Logistics was coordinating their fleet through a patchwork of spreadsheets and radio dispatch. We built a unified operations platform with live GPS tracking, automated route optimization, and a dispatcher console that cut manual coordination time dramatically.',
      thumbnail: { url: img('northwind-project', 1200, 800), publicId: 'seed/northwind-project' },
      gallery: [
        { url: img('northwind-1', 1200, 800), publicId: 'seed/northwind-1', caption: 'Live dispatch console' },
        { url: img('northwind-2', 1200, 800), publicId: 'seed/northwind-2', caption: 'Route optimization view' },
      ],
      category: catBySlug(projectCategories, 'saas-platforms')._id,
      technologies: [techBySlug('react'), techBySlug('nodejs'), techBySlug('mongodb'), techBySlug('aws')],
      client: clientByName('Northwind Logistics'),
      developers: [devBySlug('jordan-ellis'), devBySlug('priya-raman'), devBySlug('amir-hassan')],
      liveUrl: 'https://northwindlogistics.example.com',
      features: ['Live GPS fleet tracking', 'Automated route optimization', 'Dispatcher command console', 'Driver mobile companion app'],
      challenges: 'Existing dispatch relied on radio and spreadsheets, causing delayed pickups and no historical visibility into fleet performance.',
      solutions: 'We built a real-time event pipeline using WebSockets and a MongoDB geospatial index to power sub-second location updates across thousands of concurrent vehicles.',
      results: [
        { metric: 'Dispatch response time', value: '-58%' },
        { metric: 'Fuel cost from route inefficiency', value: '-23%' },
        { metric: 'On-time delivery rate', value: '+31%' },
      ],
      durationWeeks: 16,
      teamSize: 5,
      completedAt: new Date('2025-03-01'),
      isFeatured: true,
      status: 'published',
      order: 1,
      seo: { title: 'Northwind Fleet Operations Platform — Case Study', description: 'How Abacus Digital Agency built a real-time fleet operations platform for Northwind Logistics.' },
    },
    {
      title: 'Patient Intake & Telehealth Portal',
      slug: 'solace-health-telehealth-portal',
      shortDescription: 'A HIPAA-conscious telehealth portal that reduced average patient intake time from 22 to 6 minutes.',
      description: 'Solace Health needed a patient-facing portal for intake, scheduling, and video consultations that felt calm and trustworthy — not like clinical software. We designed and built a portal with a strong focus on accessibility, clarity, and data security.',
      thumbnail: { url: img('solace-project', 1200, 800), publicId: 'seed/solace-project' },
      gallery: [
        { url: img('solace-1', 1200, 800), publicId: 'seed/solace-1', caption: 'Patient intake flow' },
        { url: img('solace-2', 1200, 800), publicId: 'seed/solace-2', caption: 'Telehealth consultation room' },
      ],
      category: catBySlug(projectCategories, 'web-applications')._id,
      technologies: [techBySlug('nextjs'), techBySlug('typescript'), techBySlug('postgresql'), techBySlug('nodejs')],
      client: clientByName('Solace Health'),
      developers: [devBySlug('maya-chen'), devBySlug('sofia-novak'), devBySlug('lucas-ferreira')],
      liveUrl: 'https://solacehealth.example.com',
      features: ['Guided patient intake flow', 'HD video consultations', 'Secure document upload', 'Appointment scheduling & reminders'],
      challenges: 'Prior intake forms had a 34% abandonment rate and no accessibility support, excluding a meaningful share of patients.',
      solutions: 'We redesigned intake as a single-question-per-screen flow with autosave, added full keyboard/screen-reader support, and built the video layer on a low-latency WebRTC infrastructure.',
      results: [
        { metric: 'Intake completion time', value: '-73%' },
        { metric: 'Form abandonment rate', value: '-81%' },
        { metric: 'Patient satisfaction score', value: '+42%' },
      ],
      durationWeeks: 14,
      teamSize: 4,
      completedAt: new Date('2025-06-15'),
      isFeatured: true,
      status: 'published',
      order: 2,
      seo: { title: 'Solace Health Telehealth Portal — Case Study', description: 'Designing a trustworthy, accessible telehealth intake experience.' },
    },
    {
      title: 'Digital Banking Mobile App',
      slug: 'fintra-digital-banking-app',
      shortDescription: 'A mobile-first banking experience with biometric security and real-time spend insights.',
      description: 'Fintra Bank wanted to compete with neobanks without abandoning the trust of a chartered institution. We built a native-feeling mobile app with instant balance updates, spend categorization, and a security model that passed a third-party penetration audit on the first attempt.',
      thumbnail: { url: img('fintra-project', 1200, 800), publicId: 'seed/fintra-project' },
      gallery: [{ url: img('fintra-1', 1200, 800), publicId: 'seed/fintra-1', caption: 'Account dashboard' }],
      category: catBySlug(projectCategories, 'mobile-apps')._id,
      technologies: [techBySlug('react-native'), techBySlug('typescript'), techBySlug('nodejs'), techBySlug('postgresql')],
      client: clientByName('Fintra Bank'),
      developers: [devBySlug('emily-zhang'), devBySlug('priya-raman')],
      liveUrl: 'https://fintra.example.com',
      features: ['Biometric login', 'Real-time spend categorization', 'Instant P2P transfers', 'Card freeze/unfreeze controls'],
      challenges: 'Fintra\u2019s legacy app had a 2.1-star rating driven by slow load times and a confusing transfer flow.',
      solutions: 'We rebuilt the app on React Native with an offline-first cache layer, cutting perceived load time to near-instant, and simplified transfers into a 3-tap flow.',
      results: [
        { metric: 'App Store rating', value: '2.1 \u2192 4.7' },
        { metric: 'Transfer completion rate', value: '+38%' },
        { metric: 'Monthly active users', value: '+64%' },
      ],
      durationWeeks: 20,
      teamSize: 4,
      completedAt: new Date('2025-01-20'),
      isFeatured: true,
      status: 'published',
      order: 3,
      seo: { title: 'Fintra Digital Banking App — Case Study', description: 'Rebuilding a chartered bank\u2019s mobile experience from the ground up.' },
    },
    {
      title: 'AI-Powered Trip Planning Platform',
      slug: 'wandermap-ai-trip-planning',
      shortDescription: 'An AI itinerary generator that turns a one-line travel prompt into a full, bookable trip plan.',
      description: 'Wandermap wanted to differentiate from generic booking sites with genuinely useful AI trip planning. We built a platform combining an LLM-powered itinerary engine with real-time pricing data from flight and hotel partners.',
      thumbnail: { url: img('wandermap-project', 1200, 800), publicId: 'seed/wandermap-project' },
      gallery: [{ url: img('wandermap-1', 1200, 800), publicId: 'seed/wandermap-1', caption: 'AI itinerary builder' }],
      category: catBySlug(projectCategories, 'ai-automation')._id,
      technologies: [techBySlug('nextjs'), techBySlug('python'), techBySlug('django'), techBySlug('redis')],
      client: clientByName('Wandermap Travel'),
      developers: [devBySlug('jordan-ellis'), devBySlug('lucas-ferreira')],
      liveUrl: 'https://wandermap.example.com',
      features: ['Natural-language trip prompts', 'AI-generated day-by-day itineraries', 'Live pricing integration', 'One-click itinerary editing'],
      challenges: 'Manually building itineraries took Wandermap\u2019s concierge team 45+ minutes per customer, limiting how many travelers they could serve.',
      solutions: 'We built a retrieval-augmented itinerary engine that grounds generated plans in real destination and pricing data, cutting hallucinated recommendations to near zero.',
      results: [
        { metric: 'Itinerary generation time', value: '45 min \u2192 12 sec' },
        { metric: 'Booking conversion rate', value: '+27%' },
        { metric: 'Customer support tickets', value: '-35%' },
      ],
      durationWeeks: 18,
      teamSize: 3,
      completedAt: new Date('2025-08-10'),
      isFeatured: true,
      status: 'published',
      order: 4,
      seo: { title: 'Wandermap AI Trip Planning — Case Study', description: 'Building an AI itinerary engine grounded in real travel data.' },
    },
    {
      title: 'Headless E-Commerce Storefront',
      slug: 'bellweather-headless-storefront',
      shortDescription: 'A sub-second-loading storefront that lifted conversion rate by 19% across 40,000 SKUs.',
      description: 'Bellweather Retail\u2019s monolithic storefront couldn\u2019t keep pace with their catalog growth. We migrated them to a headless architecture with an edge-rendered storefront, cutting median page load time from 4.1s to 0.9s.',
      thumbnail: { url: img('bellweather-project', 1200, 800), publicId: 'seed/bellweather-project' },
      gallery: [{ url: img('bellweather-1', 1200, 800), publicId: 'seed/bellweather-1', caption: 'Product listing page' }],
      category: catBySlug(projectCategories, 'e-commerce')._id,
      technologies: [techBySlug('nextjs'), techBySlug('graphql'), techBySlug('redis'), techBySlug('aws')],
      client: clientByName('Bellweather Retail'),
      developers: [devBySlug('lucas-ferreira'), devBySlug('amir-hassan')],
      liveUrl: 'https://bellweather.example.com',
      features: ['Edge-rendered product pages', 'Real-time inventory sync', 'Personalized recommendations', 'One-page checkout'],
      challenges: 'A monolithic legacy platform meant every catalog update required a full site redeploy, and page speed scores had fallen to the bottom quartile industry-wide.',
      solutions: 'We decoupled the storefront from the commerce backend via GraphQL, added an edge caching layer, and rebuilt checkout as a single streamlined page.',
      results: [
        { metric: 'Median page load time', value: '4.1s \u2192 0.9s' },
        { metric: 'Conversion rate', value: '+19%' },
        { metric: 'Cart abandonment', value: '-24%' },
      ],
      durationWeeks: 22,
      teamSize: 5,
      completedAt: new Date('2024-11-05'),
      isFeatured: false,
      status: 'published',
      order: 5,
      seo: { title: 'Bellweather Headless Storefront — Case Study', description: 'Migrating a 40,000-SKU catalog to a headless, edge-rendered storefront.' },
    },
    {
      title: 'Brand Identity & Marketing Platform',
      slug: 'orbit-robotics-brand-platform',
      shortDescription: 'A full brand identity and marketing site launch for a robotics startup emerging from stealth.',
      description: 'Orbit Robotics needed to make a strong first impression the day they left stealth mode. We led brand strategy, visual identity, and a marketing site built to convert enterprise buyers.',
      thumbnail: { url: img('orbit-project', 1200, 800), publicId: 'seed/orbit-project' },
      gallery: [{ url: img('orbit-1', 1200, 800), publicId: 'seed/orbit-1', caption: 'Brand identity system' }],
      category: catBySlug(projectCategories, 'brand-identity')._id,
      technologies: [techBySlug('nextjs'), techBySlug('tailwindcss'), techBySlug('figma')],
      client: clientByName('Orbit Robotics'),
      developers: [devBySlug('maya-chen'), devBySlug('sofia-novak')],
      liveUrl: 'https://orbitrobotics.example.com',
      features: ['Full visual identity system', 'Motion-driven marketing site', 'Investor deck template', 'Design system documentation'],
      challenges: 'Orbit had strong technology but no cohesive brand voice or visual identity ahead of a high-stakes public launch.',
      solutions: 'We ran a compressed 3-week brand sprint culminating in a full identity system, then built the launch site to ship the same week as their funding announcement.',
      results: [
        { metric: 'Launch week site traffic', value: '48,000 visitors' },
        { metric: 'Press mentions', value: '14 outlets' },
        { metric: 'Investor inquiries post-launch', value: '+9' },
      ],
      durationWeeks: 8,
      teamSize: 3,
      completedAt: new Date('2025-05-22'),
      isFeatured: false,
      status: 'published',
      order: 6,
      seo: { title: 'Orbit Robotics Brand & Launch Platform — Case Study', description: 'Brand identity and launch site for a robotics startup emerging from stealth.' },
    },
  ]);

  const projectBySlug = (slug) => projects.find((p) => p.slug === slug)._id;

  // ---------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------
  await Service.insertMany([
    {
      title: 'Product Design',
      slug: 'product-design',
      icon: 'FiPenTool',
      shortDescription: 'Research-driven UX and interface design that turns complex problems into intuitive products.',
      description: 'We embed with your team to understand real user problems, then design interfaces that are as functional as they are beautiful. Every engagement includes research, wireframing, high-fidelity design, and a reusable design system.',
      coverImage: { url: img('service-design', 1200, 800) },
      features: ['User research & discovery', 'Information architecture', 'High-fidelity UI design', 'Design systems & component libraries', 'Usability testing'],
      process: [
        { step: 1, title: 'Discover', description: 'Stakeholder interviews, user research, and competitive analysis to ground every decision in evidence.' },
        { step: 2, title: 'Define', description: 'Information architecture and user flows that map the shortest path to value.' },
        { step: 3, title: 'Design', description: 'High-fidelity UI design with a reusable component system built alongside it.' },
        { step: 4, title: 'Validate', description: 'Usability testing with real users before a single line of production code is written.' },
      ],
      technologies: [techBySlug('figma')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Web Application Development',
      slug: 'web-application-development',
      icon: 'FiCode',
      shortDescription: 'Full-stack web applications engineered for performance, security, and long-term maintainability.',
      description: 'From MVP to enterprise platform, we build web applications on modern, battle-tested stacks — with the architecture decisions, test coverage, and documentation your team can actually build on afterward.',
      coverImage: { url: img('service-webapp', 1200, 800) },
      features: ['Custom full-stack development', 'API design & architecture', 'Performance optimization', 'CI/CD pipeline setup', 'Post-launch support'],
      process: [
        { step: 1, title: 'Architect', description: 'System design covering data modeling, API contracts, and infrastructure before any code is written.' },
        { step: 2, title: 'Build', description: 'Iterative development in weekly sprints with continuous deployment to a staging environment.' },
        { step: 3, title: 'Harden', description: 'Load testing, security review, and accessibility audit before launch.' },
        { step: 4, title: 'Launch & Support', description: 'Production rollout with monitoring in place, plus a support window to catch anything real users surface.' },
      ],
      technologies: [techBySlug('react'), techBySlug('nodejs'), techBySlug('mongodb')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      icon: 'FiSmartphone',
      shortDescription: 'Native-feeling iOS and Android apps built with React Native, Flutter, or fully native stacks.',
      description: 'We build mobile apps that feel instant and native, backed by robust offline handling, push notifications, and a release process that gets through App Store and Play Store review the first time.',
      coverImage: { url: img('service-mobile', 1200, 800) },
      features: ['Cross-platform & native development', 'Offline-first architecture', 'Push notifications', 'App Store & Play Store launch support'],
      process: [
        { step: 1, title: 'Scope', description: 'Define the platform strategy — cross-platform vs. native — based on your performance and timeline needs.' },
        { step: 2, title: 'Prototype', description: 'A clickable prototype to validate core flows before full development begins.' },
        { step: 3, title: 'Build', description: 'Sprint-based development with TestFlight/internal testing builds from week one.' },
        { step: 4, title: 'Ship', description: 'Store submission, review handling, and a monitored launch window.' },
      ],
      technologies: [techBySlug('react-native'), techBySlug('flutter'), techBySlug('swift')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: true,
      order: 3,
    },
    {
      title: 'E-Commerce Development',
      slug: 'ecommerce-development',
      icon: 'FiShoppingCart',
      shortDescription: 'High-converting, fast-loading storefronts built headless for scale and flexibility.',
      description: 'We build e-commerce platforms decoupled from the constraints of monolithic themes — giving you sub-second page loads, real-time inventory, and full creative control over the storefront.',
      coverImage: { url: img('service-ecommerce', 1200, 800) },
      features: ['Headless storefront architecture', 'Payment & inventory integration', 'Personalization & recommendations', 'Conversion rate optimization'],
      process: [
        { step: 1, title: 'Audit', description: 'A full audit of your current funnel to identify where revenue is being lost.' },
        { step: 2, title: 'Design', description: 'Storefront design optimized for conversion, not just aesthetics.' },
        { step: 3, title: 'Build', description: 'Headless implementation connected to your commerce backend of choice.' },
        { step: 4, title: 'Optimize', description: 'Post-launch A/B testing to keep improving conversion over time.' },
      ],
      technologies: [techBySlug('nextjs'), techBySlug('graphql')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: false,
      order: 4,
    },
    {
      title: 'Brand Identity & Design',
      slug: 'brand-identity-design',
      icon: 'FiFeather',
      shortDescription: 'Visual identity systems that give ambitious companies a voice as strong as their product.',
      description: 'We build brand systems — not just logos. Every engagement includes a full visual identity, voice and tone guidelines, and application across your key touchpoints.',
      coverImage: { url: img('service-brand', 1200, 800) },
      features: ['Brand strategy & positioning', 'Visual identity systems', 'Voice & tone guidelines', 'Marketing collateral design'],
      process: [
        { step: 1, title: 'Position', description: 'Clarify who you are, who you\u2019re for, and how you\u2019re different — before any visual work starts.' },
        { step: 2, title: 'Explore', description: 'Multiple distinct creative directions explored in parallel, not a single safe option.' },
        { step: 3, title: 'Refine', description: 'The chosen direction developed into a full, documented identity system.' },
        { step: 4, title: 'Apply', description: 'Identity applied across your real touchpoints — site, deck, product, social.' },
      ],
      technologies: [techBySlug('figma')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: false,
      order: 5,
    },
    {
      title: 'AI & Automation Engineering',
      slug: 'ai-automation-engineering',
      icon: 'FiCpu',
      shortDescription: 'Practical AI features grounded in real data — not demos that fall apart in production.',
      description: 'We integrate LLMs and automation into real products in ways that hold up under production load: retrieval-grounded generation, careful prompt engineering, and fallback handling for when the model gets it wrong.',
      coverImage: { url: img('service-ai', 1200, 800) },
      features: ['LLM integration & prompt engineering', 'Retrieval-augmented generation', 'Workflow automation', 'AI feature evaluation & monitoring'],
      process: [
        { step: 1, title: 'Identify', description: 'Find the highest-leverage place AI can remove real manual work — not just add a chatbot.' },
        { step: 2, title: 'Prototype', description: 'A fast, scrappy prototype to validate the AI feature actually solves the problem.' },
        { step: 3, title: 'Harden', description: 'Grounding, evaluation, and fallback handling so the feature is reliable in production.' },
        { step: 4, title: 'Monitor', description: 'Ongoing evaluation of output quality after launch, not just at ship time.' },
      ],
      technologies: [techBySlug('python'), techBySlug('django')],
      pricing: { model: 'custom-quote', currency: 'USD' },
      isFeatured: true,
      order: 6,
    },
  ]);

  // ---------------------------------------------------------------
  // Testimonials
  // ---------------------------------------------------------------
  await Testimonial.insertMany([
    {
      clientName: 'Daniel Osei',
      clientDesignation: 'VP of Operations',
      clientCompany: 'Northwind Logistics',
      clientAvatar: { url: img('daniel-osei', 300, 300) },
      rating: 5,
      message: 'Abacus didn\u2019t just build what we asked for — they pushed back on our original spec and delivered something that solved the actual problem. Dispatch response time dropped 58% in the first month.',
      project: projectBySlug('northwind-fleet-operations-platform'),
      isFeatured: true,
      order: 1,
    },
    {
      clientName: 'Dr. Rachel Kim',
      clientDesignation: 'Chief Medical Officer',
      clientCompany: 'Solace Health',
      clientAvatar: { url: img('rachel-kim', 300, 300) },
      rating: 5,
      message: 'They took patient trust as seriously as we do. The accessibility work alone opened our platform to patients who genuinely couldn\u2019t use it before.',
      project: projectBySlug('solace-health-telehealth-portal'),
      isFeatured: true,
      order: 2,
    },
    {
      clientName: 'Marcus Webb',
      clientDesignation: 'Head of Digital Banking',
      clientCompany: 'Fintra Bank',
      clientAvatar: { url: img('marcus-webb', 300, 300) },
      rating: 5,
      message: 'Our app rating went from 2.1 to 4.7 stars in one release. The team understood both the engineering constraints of banking software and how to make it feel effortless.',
      project: projectBySlug('fintra-digital-banking-app'),
      isFeatured: true,
      order: 3,
    },
    {
      clientName: 'Leah Fontaine',
      clientDesignation: 'Founder & CEO',
      clientCompany: 'Wandermap Travel',
      clientAvatar: { url: img('leah-fontaine', 300, 300) },
      rating: 5,
      message: 'We\u2019d seen a dozen "AI trip planner" demos that fell apart with real questions. Abacus built one that actually works, grounded in real pricing data, not hallucinated nonsense.',
      project: projectBySlug('wandermap-ai-trip-planning'),
      isFeatured: true,
      order: 4,
    },
    {
      clientName: 'Priya Shah',
      clientDesignation: 'Director of E-Commerce',
      clientCompany: 'Bellweather Retail',
      clientAvatar: { url: img('priya-shah', 300, 300) },
      rating: 5,
      message: 'Page load times went from 4 seconds to under a second. That single change moved conversion more than any marketing campaign we ran last year.',
      project: projectBySlug('bellweather-headless-storefront'),
      isFeatured: false,
      order: 5,
    },
    {
      clientName: 'Tomas Reyes',
      clientDesignation: 'Co-Founder',
      clientCompany: 'Orbit Robotics',
      clientAvatar: { url: img('tomas-reyes', 300, 300) },
      rating: 5,
      message: 'They took us from "no brand at all" to a full identity system and launch site in under two months, timed exactly to our funding announcement.',
      project: projectBySlug('orbit-robotics-brand-platform'),
      isFeatured: false,
      order: 6,
    },
  ]);

  // ---------------------------------------------------------------
  // Blogs
  // ---------------------------------------------------------------
  await Blog.insertMany([
    {
      title: 'Why We Moved Our Rendering Pipeline to React Server Components',
      slug: 'moving-to-react-server-components',
      excerpt: 'A practical look at what actually improved — and what got harder — when we adopted RSCs across three client projects.',
      content: `<p>We spent the last two quarters migrating rendering in three separate client codebases to React Server Components. Here's the honest account: what got faster, what got more complex, and where we'd still reach for a client component without hesitation.</p><h2>What actually got faster</h2><p>Time-to-first-byte dropped meaningfully across all three projects, mostly because data fetching moved server-side and stopped triggering client-side waterfalls. For content-heavy pages — blog posts, marketing pages, dashboards with static-ish data — this was a clear win.</p><h2>Where it got harder</h2><p>The mental model shift is real. Knowing what can and can't be a server component takes a few weeks to become intuitive for a team, and debugging hydration mismatches got trickier before it got easier.</p><h2>Our rule of thumb now</h2><p>Server components by default, client components at the leaf nodes that actually need interactivity — forms, anything with local state, anything using browser APIs. It's not a silver bullet, but for the right page shape, it's a genuine architectural improvement.</p>`,
      coverImage: { url: img('blog-rsc', 1200, 700), publicId: 'seed/blog-rsc' },
      author: admin._id,
      category: catBySlug(blogCategories, 'engineering')._id,
      tags: ['react', 'performance', 'architecture'],
      readTimeMinutes: 7,
      status: 'published',
      publishedAt: new Date('2025-09-12'),
      isFeatured: true,
    },
    {
      title: 'Designing for Trust: Lessons from Building a Healthcare Portal',
      slug: 'designing-for-trust-healthcare-portal',
      excerpt: 'What we learned building a patient-facing product where every design decision carries real stakes.',
      content: `<p>Designing for healthcare is different from designing for most consumer products, because the cost of confusion isn't a lost click — it's a patient who doesn't get care they need.</p><h2>Clarity over cleverness</h2><p>Every interaction pattern we'd normally consider "delightful" got re-evaluated against a simpler question: does this make the next step obvious to someone who is stressed, in pain, or unfamiliar with technology?</p><h2>Accessibility isn't optional</h2><p>We treated WCAG AA compliance as a baseline requirement, not a nice-to-have, and it changed our design process for the better across the board — better color contrast, better focus states, clearer error messaging.</p><h2>The result</h2><p>Intake completion time dropped 73%. Not because the interface got flashier, but because we removed everything that wasn't essential to the next decision a patient needed to make.</p>`,
      coverImage: { url: img('blog-healthcare', 1200, 700), publicId: 'seed/blog-healthcare' },
      author: admin._id,
      category: catBySlug(blogCategories, 'design')._id,
      tags: ['ux', 'healthcare', 'accessibility'],
      readTimeMinutes: 6,
      status: 'published',
      publishedAt: new Date('2025-08-20'),
      isFeatured: true,
    },
    {
      title: 'A Practical Guide to Scaling MongoDB for High-Traffic Applications',
      slug: 'scaling-mongodb-high-traffic',
      excerpt: 'Indexing strategy, connection pooling, and the mistakes we see most often in production MongoDB deployments.',
      content: `<p>Most MongoDB performance problems we're called in to fix aren't MongoDB's fault — they're missing indexes, connection pool misconfiguration, or query patterns that fight the document model instead of working with it.</p><h2>Start with the query, not the schema</h2><p>Design your schema around how you'll actually query the data, not around normalized relational instincts. Denormalization that looks "wrong" in a relational mindset is often exactly right in MongoDB.</p><h2>Index deliberately</h2><p>Every index speeds up reads and slows down writes. We audit index usage quarterly on every client project — unused indexes are pure write-performance tax.</p><h2>Connection pooling matters more than people think</h2><p>A misconfigured pool size is one of the most common causes of mysterious latency spikes under load. We default to sizing pools based on measured concurrent query load, not a guessed constant.</p>`,
      coverImage: { url: img('blog-mongodb', 1200, 700), publicId: 'seed/blog-mongodb' },
      author: admin._id,
      category: catBySlug(blogCategories, 'engineering')._id,
      tags: ['mongodb', 'database', 'performance'],
      readTimeMinutes: 8,
      status: 'published',
      publishedAt: new Date('2025-07-05'),
      isFeatured: false,
    },
    {
      title: 'The Hidden Cost of Design Debt (and How to Pay It Down)',
      slug: 'hidden-cost-of-design-debt',
      excerpt: 'Inconsistent components and undocumented decisions compound just like technical debt. Here\u2019s how we audit and fix it.',
      content: `<p>Design debt is quieter than technical debt — nothing crashes — but it compounds the same way. Every one-off button variant, every undocumented color choice, makes the next feature slower to ship and the product feel less coherent.</p><h2>How we audit it</h2><p>We start every design system engagement with a component inventory: screenshot every distinct pattern in the live product and group by function. The count is almost always shocking to the client — dozens of "unique" buttons that were all meant to be the same component.</p><h2>Paying it down without a full redesign</h2><p>You don't need to stop the roadmap to fix this. We embed design system work into regular feature sprints — every new feature consolidates two or three legacy patterns into the system instead of adding a new one.</p>`,
      coverImage: { url: img('blog-designdebt', 1200, 700), publicId: 'seed/blog-designdebt' },
      author: admin._id,
      category: catBySlug(blogCategories, 'design')._id,
      tags: ['design systems', 'process'],
      readTimeMinutes: 5,
      status: 'published',
      publishedAt: new Date('2025-05-30'),
      isFeatured: false,
    },
    {
      title: 'Building Accessible Interfaces Without Slowing Down Sprints',
      slug: 'accessible-interfaces-without-slowing-sprints',
      excerpt: 'Accessibility doesn\u2019t have to be a separate phase bolted on at the end. Here\u2019s how we build it into everyday sprint work.',
      content: `<p>The biggest misconception about accessibility work is that it's a separate phase — an audit that happens after the "real" design and development is done. That approach is both slower and produces worse results than building it in from the start.</p><h2>Bake it into component definitions</h2><p>Every component in our design system ships with its accessible states defined — focus, hover, disabled, error — as part of the spec, not an afterthought.</p><h2>Automate what can be automated</h2><p>Automated contrast and ARIA checks run in CI on every pull request, catching the mechanical issues so manual review time is spent on the things that actually need a human — keyboard flow, screen reader narrative sense.</p>`,
      coverImage: { url: img('blog-a11y', 1200, 700), publicId: 'seed/blog-a11y' },
      author: admin._id,
      category: catBySlug(blogCategories, 'product')._id,
      tags: ['accessibility', 'process'],
      readTimeMinutes: 6,
      status: 'published',
      publishedAt: new Date('2025-04-18'),
      isFeatured: false,
    },
    {
      title: 'How We Cut API Latency by 68% With Smart Caching',
      slug: 'cutting-api-latency-with-caching',
      excerpt: 'A case study in diagnosing and fixing a latency problem that had nothing to do with the database.',
      content: `<p>A client came to us convinced their database was the bottleneck. It wasn't. Here's how we actually found and fixed a 68% latency reduction.</p><h2>Profile before you optimize</h2><p>We instrumented every layer of the request path before changing anything. The real bottleneck turned out to be redundant, uncached calls to a third-party enrichment API on nearly every request.</p><h2>The fix</h2><p>A Redis caching layer with sensible TTLs on the enrichment calls, plus request coalescing for concurrent identical lookups, cut median latency from 640ms to 205ms without touching the database at all.</p><h2>The lesson</h2><p>Always profile the full request path before assuming you know where the time is going. Intuition about performance is wrong more often than engineers like to admit.</p>`,
      coverImage: { url: img('blog-caching', 1200, 700), publicId: 'seed/blog-caching' },
      author: admin._id,
      category: catBySlug(blogCategories, 'engineering')._id,
      tags: ['performance', 'caching', 'redis'],
      readTimeMinutes: 6,
      status: 'published',
      publishedAt: new Date('2025-03-02'),
      isFeatured: true,
    },
  ]);

  // ---------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------
  await FAQ.insertMany([
    { question: 'What industries do you typically work with?', answer: 'We work most often with healthcare, fintech, logistics, retail/e-commerce, and B2B SaaS companies — but our process is built around understanding your specific users and constraints, not applying a template.', category: 'general', order: 1 },
    { question: 'How is pricing structured?', answer: 'Most engagements are scoped as fixed-price phases tied to clear deliverables, though we offer hourly/retainer arrangements for ongoing product teams. We\u2019ll always give you a detailed quote before any work begins.', category: 'pricing', order: 2 },
    { question: 'How long does a typical project take?', answer: 'A focused MVP typically takes 8-14 weeks. Larger platform builds run 16-24 weeks. We\u2019ll give you a realistic timeline estimate during our discovery call, based on real scope, not a sales pitch.', category: 'process', order: 3 },
    { question: 'Do you offer post-launch support?', answer: 'Yes. Every project includes a post-launch support window, and most clients transition into an ongoing retainer for continued feature development and maintenance.', category: 'process', order: 4 },
    { question: 'What does your development process look like?', answer: 'Discovery and architecture, then sprint-based iterative development with a staging environment you can review continuously, followed by hardening (testing, security, accessibility) before launch.', category: 'process', order: 5 },
    { question: 'Can you work with our existing team?', answer: 'Yes — many engagements are hybrid, where we embed with an in-house team rather than working in isolation. We adapt to your existing tools and workflows rather than imposing our own.', category: 'general', order: 6 },
    { question: 'What technologies do you specialize in?', answer: 'Primarily React/Next.js and Node.js on the web, React Native and native Swift/Kotlin for mobile, with MongoDB and PostgreSQL for data. We choose the stack based on the problem, not our own preferences.', category: 'technical', order: 7 },
    { question: 'How do you handle data security and compliance?', answer: 'We follow OWASP best practices as a baseline on every project, and have direct experience with HIPAA-conscious healthcare systems and PCI-adjacent fintech applications.', category: 'technical', order: 8 },
  ]);

  // ---------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------
  await Statistic.insertMany([
    { label: 'Projects Delivered', value: 180, suffix: '+', icon: 'FiCheckCircle', order: 1 },
    { label: 'Client Retention Rate', value: 94, suffix: '%', icon: 'FiHeart', order: 2 },
    { label: 'Avg. Team Experience', value: 8, suffix: '+ yrs', icon: 'FiAward', order: 3 },
    { label: 'Countries Served', value: 22, suffix: '+', icon: 'FiGlobe', order: 4 },
  ]);

  // ---------------------------------------------------------------
  // Job Posts
  // ---------------------------------------------------------------
  await JobPost.insertMany([
    {
      title: 'Senior Frontend Engineer',
      slug: 'senior-frontend-engineer',
      department: 'Engineering',
      type: 'full-time',
      location: 'Remote (Global)',
      experienceLevel: 'senior',
      description: 'We\u2019re looking for a senior frontend engineer who cares as much about animation timing and layout shift as they do about code architecture. You\u2019ll work directly with designers and clients on high-visibility production builds.',
      responsibilities: ['Lead frontend architecture on 1-2 concurrent client engagements', 'Collaborate directly with design on interaction and motion details', 'Mentor mid-level engineers on the team', 'Contribute to our internal component library'],
      requirements: ['5+ years building production React applications', 'Strong CSS and animation fundamentals (Framer Motion, GSAP)', 'Experience with TypeScript in a team setting', 'Comfortable working directly with clients'],
      niceToHave: ['Experience with Next.js App Router', 'WebGL or Three.js experience', 'Prior agency or consultancy experience'],
      salaryRange: { min: 120000, max: 160000, currency: 'USD', isPublic: true },
      postedBy: admin._id,
      isActive: true,
    },
    {
      title: 'Product Designer',
      slug: 'product-designer',
      department: 'Design',
      type: 'full-time',
      location: 'Remote (Global)',
      experienceLevel: 'mid',
      description: 'Join our design team to work across the full arc of a project — research, flows, high-fidelity UI, and design systems — for clients ranging from healthcare startups to fintech platforms.',
      responsibilities: ['Own end-to-end design on client engagements', 'Run lightweight user research and usability testing', 'Build and maintain design systems', 'Present work directly to client stakeholders'],
      requirements: ['3+ years of product design experience', 'Strong portfolio showing process, not just polished outcomes', 'Fluency in Figma', 'Comfortable presenting and defending design decisions'],
      niceToHave: ['Motion/prototyping skills', 'Experience in a regulated industry (healthcare, fintech)'],
      salaryRange: { min: 95000, max: 130000, currency: 'USD', isPublic: true },
      postedBy: admin._id,
      isActive: true,
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      department: 'Engineering',
      type: 'full-time',
      location: 'Remote (US/EU time zones)',
      experienceLevel: 'senior',
      description: 'Help us keep every client\u2019s infrastructure fast, secure, and boring. You\u2019ll design CI/CD pipelines, manage cloud infrastructure, and set up monitoring that catches problems before clients do.',
      responsibilities: ['Design and maintain CI/CD pipelines across client projects', 'Manage AWS/GCP infrastructure as code', 'Set up monitoring, alerting, and incident response processes', 'Support engineers with deployment and infrastructure questions'],
      requirements: ['4+ years in a DevOps/infrastructure role', 'Strong experience with Docker and Kubernetes', 'Infrastructure-as-code experience (Terraform or similar)', 'On-call rotation availability'],
      niceToHave: ['Experience with multi-tenant SaaS infrastructure', 'Security certification (e.g. AWS Security Specialty)'],
      salaryRange: { min: 110000, max: 145000, currency: 'USD', isPublic: true },
      postedBy: admin._id,
      isActive: true,
    },
    {
      title: 'Backend Engineer (Node.js)',
      slug: 'backend-engineer-nodejs',
      department: 'Engineering',
      type: 'full-time',
      location: 'Remote (Global)',
      experienceLevel: 'mid',
      description: 'Build APIs and data architectures that hold up under real production load, across a variety of industries and technical constraints.',
      responsibilities: ['Design and build REST/GraphQL APIs', 'Own data modeling decisions with MongoDB and PostgreSQL', 'Write tests that give the team real confidence to ship', 'Participate in architecture reviews across client projects'],
      requirements: ['3+ years building production Node.js APIs', 'Strong understanding of database design (SQL and document-based)', 'Experience with authentication/authorization patterns', 'Comfortable writing tests, not just features'],
      niceToHave: ['Experience with NestJS', 'Exposure to event-driven architectures'],
      salaryRange: { min: 100000, max: 135000, currency: 'USD', isPublic: true },
      postedBy: admin._id,
      isActive: true,
    },
  ]);

  // ---------------------------------------------------------------
  // Site Settings — full marketing content
  // ---------------------------------------------------------------
  await SiteSettings.findOneAndUpdate(
    {},
    {
      siteName: 'Abacus Digital Agency',
      tagline: 'We engineer digital experiences that convert.',
      contactEmail: 'hello@abacusdigital.agency',
      contactPhone: '+1 (415) 555-0198',
      address: 'San Francisco, CA \u2014 Remote-first, global team',
      socialLinks: {
        twitter: 'https://twitter.com/abacusdigital',
        linkedin: 'https://linkedin.com/company/abacusdigital',
        github: 'https://github.com/abacusdigital',
        instagram: 'https://instagram.com/abacusdigital',
        dribbble: 'https://dribbble.com/abacusdigital',
      },
      seoDefaults: {
        title: 'Abacus Digital Agency \u2014 Product Design & Engineering Studio',
        description: 'Abacus Digital Agency designs and builds high-performance web platforms, brands, and products for ambitious companies worldwide.',
        keywords: ['digital agency', 'web development agency', 'product design studio', 'react development agency'],
      },
      footerText: `\u00a9 ${new Date().getFullYear()} Abacus Digital Agency. Crafted with precision.`,
      heroContent: {
        badge: 'Available for new projects — Q1 2026',
        title: 'We design and build products people',
        highlight: 'actually love',
        subtitle: 'Abacus Digital Agency is a product design and engineering studio for ambitious companies — from first sketch to production deployment, one accountable team.',
        primaryCtaLabel: 'Start a Project',
        primaryCtaLink: '/contact',
        secondaryCtaLabel: 'View Our Work',
        secondaryCtaLink: '/portfolio',
      },
      aboutContent: {
        story: 'Abacus Digital Agency started in 2018 with a simple frustration: too many agencies treated design and engineering as separate disciplines handed off in sequence, and too many product teams shipped software that looked good in a pitch deck and fell apart in production. We built Abacus to close that gap \u2014 a single team of designers and engineers who own a product from first sketch through production deployment, with no handoff where quality gets lost. Today we\u2019re a team of specialists working with startups and established companies across healthcare, fintech, logistics, and retail, still holding to the same rule we started with: nothing ships that we wouldn\u2019t be proud to put our name on.',
        mission: 'To build digital products that are as reliable in production as they are impressive in a demo \u2014 combining design craft and engineering rigor in a single accountable team.',
        vision: 'A future where the best digital experiences aren\u2019t reserved for companies with in-house teams of hundreds \u2014 where any ambitious team can access agency-quality craft without sacrificing product-team-quality process.',
      },
      values: [
        { icon: 'FiTarget', title: 'Innovation', description: 'We stay ahead of the tooling curve so our clients don\u2019t have to \u2014 evaluating new frameworks and techniques constantly, but only shipping what actually holds up in production.' },
        { icon: 'FiCheckCircle', title: 'Quality', description: 'Every engagement includes code review, testing, and accessibility checks as standard practice, not optional extras cut when the timeline gets tight.' },
        { icon: 'FiShield', title: 'Security', description: 'We treat security as a design constraint from day one \u2014 not an audit bolted on before launch \u2014 following OWASP best practices on every project by default.' },
        { icon: 'FiUsers', title: 'Partnership', description: 'We work as an extension of your team, not a black box vendor \u2014 with direct access to the people actually building your product, always.' },
      ],
      whyChooseUs: [
        { icon: 'FiLayers', title: 'Full-Stack Ownership', description: 'One accountable team across design and engineering \u2014 no handoffs where quality gets lost in translation.' },
        { icon: 'FiZap', title: 'Built for Production', description: 'We ship code with test coverage, monitoring, and documentation your team can maintain long after we\u2019re gone.' },
        { icon: 'FiTrendingUp', title: 'Outcome-Focused', description: 'Every engagement starts with the business metric we\u2019re trying to move \u2014 not just a features list to check off.' },
        { icon: 'FiClock', title: 'Realistic Timelines', description: 'We quote timelines we can actually hit, based on real scoping \u2014 not sales estimates that create delivery pressure later.' },
      ],
      processSteps: [
        { step: 1, icon: 'FiSearch', title: 'Discover', description: 'Stakeholder interviews and technical audits to understand the real problem before proposing a solution.' },
        { step: 2, icon: 'FiPenTool', title: 'Design', description: 'Research-driven UX and interface design, validated with real users before development begins.' },
        { step: 3, icon: 'FiCode', title: 'Build', description: 'Sprint-based development with a continuously deployed staging environment you can review at any time.' },
        { step: 4, icon: 'FiShield', title: 'Harden', description: 'Testing, security review, and accessibility audit before anything reaches production.' },
        { step: 5, icon: 'FiRocket', title: 'Launch & Support', description: 'Monitored production rollout, followed by a support window to handle what real usage surfaces.' },
      ],
      industries: [
        { icon: 'FiActivity', name: 'Healthcare', description: 'Patient-facing portals and clinical tools built with accessibility and trust as first-class requirements.' },
        { icon: 'FiDollarSign', name: 'Fintech', description: 'Banking and payments products engineered for security, compliance, and real-time reliability.' },
        { icon: 'FiTruck', name: 'Logistics', description: 'Operations platforms and real-time tracking systems for complex, distributed fleets.' },
        { icon: 'FiShoppingBag', name: 'Retail & E-Commerce', description: 'High-conversion storefronts built to scale with growing catalogs and traffic.' },
        { icon: 'FiCpu', name: 'B2B SaaS', description: 'Product platforms designed to onboard users fast and scale with enterprise demands.' },
        { icon: 'FiMap', name: 'Travel & Hospitality', description: 'Booking and itinerary platforms that turn complex logistics into simple decisions.' },
      ],
      pricingPlans: [
        {
          name: 'Launch',
          description: 'For startups validating a new product idea with a focused MVP.',
          price: 15000,
          billingNote: 'starting at',
          features: ['Discovery & UX design', 'Core feature development', 'Staging environment access', '4-week support window'],
          isPopular: false,
          ctaLabel: 'Start a Project',
          order: 1,
        },
        {
          name: 'Scale',
          description: 'For growing companies building a full production platform.',
          price: 45000,
          billingNote: 'starting at',
          features: ['Full product design system', 'Full-stack development', 'CI/CD & infrastructure setup', 'Security & accessibility audit', '8-week support window'],
          isPopular: true,
          ctaLabel: 'Start a Project',
          order: 2,
        },
        {
          name: 'Partner',
          description: 'For established teams needing an ongoing embedded product partner.',
          price: null,
          billingNote: 'custom quote',
          features: ['Dedicated embedded team', 'Continuous feature development', 'Priority support & SLAs', 'Quarterly architecture reviews'],
          isPopular: false,
          ctaLabel: 'Talk to Us',
          order: 3,
        },
      ],
      awards: [
        { title: 'Best Digital Agency \u2014 West Coast', organization: 'Digital Design Awards', year: 2025, icon: 'FiAward' },
        { title: 'Awwwards Site of the Day', organization: 'Awwwards', year: 2024, icon: 'FiStar' },
        { title: 'Top B2B SaaS Design Partner', organization: 'Clutch', year: 2024, icon: 'FiTrendingUp' },
        { title: 'Excellence in Healthcare UX', organization: 'UX Design Awards', year: 2023, icon: 'FiHeart' },
      ],
      timeline: [
        { year: '2018', title: 'Founded', description: 'Abacus Digital Agency founded in San Francisco with a team of four.' },
        { year: '2020', title: 'Remote-First', description: 'Transitioned to a fully remote, globally distributed team of specialists.' },
        { year: '2022', title: '100th Project', description: 'Delivered our 100th client project, spanning healthcare, fintech, and retail.' },
        { year: '2024', title: 'Awwwards Recognition', description: 'Recognized with Site of the Day for a client e-commerce launch.' },
        { year: '2025', title: '180+ Projects', description: 'Crossed 180 delivered projects with a 94% client retention rate.' },
      ],
      openSource: {
        title: 'Open Source',
        description: 'We contribute tooling back to the ecosystem we build on every day.',
        repositories: [
          { name: 'lenis-react-hooks', description: 'Lightweight React hooks for Lenis smooth scroll integration.', url: 'https://github.com/abacusdigital/lenis-react-hooks', stars: 340, language: 'TypeScript' },
          { name: 'motion-primitives', description: 'A library of accessible, reusable Framer Motion animation primitives.', url: 'https://github.com/abacusdigital/motion-primitives', stars: 512, language: 'TypeScript' },
          { name: 'zod-form-kit', description: 'Utilities for pairing React Hook Form with Zod schemas at scale.', url: 'https://github.com/abacusdigital/zod-form-kit', stars: 189, language: 'TypeScript' },
        ],
      },
      community: {
        title: 'Community',
        description: 'We host a monthly build-in-public session and write regularly about what we learn on real client work.',
        links: [
          { label: 'Engineering Blog', url: '/blog', icon: 'FiBookOpen' },
          { label: 'Discord Community', url: 'https://discord.gg/abacusdigital', icon: 'FiMessageCircle' },
          { label: 'GitHub', url: 'https://github.com/abacusdigital', icon: 'FiGithub' },
        ],
      },
      partners: [
        { name: 'Vercel', logo: { url: img('partner-vercel', 240, 100) }, url: 'https://vercel.com' },
        { name: 'MongoDB', logo: { url: img('partner-mongodb', 240, 100) }, url: 'https://mongodb.com' },
        { name: 'AWS Partner Network', logo: { url: img('partner-aws', 240, 100) }, url: 'https://aws.amazon.com' },
        { name: 'Stripe', logo: { url: img('partner-stripe', 240, 100) }, url: 'https://stripe.com' },
        { name: 'Cloudinary', logo: { url: img('partner-cloudinary', 240, 100) }, url: 'https://cloudinary.com' },
        { name: 'Figma', logo: { url: img('partner-figma', 240, 100) }, url: 'https://figma.com' },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  logger.info('All CMS content seeded successfully.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  logger.error(`Seeding failed: ${error.message}\n${error.stack}`);
  process.exit(1);
});
