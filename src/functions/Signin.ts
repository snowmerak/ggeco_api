import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getKakaoUserInfo, getNaverUserInfo, KakaoUserInfo, NaverUserInfo } from "../auth/oauth";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken, Payload } from "../auth/token";
import { generateRandomNickname } from "../names/nickname";

class SigninRequest {
    public access_token: string;
    public kakao_account: boolean;
    public naver_account: boolean;
}

class SigninResponse {
    public access_token: string;
    public refresh_token: string;
}

export async function Signin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let req = new SigninRequest();
    try {
        const body = (await request.json()) as SigninRequest;
        req = body;
    } catch (e) {
        return {
            status: 400,
            body: JSON.stringify({
                error: e.message
            })
        }
    }

    const db = new PrismaClient();
    let payload = new Payload();
    let kakao_user_info: KakaoUserInfo = null;
    let naver_user_info: NaverUserInfo = null;

    switch (true) {
        case req.kakao_account:
            kakao_user_info = await getKakaoUserInfo(req.access_token);

            const kakao_user = await db.kakaoUsers.findFirst({
                where: {
                    kakao_id: kakao_user_info?.id,
                }
            });

            payload.id = kakao_user?.user_id;

            break;
        case req.naver_account:
            naver_user_info = await getNaverUserInfo(req.access_token);

            const naver_user = await db.naverUsers.findFirst({
                where: {
                    naver_id: naver_user_info?.response.id,
                }
            });

            payload.id = naver_user?.user_id;

            break;
    }

    if (payload.id != null && payload.id != undefined && payload.id != "") {
        const resp = new SigninResponse();
        resp.access_token = generateAccessToken(payload);
        resp.refresh_token = generateRefreshToken(payload);

        return {
            status: 200,
            body: JSON.stringify(resp)
        }
    }

    const result = await db.users.create({
        data: {
            nickname: generateRandomNickname(),
            create_at: new Date(),
            last_signin: new Date(),
        }
    });

    switch (true) {
        case req.kakao_account:
            await db.kakaoUsers.create({
                data: {
                    kakao_id: kakao_user_info.id,
                    user_id: result.id,
                    info: JSON.stringify(kakao_user_info),
                }
            });
            break;
        case req.naver_account:
            await db.naverUsers.create({
                data: {
                    naver_id: naver_user_info.response.id,
                    user_id: result.id,
                    info: JSON.stringify(naver_user_info.response),
                }
            });
            break;
    }

    payload.id = result.id;

    const resp = new SigninResponse();
    resp.access_token = generateAccessToken(payload);
    resp.refresh_token = generateRefreshToken(payload);

    return { 
        status: 200,
        body: JSON.stringify(resp),
    };
};

app.http('Signin', {
    methods: ['POST'],
    authLevel: 'function',
    handler: Signin
});
