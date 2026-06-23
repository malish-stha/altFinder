"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calculator, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 mb-20 select-none pointer-events-none">
        <div className="space-y-12 md:space-y-20">
          
          {/* Header Label */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase font-sans mb-8">
              Open Source Directory
            </p>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground font-display leading-[1.1] mb-8">
              Find smarter
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-display">
                alternatives.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed max-w-2xl">
              Discover powerful open source solutions that replace expensive proprietary software. Build smarter, spend less, and own your stack.
            </p>
          </div>

          {/* CTA & Description */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-12 gap-6">
            <Link href="/add" className="inline-block pointer-events-auto w-fit">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold tracking-wide px-8 py-3.5 rounded-none shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Generate Comparison
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground font-sans max-w-sm">
              Compare popular tools with open source alternatives powered by AI analysis.
            </p>
          </div>

        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="mb-24 border border-border bg-card/30 p-8 md:p-12 backdrop-blur-sm">
        <div className="grid gap-12 lg:grid-cols-3 lg:items-center">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                Savings Calculator
              </h2>
            </div>
            <p className="text-base text-muted-foreground mb-8 font-sans leading-relaxed">
              Select your current software subscriptions to see potential yearly savings with open source alternatives.
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {CALCULATOR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCalculatorItem(item.id)}
                  className={`flex items-center justify-between border p-4 transition-all duration-300 ${
                    checkedItems[item.id]
                      ? "border-primary bg-primary/5 text-foreground font-semibold"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-card/40"
                  }`}
                >
                  <span className="text-sm font-medium font-sans">{item.name}</span>
                  <span className={`text-xs px-3 py-1 font-mono font-semibold ${
                    checkedItems[item.id] ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                  }`}>
                    ${item.price.toFixed(2)}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col items-center justify-center border border-border bg-primary/5 p-8 text-center">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase font-sans">
              Annual Savings
            </span>
            <span className="mt-4 text-5xl md:text-6xl font-black font-display bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="mt-6 text-xs text-muted-foreground font-sans">
              Per user. Multiply for teams.
            </p>
          </div>
          
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section>
        
        {/* Search & Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools, software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border bg-card/30 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-transparent border-border text-muted-foreground hover:bg-card/40 hover:border-primary/50"
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
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : comparisons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((item) => (
              <Link key={item.slug} href={`/alternatives/${item.slug}`}>
                <div 
                  className="group relative border border-border bg-card/20 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/40 hover:shadow-[0_12px_40px_rgba(20,184,166,0.1)] h-full flex flex-col cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <span className="text-xs px-3 py-1 font-semibold uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border/50 whitespace-nowrap">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-primary whitespace-nowrap">
                      ★ {item.upvoteCount}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-3 font-display">
                    <span className="text-muted-foreground">{item.commercialName}</span>
                    <br />
                    <span className="text-primary">→ {item.alternativeName}</span>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-sans flex-1">
                    {item.alternativeDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-primary font-semibold">
                      Save ${item.commercialPriceNumeric}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border/50 bg-card/10">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2 font-display">No results found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 font-sans">
              Generate a custom comparison with AI to find the perfect alternative.
            </p>
            <Link href="/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-6 py-3 shadow-lg shadow-primary/20">
                Generate Comparison
              </Button>
            </Link>
          </div>
        )}

      </section>

    </div>
  );
}
