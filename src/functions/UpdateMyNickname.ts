import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAndVerifyAccessToken, Payload } from "../auth/token";
import { PrismaClient } from "@prisma/client";

class UpdateMyNicknameRequest {
    public nickname: string;
}

export async function UpdateMyNickname(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let req = new UpdateMyNicknameRequest();
    try {
        const body = (await request.json()) as UpdateMyNicknameRequest;
        req = body;
    } catch (e) {
        return {
            status: 400,
            body: JSON.stringify({
                error: e.message
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

    await db.users.update({
        where: {
            id: token.id,
        },
        data: {
            nickname: req.nickname,
        }
    });

    return { status: 200 };
};

app.http('UpdateMyNickname', {
    methods: ['PATCH'],
    authLevel: 'function',
    handler: UpdateMyNickname
});
