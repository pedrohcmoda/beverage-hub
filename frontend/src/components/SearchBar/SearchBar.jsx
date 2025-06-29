import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css";

function SearchBar({ value, onChange, onSearch }) {
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
      onSearch(whatUserTyped);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(inputValue);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
      setInputValue("");
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
        aria-label="Search input for drink name"
        placeholder="Search for a drink..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
