import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

class IsFavoritePlaceResponse {
    public is_favorite: boolean;
}

export async function IsFavoritePlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const place_id = request.query.get('place_id');
    if (!place_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: "place_id is required"
            })
        }
    }

    const db = new PrismaClient();

    const count = await db.favoritePlaces.count({
        where: {
            user_id: token.id,
            place_id: place_id,
        }
    });

    return {
        status: 200,
        body: JSON.stringify({
            is_favorite: count > 0,
        })
    };
};

app.http('IsFavoritePlace', {
    methods: ['GET'],
    authLevel: 'function',
    handler: IsFavoritePlace
});
