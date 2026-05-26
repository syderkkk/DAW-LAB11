"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { TeamMember, Project } from "@/types";
import { AlertCircle, Plus, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Props {
  members: TeamMember[];
  projects: Project[];
  setMembers: (m: TeamMember[]) => void;
}

const emptyMember: Omit<TeamMember, "userId"> = {
  role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: "", isActive: true,
};

export function TeamTab({ members, projects, setMembers }: Props) {
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<typeof emptyMember>({ ...emptyMember });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio.";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email inválido.";
    if (!form.role) e.role = "Selecciona un rol.";
    if (!form.position.trim()) e.position = "La posición es obligatoria.";
    return e;
  };

  const openCreate = () => { setEditTarget(null); setForm({ ...emptyMember }); setErrors({}); setOpen(true); };
  const openEdit = (m: TeamMember) => { setEditTarget(m); setForm({ role: m.role, name: m.name, email: m.email, position: m.position, birthdate: m.birthdate, phone: m.phone, projectId: m.projectId, isActive: m.isActive }); setErrors({}); setOpen(true); };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setMembers(members.map((m) => m.userId === editTarget.userId ? { ...editTarget, ...form } : m));
      } else {
        const newM: TeamMember = { userId: `u${Date.now()}`, ...form };
        setMembers([...members, newM]);
      }
      setLoading(false);
      setOpen(false);
    }, 1200);
  };

  const handleDelete = (userId: string) => setMembers(members.filter((m) => m.userId !== userId));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Equipo ({members.length})</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Agregar Miembro</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>CRUD completo de miembros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.userId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{m.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.position} — {m.role}</p>
                    <p className="text-xs text-muted-foreground">{m.email} {m.phone && `· ${m.phone}`}</p>
                    {m.birthdate && <p className="text-xs text-muted-foreground">Nac: {m.birthdate}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Activo" : "Inactivo"}</Badge>
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(m.userId)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Nombre *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Posición *</Label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Teléfono</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Rol *</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue placeholder="Rol" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="pm">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Proyecto</Label>
                <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                  <SelectTrigger><SelectValue placeholder="Asignar proyecto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin proyecto</SelectItem>
                    {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha de nacimiento con Calendar */}
            <div className="grid gap-1">
              <Label><CalendarIcon className="inline h-4 w-4 mr-1" />Fecha de nacimiento</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {form.birthdate ? format(new Date(form.birthdate), "dd/MM/yyyy") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single"
                    selected={form.birthdate ? new Date(form.birthdate) : undefined}
                    onSelect={(d) => { setForm({ ...form, birthdate: d ? d.toISOString().split("T")[0] : "" }); setCalOpen(false); }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary" />
              <Label htmlFor="isActive">Miembro activo</Label>
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