import { createSlice } from "@reduxjs/toolkit";
import { clearUser } from "./profileSlice";

const initialState = {
    user: (() => {
        const user = localStorage.getItem("pencraft_user");
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null;
        }
    })(),
    name: localStorage.getItem("pencraft_name") || null,
    username: localStorage.getItem("pencraft_username") || null,
    profileImageUrl: localStorage.getItem("pencraft_profileImageUrl") || null,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        authenticate: (state, { payload }) => {
            console.log("Authenticating user:", payload);
            state.user = payload.userId;
            state.name = payload.name;
            state.username = payload.username;
            state.profileImageUrl = payload.profileImageUrl || null;
                        
            // Store all data in localStorage
            localStorage.setItem("pencraft_user", JSON.stringify(payload.userId));
            localStorage.setItem("pencraft_name", payload.name);
            localStorage.setItem("pencraft_username", payload.username);
            if (payload.profileImageUrl) {
                localStorage.setItem("pencraft_profileImageUrl", payload.profileImageUrl);
            }
        },
        logout: (state) => {
            clearUser();
            state.user = null;
            state.name = null;
            state.username = null;
            state.profileImageUrl = null;
            
            // Clear all localStorage items
            localStorage.removeItem("pencraft_user");
            localStorage.removeItem("pencraft_name");
            localStorage.removeItem("pencraft_username");
            localStorage.removeItem("pencraft_profileImageUrl");
        },
    }
});

export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;