import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Share2, Instagram, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

async function fetchBlob(url) {
  const res = await fetch(url, { mode: "cors" });
  return await res.blob();
}

export default function ResultActions({ imageUrl, title }) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [busy, setBusy] = useState(null);

  const fileBase = (title || "restyle").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleDownload = async () => {
    setBusy("dl");
    try {
      const blob = await fetchBlob(imageUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileBase}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    setBusy("share");
    try {
      if (navigator.share) {
        try {
          const blob = await fetchBlob(imageUrl);
          const file = new File([blob], `${fileBase}.jpg`, { type: blob.type || "image/jpeg" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: title || "My Restyle", text: "Redesigned with Restyle" });
            return;
          }
        } catch {}
        await navigator.share({ title: title || "My Restyle", text: "Redesigned with Restyle", url: imageUrl });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast({ title: "Link copied", description: "Image link copied to clipboard." });
      }
    } catch {
      // user cancelled
    } finally {
      setBusy(null);
    }
  };

  const handleInstagram = async () => {
    if (!isAuthenticated) return;
    setBusy("ig");
    try {
      if (navigator.share) {
        try {
          const blob = await fetchBlob(imageUrl);
          const file = new File([blob], `${fileBase}.jpg`, { type: blob.type || "image/jpeg" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: "Redesigned with Restyle #restyle #interiordesign" });
            return;
          }
        } catch {}
      }
      await handleDownload();
      window.open("https://www.instagram.com/", "_blank");
      toast({ title: "Open Instagram", description: "Your image downloaded — post it to Instagram." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={handleDownload}
        disabled={busy === "dl"}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {busy === "dl" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        Download
      </button>

      <button
        onClick={handleShare}
        disabled={busy === "share"}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {busy === "share" ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
        Share
      </button>

      {isAuthenticated ? (
        <button
          onClick={handleInstagram}
          disabled={busy === "ig"}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy === "ig" ? <Loader2 size={15} className="animate-spin" /> : <Instagram size={15} />}
          Share to Instagram
        </button>
      ) : (
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Lock size={14} /> Log in to share to Instagram
        </Link>
      )}
    </div>
  );
}