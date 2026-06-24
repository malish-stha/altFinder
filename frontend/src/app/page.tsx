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
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden pt-20 md:pt-32 pb-24 md:pb-40 select-none pointer-events-none">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 opacity-60"></div>
          <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 opacity-40"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">New</span>
              <span className="text-xs text-muted-foreground">AI-powered comparison analysis</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Left Column - Hero Text */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground font-display leading-[0.95]">
                  Replace expensive
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-display">
                    proprietary software
                  </span>
                  <br />
                  with open source.
                </h1>
                <p className="text-xl text-muted-foreground font-sans leading-relaxed max-w-2xl">
                  Discover powerful, free alternatives to everything. AI-powered comparisons that save your team thousands annually.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                <Link href="/add" className="inline-block pointer-events-auto">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold tracking-wide px-10 py-5 rounded-lg shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-200 w-full sm:w-auto">
                    Generate Your Comparison
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground font-sans">
                  <span className="font-semibold text-foreground">150+</span> comparisons • AI-powered • Free forever
                </p>
              </div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {/* Stat 1 */}
              <div className="group relative rounded-xl border border-border/50 bg-gradient-to-br from-card/60 to-card/30 p-6 backdrop-blur-md hover:border-primary/50 hover:bg-card/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Comparisons</p>
                  <p className="text-4xl font-black text-foreground font-display">150+</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group relative rounded-xl border border-border/50 bg-gradient-to-br from-card/60 to-card/30 p-6 backdrop-blur-md hover:border-primary/50 hover:bg-card/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Community</p>
                  <p className="text-4xl font-black text-foreground font-display">10k+</p>
                </div>
              </div>

              {/* Stat 3 Full Width */}
              <div className="col-span-2 group relative rounded-xl border border-border/50 bg-gradient-to-r from-primary/10 to-emerald-500/10 p-6 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Avg. Saved</p>
                      <p className="text-3xl font-black text-foreground font-display">$5k+/year</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 border-y border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-display mb-6">Why choose open source?</h2>
            <p className="text-lg text-muted-foreground">Everything you need, without the subscription burden</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-xl border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 space-y-6">
                <div className="w-14 h-14 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground font-display mb-3">100% Free</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    All alternatives are open source and completely free to use. Zero subscriptions. Zero vendor lock-in. Complete control.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 space-y-6">
                <div className="w-14 h-14 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground font-display mb-3">AI-Powered Analysis</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Gemini AI analyzes your specific needs and generates instant, detailed comparisons with real ROI calculations.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 space-y-6">
                <div className="w-14 h-14 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground font-display mb-3">Community Vetted</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Curated by thousands of developers. Real-world experiences, proven production use, and active development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
          
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
                    Calculate Your Savings
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Select subscriptions you currently pay for</p>
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {CALCULATOR_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCalculatorItem(item.id)}
                    className={`group relative rounded-lg border-2 p-4 transition-all duration-300 text-left overflow-hidden ${
                      checkedItems[item.id]
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/30 hover:border-primary/50 hover:bg-card/50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Monthly cost</p>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors ${
                        checkedItems[item.id] ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1 flex flex-col items-center justify-center rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-emerald-500/5 p-10 text-center sticky top-32">
              <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase font-sans">
                Your Yearly Savings
              </span>
              <div className="mt-6 space-y-2">
                <span className="block text-6xl font-black font-display bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <p className="text-sm text-muted-foreground font-sans">
                  {CALCULATOR_ITEMS.filter(item => checkedItems[item.id]).length} services selected
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-border/30 w-full">
                <p className="text-xs text-muted-foreground font-sans">
                  💡 Per user • Scale for team size
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
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
          <div className="flex justify-center items-center py-32">
            <div className="space-y-4 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading comparisons...</p>
            </div>
          </div>
        ) : comparisons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((item) => (
              <Link key={item.slug} href={`/alternatives/${item.slug}`}>
                <div 
                  className="group relative h-full rounded-xl border border-border/50 bg-gradient-to-br from-card/40 to-card/20 p-8 transition-all duration-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-card/60 hover:to-card/40 hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] overflow-hidden cursor-pointer flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  
                  <div className="relative space-y-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs px-3 py-1 font-bold uppercase tracking-wider bg-primary/15 text-primary rounded-full whitespace-nowrap border border-primary/20">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                        ★ {item.upvoteCount}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-foreground mb-2 font-display line-clamp-2">
                        <span className="text-muted-foreground font-bold">{item.commercialName}</span>
                      </h3>
                      <p className="text-sm text-primary font-bold flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        {item.alternativeName}
                      </p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 font-sans leading-relaxed flex-1">
                      {item.alternativeDescription}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50 mt-auto">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-sans">Annual savings</p>
                        <p className="text-lg font-black text-primary font-display">
                          ${item.commercialPriceNumeric * 12}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-xl border-2 border-dashed border-border/50 bg-gradient-to-br from-card/20 to-card/10 backdrop-blur-sm">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3 font-display">No comparisons found</h3>
            <p className="text-base text-muted-foreground max-w-sm mx-auto mb-10 font-sans">
              Generate a custom AI-powered comparison instantly to find the perfect open source alternative for your workflow.
            </p>
            <Link href="/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold px-8 py-4 rounded-lg shadow-lg shadow-primary/30 active:scale-95 transition-all">
                Create Your Comparison
              </Button>
            </Link>
          </div>
        )}

      </section>

      {/* CTA Footer Section */}
      <section className="relative mt-40 py-32 border-t border-border/30 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-foreground font-display leading-[1.15]">
              Start saving thousands
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                today.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
              Generate your first AI-powered comparison now. Discover the perfect free alternative and calculate your exact savings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
            <Link href="/add" className="inline-block pointer-events-auto">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold tracking-wide px-12 py-6 rounded-lg shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-200 w-full sm:w-auto">
                Generate Comparison Now
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-8 border-t border-border/30">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">No Card</p>
              <p className="text-sm text-foreground font-semibold mt-1">Required</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Always</p>
              <p className="text-sm text-foreground font-semibold mt-1">Free</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Open</p>
              <p className="text-sm text-foreground font-semibold mt-1">Source</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
