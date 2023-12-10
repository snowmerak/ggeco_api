import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

export async function GetSearchableBadges(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const db = new PrismaClient();

    const badges = await db.badges.findMany(
        {
            where: {
                searchable: 1,
            }
        }
    );

    return {
        status: 200,
        body: JSON.stringify(badges),
    };
};

app.http('GetSearchableBadges', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetSearchableBadges
});
