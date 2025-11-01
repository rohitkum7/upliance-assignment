// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   loadFromLocalStorage,
//   addRecipe,
// } from "./features/recipes/recipesSlice";

// import {
//   createIngredient,
//   createRecipeStep,
//   createRecipe,
//   DIFFICULTIES,
// } from "./features/recipes/types";

// import {
//   startSession,
//   pauseSession,
//   resumeSession,
//   stopStep,
//   tickSecond,
//   endSession,
// } from "./features/session/sessionSlice";

// const App = () => {
//   const dispatch = useDispatch();

//   // Recipes state from localStorage
//   const recipes = useSelector((state) => state.recipes.recipes);

//   // Session state (in-memory)
//   const session = useSelector((state) => state.session);

//   // Load recipes when app starts
//   useEffect(() => {
//     dispatch(loadFromLocalStorage());
//   }, [dispatch]);

//   // Tick timer every second (only when session is active and not paused)
//   useEffect(() => {
//     let interval;
//     if (session.isActive && !session.isPaused) {
//       interval = setInterval(() => {
//         dispatch(tickSecond());
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [session.isActive, session.isPaused, dispatch]);

//   // Add a new recipe (like Tomato Soup)
//   const handleAddRecipe = () => {
//     const tomato = createIngredient("Tomato", 2, "pcs");

//     const boilTomato = createRecipeStep({
//       description: "Boil the tomatoes until soft.",
//       type: "cooking",
//       durationMinutes: 5,
//       cookingSettings: { temperature: 100, speed: 3 },
//     });

//     const recipe = createRecipe({
//       title: "Tomato Soup",
//       cuisine: "Indian",
//       difficulty: DIFFICULTIES[0],
//       ingredients: [tomato],
//       steps: [boilTomato],
//     });

//     dispatch(addRecipe(recipe));
//   };

//   return (
//     <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
//       <h1>🍲 Recipe App with Session</h1>

//       {/* Add Recipe Button */}
//       <button onClick={handleAddRecipe}>Add Tomato Soup</button>

//       <h2>Stored Recipes</h2>
//       <pre>{JSON.stringify(recipes, null, 2)}</pre>

//       <hr />

//       {/* Session Controls */}
//       <h2>Cooking Session</h2>
//       {session.isActive ? (
//         <div>
//           <p>
//             <strong>Active Recipe ID:</strong> {session.activeRecipeId}
//           </p>
//           <p>
//             <strong>Step:</strong> {session.currentStepIndex + 1}
//           </p>
//           <p>
//             <strong>Time Elapsed:</strong> {session.timeElapsed}s
//           </p>

//           {session.isPaused ? (
//             <button onClick={() => dispatch(resumeSession())}>Resume</button>
//           ) : (
//             <button onClick={() => dispatch(pauseSession())}>Pause</button>
//           )}

//           <button
//             onClick={() => {
//               // Find the recipe and total steps
//               const recipe = recipes.find(
//                 (r) => r.id === session.activeRecipeId
//               );
//               const totalSteps = recipe?.steps?.length || 1;
//               dispatch(stopStep(totalSteps));
//             }}
//           >
//             Next Step
//           </button>

//           <button onClick={() => dispatch(endSession())}>End Session</button>
//         </div>
//       ) : (
//         <div>
//           <button
//             onClick={() => {
//               if (recipes.length > 0) {
//                 // Start with first recipe from localStorage
//                 dispatch(startSession(recipes[0].id));
//               } else {
//                 alert("No recipe found in localStorage!");
//               }
//             }}
//           >
//             Start Session
//           </button>
//         </div>
//       )}

//       <h3>Session State</h3>
//       <pre>{JSON.stringify(session, null, 2)}</pre>
//     </div>
//   );
// };

// export default App;

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
