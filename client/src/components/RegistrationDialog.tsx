import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle, CheckCircle2, Calendar, MapPin, Clock } from "lucide-react";

interface SessionInfo {
    id: number;
    dayOfWeek: string;
    time: string;
    instructor: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
    class?: { id: number; title: string } | null;
    location?: { id: number; name: string; address: string } | null;
}

interface RegistrationDialogProps {
    session: SessionInfo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const registrationSchema = z.object({
    parentName: z.string().min(1, "Parent name is required"),
    parentEmail: z.string().email("Please enter a valid email address"),
    studentName: z.string().min(1, "Student name is required"),
    studentAge: z
        .number({ message: "Age is required" })
        .min(0, "Age must be 0 or greater")
        .max(10, "Age must be 10 or less"),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationDialog({
    session,
    open,
    onOpenChange,
}: RegistrationDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            parentName: "",
            parentEmail: "",
            studentName: "",
            studentAge: undefined as unknown as number,
            termsAccepted: false,
        },
    });

    const termsAccepted = watch("termsAccepted");

    const onSubmit = async (data: RegistrationFormData) => {
        if (!session) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: session.id,
                    parentName: data.parentName,
                    parentEmail: data.parentEmail,
                    studentName: data.studentName,
                    studentAge: data.studentAge,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as { message?: string }).message || "Registration failed. Please try again."
                );
            }

            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "An unexpected error occurred"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setSubmitError(null);
        setSubmitSuccess(false);
        onOpenChange(false);
    };

    if (!session) return null;

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading font-black text-navy">
                        {submitSuccess ? "Registration Complete!" : "Register for Class"}
                    </DialogTitle>
                    {!submitSuccess && (
                        <DialogDescription>
                            Fill out the form below to register for this session.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {submitSuccess ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">
                            Thank you for registering!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We've received your registration for{" "}
                            <span className="font-semibold">{session.class?.title}</span>.
                            You'll receive a confirmation email shortly with payment instructions.
                        </p>
                        <Button onClick={handleClose} className="rounded-full font-bold px-8">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Session Info Card */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <h4 className="font-bold text-navy mb-2">{session.class?.title}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>
                                        {session.dayOfWeek} at {session.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span>{session.location?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>
                                        {formatDate(session.startDate)} - {formatDate(session.endDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {submitError && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Parent Name */}
                            <div className="space-y-2">
                                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                                <Input
                                    id="parentName"
                                    {...register("parentName")}
                                    placeholder="Enter your full name"
                                    className={errors.parentName ? "border-red-500" : ""}
                                />
                                {errors.parentName && (
                                    <p className="text-red-500 text-sm">{errors.parentName.message}</p>
                                )}
                            </div>

                            {/* Parent Email */}
                            <div className="space-y-2">
                                <Label htmlFor="parentEmail">Email Address *</Label>
                                <Input
                                    id="parentEmail"
                                    type="email"
                                    {...register("parentEmail")}
                                    placeholder="your@email.com"
                                    className={errors.parentEmail ? "border-red-500" : ""}
                                />
                                {errors.parentEmail && (
                                    <p className="text-red-500 text-sm">{errors.parentEmail.message}</p>
                                )}
                            </div>

                            {/* Student Name */}
                            <div className="space-y-2">
                                <Label htmlFor="studentName">Child's Name *</Label>
                                <Input
                                    id="studentName"
                                    {...register("studentName")}
                                    placeholder="Enter your child's name"
                                    className={errors.studentName ? "border-red-500" : ""}
                                />
                                {errors.studentName && (
                                    <p className="text-red-500 text-sm">{errors.studentName.message}</p>
                                )}
                            </div>

                            {/* Student Age */}
                            <div className="space-y-2">
                                <Label htmlFor="studentAge">Child's Age *</Label>
                                <Input
                                    id="studentAge"
                                    type="number"
                                    min={0}
                                    max={10}
                                    {...register("studentAge", { valueAsNumber: true })}
                                    placeholder="Enter age in years"
                                    className={errors.studentAge ? "border-red-500" : ""}
                                />
                                {errors.studentAge && (
                                    <p className="text-red-500 text-sm">{errors.studentAge.message}</p>
                                )}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="space-y-2 pt-2">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="termsAccepted"
                                        checked={termsAccepted === true}
                                        onCheckedChange={(checked) =>
                                            setValue("termsAccepted", checked === true)
                                        }
                                        className={errors.termsAccepted ? "border-red-500" : ""}
                                    />
                                    <Label
                                        htmlFor="termsAccepted"
                                        className="text-sm text-gray-600 leading-snug cursor-pointer"
                                    >
                                        I agree to the{" "}
                                        <a
                                            href="/terms"
                                            target="_blank"
                                            className="text-primary hover:underline"
                                        >
                                            terms and conditions
                                        </a>{" "}
                                        and understand that payment is required to confirm my registration. *
                                    </Label>
                                </div>
                                {errors.termsAccepted && (
                                    <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full font-bold px-8"
                            >
                                {submitting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                                {submitting ? "Submitting..." : "Register"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
