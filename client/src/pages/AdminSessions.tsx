import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Loader2,
    Plus,
    Pencil,
    Trash2,
    ArrowLeft,
    Calendar as CalendarIcon,
    AlertCircle,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { Session, Class, Location } from "@shared/schema";
import { format } from "date-fns";

interface SessionWithRelations extends Session {
    class?: { id: number; title: string } | null;
    location?: { id: number; name: string; address: string } | null;
}

interface SessionForm {
    classId: string;
    locationId: string;
    dayOfWeek: string;
    time: string;
    instructor: string;
    status: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
}

const emptyForm: SessionForm = {
    classId: "",
    locationId: "",
    dayOfWeek: "Monday",
    time: "",
    instructor: "",
    status: "Open",
    startDate: undefined,
    endDate: undefined,
};

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const STATUS_OPTIONS = ["Open", "Few Spots Left", "Full", "Waitlist"];

function getStatusColor(status: string): string {
    switch (status) {
        case "Open":
            return "bg-green-100 text-green-700";
        case "Full":
            return "bg-red-100 text-red-700";
        case "Few Spots Left":
            return "bg-yellow-100 text-yellow-700";
        case "Waitlist":
            return "bg-orange-100 text-orange-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function AdminSessions() {
    const {
        data: sessions,
        loading: sessionsLoading,
        error: sessionsError,
        refetch,
    } = useApi<SessionWithRelations[]>("/admin/sessions");
    const { data: classes } = useApi<Class[]>("/classes");
    const { data: locations } = useApi<Location[]>("/locations");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState<SessionForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddDialog = () => {
        setEditingId(null);
        setForm({
            ...emptyForm,
            startDate: new Date(),
            endDate: new Date(),
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (session: SessionWithRelations) => {
        setEditingId(session.id);
        setForm({
            classId: session.classId?.toString() || "",
            locationId: session.locationId?.toString() || "",
            dayOfWeek: session.dayOfWeek,
            time: session.time,
            instructor: session.instructor,
            status: session.status,
            startDate: session.startDate ? new Date(session.startDate) : undefined,
            endDate: session.endDate ? new Date(session.endDate) : undefined,
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.classId) {
            setFormError("Please select a class");
            return;
        }
        if (!form.locationId) {
            setFormError("Please select a location");
            return;
        }
        if (!form.time.trim()) {
            setFormError("Time is required");
            return;
        }
        if (!form.instructor.trim()) {
            setFormError("Instructor is required");
            return;
        }
        if (!form.startDate) {
            setFormError("Start date is required");
            return;
        }
        if (!form.endDate) {
            setFormError("End date is required");
            return;
        }
        if (form.startDate > form.endDate) {
            setFormError("End date must be after start date");
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `/api/admin/sessions/${editingId}`
                : "/api/admin/sessions";

            const payload = {
                classId: parseInt(form.classId),
                locationId: parseInt(form.locationId),
                dayOfWeek: form.dayOfWeek,
                time: form.time,
                instructor: form.instructor,
                status: form.status,
                startDate: form.startDate.toISOString(),
                endDate: form.endDate.toISOString(),
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to save session");
            }

            setDialogOpen(false);
            await refetch();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        setDeleting(true);

        try {
            const response = await fetch(`/api/admin/sessions/${deletingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to delete session");
            }

            setDeleteDialogOpen(false);
            setDeletingId(null);
            await refetch();
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeleting(false);
        }
    };

    // Find class and location names for display
    const getClassName = (classId: number | undefined) => {
        if (!classId || !classes) return "Unknown Class";
        const cls = classes.find((c) => c.id === classId);
        return cls?.title || "Unknown Class";
    };

    const getLocationName = (locationId: number | undefined) => {
        if (!locationId || !locations) return "Unknown Location";
        const loc = locations.find((l) => l.id === locationId);
        return loc?.name || "Unknown Location";
    };

    if (sessionsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (sessionsError) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to load sessions: {sessionsError.message}</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-heading font-black text-primary">
                            Manage Schedule
                        </h1>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 w-4 h-4" /> Add Session
                    </Button>
                </header>

                {sessions?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 mb-4">No sessions scheduled yet</p>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 w-4 h-4" /> Add Your First Session
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3">Class</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Day/Time</th>
                                        <th className="px-6 py-3">Instructor</th>
                                        <th className="px-6 py-3">Dates</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {sessions?.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">
                                                {session.class?.title || getClassName(session.classId)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {session.location?.name ||
                                                    getLocationName(session.locationId)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {session.dayOfWeek} @ {session.time}
                                            </td>
                                            <td className="px-6 py-4">{session.instructor}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {session.startDate &&
                                                    format(new Date(session.startDate), "MMM d")}
                                                {" - "}
                                                {session.endDate &&
                                                    format(new Date(session.endDate), "MMM d, yyyy")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "px-2 py-1 rounded-full text-xs font-bold",
                                                        getStatusColor(session.status)
                                                    )}
                                                >
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(session)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => openDeleteDialog(session.id)}
                                                    >
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
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Edit Session" : "Add New Session"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {formError && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {formError}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Class *</Label>
                                    <Select
                                        value={form.classId}
                                        onValueChange={(v) => setForm({ ...form, classId: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Location *</Label>
                                    <Select
                                        value={form.locationId}
                                        onValueChange={(v) => setForm({ ...form, locationId: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations?.map((l) => (
                                                <SelectItem key={l.id} value={l.id.toString()}>
                                                    {l.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Day of Week *</Label>
                                    <Select
                                        value={form.dayOfWeek}
                                        onValueChange={(v) => setForm({ ...form, dayOfWeek: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS_OF_WEEK.map((d) => (
                                                <SelectItem key={d} value={d}>
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time *</Label>
                                    <Input
                                        id="time"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        placeholder="e.g. 10:00 AM"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instructor">Instructor *</Label>
                                    <Input
                                        id="instructor"
                                        value={form.instructor}
                                        onChange={(e) =>
                                            setForm({ ...form, instructor: e.target.value })
                                        }
                                        placeholder="Instructor name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status *</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(v) => setForm({ ...form, status: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !form.startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.startDate ? (
                                                    format(form.startDate, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={form.startDate}
                                                onSelect={(date) =>
                                                    setForm({ ...form, startDate: date })
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !form.endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.endDate ? (
                                                    format(form.endDate, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={form.endDate}
                                                onSelect={(date) =>
                                                    setForm({ ...form, endDate: date })
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                                {editingId ? "Save Changes" : "Add Session"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                session from the schedule. Any existing registrations may be
                                affected.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {deleting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
