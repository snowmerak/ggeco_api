import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

export async function RemoveFavoritePlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const place_id = request.query.get('place_id');
    if (!place_id) {
        return {
            status: 400,
            body: JSON.stringify({
                error: "place_id is required"
            })
        }
    }

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

    await db.favoritePlaces.deleteMany({
        where: {
            user_id: token.id,
            place_id: place_id,
        }
    });

    return { status: 200 };
};

app.http('RemoveFavoritePlace', {
    methods: ['DELETE'],
    authLevel: 'function',
    handler: RemoveFavoritePlace
});
