import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipes: [],
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    loadFromLocalStorage: (state) => {
      try {
        const data = JSON.parse(localStorage.getItem("recipes:v1")) || [];
        state.recipes = data;
      } catch (error) {
        console.error("Failed to load Recipies", error.message);
      }
    },

    saveToLocalStorage: (state) => {
      localStorage.setItem("recipes:v1", JSON.stringify(state.recipes));
    },

    addRecipe: (state, action) => {
      state.recipes.push(action.payload);
      localStorage.setItem("recipes:v1", JSON.stringify(state.recipes));
    },

    toggleFavorite: (state, action) => {
      let recipe = state.recipes.find((r) => r.id === action.payload);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        localStorage.setItem("recipes:v1", JSON.stringify(state.recipes));
      }
    },
  },
});

export const {
  loadFromLocalStorage,
  saveToLocalStorage,
  addRecipe,
  toggleFavorite,
} = recipesSlice.actions;

export default recipesSlice.reducer;
