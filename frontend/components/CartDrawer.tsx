"use client";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import type { Product } from "@/types/product";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

type CartDrawerProps = {
  open: boolean;
  cartProducts: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
};

const priceFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export function CartDrawer({
  open,
  cartProducts,
  onClose,
  onRemove,
  onClearCart,
}: CartDrawerProps) {
  const total = cartProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100vw", sm: 360 } } } }}
    >
      <Stack sx={{ height: "100%" }}>
        {/* 標題列 */}
        <Stack
          spacing={1}
          sx={{
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            flexDirection: "row",
            p: 2,
          }}
        >
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 900 }}>
            購物車（{cartProducts.length} 件）
          </Typography>
          <IconButton aria-label="關閉購物車" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* 商品列表 */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {cartProducts.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ fontWeight: 700, mt: 4, textAlign: "center" }}
            >
              購物車是空的
            </Typography>
          ) : (
            <Stack divider={<Divider />} spacing={2}>
              {cartProducts.map((product) => (
                <Stack
                  key={product.id}
                  spacing={1.5}
                  sx={{ alignItems: "flex-start", flexDirection: "row" }}
                >
                  <Box
                    alt={product.name}
                    component="img"
                    src={product.imageUrl}
                    sx={{
                      borderRadius: 1,
                      flexShrink: 0,
                      height: 64,
                      objectFit: "cover",
                      width: 64,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>
                      {product.name}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {product.brand} · {product.category}
                    </Typography>
                    <Typography color="error.main" variant="body2" sx={{ fontWeight: 900, mt: 0.5 }}>
                      {priceFormatter.format(product.price)}
                    </Typography>
                  </Box>
                  <IconButton
                    aria-label={`移除 ${product.name}`}
                    color="error"
                    size="small"
                    onClick={() => onRemove(product.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        {/* 底部合計列 */}
        {cartProducts.length > 0 ? (
          <Box sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
            <Stack
              sx={{ flexDirection: "row", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontWeight: 700 }}>合計</Typography>
              <Typography color="error.main" sx={{ fontWeight: 900 }}>
                {priceFormatter.format(total)}
              </Typography>
            </Stack>
            <Button color="error" fullWidth variant="outlined" onClick={onClearCart}>
              清空購物車
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Drawer>
  );
}
