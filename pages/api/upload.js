import multer from 'multer';
import { join } from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import {
    connectDatabase,
    closeDatabase,
    saveDataToDB,
} from "/lib/db";
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const upload = multer({ dest: 'public/images' });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const bodyParserMiddleware = bodyParser.urlencoded({ extended: true });
    return new Promise(async (resolve, reject) => {
        bodyParserMiddleware(req, res, (error) => {
            if (error) {
                console.error('Error parsing form data:', error);
                return res.status(500).json({ message: 'Error parsing form data.' });
            }
            upload.single('image')(req, res, async (error) => {
                if (error) {
                    console.error('Error uploading image:', error);
                    return res.status(500).json({ message: 'Image upload failed.' });
                }

                if (!validateInput(req.body.text)) {
                    return res.status(400).json({ message: 'Invalid input.' });
                }

                const image = req.file;

                const mimeType = req.file.mimetype;
                const extension = mime.extension(mimeType);
                const fileName = `${uuidv4()}.${extension}`;

                const filePath = join(process.cwd(), 'public', 'images', fileName);

                fs.renameSync(image.path, filePath);

                const query = 'INSERT INTO images (title, image_path) VALUES (?, ?)';
                const values = [req.body.text, fileName];

                let connection;
                try {
                    connection = await connectDatabase();
                    const results = await saveDataToDB(connection, query, values);
                } catch (error) {
                    console.error(error);
                } finally {
                    if (connection) {
                        closeDatabase(connection);
                    }
                }

                // ファイルの移動が完了した後にレスポンスを送信する
                res.status(200).json({ message: 'Image uploaded successfully.' + req.body.text });
            });
        });
    });
}

function validateInput(text) {
    const alphanumericPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
    return alphanumericPattern.test(text);
}