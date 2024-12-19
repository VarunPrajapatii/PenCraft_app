import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    access_token: localStorage.getItem("pencraft_token") || null,
    user: (() => {
        const user = localStorage.getItem("pencraft_user");
        try {
            return user ? JSON.parse(user) : null; // Only parse if there's a value
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null; // Fallback to null if JSON.parse fails
        }
    })(),
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        authenticate: (state, { payload }) => {
            console.log(payload);
            state.user = payload.userId;
            state.access_token = payload.jwt;
            localStorage.setItem("pencraft_token", payload.jwt);
            localStorage.setItem("pencraft_user", JSON.stringify(payload.userId));
        },
        logout: (state) => {
            state.user = null;
            state.access_token = null;
            localStorage.removeItem("pencraft_token");
            localStorage.removeItem("pencraft_user");
        },

    }
});


export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;