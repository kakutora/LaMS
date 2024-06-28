import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Database } from "/lib/pool";

const db = new Database();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userName, userId, email, password } = req.body;

        if (userName.length < 1 || userName.length >= 16) {
            return res.status(400).send();
        }
        if (
            userId.length < 1 ||
            userId.length > 16 ||
            !/^[a-zA-Z0-9_]*$/.test(userId)
        ) {
            return res.status(400).send();
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send();
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/.test(password)) {
            return res.status(400).send();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (useruuid, userid, username, email, password) VALUES (?, ?, ?, ?, ?)';
        const values = [uuidv4(), userId, userName, email, hashedPassword];

        try {
            await db.connect();
            await db.execQuery(query, values);
            res.status(201).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
            db.close();
        }
    } else {
        res.status(405).end();
    }
}