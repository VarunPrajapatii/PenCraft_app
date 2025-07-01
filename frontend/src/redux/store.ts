import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import userProfileSlice from "./slice/profileSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        loggedInUserDetails: userProfileSlice,
    }
})

export default store;