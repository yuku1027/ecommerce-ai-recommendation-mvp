"use client";

import { useEffect, useMemo, useState } from "react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { BehaviorPanel } from "@/components/BehaviorPanel";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { RecommendationSection } from "@/components/RecommendationSection";
import { SearchBar } from "@/components/SearchBar";
import { getApiBaseUrl } from "@/lib/apiClient";
import { buildProductSearchString } from "@/lib/productSearchTags";
import { useProductsQuery, useRecommendationsMutation } from "@/services/recommendationApi";
import type { Product } from "@/types/product";
import type { BehaviorState, RecommendationRequest } from "@/types/recommendation";
import {
  Box,
  Chip,
  Container,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

const themeStorageKey = "ecommerce-ai-recommendation-theme";

export default function Home() {
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

  const { data: products = [], isLoading: isProductsLoading, error: productsError } = useProductsQuery();
  const {
    mutate: fetchRecommendations,
    data: recommendations = [],
    isPending: isRecommendationsLoading,
    error: recommendationsError,
  } = useRecommendationsMutation();

  // 初次進入頁面：以空行為取得預設熱門推薦
  useEffect(() => {
    fetchRecommendations({ viewedProductIds: [], cartProductIds: [] });
  }, [fetchRecommendations]);

  // theme 持久化
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsDarkMode(window.localStorage.getItem(themeStorageKey) === "dark");
      setHasLoadedTheme(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!hasLoadedTheme) return;
    window.localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
  }, [hasLoadedTheme, isDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: { main: "#22577a" },
          secondary: { main: "#38a3a5" },
          background: {
            default: isDarkMode ? "#0f172a" : "#f6f7fb",
            paper: isDarkMode ? "#111827" : "#ffffff",
          },
        },
        shape: { borderRadius: 8 },
        typography: { fontFamily: "Arial, Helvetica, sans-serif" },
      }),
    [isDarkMode],
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  const viewedProductIds = useMemo(
    () => viewedProducts.map((p) => p.id),
    [viewedProducts],
  );

  const filteredProducts = useMemo(() => {
    const keyword = confirmedKeyword.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesKeyword = keyword
        ? buildProductSearchString(product).includes(keyword)
        : true;
      return matchesCategory && matchesKeyword;
    });
  }, [products, confirmedKeyword, selectedCategory]);

  const behavior: BehaviorState = {
    viewedProducts,
    searchKeyword: confirmedKeyword,
    selectedCategory,
    cartProductIds,
  };

  const recommendationBasis = [
    viewedProducts[0] ? `最近瀏覽：${viewedProducts[0].name}` : "預設：近期熱門商品",
    confirmedKeyword ? `搜尋：${confirmedKeyword}` : "尚未搜尋",
    selectedCategory ? `分類：${selectedCategory}` : "全部分類",
    cartProductIds.length > 0 ? `購物車：${cartProductIds.length} 件` : "購物車尚空",
  ];

  // 組合推薦 request，允許呼叫方傳入即時值覆蓋 state（避免 setState 非同步問題）
  function buildRequest(overrides: Partial<RecommendationRequest>): RecommendationRequest {
    return {
      viewedProductIds,
      cartProductIds,
      searchKeyword: confirmedKeyword || undefined,
      preferredCategory: selectedCategory || undefined,
      ...overrides,
    };
  }

  function handleViewProduct(product: Product) {
    const newViewed = [product, ...viewedProducts.filter((p) => p.id !== product.id)];
    setViewedProducts(newViewed);
    fetchRecommendations(buildRequest({ viewedProductIds: newViewed.map((p) => p.id) }));
  }

  function handleAddToCart(product: Product) {
    const newViewed = [product, ...viewedProducts.filter((p) => p.id !== product.id)];
    const newCartIds = cartProductIds.includes(product.id)
      ? cartProductIds
      : [...cartProductIds, product.id];
    setViewedProducts(newViewed);
    setCartProductIds(newCartIds);
    fetchRecommendations(
      buildRequest({
        viewedProductIds: newViewed.map((p) => p.id),
        cartProductIds: newCartIds,
      }),
    );
  }

  function handleSearch(keyword: string) {
    setConfirmedKeyword(keyword);
    fetchRecommendations(buildRequest({ searchKeyword: keyword || undefined }));
  }

  function handleClearSearch() {
    setConfirmedKeyword("");
    fetchRecommendations(buildRequest({ searchKeyword: undefined }));
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    fetchRecommendations(buildRequest({ preferredCategory: category || undefined }));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100svh", bgcolor: "background.default" }}>
        <AppHeader isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((v) => !v)} />

        <Container component="main" maxWidth={false} sx={{ maxWidth: 1440, py: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Paper
              aria-label="商品搜尋與分類"
              component="section"
              variant="outlined"
              sx={{ borderRadius: 2, p: { xs: 2, md: 2.5 } }}
            >
              <Stack spacing={2}>
                <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={handleCategorySelect}
                />
              </Stack>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 320px" },
                alignItems: "start",
              }}
            >
              <Stack spacing={2.5} sx={{ minWidth: 0 }}>
                <RecommendationSection
                  basisLabels={recommendationBasis}
                  errorMessage={recommendationsError instanceof Error ? recommendationsError.message : ""}
                  isLoading={isRecommendationsLoading}
                  recommendations={recommendations}
                />

                <Box component="section" aria-labelledby="products-heading">
                  <Stack
                    spacing={1.5}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "flex-end" },
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography color="primary" variant="caption" sx={{ fontWeight: 900, textTransform: "uppercase" }}>
                        Products
                      </Typography>
                      <Typography component="h2" id="products-heading" variant="h5" sx={{ fontWeight: 900 }}>
                        商品列表
                      </Typography>
                    </Box>
                    <Chip
                      color="primary"
                      label={`${filteredProducts.length} / ${products.length} 件`}
                      variant="outlined"
                    />
                  </Stack>
                  <ProductGrid
                    cartProductIds={cartProductIds}
                    errorMessage={productsError instanceof Error ? productsError.message : ""}
                    isLoading={isProductsLoading}
                    products={filteredProducts}
                    viewedProductIds={viewedProductIds}
                    onAddToCart={handleAddToCart}
                    onViewProduct={handleViewProduct}
                  />
                </Box>
              </Stack>

              <BehaviorPanel behavior={behavior} />
            </Box>
          </Stack>
        </Container>

        <AppFooter apiBaseUrl={getApiBaseUrl()} />
      </Box>
    </ThemeProvider>
  );
}
