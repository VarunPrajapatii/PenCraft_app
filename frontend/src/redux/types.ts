import { UserProfileDetails } from "../hooks/hooks";

export interface AuthState {
    access_token: string | null;
    user: string;
}


export interface RootState {
    auth: AuthState;
    loggedInUserDetails: UserProfileDetails;
}