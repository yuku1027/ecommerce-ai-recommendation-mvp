import type { Product } from "./product";

export type Recommendation = {
  product: Product;
  score: number;
  reasons: string[];
  matchedRules: string[];
};

export type RecommendationRequest = {
  viewedProductIds: string[];
  cartProductIds: string[];
  searchKeyword?: string;
  preferredCategory?: string;
  preferredBrand?: string;
};

export type BehaviorState = {
  viewedProducts: Product[];
  searchKeyword: string;
  selectedCategory: string;
  cartProductIds: string[];
};
