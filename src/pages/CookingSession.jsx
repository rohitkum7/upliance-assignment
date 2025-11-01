import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  startSession,
  pauseSession,
  resumeSession,
  stopStep,
  tickSecond,
  endSession,
} from "../features/session/sessionSlice";
import { toggleFavorite } from "../features/recipes/recipesSlice";
import { Star, StarOff } from "lucide-react";

const CookingSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes.recipes);
  const session = useSelector((state) => state.session);

  const recipe = recipes.find((r) => r.id === id);
  const [intervalId, setIntervalId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Auto end session if recipe not found
  useEffect(() => {
    if (!recipe) navigate("/recipes");
  }, [recipe, navigate]);

  // Start ticking every second when active
  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      const id = setInterval(() => dispatch(tickSecond()), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [session.isActive, session.isPaused, dispatch]);

  // Auto-advance step or end session
  useEffect(() => {
    if (session.isActive && recipe) {
      const currentStep = recipe.steps[session.currentStepIndex];
      if (
        currentStep &&
        session.timeElapsed >= currentStep.durationMinutes * 60
      ) {
        dispatch(stopStep(recipe.steps.length));

        // End session if last step completed
        if (session.currentStepIndex === recipe.steps.length - 1) {
          dispatch(endSession());
          setSnackbarOpen(true);
          setTimeout(() => navigate("/recipes"), 1500);
        }
      }
    }
  }, [session.timeElapsed]);

  if (!recipe) return null;

  const currentStep = recipe.steps[session.currentStepIndex];
  const totalSteps = recipe.steps.length;

  const overallProgress =
    ((session.currentStepIndex +
      session.timeElapsed / (currentStep?.durationMinutes * 60 || 1)) /
      totalSteps) *
    100;

  const stepProgress = currentStep
    ? Math.min(
        (session.timeElapsed / (currentStep.durationMinutes * 60)) * 100,
        100
      )
    : 0;

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4">{recipe.title}</Typography>
          <Chip label={recipe.difficulty} color="primary" sx={{ mt: 1 }} />
          <Typography variant="body2" color="text.secondary">
            ⏱️ Total Time: {recipe.totalTimeMinutes || 0} mins
          </Typography>
        </Box>

        <IconButton onClick={() => dispatch(toggleFavorite(recipe.id))}>
          {recipe.isFavorite ? <Star color="gold" /> : <StarOff />}
        </IconButton>
      </Box>

      {/* Active Step */}
      {session.isActive ? (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Step {session.currentStepIndex + 1} of {totalSteps}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {currentStep?.description}
              </Typography>

              <Box display="flex" alignItems="center" gap={3} mt={2}>
                <CircularProgress
                  variant="determinate"
                  value={stepProgress}
                  size={70}
                />
                <Typography variant="body2">
                  {Math.round(stepProgress)}%
                </Typography>
              </Box>

              {currentStep?.type === "cooking" &&
                currentStep.cookingSettings && (
                  <Box mt={2}>
                    <Chip
                      label={`🔥 Temp: ${currentStep.cookingSettings.temperature}°C`}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`⚙️ Speed: ${currentStep.cookingSettings.speed}`}
                    />
                  </Box>
                )}

              {currentStep?.type === "instruction" &&
                currentStep.ingredientIds?.length > 0 && (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {currentStep.ingredientIds.map((id) => {
                      const ing = recipe.ingredients.find((i) => i.id === id);
                      return (
                        <Chip key={id} label={ing ? ing.name : "Unknown"} />
                      );
                    })}
                  </Box>
                )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Box display="flex" gap={2} mb={3}>
            {session.isPaused ? (
              <Button
                variant="contained"
                onClick={() => dispatch(resumeSession())}
              >
                ▶ Resume
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => dispatch(pauseSession())}
              >
                ⏸ Pause
              </Button>
            )}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                dispatch(endSession());
                navigate("/recipes");
              }}
            >
              ⏹ Stop
            </Button>
          </Box>

          {/* Overall Progress */}
          <Box mt={3}>
            <Typography variant="body2" gutterBottom>
              Overall Progress
            </Typography>
            <LinearProgress variant="determinate" value={overallProgress} />
          </Box>

          {/* Timeline */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Grid container spacing={1}>
              {recipe.steps.map((step, index) => (
                <Grid item xs={12} key={step.id}>
                  <Card
                    sx={{
                      backgroundColor:
                        index < session.currentStepIndex
                          ? "#e0f7fa"
                          : index === session.currentStepIndex
                          ? "#fff9c4"
                          : "#f5f5f5",
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2">
                        Step {index + 1}: {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" mb={2}>
            Ready to start cooking?
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(startSession(recipe.id));
            }}
          >
            ▶ Start Session
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Session Complete!"
      />
    </Box>
  );
};

export default CookingSession;
