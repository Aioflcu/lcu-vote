import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, useStore, selectCurrentUser } from "@/lib/store";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Leadcity Voting App" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(4, "Password is too short"),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const user = useStore(selectCurrentUser);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const onSubmit = (data: FormData) => {
    const res = loginUser(data.email, data.password);
    if (res.ok) {
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 max-w-md">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@leadcity.edu.ng" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register("password")} />
          </Field>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-primary-deep">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          No account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
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
