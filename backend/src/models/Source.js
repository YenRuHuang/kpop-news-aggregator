const Database = require('../config/database');

class Source {
    static async getAll() {
        const db = Database.getInstance().db;
        const sql = 'SELECT * FROM sources WHERE isActive = 1 ORDER BY name ASC';
        const rows = await db.all(sql);
        return rows;
    }

    static async getActive() {
        const db = Database.getInstance().db;
        const sql = 'SELECT * FROM sources WHERE isActive = 1';
        const rows = await db.all(sql);
        return rows;
    }

    static async getByUrl(url) {
        const db = Database.getInstance().db;
        const sql = 'SELECT * FROM sources WHERE url = ?';
        const row = await db.get(sql, [url]);
        return row;
    }

    static async create(data) {
        const db = Database.getInstance().db;
        const sql = `
            INSERT INTO sources (name, url, category, language, isActive)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            data.name,
            data.url,
            data.category || 'general',
            data.language || 'en',
            data.isActive !== undefined ? data.isActive : true
        ];
        const result = await db.run(sql, params);
        return result.lastID;
    }

    static async update(id, data) {
        const db = Database.getInstance().db;
        const sql = `
            UPDATE sources SET
                name = ?, url = ?, category = ?, language = ?, isActive = ?,
                lastFetched = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const params = [
            data.name,
            data.url,
            data.category,
            data.language,
            data.isActive,
            id
        ];
        await db.run(sql, params);
    }

    static async delete(id) {
        const db = Database.getInstance().db;
        const sql = 'DELETE FROM sources WHERE id = ?';
        await db.run(sql, [id]);
    }
}

module.exports = Source;