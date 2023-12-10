import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function GetFavoriteCourses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let token = new Payload();
    try {
        const data = getAndVerifyAccessToken(request.headers);
        token = data;
    } catch (e) {
        return {
            status: 401,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

    const db = new PrismaClient();

    const favorite_courses = await db.favoriteCourses.findMany({
        where: {
            user_id: token.id,
        },
    });

    return { body: `Hello, ${name}!` };
};

app.http('GetFavoriteCourses', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: GetFavoriteCourses
});
