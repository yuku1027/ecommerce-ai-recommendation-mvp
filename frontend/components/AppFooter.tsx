import { Box, Container, Link, Stack, Typography } from "@mui/material";

type AppFooterProps = {
  apiBaseUrl: string;
};

export function AppFooter({ apiBaseUrl }: AppFooterProps) {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3 }}>
      <Container maxWidth={false} sx={{ maxWidth: 1440 }}>
        <Stack
          spacing={1}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            規則式推薦 MVP，用於展示 AI 推薦導入流程與可替換架構。
          </Typography>
          <Typography color="text.secondary" variant="body2">
            API: <Link href={`${apiBaseUrl}/swagger`} target="_blank" rel="noreferrer">Swagger / OpenAPI</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
