import { Courses, PlaceReviewPictures, PlaceReviews, PrismaClient } from "@prisma/client";
import { Payload } from "../auth/token";
import { PlaceData } from "@googlemaps/google-maps-services-js";

export async function addCourseData(course: Courses, reviews: PlaceReviews[], review_photos: PlaceReviewPictures[][], token: Payload, db: PrismaClient) {
    let review_ids = new Array<string>();
    for (let i = 0; i < reviews.length; i++) {
        const review = await db.placeReviews.create({
            data: reviews[i],
        });
        review_ids.push(review?.id);

        await db.coursePlaces.create({
            data: {
                course_id: course.id,
                place_id: reviews[i].place_id,
                order: i,
            }
        });
    }

    for (const photos of review_photos) {
        for (let i = 0; i < photos.length; i++) {
            photos[i].review_id = review_ids[photos[i].review_id];
            photos[i].order = i;
            photos[i].id = null;

            await db.placeReviewPictures.create({
                data: photos[i],
            });
        }
    }

    const places = await db.places.findMany({
        where: {
            id: {
                in: reviews.map(review => review.place_id),
            }
        }
    });

    const place_types = places.map(place => JSON.parse(place.data) as PlaceData).map(place => place.types).flatMap(types => types);

    const course_badges = new Set<string>();
    (await db.placeTypeToBadgeId.findMany({
        where: {
            place_type: {
                in: place_types,
            }
        }
    })).forEach(place_type_to_badge_id => {
        course_badges.add(place_type_to_badge_id.badge_id);
    });

    await db.courseBadges.createMany({
        data: Array.from(course_badges).map(badge_id => {
            return {
                course_id: course.id,
                badge_id: badge_id,
            }
        })
    });
}

export async function removeCourseData(course: Courses, db: PrismaClient) {
    await db.courseBadges.deleteMany({
        where: {
            course_id: course.id,
        }
    });

    const review_ids = (await db.placeReviews.findMany({
        where: {
            course_id: course.id,
        }
    })).map(review => review.id);
    
    await db.placeReviewPictures.deleteMany({
        where: {
            review_id: {
                in: review_ids,
            }
        }
    });

    await db.placeReviews.deleteMany({
        where: {
            id: {
                in: review_ids,
            }
        }
    });

    await db.coursePlaces.deleteMany({
        where: {
            course_id: course.id,
        }
    });
}