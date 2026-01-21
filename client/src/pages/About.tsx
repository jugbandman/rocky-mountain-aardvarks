import { useApi } from "@/hooks/useApi";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { PageContent } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
    const { data: content, loading, error } = useApi<PageContent>("/content/our-story");

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-light">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-primary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Our Story</h1>
                        <p className="max-w-2xl mx-auto text-xl opacity-90">
                            The journey of Rocky Mountain Aardvarks
                        </p>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading...</span>
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
                    <section className="bg-primary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Our Story</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load content. Please try again later.</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // If no content exists for our-story slug
    if (!content) {
        return (
            <div className="min-h-screen flex flex-col bg-light">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-primary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Our Story</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Content coming soon.</p>
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
                <section className="bg-primary text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">{content.title}</h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90">
                        The journey of Rocky Mountain Aardvarks
                    </p>
                </section>

                {/* Content Section */}
                <section className="max-w-4xl mx-auto py-16 px-4">
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-accent"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                </section>

                {/* CTA */}
                <section className="bg-secondary/10 py-20 px-4 text-center">
                    <h2 className="text-4xl font-heading font-black text-navy mb-6">
                        Join Our Musical Family
                    </h2>
                    <p className="text-xl mb-8 max-w-xl mx-auto text-gray-700">
                        Experience the magic of music with your little ones at Rocky Mountain Aardvarks!
                    </p>
                    <Link href="/classes">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all">
                            Find a Class
                        </button>
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}
