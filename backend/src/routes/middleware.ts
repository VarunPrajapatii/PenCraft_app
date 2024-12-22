import { verify } from 'hono/jwt';

export const authMiddleware = async (c: any, next: () => Promise<void>) => {
    const authHeader = c.req.header('authorization') || '';
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set('userId', user.userId);
            await next(); // Proceed to the next route
        } else {
            c.status(403);
            return c.json({ message: 'Unauthorized access.' });
        }
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Invalid token.' });
    }
};
