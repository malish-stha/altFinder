"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { 
  ArrowLeft, ThumbsUp, Bookmark, Globe, AlertCircle,
  Star, GitFork, Clock, Check, X, ExternalLink
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  useGetComparisonBySlugQuery,
  useToggleUpvoteMutation,
  useToggleBookmarkMutation,
  useGetBookmarksQuery
} from "../../../lib/features/api/apiSlice";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface FeatureRow {
  feature: string;
  commercial: string;
  alternative: string;
  status: string;
}

interface GithubStats {
  stars: number;
  forks: number;
  lastCommit: string;
}

export default function AlternativeDetail({ params: paramsPromise }: PageProps) {
  // Unwrap params using React.use() which is required in Next.js 15+
  const params = use(paramsPromise);
  const slug = params.slug;

  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);

  // Fetch Clerk Auth token for queries/mutations
  useEffect(() => {
    if (isSignedIn) {
      getToken().then((t) => setToken(t));
    } else {
      Promise.resolve().then(() => {
        setToken((prev) => (prev === null ? prev : null));
      });
    }
  }, [isSignedIn, getToken]);

  // Fetch comparison details via RTK Query
  const { 
    data: comparison, 
    isLoading: loading, 
    isError: error 
  } = useGetComparisonBySlugQuery(slug);

  // Fetch bookmarks via RTK Query
  const { data: bookmarks = [] } = useGetBookmarksQuery(token ?? "", { skip: !token });
  const hasBookmarked = bookmarks.some((item) => item.slug === slug);

  // Mutations
  const [toggleUpvote] = useToggleUpvoteMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const upvoteCount = comparison?.upvoteCount ?? 0;

  // GitHub Stats State
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);

  // Fetch GitHub live stats once comparison loads
  useEffect(() => {
    if (!comparison || !comparison.alternativeRepo) return;

    const repo = comparison.alternativeRepo.trim();

    async function fetchGitHubData() {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`);
        if (res.ok) {
          const data = await res.json();
          setGithubStats({
            stars: data.stargazers_count,
            forks: data.forks_count,
            lastCommit: new Date(data.pushed_at).toLocaleDateString(),
          });
        }
      } catch (err) {
        console.error("Failed to load GitHub stats:", err);
      }
    }
    fetchGitHubData();
  }, [comparison]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2 font-display">Comparison Not Found</h2>
        <p className="text-muted-foreground mb-6 font-sans">
          The requested software comparison does not exist in our database yet. You can submit it to let Gemini build it!
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const features: FeatureRow[] = comparison.featuresTableJson ? JSON.parse(comparison.featuresTableJson) : [];
  const pros: string[] = comparison.prosJson ? JSON.parse(comparison.prosJson) : [];
  const cons: string[] = comparison.consJson ? JSON.parse(comparison.consJson) : [];

  // Toggle upvote in database
  const handleUpvote = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    try {
      const authToken = await getToken();
      const res = await toggleUpvote({ slug, token: authToken ?? "" }).unwrap();
      setHasUpvoted(res.action === "added");
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  // Toggle bookmark in database
  const handleBookmark = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    try {
      const authToken = await getToken();
      await toggleBookmark({ slug, token: authToken ?? "" }).unwrap();
    } catch (err) {
      console.error("Failed to bookmark:", err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Structured Schema JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": comparison.seoTitle || `${comparison.commercialName} vs ${comparison.alternativeName} - Comparison`,
            "description": comparison.seoDescription,
            "mainEntity": {
              "@type": "Product",
              "name": comparison.alternativeName,
              "description": comparison.alternativeDescription,
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }
          }),
        }}
      />

      {/* Navigation & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
        
        {/* Upvote & Bookmark Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleUpvote}
            className={`inline-flex items-center gap-2 rounded-none border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
              hasUpvoted 
                ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                : "bg-card/30 border-border text-muted-foreground hover:bg-card/50 hover:border-border/80"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Upvote ({upvoteCount})
          </button>
          
          <button 
            onClick={handleBookmark}
            className={`inline-flex items-center justify-center rounded-none border p-2 transition-all ${
              hasBookmarked 
                ? "bg-primary/25 border-primary text-primary shadow-[0_0_15px_rgba(20,184,166,0.2)]" 
                : "bg-card/30 border-border text-muted-foreground hover:bg-card/50 hover:border-border/80"
            }`}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Showcase Title */}
      <section className="mb-12">
        <span className="text-xs px-2.5 py-0.5 rounded-none font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/10">
          {comparison.category}
        </span>
        <h1 className="text-3xl md:text-5xl font-black mt-3 tracking-tight text-foreground font-display">
          {comparison.commercialName} <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Alternative:</span> {comparison.alternativeName}
        </h1>
        
        {/* GitHub stats integration */}
        {githubStats && (
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/10 text-yellow-300 px-3 py-1 rounded-none text-xs font-mono">
              <Star className="h-3.5 w-3.5 fill-current" /> {githubStats.stars.toLocaleString()} Stars
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/10 text-primary px-3 py-1 rounded-none text-xs font-mono">
              <GitFork className="h-3.5 w-3.5" /> {githubStats.forks.toLocaleString()} Forks
            </div>
            <div className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/10 text-teal-300 px-3 py-1 rounded-none text-xs font-mono">
              <Clock className="h-3.5 w-3.5" /> Updated {githubStats.lastCommit}
            </div>
          </div>
        )}
      </section>

      {/* Pricing Comparison Cards */}
      <section className="grid gap-6 md:grid-cols-2 mb-12">
        
        {/* Commercial Tool */}
        <div className="rounded-none border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-red-400 tracking-wider uppercase font-display">Proprietary Software</span>
            <X className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-display">{comparison.commercialName}</h3>
          <p className="mt-3 text-sm text-muted-foreground font-sans">{comparison.commercialDescription}</p>
          <div className="mt-6 pt-4 border-t border-border flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground font-display">
              ${comparison.commercialPriceNumeric.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground font-sans">/{comparison.commercialPricePeriod === "monthly" ? "month" : "year"}</span>
          </div>
        </div>

        {/* Open Source Tool */}
        <div className="rounded-none border border-primary/20 bg-primary/5 p-6 backdrop-blur-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-primary tracking-wider uppercase font-display">Open Source Alternative</span>
            <Check className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-display">{comparison.alternativeName}</h3>
          <p className="mt-3 text-sm text-muted-foreground font-sans">{comparison.alternativeDescription}</p>
          <div className="mt-6 pt-4 border-t border-border flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary font-display">$0.00</span>
            <span className="text-sm text-primary/70 font-sans font-semibold uppercase tracking-wider">Free & Open Source</span>
          </div>
        </div>

      </section>

      {/* Feature Comparison Table */}
      {features.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6 font-display uppercase">Side-By-Side Comparison</h2>
          <div className="overflow-hidden rounded-none border border-border bg-card/50 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-foreground font-bold uppercase tracking-wider text-xs font-display border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Key Criteria</th>
                    <th className="px-6 py-4">{comparison.commercialName}</th>
                    <th className="px-6 py-4">{comparison.alternativeName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {features.map((row, idx) => (
                    <tr key={idx} className="hover:bg-card/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{row.feature}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.commercial}</td>
                      <td className="px-6 py-4 text-foreground font-medium">{row.alternative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Pros & Cons Grid */}
      <section className="grid gap-6 md:grid-cols-2 mb-12">
        
        {/* Pros */}
        <div className="rounded-none border border-border bg-card/30 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-primary font-display mb-4 uppercase">Why Switch (Pros of {comparison.alternativeName})</h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            {pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="rounded-none border border-border bg-card/30 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-red-400 font-display mb-4 uppercase">Trade-Offs (Cons of {comparison.alternativeName})</h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            {cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* Expert Analysis */}
      <section className="rounded-none border border-border bg-card/50 p-6 md:p-8 backdrop-blur-xl mb-12">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-4 font-display uppercase">Why Migrate? Expert Analysis</h2>
        <p className="text-muted-foreground text-sm leading-relaxed font-sans">
          {comparison.whySwitchText}
        </p>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-col sm:flex-row justify-center gap-4">
        {comparison.commercialWebsite && (
          <a href={comparison.commercialWebsite} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-none px-6 py-5">
              <Globe className="h-4 w-4 mr-2" />
              Visit {comparison.commercialName} <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </a>
        )}
        {comparison.alternativeWebsite && (
          <a href={comparison.alternativeWebsite} target="_blank" rel="noopener noreferrer">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-5 shadow-lg">
              <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Get {comparison.alternativeName} <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </a>
        )}
      </section>

    </div>
  );
}
