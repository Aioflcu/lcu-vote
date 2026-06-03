import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore, selectCurrentUser, updateProfile, logout } from "@/lib/store";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — Leadcity Voting App" }] }),
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  matric: z.string().trim().min(4).max(20),
  email: z.string().trim().email().max(120),
});
type FormData = z.infer<typeof schema>;

function ProfilePage() {
  const user = useStore(selectCurrentUser);
  const [emailNotif, setEmailNotif] = useState(true);
  const [resultsAlert, setResultsAlert] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) reset({ name: user.name, matric: user.matric, email: user.email });
  }, [user, reset]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <Link to="/login"><Button className="mt-6 bg-primary hover:bg-primary-deep">Login</Button></Link>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    updateProfile(data);
    toast.success("Profile updated");
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl">
      <h1 className="text-3xl font-bold">Profile & Settings</h1>
      <p className="text-muted-foreground mt-1">Manage your personal info and app preferences.</p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
        <h2 className="font-semibold text-lg">Personal information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name?.message}>
            <Input {...register("name")} />
          </Field>
          <Field label="Matric number" error={errors.matric?.message}>
            <Input {...register("matric")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button disabled={!isDirty} type="submit" className="bg-primary hover:bg-primary-deep">
              Save changes
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
        <h2 className="font-semibold text-lg">App settings</h2>
        <div className="mt-4 space-y-4">
          <Toggle label="Email notifications" desc="Get updates on election milestones." checked={emailNotif} onChange={setEmailNotif} />
          <Toggle label="Results alerts" desc="Notify me when results are published." checked={resultsAlert} onChange={setResultsAlert} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold text-lg text-destructive">Sign out</h2>
        <p className="text-sm text-muted-foreground mt-1">End your session on this device.</p>
        <Button variant="destructive" className="mt-4" onClick={() => { logout(); toast("Signed out"); }}>
          Sign out
        </Button>
      </section>
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

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
