import httpStatus from "http-status";
import { HttpError } from "../../utils/httpError";
import { LoginInput, RegisterInput } from "./auth.interface";

const MAX_PASSWORD_BYTES = 72;

function getObjectBody(body: unknown): Record<string, unknown> {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Request body must be an object.");
    }

    return body as Record<string, unknown>;
}

function validateEmail(email: string): string {
    const normalizedEmail = email.trim().toLowerCase();
    if (
        normalizedEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
        throw new HttpError(httpStatus.BAD_REQUEST, "A valid email is required.");
    }

    return normalizedEmail;
}

export function validateRegisterInput(body: unknown): RegisterInput {
    const input = getObjectBody(body);
    const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
    const email = typeof input.email === "string" ? input.email : "";
    const password = typeof input.password === "string" ? input.password : "";

    if (fullName.length < 2 || fullName.length > 100) {
        throw new HttpError(
            httpStatus.BAD_REQUEST,
            "Full name must be between 2 and 100 characters.",
        );
    }

    if (
        password.length < 8 ||
        Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
    ) {
        throw new HttpError(
            httpStatus.BAD_REQUEST,
            "Password must be at least 8 characters and no more than 72 bytes.",
        );
    }

    let phone: string | undefined;
    if (input.phone !== undefined) {
        if (typeof input.phone !== "string") {
            throw new HttpError(httpStatus.BAD_REQUEST, "Phone must be a string.");
        }

        phone = input.phone.trim() || undefined;
        if (phone && phone.length > 32) {
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                "Phone must be no more than 32 characters.",
            );
        }
    }

    return { fullName, email: validateEmail(email), password, phone };
}

export function validateLoginInput(body: unknown): LoginInput {
    const input = getObjectBody(body);
    const email = typeof input.email === "string" ? input.email : "";
    const password = typeof input.password === "string" ? input.password : "";

    if (!password || Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
        throw new HttpError(
            httpStatus.UNAUTHORIZED,
            "Invalid email or password.",
        );
    }

    return { email: validateEmail(email), password };
}

export function validateRefreshToken(token: unknown): string {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
        throw new HttpError(
            httpStatus.UNAUTHORIZED,
            "A valid refresh token is required.",
        );
    }

    return token;
}