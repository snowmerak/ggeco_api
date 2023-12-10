import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";
import { CourseData, ErrorCode, getCourseData } from "../course/course";

export async function GetRecentCourses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let count_value = request.query.get('count');
    if (!count_value) {
        count_value = "10";
    }

    const count = parseInt(count_value, 10);

    const db = new PrismaClient();

    const courses = await db.courses.findMany({
        where: {
            is_public: 1,
        },
        take: count,
        orderBy: {
            reg_date: 'desc',
        },
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

app.http('GetRecentCourses', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetRecentCourses
});
