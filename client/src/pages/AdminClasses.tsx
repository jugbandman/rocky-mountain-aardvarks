import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { Class } from "@shared/schema";

export default function AdminClasses() {
    const { data: classes, loading } = useApi<Class[]>("/classes");
    const [editingClass, setEditingClass] = useState<Partial<Class> | null>(null);

    const handleSave = async () => {
        if (!editingClass) return;
        const method = editingClass.id ? "PUT" : "POST";
        const url = editingClass.id ? `/api/classes/${editingClass.id}` : "/api/classes";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingClass),
        });
        setEditingClass(null);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/classes/${id}`, { method: "DELETE" });
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
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Classes</h1>
                    </div>
                    <Button onClick={() => setEditingClass({ title: "", description: "", ageRange: "", duration: "", price: 0 })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Class Type
                    </Button>
                </header>

                <div className="grid gap-6">
                    {classes?.map((cls) => (
                        <Card key={cls.id}>
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className="w-16 h-16 rounded bg-secondary/20 flex items-center justify-center shrink-0">
                                    <BookOpen className="text-secondary w-8 h-8" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold">{cls.title}</h3>
                                    <p className="text-sm text-gray-500">{cls.ageRange} • {cls.duration} • ${cls.price / 100}</p>
                                    <p className="text-gray-600 line-clamp-1 mt-1">{cls.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setEditingClass(cls)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(cls.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editingClass && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>{editingClass.id ? "Edit Class Type" : "Add New Class Type"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold">Class Title</label>
                                    <Input value={editingClass.title} onChange={(e) => setEditingClass({ ...editingClass, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Age Range</label>
                                    <Input placeholder="e.g. 6 months - 5 years" value={editingClass.ageRange} onChange={(e) => setEditingClass({ ...editingClass, ageRange: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold">Duration</label>
                                        <Input placeholder="e.g. 45 mins" value={editingClass.duration} onChange={(e) => setEditingClass({ ...editingClass, duration: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold">Price (in cents)</label>
                                        <Input type="number" value={editingClass.price} onChange={(e) => setEditingClass({ ...editingClass, price: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Description</label>
                                    <Textarea value={editingClass.description} onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingClass(null)}>Cancel</Button>
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
