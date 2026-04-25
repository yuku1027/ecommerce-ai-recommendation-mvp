"use client";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import type { Product } from "@/types/product";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  LinearProgress,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

type ProductDetailModalProps = {
  product: Product | null;
  isInCart: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

const priceFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export function ProductDetailModal({
  product,
  isInCart,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={onClose} scroll="paper">
      {/* 商品圖片 + 關閉按鈕 */}
      <Box sx={{ position: "relative" }}>
        <Box
          alt={product.name}
          component="img"
          src={product.imageUrl}
          sx={{ aspectRatio: "4 / 3", display: "block", objectFit: "cover", width: "100%" }}
        />
        <IconButton
          aria-label="關閉"
          onClick={onClose}
          sx={{
            bgcolor: "rgba(0,0,0,0.45)",
            color: "white",
            position: "absolute",
            right: 8,
            top: 8,
            "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {/* 名稱與標籤 */}
          <Box>
            <Stack spacing={0.75} sx={{ flexDirection: "row", flexWrap: "wrap", mb: 1 }}>
              <Chip color="primary" label={product.category} size="small" variant="outlined" />
              <Chip label={product.brand} size="small" variant="outlined" />
            </Stack>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 900, mb: 0.75 }}>
              {product.name}
            </Typography>
            <Stack spacing={0.75} sx={{ alignItems: "center", flexDirection: "row" }}>
              <Rating precision={0.1} readOnly size="small" value={product.rating} />
              <Typography color="text.secondary" variant="body2">
                {product.rating.toFixed(1)} 分
              </Typography>
            </Stack>
          </Box>

          <Divider />

          {/* 規格資訊 */}
          <Stack spacing={1.75}>
            <Stack
              sx={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography color="text.secondary" variant="body2">
                售價
              </Typography>
              <Typography color="error.main" variant="h5" sx={{ fontWeight: 900 }}>
                {priceFormatter.format(product.price)}
              </Typography>
            </Stack>

            <Stack
              sx={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography color="text.secondary" variant="body2">
                品牌
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {product.brand}
              </Typography>
            </Stack>

            <Stack
              sx={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography color="text.secondary" variant="body2">
                分類
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {product.category}
              </Typography>
            </Stack>

            {/* 熱度指數 */}
            <Box>
              <Stack
                sx={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  mb: 0.75,
                }}
              >
                <Typography color="text.secondary" variant="body2">
                  熱度指數
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {product.popularity} / 100
                </Typography>
              </Stack>
              <LinearProgress
                color="primary"
                value={product.popularity}
                variant="determinate"
                sx={{ borderRadius: 1, height: 6 }}
              />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ gap: 1, pb: 3, px: 3 }}>
        <Button fullWidth variant="outlined" onClick={onClose}>
          繼續瀏覽
        </Button>
        <Button
          fullWidth
          color={isInCart ? "success" : "primary"}
          startIcon={<AddShoppingCartIcon />}
          variant="contained"
          onClick={() => {
            if (!isInCart) onAddToCart(product);
            onClose();
          }}
        >
          {isInCart ? "已在購物車" : "加入購物車"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
