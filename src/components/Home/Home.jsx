import React, { useState, useEffect } from 'react';
import Banner from '../Banner/Banner';
import CardCategory from '../CardCategory/CardCategory';
import Drink from '../Drink/Drink';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import styles from './Home.module.css';
import SearchBar from '../SearchBar/SearchBar';
import Footer from '../Footer/Footer';
import SearchResults from '../SearchResults/SearchResults';
import { Link } from 'react-router-dom';

function Home() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cocktail');
  const [searchResults, setSearchResults] = useState([]);
  const [mostraResultadoBusca, setMostraResultadoBusca] = useState(false);


  const categoryIcons = {
    Cocktail: '/Cocktail.png',
    Shake: '/Shake.png',
    Soft_Drink: '/Soft_Drink.png',
    Ordinary_Drink: '/Ordinary_Drink.png',
    Beer: '/Beer.png',
    Coffee_Tea: '/Coffee_Tea.png',
    Punch_Party_Drink: '/Punch_Party_Drink.png',
    Shot: '/Shot.png',
    Cocoa: '/Cocoa.png',
    Other_Unknown: '/Other_Unknown.png',
    Homemade_Liqueur: '/Homemade_Liqueur.png',
  }

  
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
      setMostraResultadoBusca(true);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleCategoryClick = async (category) => {
    console.log('Category clicked:', category);
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      setSearchResults(data.drinks || []);
      console.log('Drinks in category:', data.drinks);
    } catch (error) {
      console.error('Error fetching drinks by category:', error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <Link to="/" onClick={() => {setSearchResults([]); setMostraResultadoBusca(false);}} className={styles.logo}>BeverageHub</Link>
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
            0: { slidesPerView: 2.5 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 4.5 },
            1920: { slidesPerView: 6 },
          }}
        >
          {categories.map((category) => {
            const normalizedName = category.strCategory.replace(/[\s/]+/g, '_');
            const icon = categoryIcons[normalizedName] || categoryIcons['default'];
            return (
              <SwiperSlide key={normalizedName}>
                <CardCategory
                  category={category.strCategory}
                  icon={icon}
                  onClick={() => { handleCategoryClick(category.strCategory); }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <h2 className={styles.title2}>Try this Drink!</h2>
      {mostraResultadoBusca ? (
        <SearchResults drinks={searchResults} />
      ) : (
        <div className={styles.drinkContainer}>
          <Drink />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Home;
