import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore, selectCurrentUser, selectUserVotes } from "@/lib/store";
import { ShieldCheck, CheckCircle2, Clock, Vote } from "lucide-react";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Your Dashboard — Leadcity Voting App" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useStore(selectCurrentUser);
  const votes = useStore(selectUserVotes);
  const candidates = useStore((s) => s.candidates);
  const status = useStore((s) => s.status);
  const endsAt = useStore((s) => s.electionEndsAt);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Login to see your voting dashboard.</p>
        <Link to="/login"><Button className="mt-6 bg-primary hover:bg-primary-deep">Login</Button></Link>
      </div>
    );
  }

  const hasVoted = votes.length > 0;

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-5xl">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Voter Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        </div>
        <Link to="/vote"><Button className="bg-primary hover:bg-primary-deep">Go to voting booth</Button></Link>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatusCard
          icon={ShieldCheck}
          label="Verification"
          value={user.verified ? "Verified" : "Pending"}
          tone={user.verified ? "good" : "warn"}
        />
        <StatusCard
          icon={Vote}
          label="Voting Status"
          value={hasVoted ? "Voted" : "Not yet"}
          tone={hasVoted ? "good" : "neutral"}
        />
        <StatusCard
          icon={Clock}
          label="Election"
          value={status}
          tone={status === "Open" ? "good" : "warn"}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg">Active election</h2>
          <p className="text-sm text-muted-foreground mt-1">Leadcity SUG General Election</p>
          <div className="mt-5 rounded-xl hero-gradient p-5 text-white">
            <p className="text-xs uppercase tracking-widest text-white/75">Time remaining</p>
            <div className="mt-3"><Countdown to={endsAt} /></div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold text-lg">Your profile</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{user.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Matric</dt><dd className="font-medium">{user.matric}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Email</dt><dd className="font-medium truncate">{user.email}</dd></div>
          </dl>
          <Link to="/profile"><Button variant="outline" className="w-full mt-5">Edit profile</Button></Link>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
        <h2 className="font-semibold text-lg">Voting history</h2>
        {votes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">You haven't cast a vote yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {votes.map((v) => {
              const c = candidates.find((x) => x.id === v.candidateId);
              return (
                <li key={v.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {c?.name ?? "Unknown candidate"}
                    </div>
                    <div className="text-xs text-muted-foreground">{v.position} · {new Date(v.at).toLocaleString()}</div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{c?.party}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusCard({
  icon: Icon, label, value, tone,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "good" | "warn" | "neutral" }) {
  const ring = tone === "good" ? "ring-emerald-200 bg-emerald-50 text-emerald-700"
    : tone === "warn" ? "ring-amber-200 bg-amber-50 text-amber-700"
    : "ring-border bg-muted text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${ring}`}>
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}
