import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Class } from "@shared/schema";

interface ClassForm {
    title: string;
    description: string;
    ageRange: string;
    duration: string;
    price: string; // Stored as string for dollar input, converted to cents on save
    imageUrl: string;
}

const emptyForm: ClassForm = {
    title: "",
    description: "",
    ageRange: "",
    duration: "",
    price: "",
    imageUrl: "",
};

// Convert cents to dollars for display
function centsToDollars(cents: number): string {
    return (cents / 100).toFixed(2);
}

// Convert dollars string to cents
function dollarsToCents(dollars: string): number {
    const num = parseFloat(dollars);
    return Math.round(num * 100);
}

export default function AdminClasses() {
    const { data: classes, loading, error, refetch } = useApi<Class[]>("/admin/classes");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState<ClassForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (cls: Class) => {
        setEditingId(cls.id);
        setForm({
            title: cls.title,
            description: cls.description,
            ageRange: cls.ageRange,
            duration: cls.duration,
            price: centsToDollars(cls.price),
            imageUrl: cls.imageUrl || "",
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            setFormError("Title is required");
            return;
        }
        if (!form.description.trim()) {
            setFormError("Description is required");
            return;
        }
        if (!form.ageRange.trim()) {
            setFormError("Age range is required");
            return;
        }
        if (!form.duration.trim()) {
            setFormError("Duration is required");
            return;
        }
        if (!form.price || parseFloat(form.price) <= 0) {
            setFormError("Price must be greater than 0");
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `/api/admin/classes/${editingId}`
                : "/api/admin/classes";

            const payload = {
                title: form.title,
                description: form.description,
                ageRange: form.ageRange,
                duration: form.duration,
                price: dollarsToCents(form.price),
                imageUrl: form.imageUrl || null,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to save class");
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
            const response = await fetch(`/api/admin/classes/${deletingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to delete class");
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
                        <span>Failed to load classes: {error.message}</span>
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
                            Manage Classes
                        </h1>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 w-4 h-4" /> Add Class Type
                    </Button>
                </header>

                {classes?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 mb-4">No class types yet</p>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 w-4 h-4" /> Add Your First Class Type
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {classes?.map((cls) => (
                            <Card key={cls.id}>
                                <CardContent className="flex items-center gap-6 p-6">
                                    {cls.imageUrl ? (
                                        <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                                            <img
                                                src={cls.imageUrl}
                                                alt={cls.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded bg-secondary/20 flex items-center justify-center shrink-0">
                                            <BookOpen className="text-secondary w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold">{cls.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {cls.ageRange} • {cls.duration} • ${centsToDollars(cls.price)}
                                        </p>
                                        <p className="text-gray-600 line-clamp-1 mt-1">
                                            {cls.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(cls)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => openDeleteDialog(cls.id)}
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
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Edit Class Type" : "Add New Class Type"}
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
                                <Label htmlFor="title">Class Title *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({ ...form, title: e.target.value })
                                    }
                                    placeholder="e.g. Family Music Class"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="What makes this class special?"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ageRange">Age Range *</Label>
                                    <Input
                                        id="ageRange"
                                        value={form.ageRange}
                                        onChange={(e) =>
                                            setForm({ ...form, ageRange: e.target.value })
                                        }
                                        placeholder="e.g. 0-5 years"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration *</Label>
                                    <Input
                                        id="duration"
                                        value={form.duration}
                                        onChange={(e) =>
                                            setForm({ ...form, duration: e.target.value })
                                        }
                                        placeholder="e.g. 45 mins"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
                                        }
                                        placeholder="e.g. 25.00"
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
                                        placeholder="https://..."
                                    />
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
                                {editingId ? "Save Changes" : "Add Class"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Class Type?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                class type from the database. Sessions scheduled for this class
                                may be affected.
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
