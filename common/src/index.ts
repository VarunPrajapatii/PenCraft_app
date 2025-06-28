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
  blogId: z.string(),
  title: z.string(),
  subtitle: z.string(),
  content: editorJsContent,
  bannerImageKey: z.string().optional(),
  published: z.boolean().optional(),
});

export const updatePostInput = z.object({
  blogId: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: editorJsContent.optional(),
  bannerImageKey: z.string().optional(),
  published: z.boolean().optional(),
});



export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;