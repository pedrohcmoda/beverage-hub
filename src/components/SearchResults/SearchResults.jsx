import React from "react";
import CardResult from "../CardResult/CardResult";
import Filter from "../Filter/Filter";
import { useState, useEffect } from "react";
import styles from "./SearchResults.module.css";
import DrinkModal from "../DrinkModal/DrinkModal";
import ReactPaginate from "react-paginate";

const SearchResults = ({ drinks, initialFilters = {} }) => {
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [filters, setFilters] = useState({
    categories: {
      cocktail: false,
      ordinaryDrink: false,
      shake: false,
      other: false,
      cocoa: false,
      shot: false,
      coffeeTea: false,
      homemadeLiqueur: false,
      beer: false,
      softDrink: false,
    },
    types: {
      alcoholic: false,
      nonAlcoholic: false,
      optionalAlcohol: false,
    },
    ...initialFilters,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const pageCount = Math.ceil(filteredDrinks.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageDrinks = filteredDrinks.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const categoryMap = {
    Cocktail: "cocktail",
    "Ordinary Drink": "ordinaryDrink",
    Shake: "shake",
    "Other/Unknown": "other",
    Cocoa: "cocoa",
    Shot: "shot",
    "Coffee / Tea": "coffeeTea",
    "Homemade Liqueur": "homemadeLiqueur",
    Beer: "beer",
    "Soft Drink": "softDrink",
  };

  const typeMap = {
    Alcoholic: "alcoholic",
    "Non alcoholic": "nonAlcoholic",
    "Optional alcohol": "optionalAlcohol",
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!drinks) return;

    let results = [...drinks];

    const categoryFiltersActive = Object.values(filters.categories).some(
      (value) => value
    );

    if (categoryFiltersActive) {
      results = results.filter((drink) => {
        const drinkCategory = drink.strCategory;
        const filterKey = categoryMap[drinkCategory];
        return filterKey && filters.categories[filterKey];
      });
    }

    const typeFiltersActive = Object.values(filters.types).some(
      (value) => value
    );

    if (typeFiltersActive) {
      results = results.filter((drink) => {
        const drinkType = drink.strAlcoholic;
        const filterKey = typeMap[drinkType];
        return filterKey && filters.types[filterKey];
      });
    }

    setFilteredDrinks(results);
  }, [drinks, filters]);

  return (
    <div className={styles.container}>
      {/* <aside className={styles.filterSidebar}>
        <Filter onFilterChange={handleFilterChange} />
      </aside> */}

      <main className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <span className={styles.drinkCount}>
            {filteredDrinks.length} drinks
          </span>
        </div>
        <div className={styles.resultsGrid}>
          {currentPageDrinks.map((drink) => (
            <CardResult
              key={drink.idDrink}
              drink={drink}
              onClick={() => setSelectedDrink(drink)}
            />
          ))}
        </div>
        {pageCount > 1 && (
          <div className={styles.paginationContainer}>
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              pageClassName={styles.pageItem}
              pageLinkClassName={styles.pageLink}
              previousClassName={styles.pageItem}
              previousLinkClassName={styles.pageLink}
              nextClassName={styles.pageItem}
              nextLinkClassName={styles.pageLink}
              breakClassName={styles.pageItem}
              breakLinkClassName={styles.pageLink}
              forcePage={currentPage}
            />
          </div>
        )}
      </main>
      {selectedDrink && (
        <DrinkModal
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      )}
    </div>
  );
};

export default SearchResults;
