import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Product } from "@/types/product";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

type ProductCardProps = {
  product: Product;
  isViewed: boolean;
  isInCart: boolean;
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

const priceFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export function ProductCard({
  product,
  isViewed,
  isInCart,
  onView,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        onClick={() => onView(product)}
        sx={{
          aspectRatio: "4 / 3",
          bgcolor: "action.hover",
          cursor: "pointer",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ display: "grid", flexGrow: 1, gap: 1.25 }}>
        <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Chip color="primary" label={product.category} size="small" variant="outlined" />
          <Stack spacing={0.5} sx={{ alignItems: "center", flexDirection: "row" }}>
            <Rating precision={0.1} readOnly size="small" value={product.rating} />
            <Typography color="text.secondary" variant="caption">
              {product.rating.toFixed(1)}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          component="h3"
          sx={{ minHeight: 48, lineHeight: 1.45, fontWeight: 800 }}
          variant="subtitle1"
        >
          {product.name}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {product.brand}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography color="error.main" sx={{ fontWeight: 900 }} variant="h6">
              {priceFormatter.format(product.price)}
            </Typography>
            <Typography color="text.secondary" sx={{ alignSelf: "end", fontWeight: 700 }} variant="caption">
              熱度 {product.popularity}
            </Typography>
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ gap: 1, p: 2, pt: 0 }}>
        <Button
          fullWidth
          startIcon={<VisibilityIcon />}
          variant={isViewed ? "contained" : "outlined"}
          onClick={() => onView(product)}
        >
          {isViewed ? "已瀏覽" : "查看"}
        </Button>
        <Button
          fullWidth
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          variant="contained"
          onClick={() => onAddToCart(product)}
        >
          {isInCart ? "已加入" : "加入"}
        </Button>
      </CardActions>
    </Card>
  );
}
