"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Task, Project, TeamMember } from "@/types";
import { AlertCircle, Plus, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Props {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  setTasks: (t: Task[]) => void;
}

const ITEMS_PER_PAGE = 4;

const empty: Omit<Task, "id"> = { description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" };

export function TasksTab({ tasks, projects, members, setTasks }: Props) {
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [form, setForm] = useState<typeof empty>({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tasks.length / ITEMS_PER_PAGE));
  const paginated = tasks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "La descripción es obligatoria.";
    if (!form.projectId) e.projectId = "Selecciona un proyecto.";
    return e;
  };

  const openCreate = () => { setEditTarget(null); setForm({ ...empty }); setErrors({}); setOpen(true); };
  const openEdit = (t: Task) => { setEditTarget(t); setForm({ description: t.description, projectId: t.projectId, status: t.status, priority: t.priority, userId: t.userId, dateline: t.dateline }); setErrors({}); setOpen(true); };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setTasks(tasks.map((t) => t.id === editTarget.id ? { ...editTarget, ...form } : t));
      } else {
        setTasks([...tasks, { id: `t${Date.now()}`, ...form }]);
      }
      setLoading(false);
      setOpen(false);
    }, 1200);
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    if (page > Math.max(1, Math.ceil(updated.length / ITEMS_PER_PAGE))) setPage(1);
  };

  const statusColor: Record<string, "default" | "secondary" | "outline"> = {
    "Completado": "default", "En progreso": "secondary", "Pendiente": "outline"
  };
  const priorityColor: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    "Urgente": "destructive", "Alta": "default", "Media": "secondary", "Baja": "outline"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tareas ({tasks.length})</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Nueva Tarea</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas</CardTitle>
          <CardDescription>Página {page} de {totalPages}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {paginated.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const member = members.find((m) => m.userId === task.userId);
            return (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.description}</p>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    <span className="text-xs text-muted-foreground">{project?.name ?? "Sin proyecto"}</span>
                    {member && <span className="text-xs text-muted-foreground">· {member.name}</span>}
                    {task.dateline && <span className="text-xs text-muted-foreground">· Límite: {task.dateline}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityColor[task.priority]}>{task.priority}</Badge>
                  <Badge variant={statusColor[task.status]}>{task.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => openEdit(task)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Paginación */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)} className="cursor-pointer">
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errores</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc ml-4">{Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}</ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="grid gap-1">
              <Label>Descripción *</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Proyecto *</Label>
                <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Asignado a</Label>
                <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {members.map((m) => <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Task["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1">
              <Label><CalendarIcon className="inline h-4 w-4 mr-1" />Fecha límite (dateline)</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {form.dateline ? format(new Date(form.dateline), "dd/MM/yyyy") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single"
                    selected={form.dateline ? new Date(form.dateline) : undefined}
                    onSelect={(d) => { setForm({ ...form, dateline: d ? d.toISOString().split("T")[0] : "" }); setCalOpen(false); }}
                    initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <><Spinner className="mr-2" /> Guardando...</> : (editTarget ? "Actualizar" : "Crear")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}