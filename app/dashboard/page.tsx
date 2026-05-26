"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ProjectsTab } from "../../components/dashboard/ProjectsTab";
import { TeamTab } from "../../components/dashboard/TeamTab";
import { TasksTab } from "../../components/dashboard/TasksTab";
import { SettingsTab } from "../../components/dashboard/SettingsTab";
import { store } from "@/store/appStore";
import { Project, TeamMember, Task } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(store.projects);
  const [members, setMembers] = useState<TeamMember[]>(store.members);
  const [tasks, setTasks] = useState<Task[]>(store.tasks);

  // Sync with store
  const updateProjects = (p: Project[]) => {
    store.projects = p;
    setProjects([...p]);
  };
  const updateMembers = (m: TeamMember[]) => {
    store.members = m;
    setMembers([...m]);
  };
  const updateTasks = (t: Task[]) => {
    store.tasks = t;
    setTasks([...t]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus proyectos y tareas con shadcn/ui
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab projects={projects} members={members} tasks={tasks} />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab
              projects={projects}
              members={members}
              setProjects={updateProjects}
            />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab
              members={members}
              projects={projects}
              setMembers={updateMembers}
            />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTab
              tasks={tasks}
              projects={projects}
              members={members}
              setTasks={updateTasks}
            />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
