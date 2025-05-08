import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css";
import { GiCutLemon } from "react-icons/gi";

function SearchBar({
  value,
  onChange,
  selectedCategory,
  onCategoryChange,
  onSearch,
}) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    const whatUserTyped = e.target.value;
    setInputValue(whatUserTyped);

    if (onChange) {
      onChange(whatUserTyped);
    }

    if (whatUserTyped === "" && onSearch) {
      onSearch(whatUserTyped, selectedCategory);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(inputValue, selectedCategory);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue, selectedCategory);
      setInputValue("");
    }
  };

  const handleCategoryChange = (_, newCategory) => {
    if (newCategory && newCategory !== selectedCategory && onCategoryChange) {
      onCategoryChange(newCategory);

      if (inputValue && onSearch) {
        onSearch(inputValue, newCategory);
      }
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <button
        type="button"
        className={styles.icon}
        onClick={handleSearch}
        aria-label="Search"
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        <SearchIcon />
      </button>
      <input
        className={styles.input}
        type="text"
        aria-label={`Search input for ${selectedCategory}`}
        placeholder={`Search for ${selectedCategory}...`}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.toggleButtonGroup}>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          sx={{
            background: "transparent",
            ".MuiToggleButton-root": {
              border: "none",
              borderRadius: "50%",
              minWidth: 36,
              minHeight: 36,
              width: 36,
              height: 36,
              color: "#111",
              background: "#c5c5c5",
              transition: "background 0.2s, color 0.2s, filter 0.2s",
              filter: "grayscale(100%)",
              "&.Mui-selected": {
                background: "#efcb58",
                color: "#111",
                filter: "grayscale(0%)",
              },
              "&:not(.Mui-selected)": {
                color: "#555",
              },
              "&:hover": {
                background: "#e4d27b",
              },
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 2px",
            },
          }}
        >
          <ToggleButton value="cocktail">
            <LocalBarIcon
              sx={{
                fontSize: 24,
                color: selectedCategory === "cocktail" ? "#111" : "#888",
                filter:
                  selectedCategory === "cocktail"
                    ? "grayscale(0%)"
                    : "grayscale(100%)",
              }}
            />
          </ToggleButton>
          <ToggleButton value="ingredient">
            <GiCutLemon
              size={20}
              style={{
                color: selectedCategory === "ingredient" ? "#111" : "#888",
                filter:
                  selectedCategory === "ingredient"
                    ? "grayscale(0%)"
                    : "grayscale(100%)",
              }}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}

export default SearchBar;
