import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, MapPin, Calendar, FileText, Settings, BookOpen, LogOut, Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

const adminLinks = [
    { href: "/admin/teachers", label: "Teachers", icon: Users, color: "text-blue-500" },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star, color: "text-yellow-500" },
    { href: "/admin/locations", label: "Locations", icon: MapPin, color: "text-red-500" },
    { href: "/admin/classes", label: "Classes", icon: BookOpen, color: "text-secondary" },
    { href: "/admin/sessions", label: "Schedule", icon: Calendar, color: "text-green-500" },
    { href: "/admin/pages", label: "Page Content", icon: FileText, color: "text-purple-500" },
];

export default function AdminDashboard() {
    const [, setLocation] = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
    const { isLoading: isCheckingAuth } = useAuth();

    async function handleSyncMainStreet() {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const response = await fetch("/api/admin/sync-mainstreet", { method: "POST" });
            const data = await response.json();
            if (data.success) {
                setSyncResult({ success: true, message: `Synced ${data.synced} classes from MainStreet` });
            } else {
                setSyncResult({ success: false, message: data.error || "Sync failed" });
            }
        } catch (err) {
            setSyncResult({ success: false, message: "Failed to connect to sync service" });
        } finally {
            setIsSyncing(false);
        }
    }

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setLocation("/admin/login");
        } catch {
            // Still redirect on error - cookie may be cleared anyway
            setLocation("/admin/login");
        }
    }

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-heading font-black text-primary">Admin Backdoor</h1>
                        <p className="text-gray-600">Welcome back, Hank! What would you like to update today?</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/">
                            <Button variant="outline">Back to Website</Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            {isLoggingOut ? (
                                <Spinner className="mr-2" />
                            ) : (
                                <LogOut className="w-4 h-4 mr-2" />
                            )}
                            Logout
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Card className="hover:shadow-lg transition-all cursor-pointer group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-bold">{link.label}</CardTitle>
                                    <link.icon className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500">Manage your {link.label.toLowerCase()} content here.</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    <Card className="hover:shadow-lg transition-all cursor-pointer group border-dashed border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-gray-400">Settings</CardTitle>
                            <Settings className="w-6 h-6 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400">Account and site-wide preferences.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* MainStreet Sync Section */}
                <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">MainStreet Class Sync</h2>
                            <p className="text-sm text-gray-500">Pull latest class schedule from MainStreet booking system</p>
                        </div>
                        <Button
                            onClick={handleSyncMainStreet}
                            disabled={isSyncing}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isSyncing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync Classes
                                </>
                            )}
                        </Button>
                    </div>
                    {syncResult && (
                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                            syncResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {syncResult.success ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <span>{syncResult.message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
