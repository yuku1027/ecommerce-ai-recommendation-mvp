import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      id="product-search"
      label="搜尋商品"
      placeholder="輸入耳機、手機、品牌..."
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton aria-label="清除搜尋關鍵字" edge="end" onClick={onClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
