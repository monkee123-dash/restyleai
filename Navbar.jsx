import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", to: "/#how" },
  { label: "Gallery", to: "/gallery" },
  { label: "Memberships", to: "/memberships" },
  { label: "Try it", to: "/redesign" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background">R</span>
          <span className="font-display text-xl font-medium tracking-tight">Restyle</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm transition-colors hover:text-accent",
                pathname === l.to ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[140px] truncate text-xs text-muted-foreground">{user?.email}</span>
              <button
                onClick={() => logout()}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Log in
              </Link>
              <Link to="/register" className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 bg-background px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block py-2.5 text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border pt-3">
            {isAuthenticated ? (
              <button onClick={() => { setOpen(false); logout(); }} className="block py-2.5 text-sm text-muted-foreground">
                Log out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="py-2.5 text-sm text-muted-foreground">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium text-accent">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}