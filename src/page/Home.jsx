import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner/Banner';
import CardCategory from '../components/CardCategory/CardCategory';
import Drink from '../components/Drink/Drink';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import styles from './Home.module.css';
import categoryIcons from '../utils/categoryIcons';
import SearchBar from '../components/SearchBar/SearchBar';
import Footer from '../components/Footer/Footer';
import SearchResults from '../components/SearchResults/SearchResults';

function Home() {
  const [categories, setCategories] = useState([]);
<<<<<<< HEAD
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
=======
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cocktail');
  const [searchResults, setSearchResults] = useState([]);
>>>>>>> ce6391ace2f4952f3a5ee20a8d8b62f3c577718b

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'
        );
        const data = await response.json();
        setCategories(data.drinks);
        console.log(data.drinks);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSearch = async (searchValue, category) => {
    if (!searchValue) {
      setSearchResults([]);
      return;
    }

    try {
      let url = '';

      if (category === 'cocktail') {
        url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`;
      } else if (category === 'ingredient') {
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchValue}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.drinks || []);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleCategoryClick = async (categoryName) => {
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`);
      const data = await response.json();
      setSelectedCategory(data.drinks || []);
    } catch (error) {
      console.error('Error fetching drinks by category:', error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>BeverageHub</h1>
        <div className={styles.headerSearch}>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <Banner />
      <h2 className={styles.title2}>Drinks by Category</h2>
      <div className={styles.carousel}>
        <Swiper
          modules={[Pagination]}
          spaceBetween={5}
          slidesPerView={7.5}
          grabCursor={true}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 2.5,
            },
            480: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4.5,
            },
            1920: {
              slidesPerView: 6,
            },
          }}
        >
          {categories.map((category) => {
            const normalizedName = category.strCategory.replace(/[\s/]+/g, '_');
            const icon = categoryIcons[normalizedName] || categoryIcons['default'];
            return (
              <SwiperSlide key={normalizedName}>
                <CardCategory category={category.strCategory} icon={icon} onClick={() => {setSelectedCategory(category.strCategory); handleCategoryClick(category.strCategory)}}/>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <h2 className={styles.title2}>Try this Drink!</h2>
      <div className={styles.drinkContainer}>
        <Drink />
      </div>
      <SearchResults drinks={searchResults} />
      <Footer />
    </div>
  );
}

export default Home;
