import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
    name: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    createdAt: "",
}

const userProfileSlice = createSlice({
    name: "userProfileSlice",
    initialState,
    reducers: {
        setUserProfile: (state, { payload }) => {
            // console.log("Payload received in setUserProfile:", payload)
            state.email= payload.email;
            state.name= payload.name;
            state.bio= payload.bio;
            state.followersCount= payload.followersCount;
            state.followingCount= payload.followingCount;
            state.createdAt= payload.createdAt;
        },
        clearUser: (state) => {        
            state.email= "";
            state.name= "";
            state.bio= "";
            state.followersCount= 0;
            state.followingCount= 0;
            state.createdAt= "";
        }
    }
})

export const { setUserProfile, clearUser } = userProfileSlice.actions;
export default userProfileSlice.reducer;