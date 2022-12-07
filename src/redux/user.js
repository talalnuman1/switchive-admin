import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoginState: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setLoginState } = userSlice.actions;

export default userSlice.reducer;
