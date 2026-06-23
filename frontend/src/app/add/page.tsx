"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useGenerateAlternativeMutation } from "../../lib/features/api/apiSlice";

const LOADING_STEPS = [
  "Analyzing proprietary license structures and pricing...",
  "Searching active open-source repositories on GitHub...",
  "Synthesizing comparative feature checklists...",
  "Drafting final review analysis and optimizing SEO tags...",
];

export default function AddAlternative() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [softwareName, setSoftwareName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [generateAlternative] = useGenerateAlternativeMutation();

  // Cycle loading status text
  useEffect(() => {
    if (!submitting) return;
    
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4500); // Shift every 4.5 seconds

    return () => clearInterval(interval);
  }, [submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!softwareName.trim()) return;

    setSubmitting(true);
    setLoadingStep(0);
    setErrorMsg("");

    try {
      // Get Clerk JWT token
      const token = await getToken();
      
      const res = await generateAlternative({ softwareName, token: token ?? "" }).unwrap();
      // Redirect on successful generation
      router.push(`/alternatives/${res.slug}`);
    } catch (err) {
      console.error("AI Generation failed:", err);
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to generate comparison. Please check server logs.";
      setErrorMsg(errMsg);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      
      {!submitting ? (
        <div className="rounded-none border border-white/5 bg-white/2 p-6 backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-display uppercase">
              AI Alternative Finder
            </h1>
          </div>
          
          <p className="text-sm text-slate-400 mb-8 font-sans leading-relaxed">
            Enter the name of any commercial or proprietary software (e.g. <strong>Trello</strong>, <strong>Tableau</strong>, <strong>Lightroom</strong>). Our Gemini AI agent will dynamically scour open-source registries, map features, compare licensing costs, and generate a review index page.
          </p>

          {errorMsg && (
            <div className="mb-6 rounded-none border border-rose-500/10 bg-rose-500/5 p-4 flex items-start gap-3 text-sm text-rose-300">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-display">Generation Interrupted</p>
                <p className="mt-1 font-sans text-xs opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="software" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-sans">
                Commercial Software Name
              </label>
              <input
                id="software"
                type="text"
                required
                placeholder="e.g. Zoom, Premiere Pro, Shopify"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                className="w-full rounded-none border border-white/5 bg-white/2 py-3 px-4 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-none py-6 font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Analyze with Gemini <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        /* Dynamic Multi-Step Loader */
        <div className="rounded-none border border-white/5 bg-white/2 p-8 backdrop-blur-xl text-center">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mx-auto mb-6" />
          
          <h2 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wide">
            AI Scraper Active
          </h2>
          
          <div className="relative mt-8 space-y-4 text-left max-w-sm mx-auto">
            {LOADING_STEPS.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3 text-sm transition-opacity duration-500 ${
                  loadingStep === idx 
                    ? "text-indigo-300 opacity-100 font-semibold" 
                    : loadingStep > idx 
                      ? "text-slate-500 opacity-90" 
                      : "text-slate-600 opacity-40"
                }`}
              >
                {loadingStep > idx ? (
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                ) : (
                  <div className={`h-5 w-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold ${
                    loadingStep === idx ? "border-indigo-400 border-t-transparent animate-spin" : "border-slate-700"
                  }`} />
                )}
                <span className="font-sans text-xs">{step}</span>
              </div>
            ))}
          </div>
          
          <p className="mt-12 text-xxs text-slate-500 font-mono">
            This operation calls the Gemini-2.5-Flash model. Refraction and layout mappings usually complete within 10-18 seconds.
          </p>
        </div>
      )}

    </div>
  );
}
