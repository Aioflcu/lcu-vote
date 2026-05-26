// Lightweight localStorage-backed store for the Leadcity Voting App.
// All state lives in the browser — no backend needed.

import { useSyncExternalStore } from "react";

export type ElectionStatus = "Open" | "Paused" | "Closed";

export interface User {
  id: string;
  name: string;
  matric: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string; // e.g. "President", "VP"
  manifesto: string;
  photo: string; // url or initials placeholder
  createdAt: number;
}

export interface VoteRecord {
  id: string;
  userId: string;
  candidateId: string;
  position: string;
  at: number;
}

interface State {
  users: User[];
  currentUserId: string | null;
  candidates: Candidate[];
  votes: VoteRecord[];
  status: ElectionStatus;
  electionEndsAt: number; // epoch ms
  feedback: { id: string; name: string; email: string; message: string; at: number }[];
}

const KEY = "leadcity-voting-store-v1";

const seedCandidates = (): Candidate[] => [
  {
    id: "c1",
    name: "Adaeze Okafor",
    party: "Progressive Students Alliance",
    position: "President",
    manifesto:
      "Modernize student services, expand scholarships, and build a transparent SUG that reports monthly to the student body.",
    photo: "AO",
    createdAt: Date.now(),
  },
  {
    id: "c2",
    name: "Tunde Bakare",
    party: "Unity Coalition",
    position: "President",
    manifesto:
      "Better hostels, faster Wi-Fi across campus, and a 24/7 student help-desk powered by trained peer counsellors.",
    photo: "TB",
    createdAt: Date.now(),
  },
  {
    id: "c3",
    name: "Ngozi Ibrahim",
    party: "Reform Movement",
    position: "Vice President",
    manifesto:
      "Champion academic excellence with free tutoring hubs, mental-health weeks, and partnerships with leading employers.",
    photo: "NI",
    createdAt: Date.now(),
  },
  {
    id: "c4",
    name: "Femi Adeyemi",
    party: "Student First",
    position: "Vice President",
    manifesto:
      "Fix campus transport, subsidize printing, and launch a Leadcity startup grant for student-led ventures.",
    photo: "FA",
    createdAt: Date.now(),
  },
];

const initial: State = {
  users: [],
  currentUserId: null,
  candidates: seedCandidates(),
  votes: [],
  status: "Open",
  electionEndsAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
  feedback: [],
};

const load = (): State => {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<State>;
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
};

let state: State = load();
const listeners = new Set<() => void>();

const persist = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
};

const setState = (updater: (s: State) => State) => {
  state = updater(state);
  persist();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = () => state;
const getServerSnapshot = () => initial;

export const useStore = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(initial));

const uid = () => Math.random().toString(36).slice(2, 10);

// ---- Auth ----
export const registerUser = (input: {
  name: string;
  matric: string;
  email: string;
  password: string;
}): { ok: true; user: User } | { ok: false; error: string } => {
  const exists = state.users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase() || u.matric === input.matric,
  );
  if (exists) return { ok: false, error: "An account with that email or matric number already exists." };
  const user: User = {
    id: uid(),
    name: input.name.trim(),
    matric: input.matric.trim().toUpperCase(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    verified: true, // auto-verify for demo
    createdAt: Date.now(),
  };
  setState((s) => ({ ...s, users: [...s.users, user], currentUserId: user.id }));
  return { ok: true, user };
};

export const loginUser = (
  email: string,
  password: string,
): { ok: true; user: User } | { ok: false; error: string } => {
  const u = state.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!u || u.password !== password) return { ok: false, error: "Invalid email or password." };
  setState((s) => ({ ...s, currentUserId: u.id }));
  return { ok: true, user: u };
};

export const logout = () => setState((s) => ({ ...s, currentUserId: null }));

export const updateProfile = (patch: Partial<Pick<User, "name" | "email" | "matric">>) => {
  setState((s) => ({
    ...s,
    users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
  }));
};

// ---- Candidates ----
export const addCandidate = (input: Omit<Candidate, "id" | "createdAt">) =>
  setState((s) => ({
    ...s,
    candidates: [...s.candidates, { ...input, id: uid(), createdAt: Date.now() }],
  }));

export const removeCandidate = (id: string) =>
  setState((s) => ({
    ...s,
    candidates: s.candidates.filter((c) => c.id !== id),
    votes: s.votes.filter((v) => v.candidateId !== id),
  }));

// ---- Voting ----
export const castVote = (
  candidateId: string,
): { ok: true } | { ok: false; error: string } => {
  const s = state;
  if (s.status !== "Open") return { ok: false, error: `Election is currently ${s.status}.` };
  if (!s.currentUserId) return { ok: false, error: "You must be signed in to vote." };
  const cand = s.candidates.find((c) => c.id === candidateId);
  if (!cand) return { ok: false, error: "Candidate not found." };
  const already = s.votes.find(
    (v) => v.userId === s.currentUserId && v.position === cand.position,
  );
  if (already) return { ok: false, error: `You already voted for ${cand.position}.` };
  setState((prev) => ({
    ...prev,
    votes: [
      ...prev.votes,
      { id: uid(), userId: prev.currentUserId!, candidateId, position: cand.position, at: Date.now() },
    ],
  }));
  return { ok: true };
};

// ---- Election controls ----
export const setStatus = (status: ElectionStatus) => setState((s) => ({ ...s, status }));
export const setEndsAt = (endsAt: number) => setState((s) => ({ ...s, electionEndsAt: endsAt }));

// ---- Feedback ----
export const sendFeedback = (input: { name: string; email: string; message: string }) =>
  setState((s) => ({
    ...s,
    feedback: [...s.feedback, { ...input, id: uid(), at: Date.now() }],
  }));

// ---- Selectors ----
export const selectCurrentUser = (s: State) =>
  s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null;

export const selectUserVotes = (s: State) =>
  s.currentUserId ? s.votes.filter((v) => v.userId === s.currentUserId) : [];

export const selectPositions = (s: State) =>
  Array.from(new Set(s.candidates.map((c) => c.position)));

export const selectTallies = (s: State) =>
  s.candidates.map((c) => ({
    name: c.name,
    party: c.party,
    position: c.position,
    votes: s.votes.filter((v) => v.candidateId === c.id).length,
  }));
