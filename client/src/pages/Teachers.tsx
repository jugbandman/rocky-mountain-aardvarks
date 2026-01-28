import { useApi } from "@/hooks/useApi";
import { Loader2, AlertCircle, User } from "lucide-react";
import { Link } from "wouter";
import type { Teacher } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Teachers() {
    const { data: teachers, loading, error } = useApi<Teacher[]>("/teachers");

    // Filter active teachers and sort by displayOrder
    const activeTeachers = teachers
        ?.filter((t) => t.active)
        ?.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow">
                    <section className="bg-primary text-white py-20 px-4 text-center">
                        <h1 className="text-5xl font-heading font-black mb-4">Meet Our Teachers</h1>
                        <p className="max-w-2xl mx-auto text-xl text-white/90">
                            Our instructors are not just musicians, but passionate educators dedicated to making music fun and accessible for every child.
                        </p>
                    </section>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading teachers...</span>
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
                        <h1 className="text-5xl font-heading font-black mb-4">Meet Our Teachers</h1>
                    </section>
                    <div className="max-w-2xl mx-auto py-20 px-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Unable to load teachers. Please try again later.</span>
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
            <section className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-heading font-black mb-4">Meet Our Teachers</h1>
                <p className="max-w-2xl mx-auto text-xl text-white/90">
                    Our instructors are not just musicians, but passionate educators dedicated to making music fun and accessible for every child.
                </p>
            </section>

            {/* Teachers Grid */}
            <section className="max-w-7xl mx-auto py-16 px-4">
                {activeTeachers && activeTeachers.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No teachers to display at this time.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-12">
                        {activeTeachers?.map((teacher) => (
                            <div key={teacher.id} className="flex flex-col items-center text-center group max-w-sm">
                                <div className="w-64 h-64 rounded-full overflow-hidden mb-6 border-8 border-secondary/20 group-hover:border-secondary/40 transition-all shadow-xl">
                                    {teacher.imageUrl ? (
                                        <img
                                            src={teacher.imageUrl}
                                            alt={teacher.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-24 h-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                                    {teacher.name}
                                </h2>
                                <div className="prose prose-lg text-gray-600">
                                    <p>{teacher.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="bg-secondary/10 py-20 px-4 text-center">
                <h2 className="text-4xl font-heading font-black text-navy mb-6">
                    Ready to make some noise?
                </h2>
                <p className="text-xl mb-8 max-w-xl mx-auto text-gray-700">
                    Join a class today and experience the magic of Rocky Mountain Aardvarks!
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
