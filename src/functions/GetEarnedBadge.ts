import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export class EarnedBadge {
    is_earned: boolean;
    badge_id: string;
    name: string;
    summary: string;
    image: string;
    earned_at: Date;
    earned_rate: number;
}

export async function GetEarnedBadge(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const earned = await db.earnedBadges.findFirst({
        where: {
            user_id: token.id,
            badge_id: badge_id,
        }
    });
    
    const user_count = await db.users.count();

    const earned_count = await db.earnedBadges.count({
        where: {
            badge_id: badge_id,
        }
    });

    const badge = await db.badges.findFirst({
        where: {
            id: badge_id,
        }
    });

    const earned_badge = new EarnedBadge();
    earned_badge.is_earned = earned ? true : false;
    earned_badge.badge_id = badge?.id;
    earned_badge.name = badge?.name;
    earned_badge.summary = badge?.summary;
    earned_badge.image = badge?.active_image;
    earned_badge.earned_at = earned?.earned_at;
    earned_badge.earned_rate = earned_count / user_count;

    return {
        status: 200,
        body: JSON.stringify(earned_badge),
    };
};

app.http('GetEarnedBadge', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetEarnedBadge
});
