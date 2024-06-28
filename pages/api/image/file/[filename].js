// pages/api/file/[filename].js
import fs from 'fs';
import path from 'path';

export default async (req, res) => {
    const { filename } = req.query;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'image/png'); // 画像の MIME タイプに合わせて変更
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};
