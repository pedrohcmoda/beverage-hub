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

function Home() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleSearch = (searchValue, category) => {
    console.log("buscando por:", searchValue, "em:", category);
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
      <Footer />
    </div>
  );
}

export default Home;
