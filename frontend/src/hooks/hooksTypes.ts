import { OutputData } from "@editorjs/editorjs";

export interface Blog {
    blogId: string;
    title: string;
    content: OutputData;
    subtitle: string;
    publishedDate: string | null;
    claps: number;
    bannerImageKey: string | null;
    bannerImageUrl: string | null;
    author: {
        name: string;
        profileImageKey: string | null;
        profileImageUrl: string | null;
        userId: string;
        username: string;
    };
}

export interface UserBlogs {
    blogId: string;
    authorname: string | null;
    authorName: string | null;
    authorUsername: string | null;
    profileImageUrl: string | null;
    title: string;
    subtitle: string;
    content: OutputData;
    publishedDate: string | null;
    claps: number;
    bannerImageKey: string | null;
    bannerImageUrl: string | null;
}

export interface UserProfileDetails {
    userId: string;
    profileImageUrl: string | null;
    name: string;
    bio: string;
    totalClaps: number;
    followersCount: number;
    followingCount: number;
    createdAt: string;
    profileImageKey: string | null;
    blogs: UserBlogs[];
}

export interface UserSmallCard {
    userId: string;
    name: string;
    username: string;
    profileImageKey?: string | null;
    profileImageUrl?: string | null;
    createdAt: string;
}