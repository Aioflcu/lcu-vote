import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck, LogOut } from "lucide-react";
import logo from "@/assets/leadcity-logo.png";
import { Button } from "@/components/ui/button";
import { useStore, selectCurrentUser, logout } from "@/lib/store";
import { AdminGate } from "@/components/AdminGate";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/candidates", label: "Candidates" },
  { to: "/vote", label: "Vote" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const user = useStore(selectCurrentUser);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-1.5 flag-bar" />
      <header className="sticky top-0 z-40 backdrop-blur bg-background/85 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Lead City University"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="leading-tight">
              <div className="font-bold text-sm sm:text-base text-primary-deep">Leadcity</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5 tracking-wide uppercase">
                Voting App
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-accent"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="hidden sm:block text-sm font-medium text-foreground/80 hover:text-primary">
                  {user.name.split(" ")[0]}
                </Link>
                <Button size="sm" variant="ghost" onClick={logout} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex">
                  <Button size="sm" variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary-deep">Register</Button>
                </Link>
              </>
            )}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
              {!user && (
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-border bg-card">
        <div className="h-1.5 flag-bar" />
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="" width={36} height={36} className="h-9 w-9" />
              <div>
                <div className="font-bold text-primary-deep">Leadcity Voting App</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Free. Fair. Verifiable.
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              The official student election platform for Lead City University.
              Cast your ballot securely and watch results unfold in real time.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/candidates" className="hover:text-primary">Candidates</Link></li>
              <li><Link to="/vote" className="hover:text-primary">Vote</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Lead City University · Built for the student body.</p>
            <button
              onClick={() => setGateOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="Admin access"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> 2000
            </button>
          </div>
        </div>
      </footer>

      <AdminGate open={gateOpen} onOpenChange={setGateOpen} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
