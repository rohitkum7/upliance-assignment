import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Star, StarOff } from "lucide-react";
import {
  loadFromLocalStorage,
  toggleFavorite,
} from "../features/recipes/recipesSlice";

const RecipeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipes = useSelector((state) => state.recipes.recipes);

  useEffect(() => {
    dispatch(loadFromLocalStorage());
  }, [dispatch]);

  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredRecipes = [...recipes]
    .filter((recipe) =>
      selectedDifficulties.length > 0
        ? selectedDifficulties.includes(recipe.difficulty)
        : true
    )
    .sort((a, b) => {
      const aTime = a.totalTimeMinutes || 0;
      const bTime = b.totalTimeMinutes || 0;
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">🍽️ Recipes</Typography>
        <Button variant="contained" onClick={() => navigate("/create")}>
          Create Recipe
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Difficulty</InputLabel>
          <Select
            multiple
            value={selectedDifficulties}
            onChange={(e) => setSelectedDifficulties(e.target.value)}
            label="Filter by Difficulty"
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort by Time</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort by Time"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Recipe Cards */}
      {filteredRecipes.length === 0 ? (
        <Typography>No recipes found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": { boxShadow: 4 },
                }}
                onClick={() => navigate(`/cook/${recipe.id}`)}
              >
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Chip
                    label={recipe.difficulty || "Unknown"}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    ⏱️ Total Time: {recipe.totalTimeMinutes || 0} mins
                  </Typography>

                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(recipe.id));
                    }}
                  >
                    {recipe.isFavorite ? <Star color="gold" /> : <StarOff />}
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecipeList;
