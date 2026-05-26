"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { store } from "@/store/appStore";
import { AppSettings } from "@/types";
import { CheckCircle2 } from "lucide-react";

export function SettingsTab() {
  const [settings, setSettings] = useState<AppSettings>({ ...store.settings });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      store.settings = { ...settings };
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }, 1500);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Configuración</h2>

      {saved && (
        <Alert className="border-green-500 bg-green-50 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>¡Guardado!</AlertTitle>
          <AlertDescription>La configuración se guardó correctamente.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Configuración básica de la aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Nombre de la aplicación</Label>
            <Input value={settings.appName} onChange={(e) => setSettings({ ...settings, appName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Zona horaria</Label>
              <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">America/Lima</SelectItem>
                  <SelectItem value="America/Bogota">America/Bogota</SelectItem>
                  <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
                  <SelectItem value="America/Santiago">America/Santiago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tema</Label>
            <Select value={settings.theme} onValueChange={(v) => setSettings({ ...settings, theme: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Controla cómo recibes alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "emailNotifications", label: "Notificaciones por email" },
            { key: "pushNotifications", label: "Notificaciones push" },
            { key: "autoSave", label: "Guardar cambios automáticamente" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label>{label}</Label>
              <input type="checkbox" className="accent-primary w-4 h-4"
                checked={settings[key as keyof AppSettings] as boolean}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })} />
            </div>
          ))}
          <div className="grid gap-2 pt-2">
            <Label>Tiempo de sesión (minutos)</Label>
            <Input type="number" value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} className="w-32" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? <><Spinner className="mr-2" /> Guardando configuración...</> : "Guardar Configuración"}
      </Button>
    </div>
  );
}