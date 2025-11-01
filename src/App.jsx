import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import RecipeBuilder from "./pages/RecipeBuilder";
import CookingSession from "./pages/CookingSession";
import MiniPlayer from "./components/MiniPlayer";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/create" element={<RecipeBuilder />} />
          <Route path="/cook/:id" element={<CookingSession />} />
        </Routes>

        {/* MiniPlayer is outside Routes */}
        <MiniPlayer />
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
