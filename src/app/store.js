import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../features/recipes/recipesSlice";
import sessionReducer from "../features/session/sessionSlice";

const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    session: sessionReducer,
  },
});

export default store;
