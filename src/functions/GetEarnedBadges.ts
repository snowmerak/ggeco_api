import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";
import { EarnedBadge } from "./GetEarnedBadge";

export async function GetEarnedBadges(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const earned_badges = await db.earnedBadges.findMany({
        where: {
            user_id: token.id,
        }
    });

    const user_cound = await db.users.count();

    const resp = new Array<EarnedBadge>();
    for (const earned_badge of earned_badges) {
        const badge = await db.badges.findFirst({
            where: {
                id: earned_badge.badge_id,
            }
        });

        const earned_count = await db.earnedBadges.count({
            where: {
                badge_id: earned_badge.badge_id,
            }
        });

        resp.push({
            is_earned: true,
            badge_id: badge.id,    
            name: badge.name,
            summary: badge.summary,
            image: badge.active_image,
            earned_at: earned_badge.earned_at,
            earned_rate: earned_count / user_cound,
        });
    }

    return {
        status: 200,
        body: JSON.stringify(resp),
    };
};

app.http('GetEarnedBadges', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetEarnedBadges
});
