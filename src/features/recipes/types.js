//Difficulty Levels
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const createIngredient = (name, quantity, unit) => ({
  id: Date.now().toString() + Math.random().toString(16).slice(2),
  name,
  quantity,
  unit,
});

export const createCookingSettings = (tempreature, speed) => ({
  tempreature,
  speed,
});

export const createRecipeStep = ({
  description,
  type,
  durationMinutes,
  cookingSettings,
  ingredientIds,
}) => ({
  id: Date.now().toString() + Math.random().toString(16).slice(2),
  description,
  type, // 'cooking' | 'instruction'
  durationMinutes,
  ...(type === "cooking" ? { cookingSettings } : {}),
  ...(type === "instruction" ? { ingredientIds } : {}),
});

export const createRecipe = ({
  title,
  cuisine,
  difficulty,
  ingredients,
  steps,
}) => ({
  id: Date.now().toString(),
  title,
  cuisine: cuisine || "",
  difficulty, // 'Easy' | 'Medium' | 'Hard'
  ingredients, // Array of Ingredient
  steps, // Array of RecipeStep
  isFavorite: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
