"use client";

// A template re-mounts on every navigation, so the enter animation replays as
// the player moves between dashboard pages.
export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-1 flex-col duration-300">
      {children}
    </div>
  );
}
