import { useApi } from "@/hooks/useApi";
import { Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Location } from "@shared/schema";

export default function Locations() {
    const { data: locations, loading } = useApi<Location[]>("/locations");

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-light">
            {/* Hero Section */}
            <section className="bg-red-500 text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-heading font-black mb-4">Find A Class Near You</h1>
                <p className="max-w-2xl mx-auto text-xl opacity-90">
                    We bring the rhythm to communities all across the Rocky Mountains. Find your closest location and join the band!
                </p>
            </section>

            {/* Locations List */}
            <section className="max-w-6xl mx-auto py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {locations?.map((location) => (
                        <div key={location.id} className="bg-white rounded-3xl p-8 shadow-xl flex gap-6 hover:shadow-2xl transition-all group">
                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-2xl font-heading font-black text-navy mb-2">{location.name}</h2>
                                <p className="text-lg text-gray-600 mb-6">{location.address}</p>
                                <div className="flex gap-4">
                                    <button className="bg-navy text-white px-6 py-2 rounded-full font-bold hover:bg-navy/80 transition-all">View Schedule</button>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" className="text-primary font-bold hover:underline flex items-center gap-1">Get Directions</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-4xl mx-auto bg-navy text-white rounded-[3rem] p-12 mb-20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-4xl font-heading font-black mb-6 text-secondary">Have Questions?</h2>
                        <p className="text-xl opacity-90 mb-8 font-medium">Not sure which location is best for you? Get in touch and we'll help you find the perfect class!</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-lg">
                                <Phone className="text-secondary" /> (303) 555-0123
                            </div>
                            <div className="flex items-center gap-4 text-lg">
                                <Mail className="text-secondary" /> hello@rockymountainaardvarks.com
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="text-secondary" /> Administrative Hours
                        </h3>
                        <div className="space-y-2 opacity-80 font-medium">
                            <div className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 5:00 PM</span></div>
                            <div className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 2:00 PM</span></div>
                            <div className="flex justify-between"><span>Sunday:</span> <span>Closed (Rocking Out!)</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
