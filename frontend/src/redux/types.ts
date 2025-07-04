import { OutputData } from "@editorjs/editorjs";
import { UserProfileDetails } from "../hooks/hooks";

export interface AuthState {
    user: string | null;
    name: string | null;
    username: string | null;
    profileImageUrl: string | null;
}

export interface DraftState {
    title: string;
    subtitle: string;
    content: OutputData;
    bannerImageUrl: string;
    bannerFile: File | null;
    isEditingDraft: boolean;
    editingBlogId: string | null;
}

export interface RootState {
    auth: AuthState;
    loggedInUserDetails: UserProfileDetails;
    draftPostEdit: DraftState;
}