import React from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Try Restyle and share your first redesigns.",
    features: ["3 redesigns per month", "All 50 interior styles", "Before/after comparison", "Download images", "Web sharing"],
    cta: "Get started",
    to: "/redesign",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    tagline: "For creators who post often.",
    features: [
      "Unlimited redesigns",
      "All 50 interior styles",
      "High-resolution downloads",
      "Direct Instagram sharing",
      "Save to private gallery",
      "Priority AI generation",
    ],
    cta: "Start Pro",
    to: "/register",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$39",
    period: "per month",
    tagline: "For designers and studios.",
    features: [
      "Everything in Pro",
      "Batch room redesigns",
      "Commercial usage license",
      "Custom style presets",
      "Team seats (5)",
      "Priority support",
    ],
    cta: "Go Studio",
    to: "/register",
    highlight: false,
  },
];

export default function Memberships() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles size={13} className="text-accent" /> Memberships
          </span>
          <h1 className="mt-5 font-display text-4xl font-light tracking-tight sm:text-5xl">Choose your plan</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Start free. Upgrade when you're ready for unlimited redesigns and direct Instagram sharing.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                plan.highlight ? "border-accent bg-card shadow-xl shadow-neutral-900/5" : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-light">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.to}
                className={`mt-7 inline-flex justify-center rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
                  plan.highlight ? "bg-foreground text-background" : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Cancel anytime. Prices in USD. Direct Instagram sharing requires a logged-in account.
        </p>
      </main>

      <Footer />
    </div>
  );
}