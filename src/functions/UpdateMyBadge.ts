import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

class UpdateMyBadgeRequest {
    public badge_id: string;
}

export async function UpdateMyBadge(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let req = new UpdateMyBadgeRequest();
    try {
        const body = (await request.json()) as UpdateMyBadgeRequest;
        req = body;
    } catch (e) {
        return {
            status: 400,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

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

    await db.users.update({
        where: {
            id: token.id,
        },
        data: {
            badge: req.badge_id,
        }
    });

    return { status: 200 };
};

app.http('UpdateMyBadge', {
    methods: ['PATCH'],
    authLevel: 'function',
    handler: UpdateMyBadge
});
