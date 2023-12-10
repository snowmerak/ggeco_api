import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";
import { CourseData, ErrorCode, getCourseData } from "../course/course";

export async function GetFavoriteCourses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const favorite_courses = await db.favoriteCourses.findMany({
        where: {
            user_id: token.id,
        },
    });

    let courses = new Array<CourseData>();
    for (const favorite_course of favorite_courses) {
        const course_data = await getCourseData(favorite_course.course_id);

        if (course_data instanceof ErrorCode) {
            return {
                status: course_data.code,
                body: JSON.stringify({
                    error: course_data.message,
                }),
            }
        }

        if (course_data.course.is_public == 0) {
            continue;
        }

        course_data.is_favorite = true;

        courses.push(course_data);
    }

    return {
        status: 200,
        body: JSON.stringify(courses),
    };
};

app.http('GetFavoriteCourses', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetFavoriteCourses
});
