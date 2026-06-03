import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { useStore, selectTallies } from "@/lib/store";
import { ArrowRight, ShieldCheck, BarChart3, Users, CheckCircle2, Vote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leadcity Voting App — Cast Your Vote, Shape Your Campus" },
      { name: "description", content: "Register, view candidates, and vote in the Lead City University student elections. Real-time results. Verified ballots." },
    ],
  }),
  component: Home,
});

function Home() {
  const status = useStore((s) => s.status);
  const endsAt = useStore((s) => s.electionEndsAt);
  const candidates = useStore((s) => s.candidates);
  const tallies = useStore(selectTallies);
  const totalVotes = tallies.reduce((a, b) => a + b.votes, 0);

  return (
    <div>
      {/* HERO */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.3), transparent 40%)",
          }} />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25 text-xs font-medium uppercase tracking-widest">
                <span className={`h-1.5 w-1.5 rounded-full ${status === "Open" ? "bg-emerald-300" : "bg-amber-300"} animate-pulse`} />
                Election {status}
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
                Your voice.<br />Your campus.<br />
                <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Your vote.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl">
                The official Lead City University student election platform.
                Verified ballots, transparent tallies, and results you can trust — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/candidates">
                  <Button size="lg" className="bg-white text-primary-deep hover:bg-white/90 font-semibold">
                    View Elections <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                    Register to Vote
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {candidates.length} candidates</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {totalVotes} votes cast</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 sm:p-8 shadow-elegant">
              <p className="text-xs uppercase tracking-widest text-white/70">Election closes in</p>
              <div className="mt-4">
                <Countdown to={endsAt} />
              </div>
              <p className="mt-5 text-sm text-white/80">
                Polls close on{" "}
                <span className="font-semibold text-white">
                  {new Date(endsAt).toLocaleDateString(undefined, { dateStyle: "full" })}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">Built for trust. Designed for students.</h2>
          <p className="mt-3 text-muted-foreground">
            Every step — from registration to results — is engineered to be transparent, secure, and effortless.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified ballots", desc: "Only registered Leadcity students with valid matric numbers can vote, and each vote is locked once cast." },
            { icon: Vote, title: "One person, one vote", desc: "Per-position vote tracking prevents double-voting with instant on-screen confirmation." },
            { icon: BarChart3, title: "Real-time tallies", desc: "Live charts in the admin dashboard let officials and observers track results as they come in." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card-soft hover:shadow-elegant transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center">Election Timeline</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { d: "Phase 1", t: "Registration", desc: "Students create accounts with matric verification." },
              { d: "Phase 2", t: "Campaigns", desc: "Candidates publish manifestos and engage voters." },
              { d: "Phase 3", t: "Voting", desc: "Polls open campus-wide for verified ballots." },
              { d: "Phase 4", t: "Results", desc: "Real-time tallies certified by the electoral committee." },
            ].map((p, i) => (
              <div key={p.t} className="relative pl-8">
                <div className="absolute left-0 top-1 h-6 w-6 rounded-full flag-bar border-2 border-card" />
                {i < 3 && <div className="absolute left-[11px] top-7 bottom-[-1.5rem] w-px bg-border md:hidden" />}
                <div className="text-xs font-semibold text-primary uppercase tracking-widest">{p.d}</div>
                <div className="mt-1 font-bold">{p.t}</div>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="rounded-3xl hero-gradient text-white p-8 sm:p-14 text-center shadow-elegant">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to make it count?</h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Join thousands of Leadcity students shaping the future of campus leadership.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-deep hover:bg-white/90 font-semibold">Get started</Button>
            </Link>
            <Link to="/vote">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                Cast your vote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
