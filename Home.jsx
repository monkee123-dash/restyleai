import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Camera, Wand2, ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

const SAMPLE_BEFORE = "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80";
const SAMPLE_AFTER = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80";

const steps = [
  { icon: Camera, title: "Upload a photo", text: "Snap or upload any cluttered room — no cleaning required." },
  { icon: Wand2, title: "AI restyles it", text: "Our model redesigns the space into a calm, minimal interior." },
  { icon: ImageIcon, title: "Share the after", text: "Get a polished before/after, ready for Instagram." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles size={13} className="text-accent" /> AI-powered interior redesign
            </span>
            <h1 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight text-balance sm:text-7xl">
              Turn cluttered rooms into <span className="italic text-accent">minimal</span>, Instagram-ready interiors.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Upload a photo of any messy space. Restyle's AI clears the clutter and redesigns it into a calm, editorial-quality room — in seconds.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/redesign" className="rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
                Redesign my room
              </Link>
              <Link to="/gallery" className="rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-secondary">
                View gallery
              </Link>
            </div>
          </div>

          {/* Hero before/after */}
          <div className="mx-auto mt-16 max-w-3xl">
            <BeforeAfterSlider
              beforeImage={SAMPLE_BEFORE}
              afterImage={SAMPLE_AFTER}
              className="shadow-2xl shadow-neutral-900/10 ring-1 ring-border"
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">Drag the slider to compare</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-5xl">Three steps to a calmer space</h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <s.icon size={20} />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                  <h3 className="text-base font-medium">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl text-balance">
            Your messiest room, reimagined.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            See what your space could look like — no movers, no renovations, no cleaning required.
          </p>
          <Link to="/redesign" className="mt-8 inline-block rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
            Try Restyle free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}