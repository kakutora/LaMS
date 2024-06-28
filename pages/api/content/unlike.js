import { Database } from '/lib/pool';

export default async (req, res) => {
    if (req.method !== 'DELETE') {
        return res.status(405).end();
    }

    const { user_uuid, image_uuid } = req.body;
    const db = new Database();

    try {
        await db.connect();
        await db.execQuery('DELETE FROM likes WHERE user_uuid = ? AND image_uuid = ?', [user_uuid, image_uuid]);
        res.status(200).json({ message: 'Unliked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        db.close();
    }
};
