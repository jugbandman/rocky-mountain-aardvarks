import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes", path: "/classes" },
    { name: "Teachers", path: "/teachers" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Locations", path: "/locations" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-primary group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="Rocky Mountain Aardvarks Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl leading-none text-primary tracking-tight">
                Rocky Mountain
              </span>
              <span className="font-heading font-black text-2xl leading-none text-accent tracking-wide">
                AARDVARKS
              </span>
            </div>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`text-sm font-bold transition-colors hover:text-accent ${isActive(item.path) ? "text-primary" : "text-gray-600"
                  }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Register Now
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col gap-8 mt-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-heading font-bold text-lg text-primary">RM Aardvarks</span>
                </div>

                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <a
                        className={`text-lg font-bold py-2 border-b border-gray-100 transition-colors ${isActive(item.path) ? "text-accent" : "text-gray-600"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-full py-6 text-lg shadow-md mt-4">
                  Register Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
