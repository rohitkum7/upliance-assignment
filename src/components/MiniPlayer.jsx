import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Pause, Play, Square } from "lucide-react";
import {
  pauseSession,
  resumeSession,
  stopStep,
  endSession,
  tickSecond,
} from "../features/session/sessionSlice";

const MiniPlayer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeRecipeId, currentStepIndex, isActive, isPaused, timeElapsed } =
    useSelector((state) => state.session);
  const recipes = useSelector((state) => state.recipes.recipes);

  const activeRecipe = recipes.find((r) => r.id === activeRecipeId);
  const currentStep = activeRecipe?.steps?.[currentStepIndex];
  const totalSteps = activeRecipe?.steps?.length ?? 0;

  useEffect(() => {
    if (!isActive || !activeRecipe || !currentStep) return;
    const interval = setInterval(() => {
      if (!isPaused) dispatch(tickSecond());
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isActive, dispatch, activeRecipe, currentStep]);

  useEffect(() => {
    if (
      isActive &&
      currentStep &&
      timeElapsed >= currentStep.durationMinutes * 60
    ) {
      dispatch(stopStep(totalSteps));
    }
  }, [timeElapsed, currentStep, totalSteps, dispatch, isActive]);

  const stepProgress = useMemo(() => {
    if (!currentStep) return 0;
    const totalSec = currentStep.durationMinutes * 60;
    return Math.min((timeElapsed / totalSec) * 100, 100);
  }, [timeElapsed, currentStep]);

  const handleNavigate = () => navigate(`/cook/${activeRecipeId}`);

  if (!isActive || !activeRecipe || !currentStep) return null;

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 600,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        zIndex: 1000,
        cursor: "pointer",
      }}
      onClick={handleNavigate}
    >
      <Box display="flex" alignItems="center" gap={2} flex={1}>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={stepProgress}
            size={48}
            thickness={5}
            color="primary"
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption">
              {Math.floor(
                (currentStep.durationMinutes * 60 - timeElapsed) / 60
              )}
              m
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {activeRecipe.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Step {currentStepIndex + 1} of {totalSteps} ·{" "}
            {isPaused ? "Paused" : "Running"}
          </Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          color="primary"
          onClick={() => {
            if (isPaused) dispatch(resumeSession());
            else dispatch(pauseSession());
          }}
        >
          {isPaused ? <Play /> : <Pause />}
        </IconButton>
        <IconButton color="error" onClick={() => dispatch(endSession())}>
          <Square />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default MiniPlayer;
