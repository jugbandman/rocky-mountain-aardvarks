import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Music, Users, Clock, Gift, PartyPopper, Star, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

const partyFeatures = [
    {
        icon: Clock,
        title: "45 Minutes of Fun",
        description: "Non-stop musical entertainment that keeps kids engaged from start to finish",
    },
    {
        icon: Users,
        title: "Up to 20 Kids",
        description: "Perfect for birthday parties of all sizes, from intimate gatherings to big celebrations",
    },
    {
        icon: Music,
        title: "All Instruments Included",
        description: "Shakers, drums, guitars, scarves, and more provided for every child",
    },
    {
        icon: Gift,
        title: "We Come to You",
        description: "In-home entertainment at your location, indoors or outdoors",
    },
];

const partyHighlights = [
    "Mix of original Aardvarks songs, kids' classics, and kid-friendly rock-n-roll",
    "Interactive musical games and dance activities",
    "Age-appropriate for mixed groups (babies to 8-year-olds)",
    "Parents get to relax while kids rock out together",
    "Memorable experience that adults enjoy too",
];

const testimonials = [
    {
        quote: "Not only did my son have such a great time, but all of the kids ages 4 months to 6 years old had a great time jamming out! The highlight was seeing children in music bliss and adults learning how to be childlike again.",
        author: "Birthday Party Parent",
    },
    {
        quote: "After seeing how much Wyatt enjoys his weekly music class, we decided to book Rocky Mountain Aardvarks for his 2nd birthday party. It gave the parents an opportunity to relax and enjoy the moments while all of the kids could rock out together.",
        author: "Wyatt's Mom",
    },
    {
        quote: "If I could give 10 stars I would! The music, team and atmosphere they provided was top notch!",
        author: "Nicole R.",
    },
];

export default function Parties() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-accent text-white py-20 px-4 text-center relative overflow-hidden">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 p-4 rounded-full">
                                <PartyPopper className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">
                            Birthday Parties
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl opacity-90">
                            Give your little one the most rockin' birthday party in Denver!
                            Live music, instruments for everyone, and memories that last forever.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-6xl mx-auto py-16 px-4">
                    <h2 className="text-3xl font-heading font-bold text-center text-primary mb-12">
                        What's Included
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partyFeatures.map((feature, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-lg text-primary mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-primary/5 py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-heading font-bold text-center text-primary mb-12">
                            The Party Experience
                        </h2>
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <ul className="space-y-4">
                                {partyHighlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="bg-secondary w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Star className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="max-w-6xl mx-auto py-16 px-4">
                    <h2 className="text-3xl font-heading font-bold text-center text-primary mb-12">
                        Party Reviews
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                                    <p className="font-bold text-primary text-sm">- {testimonial.author}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Ready to Book?
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Contact Hank to check availability and discuss your party details.
                            We book up quickly, especially on weekends!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <a href="tel:720-515-8275">
                                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full px-8">
                                    <Phone className="w-5 h-5 mr-2" />
                                    (720) 515-VARK
                                </Button>
                            </a>
                            <a href="mailto:hank@rockymtnaardvarks.com">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold rounded-full px-8">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Email Hank
                                </Button>
                            </a>
                        </div>
                        <p className="text-sm opacity-75">
                            Or use our{" "}
                            <Link href="/contact">
                                <a className="underline hover:no-underline">contact form</a>
                            </Link>
                            {" "}and select "Birthday Parties"
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
