import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import userProfileSlice from "./slice/userProfileSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        loggedInUserDetails: userProfileSlice,
    }
})

export default store;