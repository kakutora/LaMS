import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Database } from "/lib/pool";

const db = new Database();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const findQuery = 'SELECT * FROM users WHERE email = ?';
        const findValues = [email];

        try {
            await db.connect();
            const findResults = await db.execQuery(findQuery, findValues);

            if (!findResults[0]) {
                res.status(500).json({ message: 'Login failed1' });
            }
            const passwordMatch = await bcrypt.compare(password, findResults[0].password);

            if (!passwordMatch) {
                res.status(500).json({ message: 'Login failed2' });
            }

            let sessionId = uuidv4();
            const sessionQuery = 'SELECT * FROM sessions WHERE sessionId = ?';
            const sessionValues = [sessionId];
            const sessionResults = await db.execQuery(sessionQuery, sessionValues);

            if (sessionResults[0]) {
                res.status(500).json({ message: 'Login failed3' });
            }

            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間後にセッションを無効化
            const insertQuery = 'INSERT INTO sessions (sessionId, useruuid, expiresAt) VALUES (?, ?, ?)';
            const insertValues = [sessionId, findResults[0].useruuid, expiresAt];
            await db.execQuery(insertQuery, insertValues);

            const cookieValue = `session=${sessionId}; HttpOnly; Path=/;`;
            res.setHeader('Set-Cookie', cookieValue);
            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Login failed' });
        } finally {
            db.close();
        }
    } else {
        res.status(405).end();
    }
}
