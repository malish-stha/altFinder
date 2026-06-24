"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calculator, Sparkles, ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGetComparisonsQuery, useGetCategoriesQuery } from "../lib/features/api/apiSlice";

interface CalculatorItem {
  id: string;
  name: string;
  price: number;
  period: string;
}

// Predefined commercial pricing for the calculator
const CALCULATOR_ITEMS: CalculatorItem[] = [
  { id: "photoshop", name: "Adobe Photoshop", price: 22.99, period: "monthly" },
  { id: "zapier", name: "Zapier Pro", price: 29.99, period: "monthly" },
  { id: "salesforce", name: "Salesforce CRM", price: 75.00, period: "monthly" },
  { id: "slack", name: "Slack Pro (per user)", price: 8.75, period: "monthly" },
  { id: "msoffice", name: "Microsoft 365", price: 12.50, period: "monthly" },
  { id: "jira", name: "Jira Premium", price: 15.25, period: "monthly" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Simple debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, debouncedSearch]);

  // Fetch comparisons and categories from RTK Query
  const { data: comparisons = [], isFetching: loading } = useGetComparisonsQuery({
    q: debouncedSearch,
    category: selectedCategory,
  });

  const { data: categoriesData = [] } = useGetCategoriesQuery();
  const categories = ["All", ...categoriesData];

  // Savings Calculator State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Calculate savings dynamically during render
  const monthlySavings = CALCULATOR_ITEMS.reduce((sum, item) => {
    return checkedItems[item.id] ? sum + item.price : sum;
  }, 0);
  const yearlySavings = monthlySavings * 12;

  // Savings are calculated dynamically in render

  const toggleCalculatorItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column - Headline & CTA */}
          <div className="lg:col-span-8 flex flex-col space-y-6 relative">
            {/* Soft background glow for headline */}
            <div className="absolute -inset-10 -z-10 bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-none border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase font-sans">
                <span className="text-[10px] animate-pulse">✨</span> The Open Source Directory
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl text-foreground font-display leading-[1.05]">
              Find smarter
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent font-display">
                alternatives
              </span>
              <br />
              to everything.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-xl">
              Discover powerful open source solutions that replace expensive proprietary software. Save thousands. Build smarter. Own your stack.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
              <Link href="/add" className="inline-block group">
                <Button className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold tracking-widest uppercase px-6 py-4 rounded-none shadow-[0_0_20px_rgba(20,184,166,0.35)] hover:shadow-[0_0_30px_rgba(20,184,166,0.55)] transition-all duration-300 flex items-center gap-2">
                  <span>Generate Comparison</span>
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground transition-transform duration-300 group-hover:rotate-45 group-hover:scale-120" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Powered by AI analysis • Instant comparisons</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats stack */}
          <div className="lg:col-span-4 flex flex-col space-y-3.5 w-full lg:max-w-sm lg:ml-auto relative">
            {/* Halo glow centered behind stats stack */}
            <div className="absolute -inset-10 -z-10 bg-cyan-500/12 blur-[80px] rounded-full pointer-events-none" />
            {/* Comparisons Stat */}
            <div className="group rounded-none border border-border bg-card/20 px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:bg-card/35 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(20,184,166,0.1)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">
                    Comparisons
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/10 rounded-none">
                  +12 new
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-display leading-none mt-1">150+</div>
              <div className="text-xs text-muted-foreground font-sans mt-1.5">
                Open source options analyzed
              </div>
            </div>

            {/* Community Stat */}
            <div className="group rounded-none border border-border bg-card/20 px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:bg-card/35 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(20,184,166,0.1)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">
                    Community
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/10 rounded-none">
                  Active
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-display leading-none mt-1">10k+</div>
              <div className="text-xs text-muted-foreground font-sans mt-1.5">
                Developers exploring alternatives
              </div>
            </div>

            {/* Average Stat */}
            <div className="group rounded-none border border-border bg-card/20 px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:bg-card/35 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(20,184,166,0.1)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">
                    Average
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-none">
                  Saved
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-display leading-none mt-1">$5k+</div>
              <div className="text-xs text-muted-foreground font-sans mt-1.5">
                Saved per organization
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="mb-16 rounded-none border border-border bg-card/50 p-6 backdrop-blur-xl md:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight text-foreground uppercase font-display">
                Open Source Savings Calculator
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-sans">
              Select the software services you are currently paying for to estimate how much you would save by migrating to open-source alternatives:
            </p>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {CALCULATOR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCalculatorItem(item.id)}
                  className={`flex items-center justify-between rounded-none border p-4 text-left transition-all ${
                    checkedItems[item.id]
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(20,184,166,0.15)] text-foreground font-semibold"
                      : "border-border bg-card/30 text-muted-foreground hover:border-border/80 hover:bg-card/50"
                  }`}
                >
                  <span className="text-sm font-semibold font-sans">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-none font-mono ${
                    checkedItems[item.id] ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    ${item.price.toFixed(2)}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-none bg-card/30 border border-border p-8 text-center h-full min-h-[220px]">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase font-sans">
              Estimated Yearly Savings
            </span>
            <span className="mt-4 text-5xl font-black font-display bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="mt-4 text-xs text-muted-foreground font-sans max-w-[280px]">
              Calculated based on standard single-user license fees. Real savings scale up for large team environments.
            </p>
          </div>
          
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section className="mt-8">
        <div className="border-b border-border pb-6 mb-8">
          <h2 className="text-xl font-black uppercase tracking-wider text-foreground font-display mb-6">
            Software Directory
          </h2>
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
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.slice(0, visibleCount).map((item) => (
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

            {/* Load More Button */}
            {comparisons.length > visibleCount && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="bg-card/30 hover:bg-card/50 border border-border text-foreground hover:text-primary text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-none active:scale-[0.98] transition-all duration-300"
                >
                  Load More Alternatives
                </Button>
              </div>
            )}
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

      </section>

    </div>
  );
}
