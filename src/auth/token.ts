import jwt = require("jsonwebtoken");

const secret_key = Buffer.from(process.env["JWT_SECRET_KEY"], "base64").toString("binary");

const access_token_lifetime = "7 days";
const refresh_token_lifetime = "6 months";

enum TokenType {
    ACCESS_TOKEN,
    REFRESH_TOKEN
}

export class Payload {
    public type: TokenType;
    public id: string;
}

export function generateAccessToken(payload: Payload): string {
    payload.type = TokenType.ACCESS_TOKEN;
    return jwt.sign(payload, secret_key, { expiresIn: access_token_lifetime });
}

export function generateRefreshToken(payload: Payload): string {
    payload.type = TokenType.REFRESH_TOKEN;
    return jwt.sign(payload, secret_key, { expiresIn: refresh_token_lifetime });
}

export function verifyAccessToken(token: string): Payload {
    const payload = jwt.verify(token, secret_key) as Payload;
    if (payload.type != TokenType.ACCESS_TOKEN) {
        throw new Error("Invalid token type");
    }
    return payload;
}

export function verifyRefreshToken(token: string): Payload {
    const payload = jwt.verify(token, secret_key) as Payload;
    if (payload.type != TokenType.REFRESH_TOKEN) {
        throw new Error("Invalid token type");
    }
    return payload;
}
