import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Star, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Testimonial } from "@shared/schema";

interface TestimonialForm {
    quote: string;
    author: string;
    source: string;
    stars: number;
    active: boolean;
}

const emptyForm: TestimonialForm = {
    quote: "",
    author: "",
    source: "",
    stars: 5,
    active: true,
};

function StarRating({ value, onChange }: { value: number; onChange: (stars: number) => void }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                >
                    <Star
                        className={`w-6 h-6 ${star <= value ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                    />
                </button>
            ))}
        </div>
    );
}

function StarDisplay({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5 text-yellow-500">
            {[...Array(count)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
            ))}
        </div>
    );
}

export default function AdminTestimonials() {
    const { data: testimonials, loading, error, refetch } = useApi<Testimonial[]>("/admin/testimonials");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState<TestimonialForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);
        setForm({
            quote: testimonial.quote,
            author: testimonial.author,
            source: testimonial.source || "",
            stars: testimonial.stars || 5,
            active: testimonial.active ?? true,
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.quote.trim()) {
            setFormError("Quote is required");
            return;
        }
        if (!form.author.trim()) {
            setFormError("Author is required");
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `/api/admin/testimonials/${editingId}`
                : "/api/admin/testimonials";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to save testimonial");
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
            const response = await fetch(`/api/admin/testimonials/${deletingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to delete testimonial");
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
                        <span>Failed to load testimonials: {error.message}</span>
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
                            Manage Testimonials
                        </h1>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 w-4 h-4" /> Add Testimonial
                    </Button>
                </header>

                {testimonials?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 mb-4">No testimonials yet</p>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 w-4 h-4" /> Add Your First Testimonial
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {testimonials?.map((testimonial) => (
                            <Card key={testimonial.id}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <StarDisplay count={testimonial.stars || 5} />
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    testimonial.active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {testimonial.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => openEditDialog(testimonial)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => openDeleteDialog(testimonial.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                                    <p className="font-bold text-primary">— {testimonial.author}</p>
                                    {testimonial.source && (
                                        <p className="text-sm text-gray-500">
                                            Source: {testimonial.source}
                                        </p>
                                    )}
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
                                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
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
                                <Label htmlFor="author">Author Name *</Label>
                                <Input
                                    id="author"
                                    value={form.author}
                                    onChange={(e) =>
                                        setForm({ ...form, author: e.target.value })
                                    }
                                    placeholder="Parent name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quote">Quote *</Label>
                                <Textarea
                                    id="quote"
                                    value={form.quote}
                                    onChange={(e) =>
                                        setForm({ ...form, quote: e.target.value })
                                    }
                                    placeholder="What they said about your classes"
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Star Rating</Label>
                                <StarRating
                                    value={form.stars}
                                    onChange={(stars) => setForm({ ...form, stars })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source (optional)</Label>
                                <Input
                                    id="source"
                                    value={form.source}
                                    onChange={(e) =>
                                        setForm({ ...form, source: e.target.value })
                                    }
                                    placeholder="e.g. Google, Yelp, Email"
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
                                {editingId ? "Save Changes" : "Add Testimonial"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                testimonial from the database.
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
