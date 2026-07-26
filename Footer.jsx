import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-xs font-semibold text-background">R</span>
          <span className="font-display text-lg font-medium">Restyle</span>
        </div>
        <p className="text-sm text-muted-foreground">Redesigning cluttered rooms into minimal, Instagram-ready interiors.</p>
        <Link to="/redesign" className="text-sm text-accent hover:underline">Start redesigning →</Link>
      </div>
    </footer>
  );
}