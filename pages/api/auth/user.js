import { Database } from '/lib/pool';

const db = new Database();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        if (!req.cookies.session) {
            res.status(204).json({ message: 'クッキーがありません。' });
            return;
        }

        try {
            await db.connect();
            const sessionQuery = 'SELECT * FROM sessions WHERE sessionId = ?';
            const sessionValues = [req.cookies.session];

            const sessionResults = await db.execQuery(sessionQuery, sessionValues);

            if (!sessionResults[0] || sessionResults[0].expiresAt < new Date()) {
                const sessionQuery = 'SELECT * FROM sessions WHERE sessionId = ?';

                res.status(400).json({ message: 'セッションが無効または期限切れです。ログインしてください。' });
                return;
            }

            const userQuery = 'SELECT * FROM users WHERE id = ?';
            const userValues = [sessionResults[0].userid];

            const userResults = await db.execQuery(userQuery, userValues);

            if (!userResults[0]) {
                res.status(404).json({ message: 'ユーザーが見つかりません。' });
                return;
            }

            res.status(200).json({ username: userResults[0].username, email: userResults[0].email, userid: userResults[0].userid, userUUID: userResults[0].useruuid });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'エラーが発生しました。' });
        } finally {
            db.close();
        }
    } else {
        res.status(405).end();
    }
}
