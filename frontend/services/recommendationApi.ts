import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiClient";
import type { Product } from "@/types/product";
import type { Recommendation, RecommendationRequest } from "@/types/recommendation";

// --- 底層 fetch 函式 ---

export function getProducts(signal?: AbortSignal) {
  return apiRequest<Product[]>("/api/products", { signal });
}

export function getProductById(productId: string, signal?: AbortSignal) {
  return apiRequest<Product>(`/api/products/${encodeURIComponent(productId)}`, { signal });
}

export function getRecommendations(request: RecommendationRequest, signal?: AbortSignal) {
  return apiRequest<Recommendation[]>("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(request),
    signal,
  });
}

// --- TanStack Query hooks ---

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => getProducts(signal),
  });
}

export function useRecommendationsMutation() {
  return useMutation({
    mutationFn: (request: RecommendationRequest) => getRecommendations(request),
  });
}
