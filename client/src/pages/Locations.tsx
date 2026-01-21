import { useApi } from "@/hooks/useApi";
import { useState, useRef } from "react";
import { Loader2, MapPin, Phone, Mail, Clock, AlertCircle, X } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";

// Denver area center for map default
const DENVER_CENTER = { lat: 39.7392, lng: -104.9903 };

export default function Locations() {
    const { data: locations, loading, error } = useApi<Location[]>("/locations");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    const handleMapReady = (map: google.maps.Map) => {
        mapRef.current = map;
        addMarkersToMap(map);
    };

    const addMarkersToMap = (map: google.maps.Map) => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.map = null);
        markersRef.current = [];

        if (!locations || locations.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        let hasValidCoords = false;

        locations.forEach((location) => {
            if (location.lat && location.lng) {
                hasValidCoords = true;
                const position = { lat: location.lat, lng: location.lng };
                bounds.extend(position);

                // Create custom marker content
                const markerContent = document.createElement('div');
                markerContent.innerHTML = `
                    <div class="bg-primary text-white px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span class="font-bold text-sm whitespace-nowrap">${location.name}</span>
                    </div>
                `;

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position,
                    title: location.name,
                    content: markerContent,
                });

                marker.addListener('click', () => {
                    setSelectedLocation(location);
                    map.panTo(position);
                });

                markersRef.current.push(marker);
            }
        });

        // Fit bounds if we have valid coordinates
        if (hasValidCoords && markersRef.current.length > 0) {
            if (markersRef.current.length === 1) {
                // Single location - just center on it
                map.setCenter(bounds.getCenter());
                map.setZoom(14);
            } else {
                map.fitBounds(bounds, 50);
            }
        }
    };

    // Re-add markers when locations change
    if (mapRef.current && locations && !loading) {
        addMarkersToMap(mapRef.current);
    }

    const handleLocationCardClick = (location: Location) => {
        setSelectedLocation(location);
        if (mapRef.current && location.lat && location.lng) {
            mapRef.current.panTo({ lat: location.lat, lng: location.lng });
            mapRef.current.setZoom(15);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-light">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-red-500 text-white py-20 px-4 text-center">
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
            <div className="min-h-screen flex flex-col bg-light">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-red-500 text-white py-20 px-4 text-center">
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

    // All locations from API are assumed active
    const activeLocations = locations;
    // Check if any locations have coordinates for the map
    const locationsWithCoords = activeLocations?.filter(l => l.lat && l.lng) || [];

    return (
        <div className="min-h-screen flex flex-col bg-light">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-red-500 text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">Find A Class Near You</h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90">
                        We bring the rhythm to communities all across the Rocky Mountains. Find your closest location and join the band!
                    </p>
                </section>

                {/* Google Map Section */}
                {locationsWithCoords.length > 0 && (
                    <section className="max-w-6xl mx-auto py-8 px-4">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                            <MapView
                                className="h-[400px] md:h-[500px]"
                                initialCenter={
                                    locationsWithCoords[0]?.lat && locationsWithCoords[0]?.lng
                                        ? { lat: locationsWithCoords[0].lat, lng: locationsWithCoords[0].lng }
                                        : DENVER_CENTER
                                }
                                initialZoom={11}
                                onMapReady={handleMapReady}
                            />
                            {/* Selected location popup overlay */}
                            {selectedLocation && (
                                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-2xl p-4 z-10">
                                    <button
                                        onClick={() => setSelectedLocation(null)}
                                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <h3 className="text-xl font-heading font-bold text-navy mb-2 pr-6">{selectedLocation.name}</h3>
                                    <p className="text-gray-600 mb-4">{selectedLocation.address}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Link href="/classes">
                                            <button className="bg-navy text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-navy/80 transition-all">
                                                View Schedule
                                            </button>
                                        </Link>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/80 transition-all"
                                        >
                                            Get Directions
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Locations List */}
                <section className="max-w-6xl mx-auto py-16 px-4">
                    {activeLocations && activeLocations.length === 0 ? (
                        <div className="text-center py-12">
                            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No locations available at this time.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeLocations?.map((location) => (
                                <div
                                    key={location.id}
                                    className={`bg-white rounded-3xl p-8 shadow-xl flex gap-6 hover:shadow-2xl transition-all group cursor-pointer ${
                                        selectedLocation?.id === location.id ? 'ring-2 ring-primary ring-offset-2' : ''
                                    }`}
                                    onClick={() => handleLocationCardClick(location)}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                        selectedLocation?.id === location.id
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 group-hover:bg-primary group-hover:text-white'
                                    }`}>
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-heading font-black text-navy mb-2">{location.name}</h2>
                                        <p className="text-lg text-gray-600 mb-6">{location.address}</p>
                                        <div className="flex gap-4 flex-wrap">
                                            <Link href="/classes" onClick={(e) => e.stopPropagation()}>
                                                <button className="bg-navy text-white px-6 py-2 rounded-full font-bold hover:bg-navy/80 transition-all">
                                                    View Schedule
                                                </button>
                                            </Link>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary font-bold hover:underline flex items-center gap-1"
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
                <section className="max-w-4xl mx-auto bg-navy text-white rounded-[3rem] p-12 mb-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-4xl font-heading font-black mb-6 text-secondary">Have Questions?</h2>
                            <p className="text-xl opacity-90 mb-8 font-medium">
                                Not sure which location is best for you? Get in touch and we'll help you find the perfect class!
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-lg">
                                    <Phone className="text-secondary" /> 720-515-VARK (8275)
                                </div>
                                <div className="flex items-center gap-4 text-lg">
                                    <Mail className="text-secondary" /> hank@rockymtnaardvarks.com
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
            </main>
            <Footer />
        </div>
    );
}
