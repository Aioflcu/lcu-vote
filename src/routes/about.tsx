import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ShieldCheck, Vote, BarChart3 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Leadcity Voting App" },
      { name: "description", content: "Learn about the Leadcity Voting App and how we run free, fair, and verifiable student elections." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className="text-xs uppercase tracking-widest text-white/80">About</span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Democracy, the Leadcity way.</h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/85">
            We built the Leadcity Voting App to make student elections faster, safer,
            and more transparent — without the queues and paperwork.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <h2 className="text-2xl font-bold">Our mission</h2>
        <p className="mt-3 text-muted-foreground">
          To empower every Lead City University student with a verifiable voice in choosing
          the leaders who represent them — from the SUG to faculty councils.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {[
            { icon: ShieldCheck, t: "Verified", d: "Every voter must register with a valid matric number." },
            { icon: Vote, t: "Anonymous", d: "Ballots are stored without revealing identities to candidates." },
            { icon: BarChart3, t: "Transparent", d: "Live tallies are visible to authorized observers in real time." },
            { icon: Mail, t: "Supportive", d: "A dedicated support channel for any voter who needs help." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          {[
            { q: "Who can vote?", a: "Any currently enrolled Lead City University student with a valid matric number can register and vote." },
            { q: "Can I change my vote?", a: "No. Votes are final once submitted. You'll see a confirmation popup before your vote is recorded." },
            { q: "Are my votes anonymous?", a: "Yes. Candidates and the public can only see vote tallies, never which student voted for whom." },
            { q: "What if I can't log in?", a: "Reach out via the contact form on this site and our support team will verify your identity and help." },
            { q: "When are results announced?", a: "Tallies are live for the electoral committee, and official results are announced after the polls close." },
          ].map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center">
          <p className="font-medium">Still have questions?</p>
          <Link to="/contact" className="text-primary font-semibold hover:underline">Contact our support team →</Link>
        </div>
      </section>
    </div>
  );
}
