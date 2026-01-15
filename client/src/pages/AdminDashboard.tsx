import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, MapPin, Calendar, FileText, Settings, BookOpen, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";

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
            </div>
        </div>
    );
}
