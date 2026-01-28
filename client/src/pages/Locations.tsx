import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Loader2, MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LeafletMap } from "@/components/LeafletMap";

export default function Locations() {
    const { data: locations, loading, error } = useApi<Location[]>("/locations");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-accent text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Find A Class Near You</h1>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading locations...</span>
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
                <main className="flex-grow">
                    <section className="bg-accent text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Find A Class Near You</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load locations. Please try again later.</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const activeLocations = locations || [];
    const locationsWithCoords = activeLocations.filter(l => l.lat && l.lng);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-accent text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">Find A Class Near You</h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90">
                        We bring the rhythm to communities all across the Rocky Mountains. Find your closest location and join the band!
                    </p>
                </section>

                {/* Map Section */}
                {locationsWithCoords.length > 0 && (
                    <section className="max-w-6xl mx-auto py-8 px-4">
                        <div className="rounded-3xl overflow-hidden shadow-xl">
                            <LeafletMap
                                locations={activeLocations}
                                onLocationClick={handleLocationClick}
                            />
                        </div>
                    </section>
                )}

                {/* Locations List */}
                <section className="max-w-6xl mx-auto py-16 px-4">
                    {activeLocations.length === 0 ? (
                        <div className="text-center py-12">
                            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No locations available at this time.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeLocations.map((location) => (
                                <div
                                    key={location.id}
                                    className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex gap-6 hover:shadow-2xl transition-all group cursor-pointer ${
                                        selectedLocation?.id === location.id ? 'ring-2 ring-accent ring-offset-2' : ''
                                    }`}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                        selectedLocation?.id === location.id
                                            ? 'bg-accent text-white'
                                            : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
                                    }`}>
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-heading font-black text-primary mb-2">{location.name}</h2>
                                        <p className="text-lg text-gray-600 mb-6">{location.address}</p>
                                        <div className="flex gap-4 flex-wrap">
                                            <Link href="/classes" onClick={(e) => e.stopPropagation()}>
                                                <button className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary/80 transition-all">
                                                    View Schedule
                                                </button>
                                            </Link>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent font-bold hover:underline flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Contact Section */}
                <section className="max-w-4xl mx-auto bg-primary text-white rounded-[3rem] p-12 mb-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-4xl font-heading font-black mb-6 text-secondary">Have Questions?</h2>
                            <p className="text-xl text-blue-100 mb-8 font-medium">
                                Not sure which location is best for you? Get in touch and we'll help you find the perfect class!
                            </p>
                            <div className="space-y-4 text-blue-100">
                                <div className="flex items-center gap-4 text-lg">
                                    <Phone className="text-secondary" /> 720-515-VARK (8275)
                                </div>
                                <div className="flex items-center gap-4 text-lg">
                                    <Mail className="text-secondary" /> hank@rockymtnaardvarks.com
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="text-secondary" /> Administrative Hours
                            </h3>
                            <div className="space-y-2 text-blue-100 font-medium">
                                <div className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 5:00 PM</span></div>
                                <div className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 2:00 PM</span></div>
                                <div className="flex justify-between"><span>Sunday:</span> <span>Closed (Rocking Out!)</span></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
