"use client";

import { useEffect, useMemo, useState } from "react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { BehaviorPanel } from "@/components/BehaviorPanel";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { RecommendationSection } from "@/components/RecommendationSection";
import { SearchBar } from "@/components/SearchBar";
import { mockProducts, previewRecommendations } from "@/data/mockProducts";
import type { Product } from "@/types/product";
import type { BehaviorState } from "@/types/recommendation";
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

const categories = Array.from(new Set(mockProducts.map((product) => product.category)));
const themeStorageKey = "ecommerce-ai-recommendation-theme";

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5163";

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsDarkMode(window.localStorage.getItem(themeStorageKey) === "dark");
      setHasLoadedTheme(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!hasLoadedTheme) {
      return;
    }

    window.localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
  }, [hasLoadedTheme, isDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#22577a",
          },
          secondary: {
            main: "#38a3a5",
          },
          background: {
            default: isDarkMode ? "#0f172a" : "#f6f7fb",
            paper: isDarkMode ? "#111827" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: "Arial, Helvetica, sans-serif",
        },
      }),
    [isDarkMode],
  );

  const filteredProducts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesKeyword = keyword
        ? [product.name, product.category, product.brand]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      return matchesCategory && matchesKeyword;
    });
  }, [searchKeyword, selectedCategory]);

  const behavior: BehaviorState = {
    viewedProducts,
    searchKeyword,
    selectedCategory,
    cartProductIds,
  };

  const viewedProductIds = viewedProducts.map((product) => product.id);

  const recommendationBasis = [
    viewedProducts[0] ? `最近瀏覽：${viewedProducts[0].name}` : "預設：近期熱門商品",
    searchKeyword ? `搜尋：${searchKeyword}` : "尚未搜尋",
    selectedCategory ? `分類：${selectedCategory}` : "全部分類",
    cartProductIds.length > 0 ? `購物車：${cartProductIds.length} 件` : "購物車尚空",
  ];

  function handleViewProduct(product: Product) {
    setViewedProducts((currentProducts) => [
      product,
      ...currentProducts.filter((currentProduct) => currentProduct.id !== product.id),
    ]);
  }

  function handleAddToCart(product: Product) {
    handleViewProduct(product);
    setCartProductIds((currentIds) =>
      currentIds.includes(product.id) ? currentIds : [...currentIds, product.id],
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100svh", bgcolor: "background.default" }}>
        <AppHeader isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((value) => !value)} />

        <Container component="main" maxWidth={false} sx={{ maxWidth: 1440, py: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Paper
              aria-label="商品搜尋與分類"
              component="section"
              variant="outlined"
              sx={{ borderRadius: 2, p: { xs: 2, md: 2.5 } }}
            >
              <Stack spacing={2}>
                <SearchBar
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                  onClear={() => setSearchKeyword("")}
                />
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
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
                  recommendations={previewRecommendations}
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
                      label={`${filteredProducts.length} / ${mockProducts.length} 件`}
                      variant="outlined"
                    />
                  </Stack>
                  <ProductGrid
                    cartProductIds={cartProductIds}
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

        <AppFooter apiBaseUrl={apiBaseUrl} />
      </Box>
    </ThemeProvider>
  );
}
