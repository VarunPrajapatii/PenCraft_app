export interface AuthState {
    access_token: string | null;
    user: any; // You can refine the type of `user` based on your application's needs
}

export interface RootState {
    auth: AuthState;
}