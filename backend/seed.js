require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./src/models/Expert');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expertbooking';

const CATEGORIES = ['Tech', 'Business', 'Design', 'Health', 'Finance', 'Education'];
const TIME_SLOTS = [
  '9:00 AM',
  '10:30 AM',
  '12:00 PM',
  '2:00 PM',
  '3:30 PM',
  '5:00 PM',
];

function formatYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildSlots() {
  const slots = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let day = 0; day < 5; day += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + day);
    const dateStr = formatYMD(d);
    for (const time of TIME_SLOTS) {
      slots.push({ date: dateStr, time, isBooked: false });
    }
  }
  return slots;
}

const EXPERTS = [
  {
    name: 'Dr. Sarah Jenkins',
    category: 'Health',
    experience: 15,
    rating: 4.9,
    price: 150,
    skills: ['Preventive Medicine', 'Wellness Strategy', 'Public Health'],
    sessionsCount: 1240,
    bio: 'Board-certified physician with 15+ years experience in preventive care and corporate wellness.',
  },
  {
    name: 'Marcus Thorne',
    category: 'Business',
    experience: 12,
    rating: 4.8,
    price: 125,
    skills: ['Executive Coaching', 'Leadership Development', 'Change Management'],
    sessionsCount: 850,
    bio: 'Transformational leader helping executives scale their organizations and lead with purpose.',
  },
  {
    name: 'Elena Rodriguez',
    category: 'Design',
    experience: 9,
    rating: 4.7,
    price: 95,
    skills: ['Brand Identity', 'Creative Direction', 'Typography'],
    sessionsCount: 420,
    bio: 'Award-winning creative director specializing in minimal and impactful brand identities.',
  },
  {
    name: 'David Chen',
    category: 'Tech',
    experience: 10,
    rating: 5.0,
    price: 110,
    skills: ['Cloud Architecture', 'Go', 'Kubernetes'],
    sessionsCount: 610,
    bio: 'Cloud-native architect focused on building resilient and scalable distributed systems.',
  },
  {
    name: 'Aisha Khan',
    category: 'Finance',
    experience: 14,
    rating: 4.9,
    price: 140,
    skills: ['Portfolio Management', 'Investment Strategy', 'Retirement Planning'],
    sessionsCount: 930,
    bio: 'Strategic financial advisor helping high-net-worth individuals preserve and grow wealth.',
  },
  {
    name: 'Julian Vane',
    category: 'Tech',
    experience: 8,
    rating: 4.8,
    price: 105,
    skills: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    sessionsCount: 340,
    bio: 'Security researcher dedicated to protecting modern infrastructure from advanced threats.',
  },
  {
    name: 'Sophia Lorenza',
    category: 'Health',
    experience: 11,
    rating: 4.7,
    price: 90,
    skills: ['Cognitive Behavioral Therapy', 'Mindfulness', 'Stress Management'],
    sessionsCount: 720,
    bio: 'Clinical psychologist focused on mental resilience and emotional intelligence.',
  },
  {
    name: 'Nathaniel Black',
    category: 'Business',
    experience: 13,
    rating: 4.9,
    price: 135,
    skills: ['Growth Marketing', 'SEO Strategy', 'Content Performance'],
    sessionsCount: 1100,
    bio: 'Marketing strategist helping D2C brands achieve hyper-growth through data-driven campaigns.',
  },
  {
    name: 'Isabella Rossi',
    category: 'Design',
    experience: 7,
    rating: 4.6,
    price: 85,
    skills: ['UX Research', 'User Testing', 'Accessibility'],
    sessionsCount: 290,
    bio: 'Human-centered designer crafting intuitive digital products for global audiences.',
  },
  {
    name: 'Gabriel Stone',
    category: 'Finance',
    experience: 16,
    rating: 4.8,
    price: 160,
    skills: ['Tax Optimization', 'Estate Planning', 'Risk Management'],
    sessionsCount: 1500,
    bio: 'Senior financial planner specialized in complex estate and tax optimization strategies.',
  },
  {
    name: 'Dr. Emily White',
    category: 'Health',
    experience: 9,
    rating: 4.9,
    price: 100,
    skills: ['Clinical Nutrition', 'Gut Health', 'Dietary Therapy'],
    sessionsCount: 540,
    bio: 'Specialist in nutrition-based healing and personalized dietary wellness plans.',
  },
  {
    name: 'Liam O Connor',
    category: 'Tech',
    experience: 6,
    rating: 4.9,
    price: 120,
    skills: ['Machine Learning', 'NLP', 'Python'],
    sessionsCount: 210,
    bio: 'AI researcher exploring the frontiers of natural language processing and automation.',
  },
  {
    name: 'Victoria Sterling',
    category: 'Business',
    experience: 18,
    rating: 5.0,
    price: 180,
    skills: ['Operations Strategy', 'Supply Chain', 'Lean Six Sigma'],
    sessionsCount: 2100,
    bio: 'Ops veteran with two decades of experience optimizing complex global supply chains.',
  },
  {
    name: 'Benjamin Hayes',
    category: 'Finance',
    experience: 5,
    rating: 4.7,
    price: 95,
    skills: ['Cryptocurrency', 'Blockchain Analysis', 'Smart Contracts'],
    sessionsCount: 180,
    bio: 'Digital asset specialist providing clarity in the evolving landscape of Web3 and DeFi.',
  },
  {
    name: 'Mia Takahashi',
    category: 'Design',
    experience: 8,
    rating: 4.8,
    price: 100,
    skills: ['Interaction Design', 'Prototyping', 'Visual Storytelling'],
    sessionsCount: 380,
    bio: 'Interaction designer blending motion and visual design to create magical user journeys.',
  },
  {
    name: 'Dr. Alistair Cook',
    category: 'Education',
    experience: 20,
    rating: 4.9,
    price: 130,
    skills: ['Curriculum Design', 'Higher Ed Consulting', 'E-Learning'],
    sessionsCount: 1800,
    bio: 'Academic consultant helping universities and ed-tech companies design future-ready curricula.',
  },
  {
    name: 'Sienna Blake',
    category: 'Education',
    experience: 7,
    rating: 4.8,
    price: 85,
    skills: ['College Admissions', 'SAT/ACT Prep', 'Essay Coaching'],
    sessionsCount: 640,
    bio: 'Dedicated academic coach specializing in Ivy League admissions and standardized testing.',
  },
  {
    name: 'Professor Mark Zhang',
    category: 'Education',
    experience: 25,
    rating: 5.0,
    price: 200,
    skills: ['STEM Education', 'Research Methodology', 'Grant Writing'],
    sessionsCount: 3200,
    bio: 'Distinguished educator with a focus on advancing STEM curricula and research excellence.',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Expert.deleteMany({});

  const slotsTemplate = buildSlots();
  const docs = EXPERTS.map((e, i) => ({
    ...e,
    avatar: `https://i.pravatar.cc/150?u=${e.name.replace(/\s/g, '')}`,
    availableSlots: slotsTemplate.map((s) => ({ ...s })),
  }));

  await Expert.insertMany(docs);
  console.log(`Inserted ${docs.length} experts with ${slotsTemplate.length} slots each.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
