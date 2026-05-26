export function CandidateAvatar({ photo, name, size = 64 }: { photo: string; name: string; size?: number }) {
  const isUrl = photo.startsWith("http") || photo.startsWith("/") || photo.startsWith("data:");
  if (isUrl) {
    return (
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className="rounded-full object-cover border-2 border-primary/30"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = (photo || name.split(" ").map((p) => p[0]).join("")).slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-deep text-primary-foreground font-bold border-2 border-primary/30"
      style={{ width: size, height: size, fontSize: size / 2.8 }}
    >
      {initials}
    </div>
  );
}
