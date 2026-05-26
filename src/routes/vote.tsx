import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStore, selectCurrentUser, selectUserVotes, selectPositions, castVote } from "@/lib/store";
import { CandidateAvatar } from "@/components/CandidateAvatar";
import { useState } from "react";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vote")({
  head: () => ({ meta: [{ title: "Cast Your Vote — Leadcity Voting App" }] }),
  component: VotePage,
});

function VotePage() {
  const user = useStore(selectCurrentUser);
  const candidates = useStore((s) => s.candidates);
  const positions = useStore(selectPositions);
  const status = useStore((s) => s.status);
  const votes = useStore(selectUserVotes);
  const [pending, setPending] = useState<{ id: string; name: string; position: string } | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <Lock className="h-12 w-12 text-primary mx-auto" />
        <h1 className="mt-4 text-2xl font-bold">Sign in to vote</h1>
        <p className="mt-2 text-muted-foreground">
          You need a verified Leadcity account to cast a ballot.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login"><Button className="bg-primary hover:bg-primary-deep">Login</Button></Link>
          <Link to="/register"><Button variant="outline">Register</Button></Link>
        </div>
      </div>
    );
  }

  if (status !== "Open") {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <h1 className="text-2xl font-bold">Voting is {status}</h1>
        <p className="mt-2 text-muted-foreground">Please check back when the election is open.</p>
        <Link to="/" className="inline-block mt-6"><Button variant="outline">Back home</Button></Link>
      </div>
    );
  }

  const confirm = () => {
    if (!pending) return;
    const res = castVote(pending.id);
    if (res.ok) {
      toast.success(`Vote recorded for ${pending.name}`, { description: "Thanks for participating." });
    } else {
      toast.error(res.error);
    }
    setPending(null);
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-4xl">
      <header>
        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified voter
        </Badge>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Voting Booth</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome, {user.name}. Cast one vote per position. Choices are final.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {positions.map((pos) => {
          const inPos = candidates.filter((c) => c.position === pos);
          const myChoice = votes.find((v) => v.position === pos);
          return (
            <section key={pos}>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">{pos}</h2>
                {myChoice && (
                  <span className="text-sm text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Ballot submitted
                  </span>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {inPos.map((c) => {
                  const chosen = myChoice?.candidateId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`rounded-2xl border p-5 transition ${
                        chosen
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <CandidateAvatar photo={c.photo} name={c.name} size={56} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold leading-tight">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.party}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{c.manifesto}</p>
                      <Button
                        className={`mt-4 w-full ${chosen ? "bg-emerald-600 hover:bg-emerald-600" : "bg-primary hover:bg-primary-deep"}`}
                        disabled={!!myChoice}
                        onClick={() => setPending({ id: c.id, name: c.name, position: pos })}
                      >
                        {chosen ? (
                          <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Your choice</>
                        ) : myChoice ? (
                          "Vote locked"
                        ) : (
                          "Cast vote"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your vote</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to vote for <strong>{pending?.name}</strong> for <strong>{pending?.position}</strong>.
              This action is final and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary hover:bg-primary-deep" onClick={confirm}>
              Confirm vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
