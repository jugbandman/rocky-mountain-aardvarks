import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Music, Star, Calendar, MapPin, ArrowRight, PlayCircle, Loader2 } from "lucide-react";
import AngledDivider from "@/components/AngledDivider";
import { useApi } from "@/hooks/useApi";
import type { Session, Testimonial } from "@shared/schema";

export default function Home() {
  const { data: testimonials, loading: testimonialsLoading } = useApi<Testimonial[]>("/testimonials");
  const { data: sessions, loading: sessionsLoading } = useApi<Session[]>("/sessions");

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-secondary font-bold text-sm mb-6 border border-white/10">
                  <Star className="w-4 h-4 fill-secondary" />
                  <span>Voted Family Favorite 2024</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-black text-white leading-tight mb-6 tracking-tight">
                  Kids Music That <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">ROCKS!</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                  Original, funky, and fun music classes for babies, toddlers, and preschoolers in Denver & Boulder. Join the band today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/classes">
                    <Button className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                      Find a Class
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-full backdrop-blur-sm">
                    <PlayCircle className="mr-2 w-5 h-5" />
                    Watch Video
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/photo-group-1.jpg"
                    alt="Rocky Mountain Aardvarks class fun"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-bold text-lg">Hank Williams</p>
                    <p className="text-sm opacity-80">Director of Awesomeness</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <a
                  href="https://music.apple.com/us/artist/rocky-mountain-aardvarks/456184985"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce duration-[3000ms] hover:scale-110 transition-transform cursor-pointer group"
                  title="Listen to our music!"
                >
                  <Music className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Listen Now!
                  </div>
                </a>
                <div className="absolute -bottom-8 -left-8 w-full h-full border-4 border-secondary/30 rounded-3xl -z-10 rotate-6"></div>
              </div>
            </div>
          </div>
          <AngledDivider position="bottom" color="text-white" />
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold text-primary mb-4">Not Your Average Music Class</h2>
              <p className="text-lg text-gray-600">
                We don't just sing "The Wheels on the Bus." Our songs are original, intelligent, and irresistibly appealing to both kids and parents.
              </p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="rounded-3xl overflow-hidden shadow-lg h-64 md:h-80">
                <img src="/photo-group-1.jpg" alt="Group music class fun" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg h-64 md:h-80">
                <img src="/photo-close.jpg" alt="Guitar playing with kids" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Original Music",
                  desc: "16 albums of original rock, blues, folk, and pop songs that reflect the lives of modern kids.",
                  icon: <Music className="w-8 h-8 text-white" />,
                  color: "bg-primary"
                },
                {
                  title: "Real Instruments",
                  desc: "Kids get hands-on with shakers, drums, and more while jamming with live guitar accompaniment.",
                  icon: <Star className="w-8 h-8 text-white" />,
                  color: "bg-accent"
                },
                {
                  title: "Developmental Fun",
                  desc: "Improves balance, coordination, and social skills through dancing and musical storytelling.",
                  icon: <Calendar className="w-8 h-8 text-primary" />,
                  color: "bg-secondary"
                }
              ].map((feature, index) => (
                <div key={index} className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Classes Preview Section */}
        <section className="py-24 bg-brand-light relative overflow-hidden">
          <AngledDivider position="top" color="text-white" flip />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-heading font-bold text-primary mb-4">Upcoming Sessions</h2>
                <p className="text-lg text-gray-600 max-w-xl">
                  Join us for our next session of singing, dancing, and jamming!
                </p>
              </div>
              <Link href="/classes">
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-full px-6">
                  View Full Schedule <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {sessionsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions?.slice(0, 3).map((cls, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {cls.status}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${cls.status === 'Open' ? 'bg-green-100 text-green-700' :
                        cls.status === 'Waitlist' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {cls.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">{(cls as any).location?.name || 'Varies'}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{cls.dayOfWeek} {cls.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                      <Star className="w-4 h-4" />
                      <span>with {cls.instructor}</span>
                    </div>
                    <Link href="/classes">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl mt-4">
                        Register
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-primary text-white relative">
          <AngledDivider position="top" color="text-brand-light" />
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-heading font-bold mb-16">Don't Take Our Word For It</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialsLoading ? (
                <div className="col-span-3 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              ) : (
                testimonials?.slice(0, 3).map((t, i) => (
                  <div key={i} className={`bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 ${i === 1 ? 'transform md:-translate-y-4' : ''}`}>
                    <div className="flex justify-center mb-6">
                      {[...Array(t.stars || 5)].map((_, i) => <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />)}
                    </div>
                    <p className="text-lg italic mb-6 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <p className="font-bold text-secondary">— {t.author}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <AngledDivider position="bottom" color="text-white" flip />
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-5xl font-heading font-black text-primary mb-6">Ready to Rock?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Join the coolest music class in town. Spaces fill up fast, so grab your spot today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-accent hover:bg-accent/90 text-white font-bold text-xl px-10 py-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                Register Now
              </Button>
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 font-bold text-xl px-10 py-8 rounded-full">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
