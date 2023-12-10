import { PlaceData } from "@googlemaps/google-maps-services-js";
import { Badges, Courses, PlaceReviewPictures, PlaceReviews, PrismaClient, Users } from "@prisma/client";

export class CourseData {
    public course: Courses;
    public author: Users;
    public author_badge: Badges;
    public reviews: PlaceReviews[];
    public review_photos: PlaceReviewPictures[][];
    public favorites: number;
    public is_favorite: boolean;
    public village_address: string;
    public category: string;
    public title_image: string;
}

export class ErrorCode {
    public code: number;
    public message: string;
}

export async function getCourseData(course_id: string): Promise<CourseData|ErrorCode> {
    const db = new PrismaClient();

    const course = await db.courses.findUnique({
        where: {
            id: course_id,
        }
    });
    if (!course) {
        const error = new ErrorCode();
        error.code = 404;
        error.message = 'course not found';
        return error;
    }

    const author = await db.users.findUnique({
        where: {
            id: course?.author_id,
        }
    });
    if (!author) {
        const error = new ErrorCode();
        error.code = 404;
        error.message = 'author not found';
        return error;
    }

    const author_badge = await db.badges.findUnique({
        where: {
            id: author?.badge,
        }
    });
    if (!author_badge) {
        const error = new ErrorCode();
        error.code = 404;
        error.message = 'author badge not found';
        return error;
    }

    const reviews = await db.placeReviews.findMany({
        where: {
            course_id: course?.id,
        },
        orderBy: {
            order: 'asc',
        }
    });

    let review_photos: Array<Array<PlaceReviewPictures>> = null;
    if (reviews && reviews.length != 0) {
        review_photos = new Array<Array<PlaceReviewPictures>>();

        for (const review of reviews) {
            const photos = await db.placeReviewPictures.findMany({
                where: {
                    review_id: review.id,
                },
                orderBy: {
                    order: 'asc',
                }
            });

            review_photos.push(photos);
        }
    }
    

    const favorites = await db.favoriteCourses.count({
        where: {
            course_id: course?.id,
        }
    });

    const course_data = new CourseData();
    course_data.course = course;
    course_data.author = author;
    course_data.author_badge = author_badge;
    course_data.reviews = reviews;
    course_data.review_photos = review_photos;
    course_data.favorites = favorites;
    course_data.is_favorite = false;

    for (const review_photo of review_photos.flatMap(x => x)) {
        if (course_data.title_image == "") {
            course_data.title_image = review_photo.thumbnail_url;
            break;
        }
    }

    for (const review of reviews) {
        if (course_data.village_address != "" && course_data.category != "" && course_data.title_image != "") {
            break;
        }

        const place = await db.places.findUnique({
            where: {
                id: review.place_id,
            }
        });

        const place_data = JSON.parse(place.data) as PlaceData;

        if (course_data.village_address == "") {
            course_data.village_address = place_data.vicinity;
        }

        if (place_data.types?.length > 0) {
            course_data.category = place_data.types[0];
        }

        if (course_data.title_image == "") {
            if (place_data.photos?.length > 0) {
                course_data.title_image = place_data.photos[0].photo_reference;
            }
        }
    }

    return course_data;
}