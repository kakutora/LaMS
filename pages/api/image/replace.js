// pages/api/images.js
import { Database } from '/lib/pool';

export default async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 5;
    const offset = page * limit;

    const db = new Database();
    const query = `SELECT id, title, image_path, time, uuid FROM images LIMIT ${limit} OFFSET ${offset}`;

    try {
        await db.connect();
        const results = await db.execQuery(query);
        const formattedData = results.map((item) => ({
            ...item,
            time: new Date(item.time).toISOString(),
            imageUrl: `/api/image/file/${item.image_path}`,
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        db.close();
    }
};
