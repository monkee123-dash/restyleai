import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Check, X } from "lucide-react";
import { INTERIOR_STYLES, STYLE_CATEGORIES } from "@/lib/interiorStyles";
import { cn } from "@/lib/utils";

const SORTS = [
  { key: "popular", label: "Most popular" },
  { key: "az", label: "Alphabetical" },
  { key: "category", label: "By category" },
];

export default function StylePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    let list = INTERIOR_STYLES.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "All") list = list.filter((s) => s.category === category);
    if (sort === "popular") list = [...list].sort((a, b) => b.popularity - a.popularity);
    else if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "category")
      list = [...list].sort((a, b) => a.category.localeCompare(b.category) || b.popularity - a.popularity);
    return list;
  }, [query, sort, category]);

  const select = (name) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:border-accent/50"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-accent" />
          <span className="text-sm font-medium">{value || "Choose a style"}</span>
        </span>
        <span className="text-xs text-muted-foreground">{INTERIOR_STYLES.length} styles</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-background sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-medium">Choose a style</h3>
                <p className="text-xs text-muted-foreground">{INTERIOR_STYLES.length} interior styles to pick from</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary">
                <X size={18} />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-3 border-b border-border px-5 py-4">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search styles…"
                  className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Sort:</span>
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      sort === s.key ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {STYLE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs transition-colors",
                      category === c ? "bg-accent text-white" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="grid gap-2 overflow-y-auto px-5 py-4 sm:grid-cols-2">
              {filtered.map((s) => (
                <button
                  key={s.name}
                  onClick={() => select(s.name)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    value === s.name ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/40"
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.name}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{s.category}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                  </div>
                  {value === s.name && <Check size={16} className="mt-0.5 shrink-0 text-accent" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">No styles match "{query}".</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}