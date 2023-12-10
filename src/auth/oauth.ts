
export const kakao_url = "https://kapi.kakao.com/v1/user/access_token_info";

export class KakaoUserInfo {
    public id: bigint;
    public expires_in: number;
    public app_id: number;
}

export async function get_kakao_user_info(token: string): Promise<KakaoUserInfo> {
    const resp = await fetch(kakao_url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (resp.status != 200) {
        throw new Error(`Failed to get kakao user info: ${resp.status} ${resp.statusText}`);
    }

    return (await resp.json()) as KakaoUserInfo;
}

const naver_url = "https://openapi.naver.com/v1/nid/me";

export class NaverUserInfo {
    resultcode: string;
    message: string;
    response: {
        id: string;
        nickname: string;
        name: string;
        email: string;
        gender: string;
        age : string;
        birthday: string;
        profile_image: string;
        birthyear: string;
        mobile: string;
    };
}

export async function get_naver_user_info(token: string): Promise<NaverUserInfo> {
    const resp = await fetch(naver_url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (resp.status != 200) {
        throw new Error(`Failed to get naver user info: ${resp.status} ${resp.statusText}`);
    }

    return (await resp.json()) as NaverUserInfo;
}