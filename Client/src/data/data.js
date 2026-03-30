
const titles = [
  { id: 1, title: "Redesign landing page"},
  { id: 2, title: "Fix authentication bug"},
  { id: 3, title: "Write API documentation"},
  { id: 4, title: "Set up CI/CD pipeline"},
  { id: 5, title: "User research interviews"},
  { id: 6, title: "Update dependencies"},
  { id: 7, title: "Old design assets"},
];

const priority = [
    {id: 1, priority: "low"},
    {id: 2, priority: "medium"},
    {id: 3, priority: "high"},
]

const status = [
    {id: 1, status: "todo"},
    {id: 2, status: "started"},
    {id: 3, status: "in-progress"},
    {id: 4, status: "completed"}
]

const categories = [
  { id: 1, category: "Frontend" },
  { id: 2, category: "Backend" },
  { id: 3, category: "Design" },
  { id: 4, category: "Testing" },
  { id: 5, category: "DevOps" },
  { id: 6, category: "Research" },
];

const estimated_hours = [
  { id: 1, label: "10 sec", seconds: 10, milliseconds: 10000 },
  { id: 2, label: "20 sec", seconds: 20, milliseconds: 20000 },
  { id: 3, label: "30 sec", seconds: 30, milliseconds: 30000 },
  { id: 4, label: "15 min", seconds: 900, milliseconds: 900000 },
  { id: 5, label: "30 min", seconds: 1800, milliseconds: 1800000 },
  { id: 6, label: "1 hr", seconds: 3600, milliseconds: 3600000 },
  { id: 7, label: "2 hrs", seconds: 7200, milliseconds: 7200000 },
  { id: 8, label: "4 hrs", seconds: 14400, milliseconds: 14400000 },
]
const userRoles = [
  { id: 1, role: "Admin" },
  { id: 2, role: "Manager" },
  { id: 3, role: "User" },
];


const colors = [
    ["#6366f1", "#4f46e5"], // indigo
    ["#8b5cf6", "#7c3aed"], // violet
    ["#ec4899", "#db2777"], // pink
    ["#14b8a6", "#0d9488"], // teal
    ["#f59e0b", "#d97706"], // amber
    ["#10b981", "#059669"], // emerald
    ["#3b82f6", "#2563eb"], // blue
    ["#ef4444", "#dc2626"], // red
  ];
export {titles, priority, status, categories, estimated_hours, userRoles, colors}