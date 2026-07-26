const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useRef, useState } from "react";
import { Upload, Sparkles, Loader2, ImageIcon, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import StylePicker from "@/components/StylePicker";
import ResultActions from "@/components/ResultActions";

import { useToast } from "@/components/ui/use-toast";

const STAGES = {
  idle: "Upload a cluttered room to begin",
  uploading: "Uploading your photo…",
  analyzing: "Analyzing the room & planning the redesign…",
  generating: "Generating your minimal interior…",
  saving: "Saving your transformation…",
  done: "Done — here's your redesigned room",
  error: "Something went wrong. Please try again.",
};

export default function Redesign() {
  const { toast } = useToast();
  const [stage, setStage] = useState("idle");
  const [beforeUrl, setBeforeUrl] = useState(null);
  const [afterUrl, setAfterUrl] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [title, setTitle] = useState(null);
  const [style, setStyle] = useState("Warm Minimal");
  const fileInputRef = useRef(null);

  const busy = stage === "uploading" || stage === "analyzing" || stage === "generating" || stage === "saving";

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setAfterUrl(null);
      setRoomType(null);
      setTitle(null);
      setStage("uploading");
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setBeforeUrl(file_url);

      setStage("analyzing");
      const analysis = await db.integrations.Core.InvokeLLM({
        prompt: `You are an expert interior designer. Analyze this photo of a cluttered room and create a detailed redesign prompt for a "${style}" interior that is minimal and Instagram-ready. Keep the room's core function and architecture but declutter, simplify, and restyle to match the ${style} aesthetic. Return a JSON object with: room_type (short label, e.g. 'Living Room'), title (a short evocative title for the redesign), and redesign_prompt (a rich, detailed image-generation prompt describing the redesigned ${style} room).`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            room_type: { type: "string" },
            title: { type: "string" },
            redesign_prompt: { type: "string" },
          },
        },
      });

      setStage("generating");
      const gen = await db.integrations.Core.GenerateImage({
        prompt: analysis.redesign_prompt,
        existing_image_urls: [file_url],
      });

      setStage("saving");
      await db.entities.Redesign.create({
        title: analysis.title,
        before_image_url: file_url,
        after_image_url: gen.url,
        room_type: analysis.room_type,
        style,
      });
      setRoomType(analysis.room_type);
      setTitle(analysis.title);
      setAfterUrl(gen.url);
      setStage("done");
      toast({ title: "Room redesigned", description: `${style} · ${analysis.room_type}` });
    } catch (e) {
      console.error(e);
      setStage("error");
      toast({ title: "Redesign failed", description: "Please try again with a different photo.", variant: "destructive" });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStage("idle");
    setBeforeUrl(null);
    setAfterUrl(null);
    setRoomType(null);
    setTitle(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles size={13} className="text-accent" /> AI Interior Redesign
          </span>
          <h1 className="mt-5 font-display text-4xl font-light tracking-tight sm:text-5xl">Redesign your room</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Upload a photo of a cluttered space. Pick a style — we'll restyle it into a calm, Instagram-ready interior.
          </p>
        </div>

        {/* Style picker */}
        <div className="mx-auto mt-8 max-w-md">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Style</label>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        {/* Upload / Progress */}
        {!afterUrl && (
          <div className="mt-8">
            {stage === "idle" || stage === "error" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card px-6 py-20 text-center transition-colors hover:border-accent/60 hover:bg-secondary/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                  <Upload size={22} />
                </div>
                <p className="mt-5 text-sm font-medium">Click to upload or drag a photo</p>
                <p className="mt-1 text-xs text-muted-foreground">JPG or PNG — a clear, well-lit room works best</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center">
                {beforeUrl && (
                  <img src={beforeUrl} alt="Uploaded room" className="mb-6 h-44 w-full max-w-sm rounded-xl object-cover opacity-80" />
                )}
                <Loader2 size={28} className="animate-spin text-accent" />
                <p className="mt-5 text-sm font-medium">{STAGES[stage]}</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {afterUrl && beforeUrl && (
          <div className="mt-10">
            {roomType && (
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ImageIcon size={14} className="text-accent" />
                <span>{roomType}</span>
                <span className="text-border">·</span>
                <span>{style}</span>
              </div>
            )}
            <BeforeAfterSlider
              beforeImage={beforeUrl}
              afterImage={afterUrl}
              className="shadow-2xl shadow-neutral-900/10 ring-1 ring-border"
            />
            <div className="mt-6">
              <ResultActions imageUrl={afterUrl} title={title} />
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <RotateCcw size={15} /> Redesign another room
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}