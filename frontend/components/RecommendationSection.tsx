import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Recommendation } from "@/types/recommendation";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Skeleton,
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

// 理論最高分 = 40+25+30+20+15+20 = 150
const MAX_SCORE = 150;

function SkeletonCard() {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        flexShrink: 0,
        p: 1.5,
        width: 200,
      }}
    >
      <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={6} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="75%" />
    </Box>
  );
}

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

        {/* 錯誤 */}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {/* 空狀態 */}
        {!isLoading && !errorMessage && recommendations.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700 }}>
            目前尚無推薦商品。
          </Typography>
        ) : null}

        {/* 橫式卡片列（Skeleton 或真實資料） */}
        <Box
          aria-label="推薦商品列表"
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { borderRadius: 3, bgcolor: "action.hover" },
            "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "success.light" },
          }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : recommendations.map((recommendation) => {
                const scorePercent = Math.min(
                  Math.round((recommendation.score / MAX_SCORE) * 100),
                  100,
                );
                return (
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

                        {/* 推薦分數條 */}
                        <Box>
                          <Stack
                            sx={{
                              alignItems: "center",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography color="text.secondary" variant="caption">
                              推薦分數
                            </Typography>
                            <Typography
                              color="success.main"
                              variant="caption"
                              sx={{ fontWeight: 700 }}
                            >
                              {recommendation.score}
                            </Typography>
                          </Stack>
                          <LinearProgress
                            color="success"
                            value={scorePercent}
                            variant="determinate"
                            sx={{ borderRadius: 1, height: 5 }}
                          />
                        </Box>

                        {/* 推薦理由（全部顯示） */}
                        <Stack spacing={0.5} sx={{ mt: "auto" }}>
                          {recommendation.reasons.map((reason) => (
                            <Typography
                              key={reason}
                              color="text.secondary"
                              variant="caption"
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
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
                );
              })}
        </Box>
      </Stack>
    </Paper>
  );
}
