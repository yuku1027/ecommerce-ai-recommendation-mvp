import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Recommendation } from "@/types/recommendation";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
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
        <Stack
          spacing={2}
          sx={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography color="success.dark" variant="caption" sx={{ fontWeight: 900, textTransform: "uppercase" }}>
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

        <Stack aria-label="目前推薦依據" sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1 }}>
          {basisLabels.map((label) => (
            <Chip color="success" key={label} label={label} size="small" variant="outlined" />
          ))}
        </Stack>

        {isLoading ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <Stack spacing={2} sx={{ alignItems: "center", flexDirection: "row" }}>
              <CircularProgress color="success" size={24} />
              <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                推薦載入中...
              </Typography>
            </Stack>
          </Paper>
        ) : null}

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {!isLoading && !errorMessage && recommendations.length === 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              目前尚無推薦商品。
            </Typography>
          </Paper>
        ) : null}

        {!isLoading && !errorMessage && recommendations.length > 0 ? (
          <Stack spacing={1.5}>
            {recommendations.map((recommendation) => (
              <Card key={recommendation.product.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1.25}>
                    <Stack
                      spacing={1}
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 900 }}>
                          {recommendation.product.name}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {recommendation.product.brand} / {recommendation.product.category}
                        </Typography>
                      </Box>
                      <Typography color="error.main" sx={{ fontWeight: 900 }}>
                        {priceFormatter.format(recommendation.product.price)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
                      {recommendation.reasons.map((reason) => (
                        <Typography component="li" key={reason} color="text.secondary" variant="body2">
                          {reason}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
