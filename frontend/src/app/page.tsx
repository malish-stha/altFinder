"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGetComparisonsQuery, useGetCategoriesQuery } from "../lib/features/api/apiSlice";
import ThreeFullPageBackground from "../components/ThreeFullPageBackground";

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
      <ThreeFullPageBackground />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-24 mb-16 select-none pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Lower Left Headline */}
          <div className="md:col-span-8 flex flex-col justify-end pt-12 md:pt-36 order-2 md:order-1">
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-foreground font-display leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              The world&apos;s
              <br />
              most powerful
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent font-display">
                open source
              </span>
              <br />
              directory.
            </h1>
          </div>

          {/* Upper Right Subtitle & Description */}
          <div className="md:col-span-4 flex flex-col justify-between pt-4 pb-6 md:pb-2 text-left order-1 md:order-2">
            <div className="max-w-xs md:ml-auto">
              <p className="text-xs font-bold tracking-widest text-teal-400 uppercase font-sans mb-3">
                AltFinder Core
              </p>
              <p className="text-xl md:text-2xl font-medium text-foreground/90 font-sans leading-tight">
                Find alternatives using open source instead of expensive code.
              </p>
            </div>
            
            <div className="max-w-xs md:ml-auto mt-12 md:mt-32">
              <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Your software stack should be a channel for growth, not an engineering or subscription license expense challenge.
              </p>
              <Link href="/add" className="inline-block pointer-events-auto">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-none shadow-lg shadow-teal-500/10 active:scale-95 transition-all">
                  Generate with AI
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="mb-16 rounded-none border border-white/5 bg-white/2 p-6 backdrop-blur-xl md:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold tracking-tight text-white uppercase font-display">
                Open Source Savings Calculator
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-6 font-sans">
              Select the software services you are currently paying for to estimate how much you would save by migrating to open-source alternatives:
            </p>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {CALCULATOR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCalculatorItem(item.id)}
                  className={`flex items-center justify-between rounded-none border p-4 text-left transition-all ${
                    checkedItems[item.id]
                      ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-white"
                      : "border-white/5 bg-white/2 text-slate-300 hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm font-semibold font-sans">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-none font-mono ${
                    checkedItems[item.id] ? "bg-indigo-500/25 text-indigo-200" : "bg-white/5 text-slate-400"
                  }`}>
                    ${item.price.toFixed(2)}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-none bg-white/2 border border-white/5 p-8 text-center h-full min-h-[220px]">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-sans">
              Estimated Yearly Savings
            </span>
            <span className="mt-4 text-5xl font-black font-display bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="mt-4 text-xs text-slate-500 font-sans max-w-[280px]">
              Calculated based on standard single-user license fees. Real savings scale up for large team environments.
            </p>
          </div>
          
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section>
        
        {/* Search & Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search commercial or open source software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-white/5 bg-white/2 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 backdrop-blur-xl transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-none px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                    : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : comparisons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((item) => (
              <div 
                key={item.slug} 
                className="group relative rounded-none border border-white/5 bg-white/2 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-0.5 rounded-none font-semibold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/5">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-none border border-green-500/10">
                    {item.upvoteCount} Upvotes
                  </span>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-white mb-2 font-display">
                  {item.commercialName} <span className="text-slate-500 font-normal">vs</span> {item.alternativeName}
                </h3>
                
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 font-sans">
                  {item.alternativeDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500 font-mono">
                    Saves ${item.commercialPriceNumeric}/{item.commercialPricePeriod === "monthly" ? "mo" : "yr"}
                  </span>
                  <Link 
                    href={`/alternatives/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                  >
                    View Comparison <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-none border border-dashed border-white/10 bg-white/1 backdrop-blur-xl">
            <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-display">No Alternatives Found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6 font-sans">
              We couldn&apos;t find comparisons for that query. You can ask our Gemini AI to analyze and generate a comparison instantly!
            </p>
            <Link href="/add">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-none shadow-lg">
                Generate with AI
              </Button>
            </Link>
          </div>
        )}

      </section>

    </div>
  );
}
