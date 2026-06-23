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
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      
      {!submitting ? (
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Generate a Comparison
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Enter any software or tool, and our AI will find open-source alternatives, compare features, and analyze pricing.
            </p>
          </div>

          {errorMsg && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Generation Failed</p>
                <p className="mt-1 text-sm text-red-200/80">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="software" className="block text-sm font-semibold text-white mb-3">
                Software Name
              </label>
              <input
                id="software"
                type="text"
                required
                placeholder="e.g. Photoshop, Salesforce, Slack"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                className="w-full border border-white/10 bg-white/5 rounded-lg py-3 px-4 text-white placeholder-white/40 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold flex items-center justify-center gap-2 rounded-lg transition-colors"
            >
              Generate with AI <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        /* Dynamic Multi-Step Loader */
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-8" />
          
          <h2 className="text-2xl font-bold text-white mb-8">
            Analyzing...
          </h2>
          
          <div className="relative space-y-4 max-w-md mx-auto">
            {LOADING_STEPS.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3 text-sm transition-all duration-500 text-left ${
                  loadingStep === idx 
                    ? "text-blue-300 opacity-100" 
                    : loadingStep > idx 
                      ? "text-white/50 opacity-90" 
                      : "text-white/30 opacity-40"
                }`}
              >
                {loadingStep > idx ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5 flex-shrink-0" />
                ) : (
                  <div className={`h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex-shrink-0 ${
                    loadingStep === idx ? "border-blue-400 border-t-transparent animate-spin" : "border-white/20"
                  }`} />
                )}
                <span className="text-xs">{step}</span>
              </div>
            ))}
          </div>
          
          <p className="mt-12 text-xs text-white/40">
            This usually takes 10-20 seconds...
          </p>
        </div>
      )}

    </div>
  );
}
