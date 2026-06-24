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
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-12">
            
            {/* Small Label */}
            <div>
              <span className="text-sm text-primary font-semibold">open source directory</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Find the open source alternative
                <br />
                <span className="text-primary">to everything.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Skip the expensive subscriptions. Discover free, open source tools that do the same job—or better.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link href="/add" className="inline-block pointer-events-auto">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  Generate Comparison
                </Button>
              </Link>
            </div>

            {/* Simple Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border">
              <div>
                <p className="text-3xl font-bold text-foreground">150+</p>
                <p className="text-sm text-muted-foreground mt-1">comparisons</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">10k+</p>
                <p className="text-sm text-muted-foreground mt-1">users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">$5k+</p>
                <p className="text-sm text-muted-foreground mt-1">saved annually</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-4xl font-bold text-primary mb-3">100%</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Free & Open</h3>
              <p className="text-sm text-muted-foreground">No subscriptions. No vendor lock-in. Complete control.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-3">⚡</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Instant comparisons with real ROI calculations.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-3">✓</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Verified</h3>
              <p className="text-sm text-muted-foreground">Curated by developers. Production-ready tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How much could you save?</h2>
              <p className="text-muted-foreground">Select the tools you're currently paying for</p>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {CALCULATOR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCalculatorItem(item.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    checkedItems[item.id]
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}/mo</p>
                </button>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">Annual savings</p>
              <p className="text-5xl font-bold text-primary">
                ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground mt-4">for {CALCULATOR_ITEMS.filter(item => checkedItems[item.id]).length || 0} services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Search & Filter */}
          <div className="space-y-6 mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alternatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : comparisons.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {comparisons.map((item) => (
                <Link key={item.slug} href={`/alternatives/${item.slug}`}>
                  <div className="group p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="text-xs font-semibold text-primary uppercase">{item.category}</span>
                      <span className="text-xs text-muted-foreground">★ {item.upvoteCount}</span>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">
                      {item.commercialName}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">→ {item.alternativeName}</p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {item.alternativeDescription}
                    </p>

                    <div className="flex items-center justify-between text-sm text-primary font-semibold">
                      <span>Save ${item.commercialPriceNumeric * 12}/yr</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">No comparisons yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Generate your first custom comparison with AI</p>
              <Link href="/add">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2">
                  Create One
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Ready to switch?</h2>
            <p className="text-muted-foreground">Generate your first comparison and see how much you could save.</p>
          </div>
          <Link href="/add" className="inline-block pointer-events-auto">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Generate Comparison
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
