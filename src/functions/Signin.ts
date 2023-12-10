import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

class SigninRequest {
    public access_token: string;
    public kakao_account: boolean;
    public naver_account: boolean;
}

export async function Signin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = (await request.json()) as SigninRequest;

    context.debug(JSON.stringify(body));

    return { body: `Hello, ${'sdd'}!` };
};

app.http('Signin', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: Signin
});
