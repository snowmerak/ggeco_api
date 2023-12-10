import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

export async function GetBadges(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const db = new PrismaClient();

    const badges = await db.badges.findMany();

    return {
        status: 200,
        body: JSON.stringify(badges),
    };
};

app.http('GetBadges', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetBadges
});
