import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Star, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Testimonial } from "@shared/schema";

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

export default function AdminTestimonials() {
    const { data: testimonials, loading, error } = useApi<Testimonial[]>("/testimonials");
    const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

    const handleSave = async () => {
        if (!editingTestimonial) return;
        const method = editingTestimonial.id ? "PUT" : "POST";
        const url = editingTestimonial.id ? `/api/testimonials/${editingTestimonial.id}` : "/api/testimonials";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingTestimonial),
        });
        setEditingTestimonial(null);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
        window.location.reload();
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    if (error) return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>Failed to load testimonials: {error.message}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon"><ArrowLeft /></Button>
                        </Link>
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Testimonials</h1>
                    </div>
                    <Button onClick={() => setEditingTestimonial({ quote: "", author: "", stars: 5, active: true })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Testimonial
                    </Button>
                </header>

                <div className="grid gap-6">
                    {testimonials?.map((testimonial) => (
                        <Card key={testimonial.id}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-0.5 text-yellow-500">
                                            {[...Array(testimonial.stars || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${testimonial.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {testimonial.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => setEditingTestimonial(testimonial)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(testimonial.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                                <p className="font-bold text-primary">— {testimonial.author}</p>
                                {testimonial.source && <p className="text-sm text-gray-500">Source: {testimonial.source}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editingTestimonial && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>{editingTestimonial.id ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold">Author Name</label>
                                    <Input value={editingTestimonial.author} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Quote</label>
                                    <Textarea value={editingTestimonial.quote} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold block mb-2">Stars</label>
                                    <StarRating
                                        value={editingTestimonial.stars || 5}
                                        onChange={(stars) => setEditingTestimonial({ ...editingTestimonial, stars })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Source (optional)</label>
                                    <Input
                                        placeholder="e.g. Google, Yelp"
                                        value={editingTestimonial.source || ""}
                                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, source: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="active"
                                        checked={editingTestimonial.active ?? true}
                                        onCheckedChange={(checked) => setEditingTestimonial({ ...editingTestimonial, active: checked === true })}
                                    />
                                    <label htmlFor="active" className="text-sm font-bold cursor-pointer">Active</label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingTestimonial(null)}>Cancel</Button>
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
