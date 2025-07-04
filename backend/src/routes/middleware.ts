import { verify } from 'hono/jwt';

export const authMiddleware = async (c: any, next: () => Promise<void>) => {
    const cookie = c.req.header('cookie') || '';
    // as i cant use cookie parser in hono, so i have manually parsed the cookie
    const token = cookie
    .split('; ')
    .find((row: string) => row.startsWith('token='))
    ?.split('=')[1];
    
    if (!token) {
        c.status(401);
        return c.json({ message: 'Token not found.' });
    }

    try {
        const user = await verify(token, c.env.JWT_SECRET);
        if (user && user.userId) {
            c.set('userId', user.userId);
            await next();
        } else {
            c.status(403);
            return c.json({ message: 'Unauthorized access.' });
        }
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Invalid token.' });
    }
};
