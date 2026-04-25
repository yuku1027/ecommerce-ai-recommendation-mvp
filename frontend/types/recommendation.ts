import type { Product } from "./product";

export type Recommendation = {
  product: Product;
  score: number;
  reasons: string[];
  matchedRules: string[];
};

export type BehaviorState = {
  viewedProducts: Product[];
  searchKeyword: string;
  selectedCategory: string;
  cartProductIds: string[];
};
