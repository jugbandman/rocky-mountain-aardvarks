import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

export default function AdminLocations() {
    const { data: locations, loading } = useApi<Location[]>("/locations");
    const [editingLocation, setEditingLocation] = useState<Partial<Location> | null>(null);

    const handleSave = async () => {
        if (!editingLocation) return;
        const method = editingLocation.id ? "PUT" : "POST";
        const url = editingLocation.id ? `/api/locations/${editingLocation.id}` : "/api/locations";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingLocation),
        });
        setEditingLocation(null);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/locations/${id}`, { method: "DELETE" });
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
                        <h1 className="text-3xl font-heading font-black text-primary">Manage Locations</h1>
                    </div>
                    <Button onClick={() => setEditingLocation({ name: "", address: "" })}>
                        <Plus className="mr-2 w-4 h-4" /> Add Location
                    </Button>
                </header>

                <div className="grid gap-6">
                    {locations?.map((location) => (
                        <Card key={location.id}>
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="text-primary w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold">{location.name}</h3>
                                    <p className="text-gray-600">{location.address}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setEditingLocation(location)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(location.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editingLocation && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle>{editingLocation.id ? "Edit Location" : "Add New Location"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold">Location Name</label>
                                    <Input value={editingLocation.name} onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Full Address</label>
                                    <Input value={editingLocation.address} onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setEditingLocation(null)}>Cancel</Button>
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
