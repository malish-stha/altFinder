"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { ArrowRight, ShieldCheck, Heart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  useGetBookmarksQuery,
  useToggleBookmarkMutation
} from "../../lib/features/api/apiSlice";

export default function UserProfile() {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  // Fetch Clerk Auth token for query/mutation
  useEffect(() => {
    if (isSignedIn) {
      getToken().then((t) => setToken(t));
    } else {
      Promise.resolve().then(() => {
        setToken((prev) => (prev === null ? prev : null));
      });
    }
  }, [isSignedIn, getToken]);

  // Fetch bookmarks from RTK Query
  const { data: bookmarks = [], isLoading: loading } = useGetBookmarksQuery(token ?? "", { skip: !token });

  const [toggleBookmark] = useToggleBookmarkMutation();

  // Calculate aggregates dynamically during render
  const yearlySavings = bookmarks.reduce((sum, item) => {
    const price = item.commercialPriceNumeric;
    const monthlyEquivalent = item.commercialPricePeriod === "yearly" ? price / 12 : price;
    return sum + (monthlyEquivalent * 12);
  }, 0);

  const removeBookmark = async (slug: string) => {
    try {
      const authToken = await getToken();
      await toggleBookmark({ slug, token: authToken ?? "" }).unwrap();
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header breadcrumb */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>

      {/* User Introduction Banner */}
      <section className="mb-12 rounded-none border border-border bg-card/50 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt="Profile Avatar"
                className="h-16 w-16 rounded-none border-2 border-primary/20"
              />
            ) : (
              <div className="h-16 w-16 rounded-none bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-foreground text-2xl">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-none font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/10">
                AltFinder Member
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-foreground font-display">
                Hello, {user?.firstName || "Explorer"}!
              </h1>
            </div>
          </div>

          <div className="flex flex-col rounded-none bg-card/30 border border-border px-6 py-4 min-w-[200px]">
            <span className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Managed Savings
            </span>
            <span className="text-3xl font-black text-primary font-display mt-1 drop-shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              ${yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/yr
            </span>
            <span className="text-xxs text-muted-foreground font-sans mt-0.5">
              Saved from {bookmarks.length} tools
            </span>
          </div>
        </div>
      </section>

      {/* My Bookmarked Open Source Stack */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-6 font-display uppercase flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary fill-current" /> My Open Source Suite
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((item) => (
              <div
                key={item.slug}
                className="group relative rounded-none border border-border bg-card/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-0.5 rounded-none font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                    {item.category}
                  </span>

                  <button
                    onClick={() => removeBookmark(item.slug)}
                    className="p-1.5 rounded-none text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 border border-transparent transition-all"
                    title="Remove from stack"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-foreground mb-2 font-display">
                  {item.commercialName} <span className="text-muted-foreground font-normal">vs</span> {item.alternativeName}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 mb-6 font-sans">
                  {item.alternativeDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-primary font-mono font-semibold">
                    Saves ${item.commercialPriceNumeric}/{item.commercialPricePeriod === "monthly" ? "mo" : "yr"}
                  </span>
                  <Link
                    href={`/alternatives/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-none border border-dashed border-border bg-card/10 backdrop-blur-xl">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2 font-display">Your Stack is Empty</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6 font-sans">
              You haven&apos;t bookmarked any open-source alternatives yet. Explore the directory and add tools to your custom stack!
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-lg">
                Explore Directory
              </Button>
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
