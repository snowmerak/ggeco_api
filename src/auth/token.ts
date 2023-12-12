import jwt = require("jsonwebtoken");
import { Headers } from "undici";

const secret_key = Buffer.from(process.env["JWT_SECRET_KEY"], "base64").toString("binary");

const access_token_lifetime = "7 days";
const refresh_token_lifetime = "6 months";

const authorization_header_key = "Authorization";
const authorization_header_prefix = "Bearer ";

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
    return jwt.sign({
        type: payload.type,
        id: payload.id
    }, secret_key, { expiresIn: access_token_lifetime });
}

export function generateRefreshToken(payload: Payload): string {
    payload.type = TokenType.REFRESH_TOKEN;
    return jwt.sign({
        type: payload.type,
        id: payload.id
    }, secret_key, { expiresIn: refresh_token_lifetime });
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

export function getTokenFromHeader(header: Headers): string {
    const auth_header = header.get(authorization_header_key);
    if (!auth_header) {
        throw new Error("Authorization header not found");
    }
    if (!auth_header.startsWith(authorization_header_prefix)) {
        throw new Error("Invalid authorization header");
    }
    return auth_header.substring(authorization_header_prefix.length);
}

export function getAndVerifyAccessToken(header: Headers): Payload {
    return verifyAccessToken(getTokenFromHeader(header));
}

export function getAndVerifyRefreshToken(header: Headers): Payload {
    return verifyRefreshToken(getTokenFromHeader(header));
}
