import z from "zod";

const editorJsBlock = z.object({
  type: z.string(),
  data: z.record(z.any()),
});

const editorJsContent = z.object({
  time: z.number(),
  blocks: z.array(editorJsBlock),
  version: z.string()
});

export const signupInput = z.object({
  username: z
    .string()
    .min(5, 'Username is required')
    .max(30, 'Username must be 30 characters or less')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      'Username must start with a letter and can only contain letters, numbers, and underscores'
    )
    .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
      message: 'Username cannot start or end with an underscore',
    })
    .refine((val) => !val.includes('__'), {
      message: 'Username cannot contain consecutive underscores',
    }),
  password: z.string().min(6),
  name: z.string()
});


export const signinInput = z.object({
    username: z
      .string()
      .min(5, 'Username is required')
      .max(30, 'Username must be 30 characters or less')
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        'Username must start with a letter and can only contain letters, numbers, and underscores'
      )
      .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
        message: 'Username cannot start or end with an underscore',
      })
      .refine((val) => !val.includes('__'), {
        message: 'Username cannot contain consecutive underscores',
      }),
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