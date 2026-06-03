import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStore, addCandidate, removeCandidate, setStatus, selectTallies, type ElectionStatus } from "@/lib/store";
import { isAdmin } from "@/components/AdminGate";
import { CandidateAvatar } from "@/components/CandidateAvatar";
import { useEffect, useState } from "react";
import { Trash2, Plus, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Leadcity Voting App" }] }),
  component: AdminPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(80),
  party: z.string().trim().min(2, "Required").max(80),
  position: z.string().trim().min(2, "Required").max(40),
  manifesto: z.string().trim().min(20, "At least 20 characters").max(500),
  photo: z.string().trim().max(120).optional(),
});
type FormData = z.infer<typeof schema>;

const COLORS = ["#16a34a", "#22c55e", "#15803d", "#86efac", "#4ade80", "#166534"];

function AdminPage() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const candidates = useStore((s) => s.candidates);
  const status = useStore((s) => s.status);
  const tallies = useStore(selectTallies);
  const totalVotes = tallies.reduce((a, b) => a + b.votes, 0);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Admin access required");
      navigate({ to: "/" });
      return;
    }
    setOk(true);
  }, [navigate]);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onAdd = (data: FormData) => {
    addCandidate({
      name: data.name,
      party: data.party,
      position: data.position,
      manifesto: data.manifesto,
      photo: data.photo || "",
    });
    toast.success("Candidate added");
    reset();
  };

  if (!ok) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
        <p className="mt-3 text-muted-foreground">Verifying admin access…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Admin Console</p>
          <h1 className="mt-1 text-3xl font-bold">Election Control Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm text-muted-foreground">Status</Label>
          <Select value={status} onValueChange={(v) => { setStatus(v as ElectionStatus); toast.success(`Election ${v}`); }}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Stat label="Total candidates" value={candidates.length} />
        <Stat label="Total votes" value={totalVotes} />
        <Stat label="Positions" value={new Set(candidates.map((c) => c.position)).size} />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg">Votes per candidate</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={tallies} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {tallies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg">Distribution</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tallies.filter((t) => t.votes > 0)}
                  dataKey="votes"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {tallies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-8 grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Plus className="h-4 w-4" /> Add candidate</h2>
          <form onSubmit={handleSubmit(onAdd)} className="mt-4 space-y-3" noValidate>
            <Field label="Name" error={errors.name?.message}>
              <Input {...register("name")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Party" error={errors.party?.message}>
                <Input {...register("party")} />
              </Field>
              <Field label="Position" error={errors.position?.message}>
                <Input placeholder="e.g. President" {...register("position")} />
              </Field>
            </div>
            <Field label="Manifesto" error={errors.manifesto?.message}>
              <Textarea rows={4} {...register("manifesto")} />
            </Field>
            <Field label="Photo URL (optional)" error={errors.photo?.message}>
              <Input placeholder="https://…" {...register("photo")} />
            </Field>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-deep">Add candidate</Button>
          </form>
        </section>

        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg">Candidates</h2>
          <ul className="mt-4 divide-y divide-border">
            {candidates.map((c) => {
              const v = tallies.find((t) => t.name === c.name)?.votes ?? 0;
              return (
                <li key={c.id} className="py-3 flex items-center gap-3">
                  <CandidateAvatar photo={c.photo} name={c.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.party} · {c.position}</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{v} votes</Badge>
                  <Button size="icon" variant="ghost" onClick={() => { removeCandidate(c.id); toast("Candidate removed"); }} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
            {candidates.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No candidates yet.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
