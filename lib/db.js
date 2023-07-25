import mysql from "mysql";

export function connectDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST, // ホスト名
        user: process.env.DB_USER, // ユーザ名
        password: process.env.DB_PASSWORD, // パスワード
        database: process.env.DB_DATABASE, // データベース名
    });

    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                reject(error);
            } else {
                resolve(connection);
            }
        });
    });
}

export function closeDatabase(connection) {
    connection.end();
}

export const saveDataToDB = (connection, query, values = []) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export function convertResultsToJSON(results) {
    return results.map((result) => {
        const jsonResult = {};
        for (const key in result) {
            // Convert Date objects to string
            if (result[key] instanceof Date) {
                jsonResult[key] = result[key].toISOString();
            } else {
                jsonResult[key] = result[key];
            }
        }
        return jsonResult;
    });
}

