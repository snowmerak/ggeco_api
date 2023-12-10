import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { Courses, PlaceReviewPictures, PlaceReviews, PrismaClient } from "@prisma/client";
import { addCourseData, removeCourseData } from "../course/detail";

class UpdateCourseRequest {
    course: Courses;
    reviews: PlaceReviews[];
    reviewPhotos: PlaceReviewPictures[][];
}

export async function UpdateCourse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    let req = new UpdateCourseRequest();
    try {
        req = (await request.json()) as UpdateCourseRequest;
    } catch (e) {
        return {
            status: 400,
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

    const course = await db.courses.findFirst({
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
            status: 400,
            body: JSON.stringify({
                error: 'you are not author'
            })
        }
    }

    req.course.id = course_id;
    
    await removeCourseData(req.course, db);

    await addCourseData(req.course, req.reviews, req.reviewPhotos, token, db);

    return { status: 200 };
};

app.http('UpdateCourse', {
    methods: ['PUT'],
    authLevel: 'function',
    handler: UpdateCourse
});
