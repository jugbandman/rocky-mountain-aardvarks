import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MAINSTREET_BOOKING_URL } from "@/lib/constants";

interface Session {
    id: number;
    dayOfWeek: string;
    time: string;
    instructor: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
    locationName?: string;
    sessionName?: string;
    mainstreetUrl?: string;
    location?: { id: number; name: string } | null;
}

interface ClassCalendarProps {
    sessions: Session[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

// Location colors
const LOCATION_COLORS: Record<string, { bg: string; dot: string; text: string }> = {
    "wash park": { bg: "bg-blue-100", dot: "bg-blue-500", text: "text-blue-700" },
    "cherry creek": { bg: "bg-pink-100", dot: "bg-pink-500", text: "text-pink-700" },
    "cherry hills": { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700" },
    "default": { bg: "bg-gray-100", dot: "bg-gray-500", text: "text-gray-700" },
};

function getLocationColor(locationName: string | undefined) {
    if (!locationName) return LOCATION_COLORS.default;
    const lower = locationName.toLowerCase();
    if (lower.includes("wash park")) return LOCATION_COLORS["wash park"];
    if (lower.includes("cherry creek")) return LOCATION_COLORS["cherry creek"];
    if (lower.includes("cherry hills") || lower.includes("university")) return LOCATION_COLORS["cherry hills"];
    return LOCATION_COLORS.default;
}

function getDayOfWeekIndex(day: string): number {
    const days: Record<string, number> = {
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
        thursday: 4, friday: 5, saturday: 6
    };
    return days[day.toLowerCase()] ?? -1;
}

export function ClassCalendar({ sessions }: ClassCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Get calendar days for current month
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: (Date | null)[] = [];

        // Padding for days before month starts
        for (let i = 0; i < startPad; i++) {
            days.push(null);
        }

        // Days of the month
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    // Get sessions for a specific date
    const getSessionsForDate = (date: Date): Session[] => {
        const dayOfWeek = DAYS[date.getDay()];

        return sessions.filter(session => {
            const sessionDayIndex = getDayOfWeekIndex(session.dayOfWeek);
            if (sessionDayIndex !== date.getDay()) return false;

            const startDate = new Date(session.startDate);
            const endDate = new Date(session.endDate);

            return date >= startDate && date <= endDate;
        });
    };

    // Get unique locations for a date (for dots)
    const getLocationsForDate = (date: Date): string[] => {
        const daySessions = getSessionsForDate(date);
        const locations = new Set<string>();
        daySessions.forEach(s => {
            const loc = s.locationName || s.location?.name || "";
            if (loc) locations.add(loc);
        });
        return Array.from(locations);
    };

    const handleDayClick = (date: Date) => {
        const daySessions = getSessionsForDate(date);
        if (daySessions.length > 0) {
            setSelectedDay(date);
            setShowModal(true);
        }
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const selectedDaySessions = selectedDay ? getSessionsForDate(selectedDay) : [];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-navy">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-sm font-bold text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => {
                    if (!date) {
                        return <div key={`empty-${idx}`} className="h-16" />;
                    }

                    const locations = getLocationsForDate(date);
                    const hasClasses = locations.length > 0;
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => handleDayClick(date)}
                            disabled={!hasClasses}
                            className={`h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                                hasClasses
                                    ? "hover:bg-primary/10 cursor-pointer"
                                    : "cursor-default"
                            } ${isToday ? "ring-2 ring-primary" : ""}`}
                        >
                            <span className={`text-sm ${isToday ? "font-bold text-primary" : "text-gray-700"}`}>
                                {date.getDate()}
                            </span>
                            {hasClasses && (
                                <div className="flex gap-1 mt-1">
                                    {locations.slice(0, 3).map((loc, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${getLocationColor(loc).dot}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">Wash Park</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-sm text-gray-600">Cherry Creek</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Cherry Hills</span>
                </div>
            </div>

            {/* Day detail modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDay && (
                                <span>
                                    {DAYS[selectedDay.getDay()]}, {MONTHS[selectedDay.getMonth()]} {selectedDay.getDate()}
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {selectedDaySessions.map(session => {
                            const locName = session.locationName || session.location?.name || "Location TBD";
                            const colors = getLocationColor(locName);

                            return (
                                <div
                                    key={session.id}
                                    className={`p-4 rounded-xl ${colors.bg}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`w-4 h-4 ${colors.text}`} />
                                        <span className={`font-bold ${colors.text}`}>{session.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className={`w-4 h-4 ${colors.text}`} />
                                        <span className={colors.text}>{locName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className={`w-4 h-4 ${colors.text}`} />
                                        <span className={colors.text}>{session.instructor}</span>
                                    </div>
                                    <a
                                        href={session.mainstreetUrl || MAINSTREET_BOOKING_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full" size="sm">
                                            Register →
                                        </Button>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
