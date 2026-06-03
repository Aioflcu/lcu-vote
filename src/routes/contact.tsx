import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { sendFeedback } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Leadcity Voting App" }] }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    sendFeedback(data);
    toast.success("Message sent", { description: "We'll get back to you shortly." });
    reset();
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 max-w-5xl">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Support</span>
        <h1 className="mt-2 text-4xl font-bold">We're here to help</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about voting, verification, or candidate registration? Drop us a message.
        </p>
      </header>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InfoCard icon={Mail} label="Email" value="votes@leadcity.edu.ng" />
          <InfoCard icon={Phone} label="Phone" value="+2349119395789" />
          <InfoCard icon={MapPin} label="Office" value=", Lead City University, Ibadan" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card-soft space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" error={errors.name?.message}>
              <Input placeholder="Your name" {...register("name")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" placeholder="elon@gmil.com" {...register("email")} />
            </Field>
          </div>
          <Field label="Message" error={errors.message?.message}>
            <Textarea rows={6} placeholder="How can we help?" {...register("message")} />
          </Field>
          <Button disabled={isSubmitting} type="submit" className="bg-primary hover:bg-primary-deep">
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
