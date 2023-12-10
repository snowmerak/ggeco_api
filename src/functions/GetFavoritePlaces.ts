import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";
import { PlaceData } from "@googlemaps/google-maps-services-js";

class GetFavoritePlacesResponse {
    public places: Partial<PlaceData>[];
}

export async function GetFavoritePlaces(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const favorite_places = await db.favoritePlaces.findMany({
        where: {
            user_id: token.id,
        }
    });

    const places = await Promise.all(favorite_places.map(async (favorite_place) => {
        const place = await db.places.findFirst({
            where: {
                id: favorite_place.place_id,
            }
        });

        return place;
    }));

    const resp = new GetFavoritePlacesResponse();
    for (const place of places) {
        resp.places.push(JSON.parse(place.data));
    }

    return {
        status: 200,
        body: JSON.stringify(resp),
    };
};

app.http('GetFavoritePlaces', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetFavoritePlaces
});
