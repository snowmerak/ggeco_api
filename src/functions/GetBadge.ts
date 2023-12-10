import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function GetBadge(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const badge_id = request.query.get('badge_id');
    if (!badge_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'badge_id is required'
            })
        }
    }

    const db = new PrismaClient();

    const badge = await db.badges.findFirst({
        where: {
            id: badge_id,
        }
    });

    return {
        status: 200,
        body: JSON.stringify(badge),
    };
};

app.http('GetBadge', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetBadge
});
