import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

type SearchBarProps = {
  /** 按下 Enter 或搜尋按鈕時呼叫，傳入確認後的關鍵字 */
  onSearch: (keyword: string) => void;
  /** 按下清除按鈕時呼叫 */
  onClear: () => void;
};

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  function handleSearch() {
    onSearch(inputValue.trim());
  }

  function handleClear() {
    setInputValue("");
    onClear();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <TextField
      fullWidth
      id="product-search"
      label="搜尋商品"
      placeholder="輸入耳機、手機、品牌... 按 Enter 或點搜尋確認"
      type="search"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="執行搜尋"
                edge="start"
                size="small"
                onClick={handleSearch}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <IconButton aria-label="清除搜尋關鍵字" edge="end" onClick={handleClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
