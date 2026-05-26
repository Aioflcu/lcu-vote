import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore, selectPositions, selectCurrentUser, selectUserVotes } from "@/lib/store";
import { CandidateAvatar } from "@/components/CandidateAvatar";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — Leadcity Voting App" },
      { name: "description", content: "Browse all candidates running in the Lead City University student election." },
    ],
  }),
  component: Candidates,
});

function Candidates() {
  const candidates = useStore((s) => s.candidates);
  const positions = useStore(selectPositions);
  const user = useStore(selectCurrentUser);
  const myVotes = useStore(selectUserVotes);
  const [filter, setFilter] = useState<string>("All");
  const navigate = useNavigate();

  const shown = filter === "All" ? candidates : candidates.filter((c) => c.position === filter);

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">The Ballot</span>
        <h1 className="mt-2 text-4xl font-bold">Meet your candidates</h1>
        <p className="mt-3 text-muted-foreground">
          Read each candidate's manifesto, then head over to the voting booth to cast your ballot.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {["All", ...positions].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === p
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => {
          const voted = myVotes.some((v) => v.candidateId === c.id);
          const votedForPosition = myVotes.find((v) => v.position === c.position);
          return (
            <article
              key={c.id}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-4">
                <CandidateAvatar photo={c.photo} name={c.name} size={64} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg leading-tight">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.party}</p>
                  <Badge variant="secondary" className="mt-1.5 bg-primary/10 text-primary hover:bg-primary/15">
                    {c.position}
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-4 min-h-[5rem]">
                {c.manifesto}
              </p>
              <div className="mt-5 pt-4 border-t border-border">
                {voted ? (
                  <Button disabled className="w-full bg-emerald-600 text-white hover:bg-emerald-600">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Your vote
                  </Button>
                ) : votedForPosition ? (
                  <Button disabled variant="outline" className="w-full">
                    Voted for {c.position}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-primary hover:bg-primary-deep"
                    onClick={() =>
                      user ? navigate({ to: "/vote" }) : navigate({ to: "/login" })
                    }
                  >
                    Vote Now
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {shown.length === 0 && (
        <p className="text-center text-muted-foreground mt-10">No candidates in this category yet.</p>
      )}

      <div className="mt-12 text-center">
        <Link to="/vote">
          <Button size="lg" className="bg-primary hover:bg-primary-deep">Go to voting booth</Button>
        </Link>
      </div>
    </div>
  );
}
