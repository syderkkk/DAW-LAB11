"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Project, TeamMember } from "@/types";
import { AlertCircle, Trash2, Eye, Plus, Users } from "lucide-react";

interface Props {
  projects: Project[];
  members: TeamMember[];
  setProjects: (p: Project[]) => void;
}

const emptyForm = { name: "", description: "", category: "", priority: "", members: [] as string[] };

export function ProjectsTab({ projects, members, setProjects }: Props) {
  const [open, setOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "El nombre es obligatorio.";
    if (!formData.category) e.category = "Selecciona una categoría.";
    if (!formData.priority) e.priority = "Selecciona una prioridad.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const newProject: Project = {
        id: `p${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: "Planificado",
        progress: 0,
        members: formData.members,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProjects([...projects, newProject]);
      setFormData({ ...emptyForm });
      setLoading(false);
      setOpen(false);
      setSuccessMsg(`Proyecto "${newProject.name}" creado exitosamente.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const toggleMember = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((m) => m !== userId)
        : [...prev.members, userId],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proyectos ({projects.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Alertas de validación */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Errores en el formulario</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc ml-4">
                      {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input placeholder="Nombre del proyecto" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción breve" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoría <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Desarrollo Web</SelectItem>
                      <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                      <SelectItem value="design">Diseño</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Prioridad <span className="text-red-500">*</span></Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Miembros del equipo */}
              <div className="grid gap-2">
                <Label><Users className="inline h-4 w-4 mr-1" />Miembros del equipo</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-36 overflow-y-auto">
                  {members.map((m) => (
                    <label key={m.userId} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" checked={formData.members.includes(m.userId)}
                        onChange={() => toggleMember(m.userId)} className="accent-primary" />
                      {m.name} — <span className="text-muted-foreground">{m.position}</span>
                    </label>
                  ))}
                </div>
                {formData.members.length > 0 && (
                  <p className="text-xs text-muted-foreground">{formData.members.length} miembro(s) seleccionado(s)</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); setErrors({}); setFormData({ ...emptyForm }); }}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <><Spinner className="mr-2" /> Guardando...</> : "Crear Proyecto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {successMsg && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const projectMembers = members.filter((m) => project.members.includes(m.userId));
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge variant={project.status === "Completado" ? "default" : project.status === "En revisión" ? "secondary" : "outline"}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  {/* Miembros del proyecto */}
                  {projectMembers.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {projectMembers.map((m) => (
                        <Badge key={m.userId} variant="outline" className="text-xs">{m.name.split(" ")[0]}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-muted-foreground">{project.members.length} miembro(s)</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailProject(project)}>
                        <Eye className="h-4 w-4 mr-1" /> Detalles
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de detalles */}
      <Dialog open={!!detailProject} onOpenChange={() => setDetailProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailProject?.name}</DialogTitle>
          </DialogHeader>
          {detailProject && (
            <div className="space-y-3 text-sm">
              <p><strong>Descripción:</strong> {detailProject.description || "Sin descripción"}</p>
              <p><strong>Categoría:</strong> {detailProject.category}</p>
              <p><strong>Prioridad:</strong> {detailProject.priority}</p>
              <p><strong>Estado:</strong> {detailProject.status}</p>
              <p><strong>Progreso:</strong> {detailProject.progress}%</p>
              <p><strong>Creado:</strong> {detailProject.createdAt}</p>
              <div>
                <strong>Miembros:</strong>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {members.filter((m) => detailProject.members.includes(m.userId)).map((m) => (
                    <Badge key={m.userId} variant="secondary">{m.name}</Badge>
                  ))}
                  {detailProject.members.length === 0 && <span className="text-muted-foreground">Sin miembros</span>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailProject(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}