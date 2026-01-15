import { useApi } from "@/hooks/useApi";
import { Loader2, Star, Quote, AlertCircle } from "lucide-react";
import type { Testimonial } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Testimonials() {
    const { data: testimonials, loading, error } = useApi<Testimonial[]>("/testimonials");

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-light">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-secondary text-navy py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">What Families Are Saying</h1>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading testimonials...</span>
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
                    <section className="bg-secondary text-navy py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">What Families Are Saying</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load testimonials. Please try again later.</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-light">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-secondary text-navy py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">What Families Are Saying</h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90 font-medium">
                        Music transforms lives. Here's how Rocky Mountain Aardvarks has impacted our community of music-making families.
                    </p>
                </section>

                {/* Testimonials Grid */}
                <section className="max-w-7xl mx-auto py-16 px-4">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {testimonials?.filter(t => t.active)?.map((testimonial) => (
                            <div key={testimonial.id} className="break-inside-avoid bg-white p-8 rounded-3xl shadow-lg border-b-8 border-primary/20 hover:border-primary/40 transition-all">
                                <div className="flex gap-1 text-yellow-500 mb-4">
                                    {[...Array(testimonial.stars || 5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <Quote className="text-primary/20 w-12 h-12 mb-4" />
                                <p className="text-xl italic text-gray-700 leading-relaxed mb-6">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="font-heading font-bold text-navy text-lg">— {testimonial.author}</div>
                                    {testimonial.source && <span className="text-sm text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">{testimonial.source}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats/Badges Section */}
                <section className="bg-navy text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="text-5xl font-heading font-black text-secondary mb-2">500+</div>
                            <p className="text-lg opacity-80 font-bold uppercase tracking-wider">Families Served</p>
                        </div>
                        <div>
                            <div className="text-5xl font-heading font-black text-secondary mb-2">4.9/5</div>
                            <p className="text-lg opacity-80 font-bold uppercase tracking-wider">Google Rating</p>
                        </div>
                        <div>
                            <div className="text-5xl font-heading font-black text-secondary mb-2">10+</div>
                            <p className="text-lg opacity-80 font-bold uppercase tracking-wider">Years of Joy</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
