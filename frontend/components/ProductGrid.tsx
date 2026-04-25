import type { Product } from "@/types/product";
import { Alert, Box, Pagination, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ProductCard } from "./ProductCard";

const ITEMS_PER_PAGE = 6;

type ProductGridProps = {
  products: Product[];
  viewedProductIds: string[];
  cartProductIds: string[];
  isLoading?: boolean;
  errorMessage?: string;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

function SkeletonCard() {
  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3", width: "100%" }} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
        <Stack spacing={1} sx={{ flexDirection: "row", mt: 2 }}>
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        </Stack>
      </Box>
    </Box>
  );
}

export function ProductGrid({
  products,
  viewedProductIds,
  cartProductIds,
  isLoading = false,
  errorMessage,
  onOpenDetail,
  onAddToCart,
}: ProductGridProps) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when products change (filter/search)
  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
  const safePage = Math.min(page, pageCount || 1);
  const pagedProducts = products.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  if (isLoading) {
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
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
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
    <Stack spacing={3}>
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
        {pagedProducts.map((product) => (
          <ProductCard
            isInCart={cartProductIds.includes(product.id)}
            isViewed={viewedProductIds.includes(product.id)}
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </Box>

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={pageCount}
            page={safePage}
            color="primary"
            shape="rounded"
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Stack>
  );
}
