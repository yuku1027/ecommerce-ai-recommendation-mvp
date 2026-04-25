import { Box, Chip } from "@mui/material";

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <Box
      aria-label="商品分類篩選"
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 0.5,
      }}
    >
      <Chip
        clickable
        color={!selectedCategory ? "primary" : "default"}
        label="全部"
        variant={!selectedCategory ? "filled" : "outlined"}
        onClick={() => onSelect("")}
      />
      {categories.map((category) => (
        <Chip
          clickable
          color={selectedCategory === category ? "primary" : "default"}
          key={category}
          label={category}
          variant={selectedCategory === category ? "filled" : "outlined"}
          onClick={() => onSelect(category)}
        />
      ))}
    </Box>
  );
}
