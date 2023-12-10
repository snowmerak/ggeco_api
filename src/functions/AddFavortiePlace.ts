import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function AddFavortiePlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    let place_id = request.query.get('place_id');
    if (!place_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'place_id is required'
            })
        }
    }

    const db = new PrismaClient();

    const favorite_place_count = await db.favoritePlaces.count({
        where: {
            user_id: token.id,
            place_id: place_id,
        }
    });

    if (favorite_place_count > 0) {
        return {
            status: 400,
            body: JSON.stringify({
                error: 'already favorite'
            })
        }
    }

    await db.favoritePlaces.create({
        data: {
            user_id: token.id,
            place_id: place_id,
        }
    });

    return { status: 200 };
};

app.http('AddFavortiePlace', {
    methods: ['POST'],
    authLevel: 'function',
    handler: AddFavortiePlace
});
