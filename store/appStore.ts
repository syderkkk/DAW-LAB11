import { Project, TeamMember, Task, AppSettings } from "@/types";

const defaultProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    members: ["u1", "u2", "u3"],
    createdAt: "2025-01-10",
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    members: ["u2", "u4"],
    createdAt: "2025-02-15",
  },
  {
    id: "p3",
    name: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "web",
    priority: "low",
    status: "Planificado",
    progress: 20,
    members: ["u1"],
    createdAt: "2025-03-01",
  },
];

const defaultMembers: TeamMember[] = [
  {
    userId: "u1",
    role: "admin",
    name: "María García",
    email: "maria@example.com",
    position: "Frontend Developer",
    birthdate: "1995-04-12",
    phone: "999-111-001",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "u2",
    role: "developer",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Backend Developer",
    birthdate: "1993-08-22",
    phone: "999-111-002",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "u3",
    role: "designer",
    name: "Ana López",
    email: "ana@example.com",
    position: "UI/UX Designer",
    birthdate: "1997-01-30",
    phone: "999-111-003",
    projectId: "p2",
    isActive: false,
  },
  {
    userId: "u4",
    role: "devops",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    position: "DevOps Engineer",
    birthdate: "1991-11-05",
    phone: "999-111-004",
    projectId: "p2",
    isActive: true,
  },
];

const defaultTasks: Task[] = [
  { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2025-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2025-11-20" },
  { id: "t3", description: "Configurar CI/CD", projectId: "p1", status: "Completado", priority: "Alta", userId: "u4", dateline: "2025-11-10" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "u2", dateline: "2025-11-12" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p3", status: "Pendiente", priority: "Baja", userId: "u2", dateline: "2025-11-25" },
  { id: "t6", description: "Crear componentes UI", projectId: "p3", status: "Pendiente", priority: "Media", userId: "u1", dateline: "2025-12-01" },
  { id: "t7", description: "Testing E2E", projectId: "p2", status: "Pendiente", priority: "Alta", userId: "u2", dateline: "2025-12-05" },
];

const defaultSettings: AppSettings = {
  appName: "ProjectHub",
  language: "es",
  timezone: "America/Lima",
  emailNotifications: true,
  pushNotifications: false,
  theme: "light",
  autoSave: true,
  sessionTimeout: "30",
};

// Simple in-memory store (resets on page reload, as required)
export const store = {
  projects: [...defaultProjects],
  members: [...defaultMembers],
  tasks: [...defaultTasks],
  settings: { ...defaultSettings },
};