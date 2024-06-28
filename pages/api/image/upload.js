import multer from 'multer';
import { join } from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { PNG } from 'pngjs';

import { Database } from '/lib/pool';

const upload = multer({ dest: 'uploads' });

export const config = {
    api: {
        bodyParser: false,
    },
};

const db = new Database();

export default async function handler(req, res) {
    return new Promise((resolve, reject) => {
        upload.single('image')(req, res, async (error) => {
            if (error) {
                console.error('Error uploading image:', error);
                return res.status(500).json({ message: 'Image upload failed.' });
            }

            if (!req.file) {
                return res.status(500).json({ message: 'No file uploaded' });
            }

            if (!validateInput(req.body.title)) {
                return res.status(400).json({ message: 'Invalid input.' });
            }

            const image = req.file;
            const mimeType = image.mimetype;
            const extension = mime.extension(mimeType);
            const uuid = uuidv4();
            const fileName = `${uuid}.${extension}`;
            const filePath = join(process.cwd(), 'uploads', fileName);

            fs.renameSync(image.path, filePath);

            if (mimeType === 'image/png') {
                fs.createReadStream(filePath)
                    .pipe(new PNG())
                    .on('metadata', (metadata) => {
                        console.log('Image Metadata:', metadata);
                    })
                    .on('parsed', function () {
                        console.log('Parsed PNG data');
                        extractCustomChunks(filePath);
                    })
                    .on('error', (err) => {
                        console.error('Error reading PNG metadata:', err);
                    });
            }

            const query = 'INSERT INTO images (title, image_path, uuid, userUUID) VALUES (?, ?, ?, ?)';
            const values = [
                req.body.title,
                fileName,
                uuid,
                req.body.userUUID
            ];

            try {
                await db.connect();
                const results = await db.execQuery(query, values);
                await db.close();
                res.status(200).json({ message: 'Image uploaded successfully.', results });
                resolve();
            } catch (error) {
                console.error('Database operation failed:', error);
                await db.close();
                res.status(500).json({ message: 'Database operation failed.' });
                reject(error);
            }
        });
    });
}

function extractCustomChunks(filePath) {
    const data = fs.readFileSync(filePath);
    let offset = 8; // Skip the 8-byte PNG signature

    while (offset < data.length) {
        const length = data.readUInt32BE(offset);
        offset += 4;
        const type = data.toString('utf8', offset, offset + 4);
        offset += 4;

        if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') {
            const chunkData = data.slice(offset, offset + length);
            console.log(`Found ${type} chunk:`, chunkData.toString());
        }

        offset += length + 4; // Skip chunk data and CRC
    }
}

function validateInput(text) {
    const alphanumericPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
    return alphanumericPattern.test(text);
}
