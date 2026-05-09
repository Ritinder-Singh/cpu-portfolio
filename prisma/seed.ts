import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Site Config
  const configEntries = [
    { key: 'name', value: 'Ritinder Singh' },
    { key: 'tagline', value: 'Backend Dev · Flutter · Python' },
    { key: 'bio', value: 'A backend developer with a passion for building scalable APIs and cross-platform mobile applications. I work primarily with Python (FastAPI, Flask) and Flutter, and I love clean architecture and developer tooling.' },
    { key: 'email', value: 'for.ritindersingh@gmail.com' },
    { key: 'github', value: 'https://github.com/ritinder' },
    { key: 'linkedin', value: 'https://linkedin.com/in/ritinder-singh' },
    { key: 'twitter', value: 'https://twitter.com/ritinder' },
    { key: 'resumeUrl', value: '/resume.pdf' },
    { key: 'location', value: 'India' },
    { key: 'availableForWork', value: 'true' },
    { key: 'avatar', value: 'RS' },
    { key: 'aboutStats', value: JSON.stringify({ projects: '4+', experience: '3+ yrs', stars: '100+' }) },
    {
      key: 'testimonials',
      value: JSON.stringify([
        { quote: 'Ritinder delivered a rock-solid FastAPI backend for our MVP. Clean code, great communication, shipped on time.', author: 'Arjun M.', role: 'Startup Founder' },
        { quote: 'The Flutter app he built for us is buttery smooth. Users love it. Would hire again without hesitation.', author: 'Priya K.', role: 'Product Manager' },
        { quote: 'Great collaborator. He takes ownership, writes clean code, and always thinks about the bigger picture.', author: 'Dev Team Lead', role: 'TechCorp' },
      ]),
    },
    {
      key: 'nowItems',
      value: JSON.stringify([
        'Learning Rust (systems programming & WebAssembly)',
        'Building QuickMart v2 with microservices arch',
        'Contributing to FastAPI open source ecosystem',
        'Writing a blog about backend engineering patterns',
      ]),
    },
    { key: 'wallpaper', value: 'linux' },
    { key: 'nowUpdated', value: 'March 2025' },
    {
      key: 'availability',
      value: JSON.stringify({
        status: 'OPEN TO OPPORTUNITIES',
        looking: 'Backend / Flutter roles',
        preference: 'Remote (open to hybrid)',
        notice: 'Available immediately',
      }),
    },
    {
      key: 'resumeJobs',
      value: JSON.stringify([
        {
          title: 'Backend Developer (Freelance)',
          company: 'Various Clients',
          period: '2022 — Present',
          points: [
            'Built FastAPI microservices handling 10k+ req/day',
            'Designed PostgreSQL schemas and Redis caching layers',
            'Deployed Docker-based applications on cloud platforms',
          ],
        },
        {
          title: 'Flutter Developer (Contract)',
          company: 'Mobile Startup',
          period: '2023 — 2024',
          points: [
            'Developed cross-platform Flutter apps (iOS + Android)',
            'Integrated Firebase Auth, Firestore, and Cloud Functions',
            'Implemented Bloc state management for complex UIs',
          ],
        },
      ]),
    },
    {
      key: 'resumeEducation',
      value: JSON.stringify({
        degree: 'B.Tech in Computer Science',
        school: 'University Name, India',
        period: '2019 — 2023',
      }),
    },
  ];

  for (const entry of configEntries) {
    await db.siteConfig.upsert({ where: { key: entry.key }, update: entry, create: entry });
  }

  // Skills
  await db.skill.deleteMany();
  const skills = [
    // Languages
    { category: 'Languages', name: 'Python', experienceType: 'professional', order: 0, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
      { name: 'PyBot', githubUrl: 'https://github.com/ritinder/pybot' },
    ]},
    { category: 'Languages', name: 'Dart', experienceType: 'professional', order: 1, projects: [
      { name: 'TaskFlow', githubUrl: 'https://github.com/ritinder/taskflow' },
    ]},
    { category: 'Languages', name: 'JavaScript', experienceType: 'personal', order: 2, projects: [
      { name: 'portfolio-cpu', githubUrl: 'https://github.com/ritinder/portfolio-cpu' },
    ]},
    { category: 'Languages', name: 'SQL', experienceType: 'professional', order: 3, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
    ]},
    { category: 'Languages', name: 'Bash', experienceType: 'personal', order: 4, projects: [
      { name: 'Server automation scripts', githubUrl: '' },
    ]},
    // Backend
    { category: 'Backend', name: 'FastAPI', experienceType: 'professional', order: 0, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
    ]},
    { category: 'Backend', name: 'Flask', experienceType: 'professional', order: 1, projects: [
      { name: 'Internal dashboard (client)', githubUrl: '' },
    ]},
    { category: 'Backend', name: 'Django REST', experienceType: 'personal', order: 2, projects: [
      { name: 'Learning project', githubUrl: '' },
    ]},
    { category: 'Backend', name: 'Celery', experienceType: 'professional', order: 3, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
    ]},
    { category: 'Backend', name: 'Redis', experienceType: 'professional', order: 4, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
    ]},
    // Mobile
    { category: 'Mobile', name: 'Flutter', experienceType: 'professional', order: 0, projects: [
      { name: 'TaskFlow', githubUrl: 'https://github.com/ritinder/taskflow' },
    ]},
    { category: 'Mobile', name: 'Firebase', experienceType: 'professional', order: 1, projects: [
      { name: 'TaskFlow', githubUrl: 'https://github.com/ritinder/taskflow' },
    ]},
    { category: 'Mobile', name: 'Bloc', experienceType: 'professional', order: 2, projects: [
      { name: 'TaskFlow', githubUrl: 'https://github.com/ritinder/taskflow' },
    ]},
    // DevOps
    { category: 'DevOps', name: 'Docker', experienceType: 'professional', order: 0, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
    ]},
    { category: 'DevOps', name: 'GitHub Actions', experienceType: 'professional', order: 1, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
    ]},
    { category: 'DevOps', name: 'Nginx', experienceType: 'professional', order: 2, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
    ]},
    { category: 'DevOps', name: 'Linux', experienceType: 'professional', order: 3, projects: [
      { name: 'VPS server management', githubUrl: '' },
    ]},
    // Databases
    { category: 'Databases', name: 'PostgreSQL', experienceType: 'professional', order: 0, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
      { name: 'DevMetrics', githubUrl: 'https://github.com/ritinder/devmetrics' },
    ]},
    { category: 'Databases', name: 'Redis', experienceType: 'professional', order: 1, projects: [
      { name: 'QuickMart API', githubUrl: 'https://github.com/ritinder/quickmart-api' },
    ]},
    { category: 'Databases', name: 'SQLite', experienceType: 'personal', order: 2, projects: [
      { name: 'PyBot', githubUrl: 'https://github.com/ritinder/pybot' },
    ]},
    { category: 'Databases', name: 'MongoDB', experienceType: 'personal', order: 3, projects: [
      { name: 'Learning project', githubUrl: '' },
    ]},
  ];
  for (const skill of skills) {
    await db.skill.create({ data: skill });
  }

  // Projects
  await db.project.deleteMany();
  const projects = [
    {
      title: 'QuickMart Backend',
      description: 'A scalable e-commerce REST API built with FastAPI and PostgreSQL, supporting 10k+ concurrent users.',
      icon: '🛒',
      techStack: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
      githubUrl: 'https://github.com/ritinder/quickmart-api',
      order: 0,
      active: true,
    },
    {
      title: 'TaskFlow',
      description: 'A cross-platform task management app built with Flutter and Firebase.',
      icon: '✅',
      techStack: ['Flutter', 'Dart', 'Firebase', 'Bloc'],
      githubUrl: 'https://github.com/ritinder/taskflow',
      order: 1,
      active: true,
    },
    {
      title: 'DevMetrics',
      description: 'Real-time developer dashboard for monitoring API performance and system health.',
      icon: '📊',
      techStack: ['Python', 'FastAPI', 'WebSockets', 'PostgreSQL'],
      githubUrl: 'https://github.com/ritinder/devmetrics',
      order: 2,
      active: true,
    },
    {
      title: 'PyBot',
      description: 'A Telegram bot framework with plugin support and async message handling.',
      icon: '🤖',
      techStack: ['Python', 'python-telegram-bot', 'SQLite'],
      githubUrl: 'https://github.com/ritinder/pybot',
      order: 3,
      active: true,
    },
  ];
  await db.project.createMany({ data: projects });

  // Achievements
  await db.achievement.deleteMany();
  const achievements = [
    { icon: '🏆', title: 'Production APIs at Scale', date: '2024', description: 'Shipped REST APIs handling 10k+ daily requests in production.', order: 0 },
    { icon: '🥈', title: 'Hackathon 2nd Place', date: '2023', description: 'Built a real-time logistics platform in 24 hours.', order: 1 },
    { icon: '📜', title: 'Docker & Kubernetes Certified', date: '2024', description: 'Completed professional certification in container orchestration.', order: 2 },
    { icon: '⭐', title: '100+ GitHub Stars', date: '2024', description: 'Open source projects reached 100+ combined stars.', order: 3 },
    { icon: '🚀', title: 'Open Source Contributor', date: '2023–24', description: 'Regular contributor to FastAPI and Flutter ecosystem packages.', order: 4 },
  ];
  await db.achievement.createMany({ data: achievements });

  console.log('✓ Seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => Promise.all([db.$disconnect(), pool.end()]));
