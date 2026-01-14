import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Session, Class, Location } from "@shared/schema";

export default function AdminSessions() {
    const { data: sessions, loading: sessionsLoading } = useApi<any[]>("/sessions");
    const { data: classes } = useApi<Class[]>("/classes");
    const { data: locations } = useApi<Location[]>("/locations");
    const [editingSession, setEditingSession] = useState<any | null>(null);

    const handleSave = async () => {
        if (!editingSession) return;
        const method = editingSession.id ? "PUT" : "POST";
        const url = editingSession.id ? `/api/sessions/${editingSession.id}` : "/api/sessions";

        // Prepare data (remove joined objects)
        const payload = {
            classId: editingSession.classId,
            locationId: editingSession.locationId,
            dayOfWeek: editingSession.dayOfWeek,
            time: editingSession.time,
            instructor: editingSession.instructor,
            status: editingSession.status,
            startDate: editingSession.startDate,
            endDate: editingSession.endDate
        };

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        setEditingSession(null);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/sessions/${id}`, { method: "DELETE" });
        window.location.reload();
    };

    if (sessionsLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon"><ArrowLeft /></Button>
                        </Link>
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Schedule</h1>
                    </div>
                    <Button onClick={() => setEditingSession({ dayOfWeek: "Monday", time: "10:00 AM", instructor: "", status: "Open", startDate: new Date().toISOString(), endDate: new Date().toISOString() })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Session
                    </Button>
                </header>

                <div className="grid gap-4">
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3">Class</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Day/Time</th>
                                        <th className="px-6 py-3">Instructor</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {sessions?.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{session.class?.title}</td>
                                            <td className="px-6 py-4">{session.location?.name}</td>
                                            <td className="px-6 py-4 text-sm">{session.dayOfWeek} @ {session.time}</td>
                                            <td className="px-6 py-4">{session.instructor}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${session.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                        session.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingSession(session)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(session.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {editingSession && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>{editingSession.id ? "Edit Session" : "Add New Session"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold">Class</label>
                                        <Select value={editingSession.classId?.toString()} onValueChange={(v) => setEditingSession({ ...editingSession, classId: parseInt(v) })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold">Location</label>
                                        <Select value={editingSession.locationId?.toString()} onValueChange={(v) => setEditingSession({ ...editingSession, locationId: parseInt(v) })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations?.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold">Day of Week</label>
                                        <Select value={editingSession.dayOfWeek} onValueChange={(v) => setEditingSession({ ...editingSession, dayOfWeek: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold">Time</label>
                                        <Input value={editingSession.time} onChange={(e) => setEditingSession({ ...editingSession, time: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold">Instructor</label>
                                    <Input value={editingSession.instructor} onChange={(e) => setEditingSession({ ...editingSession, instructor: e.target.value })} />
                                </div>

                                <div>
                                    <label className="text-sm font-bold">Status</label>
                                    <Select value={editingSession.status} onValueChange={(v) => setEditingSession({ ...editingSession, status: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Open", "Few Spots Left", "Full", "Waitlist"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingSession(null)}>Cancel</Button>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
