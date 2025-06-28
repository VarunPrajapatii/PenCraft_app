import z from "zod";

const editorJsBlock = z.object({
  type: z.string(),
  data: z.record(z.any()),
});

const editorJsContent = z.object({
  time: z.number(),
  blocks: z.array(editorJsBlock),
  version: z.string(),
});

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
});


export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});


export const createPostInput = z.object({
  title: z.string(),
  content: editorJsContent,
});

export const updatePostInput = z.object({
  id: z.string(),
  title: z.string(),
  content: editorJsContent,
});



export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;