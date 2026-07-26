const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ImageIcon, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

import { cn } from "@/lib/utils";

const FALLBACK = [
  {
    id: "f1",
    title: "Sunlit Living Room",
    room_type: "Living Room",
    before_image_url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
    after_image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "f2",
    title: "Calm Bedroom",
    room_type: "Bedroom",
    before_image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    after_image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "f3",
    title: "Minimal Kitchen",
    room_type: "Kitchen",
    before_image_url: "https://images.unsplash.com/photo-1604335078980-3b6b0b3a9d4f?auto=format&fit=crop&w=800&q=80",
    after_image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
  },
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "az", label: "A–Z" },
  { key: "popular", label: "Most popular" },
];

export default function Gallery() {
  const [items, setItems] = useState(null);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    db.entities.Redesign.list("-created_date", 60)
      .then((data) => setItems(data.length ? data : FALLBACK))
      .catch(() => setItems(FALLBACK));
  }, []);

  const sorted = useMemo(() => {
    if (!items) return null;
    const list = [...items];
    if (sort === "az") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sort === "popular") list.sort((a, b) => (a.room_type || "").localeCompare(b.room_type || ""));
    // newest: already from list order
    return list;
  }, [items, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Gallery</p>
          <h1 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-5xl">Before & after</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Real transformations from cluttered to calm. Drag any slider to compare.
          </p>
        </div>

        {/* Sort */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <ArrowUpDown size={14} className="text-muted-foreground" />
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                sort === s.key ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {!sorted ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {sorted.map((item) => (
              <div key={item.id}>
                <BeforeAfterSlider
                  beforeImage={item.before_image_url}
                  afterImage={item.after_image_url}
                  className="ring-1 ring-border"
                />
                <div className="mt-3 flex items-center justify-between px-1">
                  <h3 className="font-display text-lg font-medium">{item.title || "Untitled"}</h3>
                  {item.room_type && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon size={12} className="text-accent" /> {item.room_type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/redesign" className="inline-block rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
            Redesign your own room
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}