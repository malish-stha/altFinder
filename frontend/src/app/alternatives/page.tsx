"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useGetComparisonsQuery, useGetCategoriesQuery } from "../../lib/features/api/apiSlice";

export default function AlternativesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Simple debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch comparisons and categories from RTK Query
  const { data: comparisons = [], isFetching: loading } = useGetComparisonsQuery({
    q: debouncedSearch,
    category: selectedCategory,
  });

  const { data: categoriesData = [] } = useGetCategoriesQuery();
  const categories = ["All", ...categoriesData];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Soft background glow */}
      <div className="absolute top-12 right-12 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

      {/* Directory Page Header */}
      <div className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-foreground font-display mb-4">
          Software Directory
        </h1>
        <p className="text-sm text-muted-foreground font-sans max-w-2xl mb-8">
          Browse the complete list of free, open-source alternatives to expensive commercial software. Filter by category or search to find the perfect fit.
        </p>

        <div className="flex flex-col gap-6">
          {/* Search Input */}
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search paid software or open source alternatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-border bg-card/20 py-3 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground backdrop-blur-xl transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 hover:bg-card/30"
            />
          </div>
          
          {/* Category Filter Pills (Scrollable Row) */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-none flex-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-none px-4.5 py-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(20,184,166,0.35)] border border-primary"
                    : "bg-card/20 border border-border text-muted-foreground hover:bg-card/45 hover:border-border/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : comparisons.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((item) => (
            <div 
              key={item.slug} 
              className="group relative rounded-none border border-border bg-card/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/35 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            >
              <div>
                {/* Card Header (Category & Upvotes) */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider bg-card/50 text-muted-foreground border border-border font-sans">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-none border border-primary/20 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {item.upvoteCount} Upvotes
                  </span>
                </div>
                
                {/* Visual Comparison Title */}
                <h3 className="text-lg font-black tracking-tight text-foreground mb-3 font-display flex items-center flex-wrap gap-x-2">
                  <span className="text-muted-foreground line-through decoration-red-500/50 font-semibold text-base">{item.commercialName}</span>
                  <span className="text-primary text-sm font-bold">vs</span>
                  <span className="text-foreground">{item.alternativeName}</span>
                </h3>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-3 mb-6 font-sans leading-relaxed">
                  {item.alternativeDescription}
                </p>
              </div>

              {/* Card Footer (Savings & Action) */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/25 rounded-none font-sans">
                  Saves ${item.commercialPriceNumeric}/{item.commercialPricePeriod === "monthly" ? "mo" : "yr"}
                </span>
                <Link 
                  href={`/alternatives/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  View Comparison <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-none border border-dashed border-border bg-card/10 backdrop-blur-xl">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2 font-display">No Alternatives Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6 font-sans">
            We couldn&apos;t find comparisons for that query. You can ask our Gemini AI to analyze and generate a comparison instantly!
          </p>
          <Link href="/add">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-lg">
              Generate with AI
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
