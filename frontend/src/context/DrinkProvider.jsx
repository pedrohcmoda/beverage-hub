import React, { createContext, useState } from "react";

export const DrinkContext = createContext();

export const DrinkProvider = ({ children }) => {
  const [selectedDrink, setSelectedDrink] = useState(null);

  return (
    <DrinkContext.Provider value={{ selectedDrink, setSelectedDrink }}>
      {children}
    </DrinkContext.Provider>
  );
};