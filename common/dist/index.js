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
    version: zod_1.default.string(),
});
exports.signupInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string().optional()
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.createPostInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: editorJsContent,
});
exports.updatePostInput = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string(),
    content: editorJsContent,
});
