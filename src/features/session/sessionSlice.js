// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   activeRecipeId: null,
//   currentStepIndex: 0,
//   timeElapsed: 0,
//   isPaused: false,
//   isActive: false,
// };

// const sessionSlice = createSlice({
//   name: "session",
//   initialState,
//   reducers: {
//     startSession: (state, action) => {
//       state.activeRecipeId = action.payload;
//       state.currentStepIndex = 0;
//       state.timeElapsed = 0;
//       state.isPaused = false;
//       state.isActive = true;
//     },

//     pauseSession: (state) => {
//       state.isPaused = true;
//     },

//     resumeSession: (state) => {
//       state.isPaused = false;
//     },

//     stopStep: (state, action) => {
//       const totalSteps = action.payload;
//       if (state.currentStepIndex < totalSteps - 1) {
//         state.currentStepIndex += 1;
//         state.timeElapsed = 0;
//       } else {
//         state.isActive = false;
//         state.activeRecipeId = null;
//         state.currentStepIndex = 0;
//       }
//     },

//     tickSecond: (state) => {
//       if (state.isActive && !state.isPaused) {
//         state.timeElapsed += 1;
//       }
//     },

//     endSession: (state) => {
//       state.activeRecipeId = null;
//       state.currentStepIndex = 0;
//       state.timeElapsed = 0;
//       state.isPaused = false;
//       state.isActive = false;
//     },
//   },
// });

// export const {
//   startSession,
//   pauseSession,
//   resumeSession,
//   stopStep,
//   tickSecond,
//   endSession,
// } = sessionSlice.actions;

// export default sessionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast"; // 👈 Import toast

const initialState = {
  activeRecipeId: null,
  currentStepIndex: 0,
  timeElapsed: 0,
  isPaused: false,
  isActive: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession: (state, action) => {
      // 🚫 Prevent multiple sessions
      if (state.isActive && state.activeRecipeId !== null) {
        toast.error("⚠️ A cooking session is already active!");
        return;
      }

      state.activeRecipeId = action.payload;
      state.currentStepIndex = 0;
      state.timeElapsed = 0;
      state.isPaused = false;
      state.isActive = true;

      toast.success("🍳 Cooking session started!");
    },

    pauseSession: (state) => {
      if (!state.isActive) return;
      state.isPaused = true;
      toast("⏸️ Cooking paused");
    },

    resumeSession: (state) => {
      if (!state.isActive) return;
      state.isPaused = false;
      toast("▶️ Cooking resumed");
    },

    stopStep: (state, action) => {
      const totalSteps = action.payload;

      if (state.currentStepIndex < totalSteps - 1) {
        state.currentStepIndex += 1;
        state.timeElapsed = 0;
        toast.success("✅ Step completed! Moving to next...");
      } else {
        toast.success("🎉 All steps complete! Great job!");
        state.isActive = false;
        state.activeRecipeId = null;
        state.currentStepIndex = 0;
      }
    },

    tickSecond: (state) => {
      if (state.isActive && !state.isPaused) {
        state.timeElapsed += 1;
      }
    },

    endSession: (state) => {
      if (state.isActive) toast("🛑 Cooking session ended");
      state.activeRecipeId = null;
      state.currentStepIndex = 0;
      state.timeElapsed = 0;
      state.isPaused = false;
      state.isActive = false;
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  stopStep,
  tickSecond,
  endSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
