import React, { useState, useEffect, useRef } from "react";
import Banner from "../Banner/Banner";
import CardCategory from "../CardCategory/CardCategory";
import Drink from "../Drink/Drink";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/bundle";
import styles from "./Home.module.css";
import SearchBar from "../SearchBar/SearchBar";
import Footer from "../Footer/Footer";
import SearchResults from "../SearchResults/SearchResults";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";
import { FaUserCircle } from "react-icons/fa";
import { API_BASE } from "../../apiBase";

function Home() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("cocktail");
  const [searchResults, setSearchResults] = useState([]);
  const [mostraResultadoBusca, setMostraResultadoBusca] = useState(false);
  const categoryCache = useRef({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const categoryIcons = {
    Cocktail: "/Cocktail.png",
    Shake: "/Shake.png",
    Soft_Drink: "/Soft_Drink.png",
    Ordinary_Drink: "/Ordinary_Drink.png",
    Beer: "/Beer.png",
    Coffee_Tea: "/Coffee_Tea.png",
    Punch_Party_Drink: "/Punch_Party_Drink.png",
    Shot: "/Shot.png",
    Cocoa: "/Cocoa.png",
    Other_Unknown: "/Other_Unknown.png",
    Homemade_Liqueur: "/Homemade_Liqueur.png",
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue) {
      setPopupMessage("Digite algo para buscar!");
      setShowPopup(true);
      setSearchResults([]);
      setMostraResultadoBusca(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/drinks/name/${encodeURIComponent(searchValue)}`
      );
      const data = await response.json();
      const drinks = Array.isArray(data) ? data : [data];
      if (!drinks.length || !drinks[0]) {
        setPopupMessage("Nenhum resultado encontrado. Tente novamente!");
        setShowPopup(true);
        setSearchResults([]);
        setMostraResultadoBusca(false);
      } else {
        setSearchResults(drinks);
        setMostraResultadoBusca(true);
      }
    } catch (error) {
      console.log(error);
      setPopupMessage("Erro ao buscar. Tente novamente!");
      setShowPopup(true);
      setSearchResults([]);
      setMostraResultadoBusca(false);
    }
  };

  const handleCategoryClick = async (categoryName) => {
    if (categoryCache.current[categoryName]) {
      setSearchResults(categoryCache.current[categoryName]);
      setMostraResultadoBusca(true);
      return;
    }
    try {
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) return;
      const response = await fetch(`${API_BASE}/api/categories/${category.id}`);
      const data = await response.json();
      setSearchResults(data.drinks || []);
      setMostraResultadoBusca(true);
      categoryCache.current[categoryName] = data.drinks || [];
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaUserCircle size={32} color="#efcb58" style={{ verticalAlign: "middle" }} />
          {user ? (
            <>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "1rem",
                  marginLeft: 4,
                }}
              >
                Logout
              </button>
              <Link
                to="/management"
                style={{
                  background: "#4caf50",
                  border: "none",
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "1rem",
                  marginLeft: 8,
                  textDecoration: "none",
                  borderRadius: 4,
                  padding: "4px 12px",
                }}
              >
                Management
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "1rem",
                marginLeft: 4,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          )}
        </div>
        <Link
          to="/"
          onClick={() => {
            setSearchResults([]);
            setMostraResultadoBusca(false);
          }}
          className={styles.logo}
        >
          BeverageHub
        </Link>
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
            const normalizedName = category.name.replace(/[\s/]+/g, "_");
            const icon = categoryIcons[normalizedName] || categoryIcons["default"];
            return (
              <SwiperSlide key={category.id}>
                <CardCategory
                  category={category.name}
                  icon={icon}
                  onClick={() => {
                    handleCategoryClick(category.name);
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      {mostraResultadoBusca ? (
        <SearchResults drinks={searchResults} />
      ) : (
        <>
          <h2 className={styles.title2}>Try this Drink!</h2>
          <div className={styles.drinkContainer}>
            <Drink />
          </div>
        </>
      )}
      <Footer />
      <Popup message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

export default Home;
