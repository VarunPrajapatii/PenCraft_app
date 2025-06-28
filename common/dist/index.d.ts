import z from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createPostInput: z.ZodObject<{
    title: z.ZodString;
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
}, "strip", z.ZodTypeAny, {
    title: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
}, {
    title: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
}>;
export declare const updatePostInput: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
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
}, "strip", z.ZodTypeAny, {
    title: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
    id: string;
}, {
    title: string;
    content: {
        time: number;
        blocks: {
            type: string;
            data: Record<string, any>;
        }[];
        version: string;
    };
    id: string;
}>;
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;
