import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ComparisonItem {
  slug: string;
  commercialName: string;
  alternativeName: string;
  category: string;
  alternativeDescription: string;
  commercialPriceNumeric: number;
  commercialPricePeriod: string;
  upvoteCount: number;
}

export interface ComparisonDetail {
  slug: string;
  commercialName: string;
  alternativeName: string;
  category: string;
  commercialDescription: string;
  alternativeDescription: string;
  featuresTableJson: string;
  prosJson: string;
  consJson: string;
  whySwitchText: string;
  commercialWebsite: string;
  alternativeWebsite: string;
  alternativeRepo: string;
  commercialPriceNumeric: number;
  commercialPricePeriod: string;
  upvoteCount: number;
  seoTitle: string;
  seoDescription: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Comparison", "Bookmark"],
  endpoints: (builder) => ({
    getComparisons: builder.query<ComparisonItem[], { q?: string; category?: string }>({
      query: ({ q, category }) => {
        const queryParam = q ? `q=${encodeURIComponent(q)}` : "";
        const categoryParam = category && category !== "All" ? `category=${encodeURIComponent(category)}` : "";
        const params = [queryParam, categoryParam].filter(Boolean).join("&");
        return {
          url: `/api/alternatives${params ? `?${params}` : ""}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: "Comparison" as const, id: slug })),
              { type: "Comparison", id: "LIST" },
            ]
          : [{ type: "Comparison", id: "LIST" }],
    }),
    getCategories: builder.query<string[], void>({
      query: () => "/api/categories",
    }),
    getComparisonBySlug: builder.query<ComparisonDetail, string>({
      query: (slug) => `/api/alternatives/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Comparison", id: slug }],
    }),
    getBookmarks: builder.query<ComparisonItem[], string>({
      query: (token) => ({
        url: "/api/users/me/bookmarks",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: "Bookmark" as const, id: slug })),
              { type: "Bookmark", id: "LIST" },
            ]
          : [{ type: "Bookmark", id: "LIST" }],
    }),
    generateAlternative: builder.mutation<ComparisonDetail, { softwareName: string; token: string }>({
      query: ({ softwareName, token }) => ({
        url: `/api/alternatives/generate?softwareName=${encodeURIComponent(softwareName)}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Comparison", id: "LIST" }],
    }),
    toggleUpvote: builder.mutation<{ action: string; upvoteCount: number }, { slug: string; token: string }>({
      query: ({ slug, token }) => ({
        url: `/api/alternatives/${slug}/upvote`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Comparison", id: slug },
        { type: "Comparison", id: "LIST" },
      ],
    }),
    toggleBookmark: builder.mutation<{ action: string }, { slug: string; token: string }>({
      query: ({ slug, token }) => ({
        url: `/api/alternatives/${slug}/bookmark`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Bookmark", id: slug },
        { type: "Bookmark", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetComparisonsQuery,
  useGetCategoriesQuery,
  useGetComparisonBySlugQuery,
  useGetBookmarksQuery,
  useGenerateAlternativeMutation,
  useToggleUpvoteMutation,
  useToggleBookmarkMutation,
} = apiSlice;
