import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

class GetMyProfileResponse {
    public id: string;
    public nickname: string;
    public badge_id: string;
    public badge_image: string;
    public badge_summary: string;
    public favorite_place_count: number;
    public favorite_course_count: number;
}

export async function GetMyProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const user = await db.users.findFirst({
        where: {
            id: token.id,
        }
    });

    const badge = await db.badges.findFirst({
        where: {
            id: user.badge,
        }
    });

    const favorite_place_count = await db.favoritePlaces.count({
        where: {
            user_id: user.id,
        }
    });

    const favorite_course_count = await db.favoriteCourses.count({
        where: {
            user_id: user.id,
        }
    });

    const resp = new GetMyProfileResponse();
    resp.id = user.id;
    resp.nickname = user.nickname;
    resp.badge_id = badge.id;
    resp.badge_image = badge.active_image;
    resp.badge_summary = badge.summary;
    resp.favorite_place_count = favorite_place_count;
    resp.favorite_course_count = favorite_course_count;

    return { 
        status: 200,
        body: JSON.stringify(resp),
    };
};

app.http('GetMyProfile', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetMyProfile
});
