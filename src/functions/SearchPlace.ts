import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { searchPlacesByQuery } from "../maps/client";

export async function SearchPlace(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const name = request.query.get('query') || '카페';

    const resp = await searchPlacesByQuery(name)

    const result = {
        places: resp,
    }

    return {
        status: 200,
        body: JSON.stringify(result)
    }
};

app.http('SearchPlace', {
    methods: ['GET'],
    authLevel: 'function',
    handler: SearchPlace
});
