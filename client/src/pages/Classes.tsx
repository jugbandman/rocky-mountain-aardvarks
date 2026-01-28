import { useState, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { Loader2, Calendar, MapPin, Clock, Music, Info, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Class, Location } from "@shared/schema";
import { format, isWithinInterval } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MAINSTREET_BOOKING_URL } from "@/lib/constants";

interface SessionWithRelations {
    id: number;
    dayOfWeek: string;
    time: string;
    instructor: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
    classId?: number;
    locationId?: number;
    class?: { id: number; title: string } | null;
    location?: { id: number; name: string; address: string } | null;
}

interface Semester {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    sessions: SessionWithRelations[];
}

function getSemesterName(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month >= 0 && month <= 4) {
        return `Spring ${year}`;
    } else if (month >= 5 && month <= 7) {
        return `Summer ${year}`;
    } else {
        return `Fall ${year}`;
    }
}

function getStatusColor(status: string): string {
    switch (status) {
        case "Open":
            return "bg-green-100 text-green-700";
        case "Full":
            return "bg-red-100 text-red-700";
        case "Few Spots Left":
            return "bg-yellow-100 text-yellow-700";
        case "Waitlist":
            return "bg-orange-100 text-orange-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function Classes() {
    const { data: sessions, loading: sessionsLoading, error: sessionsError } = useApi<SessionWithRelations[]>("/sessions");
    const { data: classes, loading: classesLoading, error: classesError } = useApi<Class[]>("/classes");
    const { data: locations } = useApi<Location[]>("/locations");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");

    const loading = sessionsLoading || classesLoading;
    const error = sessionsError || classesError;

    // Group sessions by semester
    const semesters = useMemo(() => {
        if (!sessions || sessions.length === 0) return [];

        const semesterMap = new Map<string, Semester>();

        sessions.forEach((session) => {
            const startDate = new Date(session.startDate);
            const semesterName = getSemesterName(startDate);
            const semesterId = semesterName.replace(/\s/g, "-").toLowerCase();

            if (!semesterMap.has(semesterId)) {
                semesterMap.set(semesterId, {
                    id: semesterId,
                    name: semesterName,
                    startDate,
                    endDate: new Date(session.endDate),
                    sessions: [],
                });
            }

            const semester = semesterMap.get(semesterId)!;
            semester.sessions.push(session);

            // Update end date if this session ends later
            const endDate = new Date(session.endDate);
            if (endDate > semester.endDate) {
                semester.endDate = endDate;
            }
        });

        // Sort by start date (most recent first becomes default)
        return Array.from(semesterMap.values()).sort(
            (a, b) => b.startDate.getTime() - a.startDate.getTime()
        );
    }, [sessions]);

    // Get the current/most relevant semester
    const currentSemester = useMemo(() => {
        const now = new Date();
        // Find semester that contains today, or the next upcoming one
        const active = semesters.find((s) =>
            isWithinInterval(now, { start: s.startDate, end: s.endDate })
        );
        return active || semesters[0];
    }, [semesters]);

    const [activeSemester, setActiveSemester] = useState<string>("");

    // Set default active semester when data loads
    useMemo(() => {
        if (currentSemester && !activeSemester) {
            setActiveSemester(currentSemester.id);
        }
    }, [currentSemester, activeSemester]);

    // Filter sessions by location
    const filteredSessions = useMemo(() => {
        const semester = semesters.find((s) => s.id === activeSemester);
        if (!semester) return [];

        return semester.sessions.filter(
            (s) => selectedLocation === "all" || s.locationId?.toString() === selectedLocation
        );
    }, [semesters, activeSemester, selectedLocation]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow pb-20">
                    <section className="bg-navy text-white py-16 px-4 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <Music className="absolute top-10 left-10 w-24 h-24 rotate-12" />
                            <Music className="absolute bottom-10 right-10 w-32 h-32 -rotate-12" />
                        </div>
                        <h1 className="text-5xl font-heading font-black mb-4 relative z-10">Class Schedule</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto relative z-10">
                            Find the perfect rhythm for your family.
                        </p>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading schedule...</span>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow pb-20">
                    <section className="bg-navy text-white py-16 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Class Schedule</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load schedule. Please try again later.</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pb-20">
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

            {/* Semester Tabs */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                {semesters.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-xl">
                        <Calendar className="w-20 h-20 text-primary mx-auto mb-6 opacity-20" />
                        <h2 className="text-3xl font-heading font-black text-navy mb-4">No Classes Scheduled</h2>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto">
                            We're currently finalizing our schedule. Check back soon or join our mailing list to be the first to know!
                        </p>
                        <Button className="mt-8 rounded-full font-black px-12 py-6 text-lg">
                            Join Mailing List
                        </Button>
                    </div>
                ) : (
                    <Tabs value={activeSemester} onValueChange={setActiveSemester} className="w-full">
                        <TabsList className={`grid w-full h-20 bg-white p-2 rounded-3xl shadow-2xl border-b-8 border-secondary/20 grid-cols-${Math.min(semesters.length, 3)}`}>
                            {semesters.slice(0, 3).map((semester, index) => (
                                <TabsTrigger
                                    key={semester.id}
                                    value={semester.id}
                                    className={`rounded-2xl text-xl font-heading font-black transition-all ${
                                        index === 0
                                            ? "data-[state=active]:bg-secondary data-[state=active]:text-navy"
                                            : "data-[state=active]:bg-primary data-[state=active]:text-white opacity-70 data-[state=active]:opacity-100"
                                    }`}
                                >
                                    {semester.name}
                                    <span className="hidden md:inline text-xs font-normal ml-2 opacity-70">
                                        ({format(semester.startDate, "MMM d")} - {format(semester.endDate, "MMM d")})
                                    </span>
                                </TabsTrigger>
                            ))}
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
                                            className={`w-full text-left px-4 py-2 rounded-xl font-bold transition-all ${
                                                selectedLocation === "all"
                                                    ? "bg-navy text-white"
                                                    : "hover:bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            All Locations
                                        </button>
                                        {locations?.map((loc) => (
                                            <button
                                                key={loc.id}
                                                onClick={() => setSelectedLocation(loc.id.toString())}
                                                className={`w-full text-left px-4 py-2 rounded-xl font-bold transition-all ${
                                                    selectedLocation === loc.id.toString()
                                                        ? "bg-navy text-white"
                                                        : "hover:bg-gray-100 text-gray-600"
                                                }`}
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
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Siblings under 6 months attend for FREE!
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Full session and drop-in rates available.
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" /> Mixed-age classes (birth to 5 years).
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content */}
                            {semesters.map((semester) => (
                                <TabsContent key={semester.id} value={semester.id} className="flex-grow m-0">
                                    <div className="grid gap-12">
                                        {classes?.map((cls) => {
                                            const classSessionsForSemester = filteredSessions.filter(
                                                (s) => s.classId === cls.id || s.class?.id === cls.id
                                            );

                                            return (
                                                <div
                                                    key={cls.id}
                                                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-b-8 border-navy/5"
                                                >
                                                    <div className="md:flex">
                                                        <div className="md:w-1/3 h-64 md:h-auto bg-gray-200 relative">
                                                            {cls.imageUrl ? (
                                                                <img
                                                                    src={cls.imageUrl}
                                                                    alt={cls.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
                                                                    <Music className="w-16 h-16 opacity-30" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-4 left-4 bg-secondary text-navy font-black px-4 py-1 rounded-full text-sm shadow-md">
                                                                {cls.ageRange}
                                                            </div>
                                                        </div>
                                                        <div className="md:w-2/3 p-8 md:p-12">
                                                            <h2 className="text-4xl font-heading font-black text-navy mb-4">
                                                                {cls.title}
                                                            </h2>
                                                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                                                {cls.description}
                                                            </p>

                                                            <div className="space-y-4">
                                                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                                    Available Sessions
                                                                </h3>
                                                                <div className="grid gap-3">
                                                                    {classSessionsForSemester.length > 0 ? (
                                                                        classSessionsForSemester.map((session) => (
                                                                            <div
                                                                                key={session.id}
                                                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all group"
                                                                            >
                                                                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                                                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                                                        <Clock className="w-6 h-6" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="font-bold text-navy">
                                                                                            {session.dayOfWeek} at {session.time}
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                                            <MapPin className="w-3 h-3" />{" "}
                                                                                            {session.location?.name} •{" "}
                                                                                            <span className="text-primary">
                                                                                                {session.instructor}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    <span
                                                                                        className={`text-xs font-black uppercase px-3 py-1 rounded-full ${getStatusColor(
                                                                                            session.status
                                                                                        )}`}
                                                                                    >
                                                                                        {session.status}
                                                                                    </span>
                                                                                    <a href={MAINSTREET_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                                                                                        <Button className="rounded-full font-black px-8">
                                                                                            {session.status === "Full"
                                                                                                ? "Join Waitlist"
                                                                                                : "Register"} <ExternalLink className="ml-2 w-3 h-3" />
                                                                                        </Button>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-gray-400 italic">
                                                                            No sessions available for this class/location.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                )}
            </div>
            </main>
            <Footer />
        </div>
    );
}
