import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Teacher } from "@shared/schema";

interface TeacherForm {
    name: string;
    bio: string;
    imageUrl: string;
    active: boolean;
}

const emptyForm: TeacherForm = {
    name: "",
    bio: "",
    imageUrl: "",
    active: true,
};

export default function AdminTeachers() {
    const { data: teachers, loading, error, refetch } = useApi<Teacher[]>("/admin/teachers");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState<TeacherForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (teacher: Teacher) => {
        setEditingId(teacher.id);
        setForm({
            name: teacher.name,
            bio: teacher.bio || "",
            imageUrl: teacher.imageUrl || "",
            active: teacher.active ?? true,
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setFormError("Name is required");
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `/api/admin/teachers/${editingId}`
                : "/api/admin/teachers";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to save teacher");
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
            const response = await fetch(`/api/admin/teachers/${deletingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to delete teacher");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to load teachers: {error.message}</span>
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
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-heading font-black text-primary">
                            Manage Teachers
                        </h1>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 w-4 h-4" /> Add Teacher
                    </Button>
                </header>

                {teachers?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 mb-4">No teachers yet</p>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 w-4 h-4" /> Add Your First Teacher
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {teachers?.map((teacher) => (
                            <Card key={teacher.id}>
                                <CardContent className="flex items-center gap-6 p-6">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                        {teacher.imageUrl ? (
                                            <img
                                                src={teacher.imageUrl}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                                                {teacher.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold">{teacher.name}</h3>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    teacher.active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {teacher.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2">{teacher.bio}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(teacher)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => openDeleteDialog(teacher.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Edit Teacher" : "Add New Teacher"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {formError && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {formError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="Teacher name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({ ...form, bio: e.target.value })
                                    }
                                    placeholder="Brief bio about the teacher"
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    value={form.imageUrl}
                                    onChange={(e) =>
                                        setForm({ ...form, imageUrl: e.target.value })
                                    }
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="active"
                                    checked={form.active}
                                    onCheckedChange={(checked) =>
                                        setForm({ ...form, active: checked })
                                    }
                                />
                                <Label htmlFor="active">Active</Label>
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
                                {editingId ? "Save Changes" : "Add Teacher"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                teacher from the database.
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
