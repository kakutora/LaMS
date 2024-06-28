import { Database } from '/lib/pool';

const db = new Database();

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { image_uuid } = req.body;  // クエリパラメータからidを取得

        const deleteQuery = 'DELETE FROM images WHERE uuid = ?';

        try {
            await db.connect();
            const results = await db.execQuery(deleteQuery, image_uuid);
            await db.close();

            if (results.affectedRows === 0) {
                // 削除対象のレコードが存在しない場合
                res.status(404).json({ message: 'Record not found.' });
            } else {
                res.status(200).json({ message: 'Record deleted successfully.' });
            }
        } catch (error) {
            console.error('Database operation failed:', error);
            await db.close();
            res.status(500).json({ message: 'Database operation failed.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
