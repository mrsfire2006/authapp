import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  currentUser: null,
  loading: false,
  error: "",
};

export const createUser = createAsyncThunk(
  "authApi/createUser",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData,
      );
      if (result.status == 201) {
        console.log(result.statusText);
        return result.data;
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const loginUser = createAsyncThunk(
  "authApi/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        formData,
      );
      if (result.status == 200) {
        console.log(result.statusText);
        return result.data;
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = "";
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = "";
      state.currentUser = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.currentUser = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, signInSuccess } = userSlice.actions;
export default userSlice.reducer;
