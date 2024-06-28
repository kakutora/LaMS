import mysql2 from 'mysql2';

export class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        this.connection = mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        return new Promise((resolve, reject) => {
            this.connection.connect((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async execQuery(query, values = []) {
        if (!this.connection) {
            await this.connect();
        }

        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /*
    async streamQuery(query, values = [], onData, onEnd, onError) {
        if (!this.connection) {
            await this.connect();
        }

        const stream = this.connection.query(query, values).stream();

        stream.on('data', onData);
        stream.on('end', onEnd);
        stream.on('error', onError);

        return stream;
    }
        */

    async close() {
        if (this.connection) {
            this.connection.end((error) => {
                if (error) {
                    console.error('Error closing the database connection:', error);
                }
            });
            this.connection = null;
        }
    }
}
