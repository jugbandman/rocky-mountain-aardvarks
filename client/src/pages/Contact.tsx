import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Phone, Mail, MapPin, CheckCircle, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    inquiryType: z.enum(["general", "classes", "parties", "registration", "other"], {
        message: "Please select an inquiry type",
    }),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "classes", label: "Class Information" },
    { value: "parties", label: "Birthday Parties" },
    { value: "registration", label: "Registration Help" },
    { value: "other", label: "Other" },
];

export default function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            inquiryType: undefined,
            message: "",
        },
    });

    async function onSubmit(data: ContactForm) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
            } else {
                const result = await response.json() as { error?: string };
                setError(result.error || "Failed to send message. Please try again.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary text-white py-20 px-4 text-center">
                    <h1 className="text-5xl font-heading font-black mb-4">Contact Us</h1>
                    <p className="max-w-2xl mx-auto text-xl text-white/90">
                        Have questions? We'd love to hear from you!
                    </p>
                </section>

                {/* Content Section */}
                <section className="max-w-6xl mx-auto py-16 px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-navy mb-6">
                                Get in Touch
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Whether you have questions about our classes, want to book a birthday party,
                                or just want to say hello, we're here to help!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy">Phone</h3>
                                        <a
                                            href="tel:720-515-8275"
                                            className="text-primary hover:text-accent transition-colors text-lg"
                                        >
                                            (720) 515-8275
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Call or text anytime!
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy">Email</h3>
                                        <a
                                            href="mailto:hank@rockymtnaardvarks.com"
                                            className="text-primary hover:text-accent transition-colors"
                                        >
                                            hank@rockymtnaardvarks.com
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy">Locations</h3>
                                        <p className="text-gray-600">
                                            Classes throughout Denver & Boulder
                                        </p>
                                        <a
                                            href="/locations"
                                            className="text-primary hover:text-accent transition-colors text-sm"
                                        >
                                            View all locations →
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="mt-10 p-6 bg-secondary/10 rounded-2xl">
                                <h3 className="font-bold text-navy mb-2">Talk to Hank</h3>
                                <p className="text-gray-600 text-sm">
                                    Hank Williams, founder and lead instructor, is happy to answer any questions
                                    about our program. Don't hesitate to reach out directly!
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-navy mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Thank you for reaching out. We'll get back to you soon!
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-heading font-bold text-navy mb-6">
                                        Send Us a Message
                                    </h2>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="space-y-5"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Your name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="your@email.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone (optional)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="tel"
                                                                placeholder="(555) 123-4567"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="inquiryType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Inquiry Type *</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a topic" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {inquiryTypes.map((type) => (
                                                                    <SelectItem
                                                                        key={type.value}
                                                                        value={type.value}
                                                                    >
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Message *</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="How can we help you?"
                                                                className="min-h-[120px] resize-none"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {error && (
                                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                className="w-full bg-accent hover:bg-accent/90"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Spinner className="mr-2" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
