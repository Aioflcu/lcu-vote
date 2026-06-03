import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — Leadcity Voting App" }] }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  matric: z
    .string()
    .trim()
    .min(4, "Matric number is required")
    .max(20)
    .regex(/^[A-Za-z0-9\/-]+$/, "Only letters, numbers, / and -"),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z.string().min(6, "At least 6 characters").max(60),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});
type FormData = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    const res = registerUser({
      name: data.name, matric: data.matric, email: data.email, password: data.password,
    });
    if (res.ok) {
      toast.success("Account created and verified", { description: "You can now vote." });
      navigate({ to: "/dashboard" });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 max-w-md">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Register with your Leadcity details to vote.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Field label="Full name" error={errors.name?.message}>
            <Input placeholder="Ai-oflcu" {...register("name")} />
          </Field>
          <Field label="Matric number" error={errors.matric?.message}>
            <Input placeholder="LCU/UG/24/22999" {...register("matric")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@leadcity.edu.ng" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="At least 6 characters" {...register("password")} />
          </Field>
          <Field label="Confirm password" error={errors.confirm?.message}>
            <Input type="password" placeholder="Repeat password" {...register("confirm")} />
          </Field>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-primary-deep">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
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
