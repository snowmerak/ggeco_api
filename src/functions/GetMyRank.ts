import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";
import { getAndVerifyAccessToken } from "../auth/token";

export async function GetMyRank(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let id = "";
    try {
        const accessToken = getAndVerifyAccessToken(request.headers);
        id = accessToken.id;
    } catch (e) {
        return {
            status: 401,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

    const db = new PrismaClient();

    const data = await db.badgeRank.findFirst({
        where: {
            user_id: id,
        }
    })

    const result = {
        delta: data.current_rank - data.prev_rank,
        rank: data.current_rank,
        updated: data.update_at,
    }

    return { 
        status: 200,
        body: JSON.stringify(result),
     };
};

app.http('GetMyRank', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetMyRank
});
