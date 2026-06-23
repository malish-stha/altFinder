"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <section className="mb-24">
        <div className="space-y-12">
          {/* Headline */}
          <div>
            <p className="text-sm text-muted-foreground font-medium tracking-widest uppercase mb-4">Open Source Directory</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight max-w-4xl">
              Find free alternatives to expensive software.
            </h1>
            <p className="text-xl text-muted-foreground mt-8 max-w-2xl leading-relaxed font-light">
              Discover open-source alternatives to popular commercial tools. Save your team thousands on subscriptions while getting powerful features.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/add" className="inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
                Generate Comparison
              </Button>
            </Link>
            <Link href="/" className="inline-block">
              <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-8 py-3 rounded-lg border border-border transition-colors">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Savings Calculator Widget */}
      <section className="mb-24 border border-border rounded-xl bg-card p-8 md:p-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-foreground mb-3">Estimate Your Savings</h2>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Select the tools you currently pay for to see how much you could save annually with open-source alternatives.
            </p>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {CALCULATOR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCalculatorItem(item.id)}
                  className={`flex items-center justify-between border rounded-lg p-3 text-left transition-all ${
                    checkedItems[item.id]
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    checkedItems[item.id] ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    ${item.price.toFixed(2)}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center border border-border rounded-xl bg-secondary p-8 text-center">
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Yearly Savings
            </span>
            <span className="mt-4 text-5xl font-bold text-foreground">
              ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="mt-4 text-xs text-muted-foreground max-w-[280px]">
              Based on single-user pricing. Savings increase with team size.
            </p>
          </div>
          
        </div>
      </section>

      {/* Main Directory & Filters */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8">Browse Alternatives</h2>
        
        {/* Search & Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alternatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border bg-secondary rounded-lg py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary border border-border text-muted-foreground hover:bg-card"
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
              <Link
                key={item.slug}
                href={`/alternatives/${item.slug}`}
                className="group border border-border rounded-xl bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-secondary text-muted-foreground">
                    {item.category}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    ↑ {item.upvoteCount}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.commercialName}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  vs <span className="font-semibold text-foreground">{item.alternativeName}</span>
                </p>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.alternativeDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Saves ${item.commercialPriceNumeric}/{item.commercialPricePeriod === "monthly" ? "mo" : "yr"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border rounded-xl bg-card">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Results Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Couldn&apos;t find any comparisons. Generate a new one with AI.
            </p>
            <Link href="/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                Generate Comparison
              </Button>
            </Link>
          </div>
        )}

      </section>

    </div>
  );
}
