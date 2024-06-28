import { Database } from "/lib/pool";

const db = new Database();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const sessionId = req.cookies.session;
        const deleteQuery = 'DELETE FROM sessions WHERE sessionId = ?';
        const deleteValues = [sessionId];
        try {
            await db.connect();

            const results = await db.execQuery(deleteQuery, deleteValues);
            if (!results[0]) {
                res.setHeader('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
                res.status(200).json({ message: 'Logout successful' });
            } else {
                res.status(500).json({ message: 'Logout failed' });
            }
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ message: 'Logout failed' });
        } finally {
            db.close();
        }
    } else {
        res.status(405).end();
    }
}
