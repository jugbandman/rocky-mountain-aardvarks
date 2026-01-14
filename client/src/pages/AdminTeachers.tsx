import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Teacher } from "@shared/schema";

export default function AdminTeachers() {
    const { data: teachers, loading, error } = useApi<Teacher[]>("/teachers");
    const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);

    const handleSave = async () => {
        if (!editingTeacher) return;
        const method = editingTeacher.id ? "PUT" : "POST";
        const url = editingTeacher.id ? `/api/teachers/${editingTeacher.id}` : "/api/teachers";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingTeacher),
        });
        setEditingTeacher(null);
        window.location.reload(); // Simple refresh for now
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/teachers/${id}`, { method: "DELETE" });
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
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Teachers</h1>
                    </div>
                    <Button onClick={() => setEditingTeacher({ name: "", bio: "", imageUrl: "" })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Teacher
                    </Button>
                </header>

                <div className="grid gap-6">
                    {teachers?.map((teacher) => (
                        <Card key={teacher.id}>
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                    {teacher.imageUrl && <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                                    <p className="text-gray-600 line-clamp-2">{teacher.bio}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setEditingTeacher(teacher)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(teacher.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editingTeacher && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>{editingTeacher.id ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold">Name</label>
                                    <Input value={editingTeacher.name} onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Bio</label>
                                    <Textarea value={editingTeacher.bio} onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Image URL</label>
                                    <Input value={editingTeacher.imageUrl || ""} onChange={(e) => setEditingTeacher({ ...editingTeacher, imageUrl: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingTeacher(null)}>Cancel</Button>
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
