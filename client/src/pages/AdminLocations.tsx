import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, MapPin, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

interface LocationForm {
    name: string;
    address: string;
    lat: string;
    lng: string;
}

const emptyForm: LocationForm = {
    name: "",
    address: "",
    lat: "",
    lng: "",
};

export default function AdminLocations() {
    const { data: locations, loading, error, refetch } = useApi<Location[]>("/admin/locations");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState<LocationForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (location: Location) => {
        setEditingId(location.id);
        setForm({
            name: location.name,
            address: location.address || "",
            lat: location.lat?.toString() || "",
            lng: location.lng?.toString() || "",
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
        if (!form.address.trim()) {
            setFormError("Address is required");
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `/api/admin/locations/${editingId}`
                : "/api/admin/locations";

            const payload = {
                name: form.name,
                address: form.address,
                lat: form.lat ? parseFloat(form.lat) : null,
                lng: form.lng ? parseFloat(form.lng) : null,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to save location");
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
            const response = await fetch(`/api/admin/locations/${deletingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data: { error?: string } = await response.json();
                throw new Error(data.error || "Failed to delete location");
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
                        <span>Failed to load locations: {error.message}</span>
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
                            Manage Locations
                        </h1>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 w-4 h-4" /> Add Location
                    </Button>
                </header>

                {locations?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 mb-4">No locations yet</p>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 w-4 h-4" /> Add Your First Location
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
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
                                        {location.lat && location.lng && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Coordinates: {location.lat}, {location.lng}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(location)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => openDeleteDialog(location.id)}
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
                                {editingId ? "Edit Location" : "Add New Location"}
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
                                <Label htmlFor="name">Location Name *</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="e.g. Washington Park"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address *</Label>
                                <Input
                                    id="address"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({ ...form, address: e.target.value })
                                    }
                                    placeholder="e.g. 701 S Franklin St, Denver, CO 80209"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lat">Latitude (optional)</Label>
                                    <Input
                                        id="lat"
                                        type="number"
                                        step="any"
                                        value={form.lat}
                                        onChange={(e) =>
                                            setForm({ ...form, lat: e.target.value })
                                        }
                                        placeholder="e.g. 39.6977"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lng">Longitude (optional)</Label>
                                    <Input
                                        id="lng"
                                        type="number"
                                        step="any"
                                        value={form.lng}
                                        onChange={(e) =>
                                            setForm({ ...form, lng: e.target.value })
                                        }
                                        placeholder="e.g. -104.9803"
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
                                {editingId ? "Save Changes" : "Add Location"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                location from the database. Sessions associated with this location
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
