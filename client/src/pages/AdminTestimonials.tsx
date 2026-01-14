import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Star } from "lucide-react";
import { Link } from "wouter";
import type { Testimonial } from "@shared/schema";

export default function AdminTestimonials() {
    const { data: testimonials, loading } = useApi<Testimonial[]>("/testimonials");
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
                                    <div className="flex gap-1 text-yellow-500">
                                        {[...Array(testimonial.stars || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold">Stars</label>
                                        <Input type="number" min="1" max="5" value={editingTestimonial.stars || 5} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, stars: parseInt(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold">Source</label>
                                        <Input value={editingTestimonial.source || ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, source: e.target.value })} />
                                    </div>
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
