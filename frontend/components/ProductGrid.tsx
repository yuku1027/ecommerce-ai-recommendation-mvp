import type { Product } from "@/types/product";
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  viewedProductIds: string[];
  cartProductIds: string[];
  isLoading?: boolean;
  errorMessage?: string;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export function ProductGrid({
  products,
  viewedProductIds,
  cartProductIds,
  isLoading = false,
  errorMessage,
  onViewProduct,
  onAddToCart,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 4 }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress size={28} />
          <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
            商品載入中...
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (products.length === 0) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center" }}>
        <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
          目前沒有符合條件的商品。
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {products.map((product) => (
        <ProductCard
          isInCart={cartProductIds.includes(product.id)}
          isViewed={viewedProductIds.includes(product.id)}
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onView={onViewProduct}
        />
      ))}
    </Box>
  );
}
