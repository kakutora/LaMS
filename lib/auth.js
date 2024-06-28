// lib/auth.js
import cookie from "cookie";
import { Database } from "./pool";

export async function userAuth(cookieHeader) {
    const db = new Database();

    if (!cookieHeader) {
        return null;
    }

    const parsedCookies = cookie.parse(cookieHeader);
    const sessionId = parsedCookies.session;

    if (!sessionId) {
        return null;
    }

    const sessionQuery = "SELECT * FROM sessions WHERE sessionId = ?";
    const sessionValues = [sessionId];
    const userQuery = "SELECT * FROM users WHERE useruuid = ?";
    const deleteSessionQuery = "DELETE FROM sessions WHERE sessionId = ?";

    try {
        await db.connect();
        const sessionResults = await db.execQuery(sessionQuery, sessionValues);

        if (!sessionResults[0] || sessionResults[0].expiresAt < new Date()) {
            await db.execQuery(deleteSessionQuery, sessionValues);
            return null;
        }

        const userValues = [sessionResults[0].useruuid];
        const userResults = await db.execQuery(userQuery, userValues);

        if (!userResults[0]) {
            return null;
        }

        return userResults[0];
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        db.close();
    }
}
