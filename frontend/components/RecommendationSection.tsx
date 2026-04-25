import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Recommendation } from "@/types/recommendation";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type RecommendationSectionProps = {
  recommendations: Recommendation[];
  basisLabels: string[];
  isLoading?: boolean;
  errorMessage?: string;
};

const priceFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export function RecommendationSection({
  recommendations,
  basisLabels,
  isLoading = false,
  errorMessage,
}: RecommendationSectionProps) {
  return (
    <Paper
      aria-labelledby="recommendation-heading"
      component="section"
      variant="outlined"
      sx={{
        borderColor: "success.light",
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.12)" : "#f7fcfa",
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Stack spacing={2}>
        {/* 標題列 */}
        <Stack
          spacing={2}
          sx={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              color="success.dark"
              variant="caption"
              sx={{ fontWeight: 900, textTransform: "uppercase" }}
            >
              Recommendation
            </Typography>
            <Stack spacing={1} sx={{ alignItems: "center", flexDirection: "row" }}>
              <AutoAwesomeIcon color="success" fontSize="small" />
              <Typography component="h2" id="recommendation-heading" variant="h5" sx={{ fontWeight: 900 }}>
                AI 為你推薦
              </Typography>
            </Stack>
          </Box>
          <Chip color="success" label="MVP 預覽" size="small" />
        </Stack>

        {/* 推薦依據標籤 */}
        <Stack aria-label="目前推薦依據" sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1 }}>
          {basisLabels.map((label) => (
            <Chip color="success" key={label} label={label} size="small" variant="outlined" />
          ))}
        </Stack>

        {/* 載入中 */}
        {isLoading ? (
          <Stack spacing={2} sx={{ alignItems: "center", flexDirection: "row", py: 1 }}>
            <CircularProgress color="success" size={20} />
            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700 }}>
              推薦載入中...
            </Typography>
          </Stack>
        ) : null}

        {/* 錯誤 */}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {/* 空狀態 */}
        {!isLoading && !errorMessage && recommendations.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700 }}>
            目前尚無推薦商品。
          </Typography>
        ) : null}

        {/* 橫式卡片列 */}
        {!isLoading && !errorMessage && recommendations.length > 0 ? (
          <Box
            aria-label="推薦商品列表"
            sx={{
              display: "flex",
              gap: 1.5,
              overflowX: "auto",
              pb: 1,
              // 自訂捲軸樣式
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-track": { borderRadius: 3, bgcolor: "action.hover" },
              "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "success.light" },
            }}
          >
            {recommendations.map((recommendation) => (
              <Card
                key={recommendation.product.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  flexShrink: 0,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, flexGrow: 1 }}>
                  <Stack spacing={1} sx={{ height: "100%" }}>
                    {/* 商品名稱 */}
                    <Typography
                      component="h3"
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {recommendation.product.name}
                    </Typography>

                    {/* 品牌 / 分類 */}
                    <Typography color="text.secondary" variant="caption">
                      {recommendation.product.brand} · {recommendation.product.category}
                    </Typography>

                    {/* 價格 */}
                    <Typography color="error.main" variant="body2" sx={{ fontWeight: 900 }}>
                      {priceFormatter.format(recommendation.product.price)}
                    </Typography>

                    {/* 推薦理由（最多顯示 2 條） */}
                    <Stack spacing={0.5} sx={{ mt: "auto" }}>
                      {recommendation.reasons.slice(0, 2).map((reason) => (
                        <Typography
                          key={reason}
                          color="text.secondary"
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                          }}
                        >
                          · {reason}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
