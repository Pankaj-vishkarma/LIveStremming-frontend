import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isAuthChecked: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // ✅ set user after login / session restore
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
        },

        // ✅ clear user on logout / error
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isAuthChecked = true;
        },
    },
});

// ✅ export actions
export const { setUser, clearUser } = authSlice.actions;

// ✅ export reducer
export default authSlice.reducer;