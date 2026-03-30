import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

function generateSecretKey() {
    return crypto.randomBytes(64).toString("hex");
}

function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

const JWT_SECRET_KEY = generateSecretKey();
console.log('The acess token:', JWT_SECRET_KEY);

const JWT_REFRESH_TOKEN_SECRET = generateRefreshToken();
console.log('The refresh token:', JWT_REFRESH_TOKEN_SECRET);