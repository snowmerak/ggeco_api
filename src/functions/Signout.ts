import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function Signout(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
            removed_at: new Date(),
        }
    });

    return { status: 200 };
};

app.http('Signout', {
    methods: ['DELETE'],
    authLevel: 'function',
    handler: Signout
});
