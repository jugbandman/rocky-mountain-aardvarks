import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Loader2, Calendar, MapPin, Clock, Music, Info, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Session, Class, Location } from "@shared/schema";

export default function Classes() {
    const { data: sessions, loading: sessionsLoading } = useApi<any[]>("/sessions");
    const { data: classes, loading: classesLoading } = useApi<Class[]>("/classes");
    const { data: locations } = useApi<Location[]>("/locations");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");

    const loading = sessionsLoading || classesLoading;

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    // Filter sessions by location if selected
    const filteredSessions = sessions?.filter(s =>
        selectedLocation === "all" || s.locationId?.toString() === selectedLocation
    );

    return (
        <div className="min-h-screen bg-light pb-20">
            {/* Hero */}
            <section className="bg-navy text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Music className="absolute top-10 left-10 w-24 h-24 rotate-12" />
                    <Music className="absolute bottom-10 right-10 w-32 h-32 -rotate-12" />
                </div>
                <h1 className="text-5xl font-heading font-black mb-4 relative z-10">Class Schedule</h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto relative z-10">
                    Find the perfect rhythm for your family. Choose a semester and location below to see our current offerings.
                </p>
            </section>

            {/* High-Visibility Semester Tabs */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <Tabs defaultValue="current" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-20 bg-white p-2 rounded-3xl shadow-2xl border-b-8 border-secondary/20">
                        <TabsTrigger value="current" className="rounded-2xl text-xl font-heading font-black data-[state=active]:bg-secondary data-[state=active]:text-navy transition-all">
                            Winter/Spring 2024
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="rounded-2xl text-xl font-heading font-black data-[state=active]:bg-primary data-[state=active]:text-white transition-all opacity-50 data-[state=active]:opacity-100">
                            Summer 2024
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-12 flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full md:w-64 shrink-0">
                            <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-8">
                                <h3 className="text-lg font-black text-navy mb-4 flex items-center gap-2">
                                    <MapPin className="text-red-500 w-5 h-5" /> Filter by Location
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedLocation("all")}
                                        className={`w-full text-left px-4 py-2 rounded-xl font-bold transition-all ${selectedLocation === 'all' ? 'bg-navy text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                    >
                                        All Locations
                                    </button>
                                    {locations?.map(loc => (
                                        <button
                                            key={loc.id}
                                            onClick={() => setSelectedLocation(loc.id.toString())}
                                            className={`w-full text-left px-4 py-2 rounded-xl font-bold transition-all ${selectedLocation === loc.id.toString() ? 'bg-navy text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                        >
                                            {loc.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-4">
                                        <Info className="w-4 h-4" /> Schedule Info
                                    </div>
                                    <ul className="text-xs space-y-3 text-gray-600 font-medium">
                                        <li className="flex gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Siblings under 6 months attend for FREE!</li>
                                        <li className="flex gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Full session and drop-in rates available.</li>
                                        <li className="flex gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Mixed-age classes (birth to 5 years).</li>
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <TabsContent value="current" className="flex-grow m-0">
                            <div className="grid gap-12">
                                {classes?.map(cls => (
                                    <div key={cls.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-b-8 border-navy/5">
                                        <div className="md:flex">
                                            <div className="md:w-1/3 h-64 md:h-auto bg-gray-200 relative">
                                                {cls.imageUrl ? (
                                                    <img src={cls.imageUrl} alt={cls.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">IMAGE PLACEHOLDER</div>
                                                )}
                                                <div className="absolute top-4 left-4 bg-secondary text-navy font-black px-4 py-1 rounded-full text-sm shadow-md">
                                                    {cls.ageRange}
                                                </div>
                                            </div>
                                            <div className="md:w-2/3 p-8 md:p-12">
                                                <h2 className="text-4xl font-heading font-black text-navy mb-4">{cls.title}</h2>
                                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{cls.description}</p>

                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Available Sessions</h3>
                                                    <div className="grid gap-3">
                                                        {filteredSessions?.filter(s => s.classId === cls.id).map(session => (
                                                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all group">
                                                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                                        <Clock className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-navy">{session.dayOfWeek} at {session.time}</div>
                                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3" /> {session.location?.name} • <span className="text-primary">{session.instructor}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${session.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                                            session.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                        {session.status}
                                                                    </span>
                                                                    <Button disabled={session.status === 'Full'} className="rounded-full font-black px-8">
                                                                        {session.status === 'Full' ? 'Join Waitlist' : 'Register'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {filteredSessions?.filter(s => s.classId === cls.id).length === 0 && (
                                                            <p className="text-gray-400 italic">No sessions available for this location.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="upcoming" className="flex-grow m-0">
                            <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-xl">
                                <Calendar className="w-20 h-20 text-primary mx-auto mb-6 opacity-20" />
                                <h2 className="text-3xl font-heading font-black text-navy mb-4">Summer 2024 Schedule Coming Soon!</h2>
                                <p className="text-xl text-gray-600 max-w-lg mx-auto">
                                    We're currently finalizing our summer lineup. Check back soon or join our mailing list to be the first to know!
                                </p>
                                <Button className="mt-8 rounded-full font-black px-12 py-6 text-lg">Join Mailing List</Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
