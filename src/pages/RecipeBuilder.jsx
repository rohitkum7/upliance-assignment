import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRecipe } from "../features/recipes/recipesSlice";
import {
  DIFFICULTIES,
  createIngredient,
  createRecipeStep,
  createRecipe,
} from "../features/recipes/types";
import { useForm } from "@tanstack/react-form";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecipeBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // TanStack form setup
  const form = useForm({
    defaultValues: {
      title: "",
      cuisine: "",
      difficulty: "Easy",
      ingredientName: "",
      quantity: "",
      unit: "",
      stepDescription: "",
      stepType: "instruction",
      durationMinutes: "",
      temperature: "",
      speed: "",
    },
    onSubmit: ({ value }) => {
      // Validation checks
      if (value.title.length < 3) {
        toast.error("Title must be at least 3 characters long");
        return;
      }
      if (ingredients.length < 1) {
        toast.error("Add at least one ingredient");
        return;
      }
      if (steps.length < 1) {
        toast.error("Add at least one step");
        return;
      }

      const totalTimeMinutes = steps.reduce(
        (sum, s) => sum + Number(s.durationMinutes),
        0
      );

      const base = { Easy: 1, Medium: 2, Hard: 3 };
      const complexityScore = base[value.difficulty] * steps.length;

      const recipe = createRecipe({
        title: value.title,
        cuisine: value.cuisine,
        difficulty: value.difficulty,
        ingredients,
        steps,
        totalTimeMinutes,
        complexityScore,
      });

      dispatch(addRecipe(recipe));
      setSnackbarOpen(true);
      setTimeout(() => navigate("/recipes"), 1000);
    },
  });

  // Add Ingredient
  const handleAddIngredient = (value) => {
    if (!value.ingredientName || !value.quantity || !value.unit) {
      alert("Please fill all ingredient fields");
      return;
    }
    const newIng = createIngredient(
      value.ingredientName,
      Number(value.quantity),
      value.unit
    );
    setIngredients((prev) => [...prev, newIng]);
    form.resetField("ingredientName");
    form.resetField("quantity");
    form.resetField("unit");
  };

  // Add Step
  const handleAddStep = (value) => {
    if (!value.stepDescription || !value.durationMinutes) {
      alert("Step description and duration are required");
      return;
    }

    if (value.stepType === "cooking" && (!value.temperature || !value.speed)) {
      alert("Cooking steps require temperature and speed");
      return;
    }

    const newStep = createRecipeStep({
      description: value.stepDescription,
      type: value.stepType,
      durationMinutes: Number(value.durationMinutes),
      cookingSettings:
        value.stepType === "cooking"
          ? {
              temperature: Number(value.temperature),
              speed: Number(value.speed),
            }
          : undefined,
    });

    setSteps((prev) => [...prev, newStep]);
    form.resetField("stepDescription");
    form.resetField("durationMinutes");
    form.resetField("temperature");
    form.resetField("speed");
  };

  // Move Step (Up/Down)
  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ];
    setSteps(newSteps);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" mb={2}>
        🍳 Create a Recipe
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Title */}
        <form.Field name="title">
          {(field) => (
            <TextField
              label="Recipe Title"
              fullWidth
              margin="normal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        {/* Cuisine */}
        <form.Field name="cuisine">
          {(field) => (
            <TextField
              label="Cuisine"
              fullWidth
              margin="normal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        {/* Difficulty */}
        <form.Field name="difficulty">
          {(field) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={field.state.value}
                label="Difficulty"
                onChange={(e) => field.handleChange(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </form.Field>

        {/* Ingredient Section */}
        <Typography variant="h6" mt={3}>
          Ingredients
        </Typography>
        <Box display="flex" gap={2} mt={1}>
          <form.Field name="ingredientName">
            {(field) => (
              <TextField
                label="Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="quantity">
            {(field) => (
              <TextField
                label="Qty"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="unit">
            {(field) => (
              <TextField
                label="Unit"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddIngredient(form.state.values)}
          >
            Add
          </Button>
        </Box>

        {ingredients.length > 0 && (
          <Box mt={2}>
            {ingredients.map((ing) => (
              <Typography key={ing.id}>
                • {ing.name} - {ing.quantity} {ing.unit}
              </Typography>
            ))}
          </Box>
        )}

        {/* Steps Section */}
        <Typography variant="h6" mt={4}>
          Steps
        </Typography>

        <form.Field name="stepDescription">
          {(field) => (
            <TextField
              fullWidth
              label="Step Description"
              margin="normal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="stepType">
          {(field) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Step Type</InputLabel>
              <Select
                value={field.state.value}
                label="Step Type"
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <MenuItem value="instruction">Instruction</MenuItem>
                <MenuItem value="cooking">Cooking</MenuItem>
              </Select>
            </FormControl>
          )}
        </form.Field>

        <form.Field name="durationMinutes">
          {(field) => (
            <TextField
              label="Duration (mins)"
              type="number"
              fullWidth
              margin="normal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.stepType}>
          {(stepType) =>
            stepType === "cooking" && (
              <Box display="flex" gap={2}>
                <form.Field name="temperature">
                  {(field) => (
                    <TextField
                      label="Temperature (°C)"
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>

                <form.Field name="speed">
                  {(field) => (
                    <TextField
                      label="Speed"
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </Box>
            )
          }
        </form.Subscribe>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleAddStep(form.state.values)}
          >
            Add Step
          </Button>

          <Button type="submit" variant="contained" color="primary">
            Save Recipe
          </Button>
        </Box>

        {steps.length > 0 && (
          <Box mt={2}>
            {steps.map((s, i) => (
              <Box
                key={s.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  background: "#f9f9f9",
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                }}
              >
                <Typography>
                  {i + 1}. {s.description} ({s.durationMinutes} min)
                </Typography>
                <Box>
                  <Button onClick={() => moveStep(i, -1)}>⬆️</Button>
                  <Button onClick={() => moveStep(i, 1)}>⬇️</Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {steps.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" color="text.secondary">
              ⏱️ Total Time:{" "}
              {steps.reduce((sum, s) => sum + Number(s.durationMinutes), 0)}{" "}
              minutes
            </Typography>
          </Box>
        )}
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success">Recipe saved successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default RecipeBuilder;
