import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import userProfileSlice from "./slice/profileSlice";
import draftSlice from "./slice/draftSlice";
import darkModeSlice from "./slice/darkModeSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        loggedInUserDetails: userProfileSlice,
        draftPostEdit: draftSlice,
        darkMode: darkModeSlice,
    }
})

export default store;