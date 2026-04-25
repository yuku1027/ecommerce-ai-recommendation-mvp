import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { BehaviorState } from "@/types/recommendation";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type BehaviorPanelProps = {
  behavior: BehaviorState;
};

export function BehaviorPanel({ behavior }: BehaviorPanelProps) {
  const recentViewedProducts = behavior.viewedProducts.slice(0, 3);

  return (
    <Paper
      aria-labelledby="behavior-heading"
      component="aside"
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 2,
        position: { md: "sticky" },
        top: { md: 16 },
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography color="primary" variant="caption" sx={{ fontWeight: 900, textTransform: "uppercase" }}>
            Behavior
          </Typography>
          <Typography component="h2" id="behavior-heading" variant="h6" sx={{ fontWeight: 900 }}>
            目前使用者行為
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
            <ShoppingCartIcon color="primary" fontSize="small" />
            <Typography color="text.secondary" variant="caption" sx={{ display: "block" }}>
              購物車
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {behavior.cartProductIds.length}
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
            <VisibilityIcon color="primary" fontSize="small" />
            <Typography color="text.secondary" variant="caption" sx={{ display: "block" }}>
              已瀏覽
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {behavior.viewedProducts.length}
            </Typography>
          </Paper>
        </Box>

        <Divider />

        <Box>
          <Stack spacing={1} sx={{ alignItems: "center", flexDirection: "row" }}>
            <HistoryIcon color="action" fontSize="small" />
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 900 }}>
              最近瀏覽
            </Typography>
          </Stack>
          {recentViewedProducts.length > 0 ? (
            <List dense sx={{ mt: 0.5 }}>
              {recentViewedProducts.map((product) => (
                <ListItem disableGutters key={product.id}>
                  <Typography variant="body2">{product.name}</Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
              尚未點擊商品。
            </Typography>
          )}
        </Box>

        <Divider />

        <Box>
          <Stack spacing={1} sx={{ alignItems: "center", flexDirection: "row" }}>
            <SearchIcon color="action" fontSize="small" />
            <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 900 }}>
              搜尋與分類
            </Typography>
          </Stack>
          <List dense>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <SearchIcon fontSize="small" />
              </ListItemIcon>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                  關鍵字
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {behavior.searchKeyword || "未輸入"}
                </Typography>
              </Box>
            </ListItem>
            <ListItem disableGutters>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                  分類
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {behavior.selectedCategory || "全部"}
                </Typography>
              </Box>
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Paper>
  );
}
