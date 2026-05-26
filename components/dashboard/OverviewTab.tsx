"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Project, TeamMember, Task } from "@/types";

interface Props {
  projects: Project[];
  members: TeamMember[];
  tasks: Task[];
}

export function OverviewTab({ projects, members, tasks }: Props) {
  const completedTasks = tasks.filter((t) => t.status === "Completado").length;
  const activeMembers = members.filter((m) => m.isActive).length;
  const totalHours = tasks.length * 8; // simulado

  return (
    <div className="space-y-4">
      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Proyectos" value={projects.length} sub={`${projects.filter(p => p.status === "En progreso").length} en progreso`} />
        <MetricCard title="Tareas Completadas" value={completedTasks} sub={`de ${tasks.length} en total`} />
        <MetricCard title="Horas Trabajadas" value={`${totalHours}h`} sub="estimado del equipo" />
        <MetricCard title="Miembros Activos" value={activeMembers} sub={`de ${members.length} totales`} />
      </div>

      {/* Actividad reciente basada en tareas reales */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas tareas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => {
              const member = members.find((m) => m.userId === task.userId);
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div key={task.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member?.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member?.name ?? "Sin asignar"}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.description} —{" "}
                      <span className="font-medium">{project?.name ?? "Sin proyecto"}</span>
                    </p>
                  </div>
                  <Badge variant={task.status === "Completado" ? "default" : task.status === "En progreso" ? "secondary" : "outline"}>
                    {task.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, sub }: { title: string; value: string | number; sub: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}