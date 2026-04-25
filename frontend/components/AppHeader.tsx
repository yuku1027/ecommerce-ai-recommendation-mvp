import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Box,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

type AppHeaderProps = {
  isDarkMode: boolean;
  cartCount: number;
  onToggleTheme: () => void;
  onOpenCart: () => void;
};

export function AppHeader({ isDarkMode, cartCount, onToggleTheme, onOpenCart }: AppHeaderProps) {
  return (
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ maxWidth: 1440, mx: "auto", width: "100%", gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography color="primary" variant="caption" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
            Shopping Recommendation MVP
          </Typography>
          <Typography component="h1" noWrap variant="h6" sx={{ fontWeight: 900 }}>
            奇摩購物 AI 推薦工作台
          </Typography>
        </Box>

        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={onToggleTheme} />}
          label={
            <Stack spacing={0.75} sx={{ alignItems: "center", flexDirection: "row" }}>
              {isDarkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              <Typography variant="body2">{isDarkMode ? "深色" : "淺色"}</Typography>
            </Stack>
          }
          labelPlacement="start"
          sx={{ m: 0 }}
        />

        <Tooltip title="購物車">
          <IconButton aria-label={`購物車，共 ${cartCount} 件`} color="inherit" onClick={onOpenCart}>
            <Badge badgeContent={cartCount} color="error" max={99}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
