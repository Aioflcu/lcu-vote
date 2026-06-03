import { useEffect, useState } from "react";

export function Countdown({ to }: { to: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, to - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const items = [
    { label: "Days", value: d },
    { label: "Hours", value: h },
    { label: "Minutes", value: m },
    { label: "Seconds", value: s },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-2 py-4 sm:py-6 text-center"
        >
          <div className="text-3xl sm:text-5xl font-bold tabular-nums text-white">
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 mt-1">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
