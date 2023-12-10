import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";
import { removeCourseData } from "../course/detail";

export async function RemoveCourse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const course = await db.courses.findUnique({
        where: {
            id: course_id,
        }
    });

    if (!course) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'course not found'
            })
        }
    }

    if (course.author_id !== token.id) {
        return {
            status: 401,
            body: JSON.stringify({
                error: 'not your course'
            })
        }
    }

    await db.courses.delete({
        where: {
            id: course_id,
        }
    });

    await removeCourseData(course, db);

    return { status: 200 };
};

app.http('RemoveCourse', {
    methods: ['DELETE'],
    authLevel: 'function',
    handler: RemoveCourse
});
