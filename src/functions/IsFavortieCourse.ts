import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function IsFavortieCourse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const course_id = request.query.get('course_id');
    if (!course_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'course_id is required'
            })
        }
    }

    const db = new PrismaClient();

    const favorite_course_count = await db.favoriteCourses.count({
        where: {
            user_id: token.id,
            course_id: course_id,
        }
    });

    return {
        status: 200,
        body: JSON.stringify({
            is_favorite: favorite_course_count > 0,
        }),
    };
};

app.http('IsFavortieCourse', {
    methods: ['GET'],
    authLevel: 'function',
    handler: IsFavortieCourse
});
