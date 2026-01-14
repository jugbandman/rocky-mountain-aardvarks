import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import type { Teacher } from "@shared/schema";

export default function Teachers() {
    const { data: teachers, loading } = useApi<Teacher[]>("/teachers");

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-light">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-heading font-black mb-4">Meet Our Teachers</h1>
                <p className="max-w-2xl mx-auto text-xl opacity-90">
                    Our instructors are not just musicians, but passionate educators dedicated to making music fun and accessible for every child.
                </p>
            </section>

            {/* Teachers Grid */}
            <section className="max-w-7xl mx-auto py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {teachers?.filter(t => t.active)?.map((teacher) => (
                        <div key={teacher.id} className="flex flex-col items-center text-center group">
                            <div className="w-64 h-64 rounded-full overflow-hidden mb-6 border-8 border-secondary/20 group-hover:border-secondary/40 transition-all shadow-xl">
                                {teacher.imageUrl ? (
                                    <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Photo</div>
                                )}
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-navy mb-4">{teacher.name}</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p>{teacher.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-secondary/10 py-20 px-4 text-center">
                <h2 className="text-4xl font-heading font-black text-navy mb-6">Ready to make some noise?</h2>
                <p className="text-xl mb-8 max-w-xl mx-auto text-gray-700">Join a class today and experience the magic of Rocky Mountain Aardvarks!</p>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all">
                    Find a Class
                </button>
            </section>
        </div>
    );
}
