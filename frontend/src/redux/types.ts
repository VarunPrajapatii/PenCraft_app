import { UserProfileDetails } from "../hooks/hooks";

export interface AuthState {
    access_token: string | null;
    user: string | null;
    name: string | null;
    username: string | null;
    profileImageUrl: string | null;
}


export interface RootState {
    auth: AuthState;
    loggedInUserDetails: UserProfileDetails;
}