"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CalculatorItem {
  id: string;
  name: string;
  price: number;
  period: string;
}

interface ComparisonItem {
  slug: string;
  commercialName: string;
  alternativeName: string;
  category: string;
  alternativeDescription: string;
  commercialPriceNumeric: number;
  commercialPricePeriod: string;
  upvoteCount: number;
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
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Savings Calculator State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Calculate savings dynamically during render
  const monthlySavings = CALCULATOR_ITEMS.reduce((sum, item) => {
    return checkedItems[item.id] ? sum + item.price : sum;
  }, 0);
  const yearlySavings = monthlySavings * 12;

  // Fetch comparisons from backend
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
        const categoryParam = selectedCategory !== "All" ? `category=${encodeURIComponent(selectedCategory)}` : "";
        
        const params = [queryParam, categoryParam].filter(Boolean).join("&");
        const res = await fetch(`${API_URL}/api/alternatives${params ? `?${params}` : ""}`);
        
        if (res.ok) {
          const data = await res.json();
          setComparisons(data);
        }
      } catch (err) {
        console.error("Failed to fetch comparisons:", err);
      } finally {
        setLoading(false);
      }
    }
    
    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Fetch unique categories
  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(["All", ...data]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCats();
  }, []);

  // Savings are calculated dynamically in render

  const toggleCalculatorItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-display">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Open Source Alternatives
          </span>
          <br />
          <span className="text-white">To Expensive Proprietary Tools</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 font-sans">
          Discover high-quality, free, open-source software to replace expensive software subscriptions. Save money, avoid licensing lock-ins, and control your data.
        </p>
      </section>

      {/* Savings Calculator Widget */}
      <section className="mb-16 rounded-2xl border border-white/5 bg-white/2 p-6 backdrop-blur-xl md:p-8">
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
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    checkedItems[item.id]
                      ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-white"
                      : "border-white/5 bg-white/2 text-slate-300 hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm font-semibold font-sans">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-md font-mono ${
                    checkedItems[item.id] ? "bg-indigo-500/25 text-indigo-200" : "bg-white/5 text-slate-400"
                  }`}>
                    ${item.price.toFixed(2)}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white/2 border border-white/5 p-8 text-center h-full min-h-[220px]">
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
              className="w-full rounded-xl border border-white/5 bg-white/2 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 backdrop-blur-xl transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all ${
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
                className="group relative rounded-2xl border border-white/5 bg-white/2 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/5">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/10">
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
          <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/1 backdrop-blur-xl">
            <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-display">No Alternatives Found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6 font-sans">
              We couldn&apos;t find comparisons for that query. You can ask our Gemini AI to analyze and generate a comparison instantly!
            </p>
            <Link href="/add">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg">
                Generate with AI
              </Button>
            </Link>
          </div>
        )}

      </section>

    </div>
  );
}
