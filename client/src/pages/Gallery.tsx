import { useApi } from "@/hooks/useApi";
import { useState, useMemo } from "react";
import { Loader2, AlertCircle, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CATEGORIES = ["All", "Classes", "Parties", "Events"] as const;
type Category = (typeof CATEGORIES)[number];

export default function Gallery() {
    const { data: photos, loading, error } = useApi<Photo[]>("/photos");
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

    // Filter photos by category
    const filteredPhotos = useMemo(() => {
        if (!photos) return [];
        if (selectedCategory === "All") return photos;
        return photos.filter((photo) => photo.category === selectedCategory);
    }, [photos, selectedCategory]);

    // Sort by displayOrder
    const sortedPhotos = useMemo(() => {
        return [...filteredPhotos].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    }, [filteredPhotos]);

    // Get current photo index for navigation
    const currentIndex = lightboxPhoto
        ? sortedPhotos.findIndex((p) => p.id === lightboxPhoto.id)
        : -1;

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setLightboxPhoto(sortedPhotos[currentIndex - 1]);
        }
    };

    const goToNext = () => {
        if (currentIndex < sortedPhotos.length - 1) {
            setLightboxPhoto(sortedPhotos[currentIndex + 1]);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-secondary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Photo Gallery</h1>
                        <p className="max-w-2xl mx-auto text-xl opacity-90">
                            Capturing the joy of music and movement
                        </p>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading photos...</span>
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
                    <section className="bg-secondary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Photo Gallery</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load photos. Please try again later.</span>
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
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-secondary text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">Photo Gallery</h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90">
                        Capturing the joy of music and movement
                    </p>
                </section>

                {/* Category Tabs */}
                <section className="max-w-6xl mx-auto py-8 px-4">
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
                                    selectedCategory === category
                                        ? "bg-primary text-white shadow-lg"
                                        : "bg-white text-gray-600 hover:bg-gray-100 shadow"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Photo Grid */}
                    {sortedPhotos.length === 0 ? (
                        <div className="text-center py-20">
                            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {selectedCategory === "All"
                                    ? "No photos available yet."
                                    : `No photos in ${selectedCategory} yet.`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {sortedPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all aspect-square"
                                    onClick={() => setLightboxPhoto(photo)}
                                >
                                    <img
                                        src={photo.imageUrl}
                                        alt={photo.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h3 className="font-bold text-lg">{photo.title}</h3>
                                            {photo.description && (
                                                <p className="text-sm opacity-90 line-clamp-2">
                                                    {photo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                                        {photo.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA */}
                {photos && photos.length > 0 && (
                    <section className="bg-primary/10 py-16 px-4 text-center">
                        <h2 className="text-3xl font-heading font-black text-navy mb-4">
                            Want to be part of the fun?
                        </h2>
                        <p className="text-lg mb-6 text-gray-700 max-w-xl mx-auto">
                            Join a class and create memories that last a lifetime!
                        </p>
                        <a
                            href="/classes"
                            className="inline-block bg-accent hover:bg-accent/90 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all"
                        >
                            Find a Class
                        </a>
                    </section>
                )}
            </main>

            {/* Lightbox Dialog */}
            <Dialog open={!!lightboxPhoto} onOpenChange={() => setLightboxPhoto(null)}>
                <DialogContent
                    className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-none"
                    showCloseButton={false}
                    onKeyDown={handleKeyDown}
                >
                    {lightboxPhoto && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Close button */}
                            <button
                                onClick={() => setLightboxPhoto(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Previous button */}
                            {currentIndex > 0 && (
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                            )}

                            {/* Image */}
                            <img
                                src={lightboxPhoto.imageUrl}
                                alt={lightboxPhoto.title}
                                className="max-w-full max-h-[80vh] object-contain"
                            />

                            {/* Next button */}
                            {currentIndex < sortedPhotos.length - 1 && (
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            )}

                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="font-heading font-bold text-2xl mb-1">
                                    {lightboxPhoto.title}
                                </h3>
                                {lightboxPhoto.description && (
                                    <p className="text-white/80">{lightboxPhoto.description}</p>
                                )}
                                <p className="text-sm text-white/60 mt-2">
                                    {currentIndex + 1} of {sortedPhotos.length} • {lightboxPhoto.category}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
