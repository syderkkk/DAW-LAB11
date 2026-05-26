export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  members: string[]; // userIds
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: "Pendiente" | "En progreso" | "Completado";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  userId: string;
  dateline: string;
}

export interface AppSettings {
  appName: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: string;
  autoSave: boolean;
  sessionTimeout: string;
}