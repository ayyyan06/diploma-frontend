import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { buildPersonalityTestResult } from "../data/personalityTest";
import { fetchWithToken } from "../api/apiutils";

/* ---------- Types ---------- */

export interface BigFiveTrait {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  score: number;
  narrative: string;
}

export interface PersonalityResult {
  archetypeKey: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  whyThisArchetype: string;
  shadowArchetype: string;
  topTraits: string[];
  developmentFocus: string;
  bigFive: BigFiveTrait[];
}

interface PersonalityState {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  submitting: boolean;
  submitError: string | null;
}

/* ---------- Async thunk: compute + POST ---------- */

export const submitPersonalityResult = createAsyncThunk<
  void,
  Record<number, string>,
  { rejectValue: string }
>(
  "personality/submitResult",
  async (selectedAnswers, { rejectWithValue }) => {
    const result = buildPersonalityTestResult(selectedAnswers);

    try {
      await fetchWithToken(
        "/api/v1/tests",
        { method: "POST" },
        { type: "personality", result }
      );
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to save result to server"
      );
    }
  }
);

/* ---------- Initial state ---------- */

const initialState: PersonalityState = {
  currentQuestionIndex: 0,
  selectedAnswers: {},
  submitting: false,
  submitError: null,
};

/* ---------- Slice ---------- */

const personalitySlice = createSlice({
  name: "personality",
  initialState,
  reducers: {
    selectAnswer(
      state,
      action: PayloadAction<{ questionId: number; answerId: string }>
    ) {
      state.selectedAnswers[action.payload.questionId] =
        action.payload.answerId;
    },

    goToNextQuestion(state) {
      state.currentQuestionIndex += 1;
    },

    goToPreviousQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },

    resetTest(state) {
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.submitting = false;
      state.submitError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(submitPersonalityResult.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitPersonalityResult.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitPersonalityResult.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload ?? "Unknown error";
      });
  },
});

export const {
  selectAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  resetTest,
} = personalitySlice.actions;

export default personalitySlice.reducer;
