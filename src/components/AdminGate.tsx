import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "2000";

export function AdminGate({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("leadcity-admin", "1");
      onOpenChange(false);
      setPw("");
      setErr("");
      toast.success("Welcome, Admin");
      navigate({ to: "/admin" });
    } else {
      setErr("Incorrect password.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Admin Access</DialogTitle>
          <DialogDescription className="text-center">
            Enter the administrator password to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="adminpw">Password</Label>
            <Input
              id="adminpw"
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }}
              placeholder="••••"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-deep">
            Unlock Admin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const isAdmin = () =>
  typeof window !== "undefined" && sessionStorage.getItem("leadcity-admin") === "1";
