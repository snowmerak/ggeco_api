import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { get_place_info } from "../maps/client";
import { PrismaClient } from "@prisma/client";

export async function GetPlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.query.get('id') || '';

    const db = new PrismaClient();
    
    try {
        const cache = await db.places.findFirst({
            where: {
                id: id,
            }
        });

        if (cache) {
            return {
                status: 200,
                body: JSON.stringify(cache)
            }
        }
    } catch (e) {
        context.info("Failed to get place from cache: " + e);
    }

    const resp = await get_place_info(id);

    await db.places.create({
        data: {
            id: id,
            data: JSON.stringify(resp),
            last_update: new Date(),
        }
    });

    const result = {
        place: resp,
    }

    return {
        status: 200,
        body: JSON.stringify(result)
    }
};

app.http('GetPlace', {
    methods: ['GET'],
    authLevel: 'function',
    handler: GetPlace
});
