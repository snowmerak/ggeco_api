import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, getAndVerifyRefreshToken, Payload } from "../auth/token";

class RefreshTokenResponse {
    public access_token: string;
}

export async function RefreshToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let req = new Payload();
    try {
        const data = getAndVerifyRefreshToken(request.headers);
        req = data;
    } catch (e) {
        return {
            status: 401,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

    const db = new PrismaClient();

    await db.users.update({
        where: {
            id: req.id,
        },
        data: {
            last_signin: new Date(),
        }
    });

    const resp = new RefreshTokenResponse();
    const accessToken = generateAccessToken(req);
    resp.access_token = accessToken;

    return { 
        status: 200,
        body: JSON.stringify(resp),
     };
};

app.http('RefreshToken', {
    methods: ['POST'],
    authLevel: 'function',
    handler: RefreshToken
});
