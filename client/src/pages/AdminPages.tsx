import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import type { PageContent } from "@shared/schema";

export default function AdminPages() {
    const { data: pages, loading } = useApi<PageContent[]>("/content");
    const [editingPage, setEditingPage] = useState<Partial<PageContent> | null>(null);

    const handleSave = async () => {
        if (!editingPage) return;
        const method = editingPage.id ? "PUT" : "POST";
        const url = editingPage.id ? `/api/content/${editingPage.id}` : "/api/content";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingPage),
        });
        setEditingPage(null);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/content/${id}`, { method: "DELETE" });
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
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Page Content</h1>
                    </div>
                    <Button onClick={() => setEditingPage({ title: "", slug: "", content: "" })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Page content
                    </Button>
                </header>

                <div className="grid gap-6">
                    {pages?.map((page) => (
                        <Card key={page.id}>
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="text-primary w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold">{page.title}</h3>
                                    <p className="text-sm text-gray-400 font-mono">/{page.slug}</p>
                                    <p className="text-gray-600 line-clamp-1 mt-1">{page.content}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setEditingPage(page)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(page.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editingPage && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <CardTitle>{editingPage.id ? "Edit Content Block" : "Add Content Block"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold">Title</label>
                                        <Input value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold">Slug</label>
                                        <Input placeholder="e.g. refund-policy" value={editingPage.slug} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold">HTML/Text Content</label>
                                    <Textarea className="min-h-[300px] font-mono" value={editingPage.content} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
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
