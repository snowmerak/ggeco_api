import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";
import { CourseData, ErrorCode, getCourseData } from "../course/course";

export async function GetMyCourses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const courses = await db.courses.findMany({
        where: {
            author_id: token.id,
        }
    });

    const course_datas = new Array<CourseData>();
    for (const course of courses) {
        const course_data = await getCourseData(course.id);
        if (course_data instanceof ErrorCode) {
            continue;
        }
        course_datas.push(course_data);
    }

    return {
        status: 200,
        body: JSON.stringify(course_datas),
    };
};

app.http('GetMyCourses', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetMyCourses
});
