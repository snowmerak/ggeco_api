import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Courses, PlaceReviewPictures, PlaceReviews, PrismaClient } from "@prisma/client";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { addCourseData } from "../course/detail";

class AddCourseRequest {
    course: Courses;
    reviews: PlaceReviews[];
    reviewPhotos: PlaceReviewPictures[][];
}

export async function AddCourse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    let req = new AddCourseRequest();
    try {
        req = (await request.json()) as AddCourseRequest;
    } catch (e) {
        return {
            status: 400,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

    const db = new PrismaClient();

    req.course.id = null;
    req.course.author_id = token.id;
    const course = await db.courses.create({
        data: req.course,
    });

    await addCourseData(course, req.reviews, req.reviewPhotos, token, db);

    return { status: 200 };
};

app.http('AddCourse', {
    methods: ['POST'],
    authLevel: 'function',
    handler: AddCourse
});
