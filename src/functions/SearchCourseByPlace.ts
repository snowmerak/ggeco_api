import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";
import { CourseData, ErrorCode, getCourseData } from "../course/course";

export async function SearchCourseByPlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const place_id = request.query.get('place_id');
    if (!place_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'place_id is required'
            })
        }
    }

    let count_value = request.query.get('count');
    if (!count_value) {
        count_value = "10";
    }

    const count = parseInt(count_value, 10);

    const db = new PrismaClient();

    const course_ids = await db.coursePlaces.findMany({
        where: {
            place_id: place_id,
        },
        take: count * 2,
    });

    const courses = await db.courses.findMany({
        where: {
            id: {
                in: course_ids.map((course) => course.course_id),
            },
            is_public: 1,
        },
        take: count,
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

app.http('SearchCourseByPlace', {
    methods: ['GET'],
    authLevel: 'function',
    handler: SearchCourseByPlace
});
