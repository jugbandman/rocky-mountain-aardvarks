import { useState } from "react";
import { Link } from "wouter";
import { Facebook, Instagram, Mail, Phone, CheckCircle, Loader2 } from "lucide-react";
import AngledDivider from "@/components/AngledDivider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
      } else {
        const data = await response.json() as { error?: string; alreadySubscribed?: boolean };
        if (data.alreadySubscribed) {
          setError("You're already subscribed!");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <footer className="bg-primary text-white pt-16 pb-8 mt-auto relative">
      <AngledDivider position="top" color="text-white" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-none">Rocky Mountain</span>
                <span className="font-heading font-black text-xl leading-none text-secondary">AARDVARKS</span>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Original, funky, and fun music classes for babies, toddlers, and preschoolers in Denver & Boulder.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-secondary">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/"><a className="text-blue-100 hover:text-white transition-colors">Home</a></Link></li>
              <li><Link href="/classes"><a className="text-blue-100 hover:text-white transition-colors">Our Classes</a></Link></li>
              <li><Link href="/teachers"><a className="text-blue-100 hover:text-white transition-colors">Our Teachers</a></Link></li>
              <li><Link href="/testimonials"><a className="text-blue-100 hover:text-white transition-colors">Testimonials</a></Link></li>
              <li><Link href="/locations"><a className="text-blue-100 hover:text-white transition-colors">Locations</a></Link></li>
              <li><Link href="/parties"><a className="text-blue-100 hover:text-white transition-colors">Birthday Parties</a></Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-secondary">Locations</h3>
            <ul className="space-y-4">
              <li className="text-blue-100 text-sm">
                <strong className="block text-white mb-1">Washington Park</strong>
                Epiphany Lutheran Church<br />
                790 S. Corona St. Denver, CO
              </li>
              <li className="text-blue-100 text-sm">
                <strong className="block text-white mb-1">Cherry Creek Dance</strong>
                2625 E. 3rd Ave.<br />
                Denver, CO
              </li>
              <li className="text-blue-100 text-sm">
                <strong className="block text-white mb-1">Cherry Hills/University</strong>
                Family Care Collective<br />
                3021 S University Blvd Denver, CO
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-secondary">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-blue-100">
                <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <a href="mailto:hank@rockymtnaardvarks.com" className="hover:text-white transition-colors">hank@rockymtnaardvarks.com</a>
              </li>
              <li className="flex items-start gap-3 text-blue-100">
                <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <a href="tel:7205158275" className="hover:text-white transition-colors">720-515-VARK (8275)</a>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h4 className="font-heading font-bold text-lg mb-3 text-secondary">Newsletter</h4>
              <p className="text-blue-100 text-sm mb-4">
                Stay updated on classes, events, and special offers!
              </p>
              {isSuccess ? (
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-secondary"
                  />
                  {error && (
                    <p className="text-red-300 text-sm">{error}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} Rocky Mountain Aardvarks. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms"><a className="hover:text-white transition-colors">Terms & Conditions</a></Link>
            <Link href="/privacy"><a className="hover:text-white transition-colors">Privacy Policy</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
