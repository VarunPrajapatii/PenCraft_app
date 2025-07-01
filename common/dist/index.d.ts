import z from "zod";
export declare const signupInput: z.ZodObject<{
    username: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    name: string;
}, {
    username: string;
    password: string;
    name: string;
}>;
export declare const signinInput: z.ZodObject<{
    username: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const createPostInput: z.ZodObject<{
    blogId: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodString;
    content: z.ZodObject<{
        time: z.ZodNumber;
        blocks: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            data: z.ZodRecord<z.ZodString, z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            data: Record<string, any>;
        }, {
            type: string;
            data: Record<string, any>;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    }, {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    }>;
    bannerImageKey: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    blogId: string;
    title: string;
    subtitle: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
    bannerImageKey?: string | undefined;
    published?: boolean | undefined;
}, {
    blogId: string;
    title: string;
    subtitle: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
    bannerImageKey?: string | undefined;
    published?: boolean | undefined;
}>;
export declare const updatePostInput: z.ZodObject<{
    blogId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodObject<{
        time: z.ZodNumber;
        blocks: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            data: z.ZodRecord<z.ZodString, z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            data: Record<string, any>;
        }, {
            type: string;
            data: Record<string, any>;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    }, {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    }>>;
    bannerImageKey: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    blogId: string;
    title?: string | undefined;
    subtitle?: string | undefined;
    content?: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    } | undefined;
    bannerImageKey?: string | undefined;
    published?: boolean | undefined;
}, {
    blogId: string;
    title?: string | undefined;
    subtitle?: string | undefined;
    content?: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    } | undefined;
    bannerImageKey?: string | undefined;
    published?: boolean | undefined;
}>;
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;
