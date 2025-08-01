"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
const editorJsBlock = zod_1.default.object({
    type: zod_1.default.string(),
    data: zod_1.default.record(zod_1.default.any()),
});
const editorJsContent = zod_1.default.object({
    time: zod_1.default.number(),
    blocks: zod_1.default.array(editorJsBlock),
    version: zod_1.default.string()
});
exports.signupInput = zod_1.default.object({
    username: zod_1.default
        .string()
        .min(5, 'Username is required')
        .max(30, 'Username must be 30 characters or less')
        .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Username must start with a letter and can only contain letters, numbers, and underscores')
        .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
        message: 'Username cannot start or end with an underscore',
    })
        .refine((val) => !val.includes('__'), {
        message: 'Username cannot contain consecutive underscores',
    }),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string()
});
exports.signinInput = zod_1.default.object({
    username: zod_1.default
        .string()
        .min(5, 'Username is required')
        .max(30, 'Username must be 30 characters or less')
        .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Username must start with a letter and can only contain letters, numbers, and underscores')
        .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
        message: 'Username cannot start or end with an underscore',
    })
        .refine((val) => !val.includes('__'), {
        message: 'Username cannot contain consecutive underscores',
    }),
    password: zod_1.default.string().min(6),
});
exports.createPostInput = zod_1.default.object({
    blogId: zod_1.default.string(),
    title: zod_1.default.string(),
    subtitle: zod_1.default.string(),
    content: editorJsContent,
    bannerImageKey: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional(),
});
exports.updatePostInput = zod_1.default.object({
    blogId: zod_1.default.string(),
    title: zod_1.default.string().optional(),
    subtitle: zod_1.default.string().optional(),
    content: editorJsContent.optional(),
    bannerImageKey: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional(),
});
