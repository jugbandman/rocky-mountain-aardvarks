import { useApi } from "@/hooks/useApi";
import { Loader2, AlertCircle, BookOpen, Music, Heart, Users } from "lucide-react";
import { Link } from "wouter";
import type { PageContent, Teacher } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
    const { data: content, loading, error } = useApi<PageContent>("/content/our-story");
    const { data: teachers } = useApi<Teacher[]>("/teachers");

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-primary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Our Story</h1>
                        <p className="max-w-2xl mx-auto text-xl text-white/90">
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
            <div className="min-h-screen flex flex-col bg-white">
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
            <div className="min-h-screen flex flex-col bg-white">
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
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">{content.title}</h1>
                    <p className="max-w-2xl mx-auto text-xl text-white/90">
                        The journey of Rocky Mountain Aardvarks
                    </p>
                </section>

                {/* Content Section */}
                <section className="max-w-5xl mx-auto py-16 px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            { icon: Music, title: "Original Music", desc: "16 albums of songs that rock, not nursery rhymes" },
                            { icon: Heart, title: "Made for Families", desc: "Music that kids AND parents actually enjoy" },
                            { icon: Users, title: "Community Focused", desc: "Serving Denver & Boulder families since 2011" },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 bg-primary/5 rounded-2xl">
                                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-heading font-bold text-lg text-navy mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div
                        className="prose prose-lg max-w-none
                            prose-headings:font-heading prose-headings:text-navy prose-headings:mb-4 prose-headings:mt-8
                            prose-h2:text-3xl prose-h2:border-b prose-h2:border-secondary/30 prose-h2:pb-3
                            prose-h3:text-2xl prose-h3:text-primary
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-primary prose-a:no-underline hover:prose-a:text-accent hover:prose-a:underline
                            prose-strong:text-navy
                            prose-li:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />

                    {/* Meet Our Leader */}
                    {teachers && teachers.filter(t => t.active).length > 0 && (
                        <div className="mt-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img
                                        src={teachers.filter(t => t.active)[0]?.imageUrl || '/images/placeholder.jpg'}
                                        alt={teachers.filter(t => t.active)[0]?.name}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="p-8 md:w-2/3">
                                    <h3 className="text-2xl font-heading font-bold text-navy mb-2">
                                        Meet {teachers.filter(t => t.active)[0]?.name}
                                    </h3>
                                    <p className="text-accent font-bold mb-4">Director of Awesomeness</p>
                                    <p className="text-gray-700 leading-relaxed">
                                        {teachers.filter(t => t.active)[0]?.bio}
                                    </p>
                                    <Link href="/teachers">
                                        <button className="mt-6 text-primary font-bold hover:text-accent transition-colors">
                                            Learn more about our team →
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
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
