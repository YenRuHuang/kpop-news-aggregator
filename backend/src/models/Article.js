const Database = require('../config/database');

class Article {
    static async getAll(page = 1, limit = 20, category, search) {
        const offset = (page - 1) * limit;
        const db = Database.getInstance().db;
        
        let sql = `
            SELECT * FROM articles
            WHERE 1=1
        `;
        let params = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            sql += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY publishedAt DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total').replace(/LIMIT.*$/, '');
        const countParams = params.slice(0, -2);
        
        const articles = await db.all(sql, params);
        const countResult = await db.get(countSql, countParams);
        const total = countResult ? countResult.total : 0;
        
        return {
            articles: articles.map(article => ({
                ...article,
                tags: article.tags ? JSON.parse(article.tags) : []
            })),
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    }

    static async getById(id) {
        const db = Database.getInstance().db;
        const sql = 'SELECT * FROM articles WHERE id = ?';
        const row = await db.get(sql, [id]);
        if (row && row.tags) {
            row.tags = JSON.parse(row.tags);
        }
        return row;
    }

    static async getByUrl(url) {
        const db = Database.getInstance().db;
        const sql = 'SELECT * FROM articles WHERE url = ?';
        const row = await db.get(sql, [url]);
        return row;
    }

    static async create(data) {
        const db = Database.getInstance().db;
        const sql = `
            INSERT INTO articles (
                title, url, description, content, publishedAt, sourceId, sourceName,
                category, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.title,
            data.url,
            data.description,
            data.content,
            data.publishedAt ? data.publishedAt.toISOString() : new Date().toISOString(),
            data.sourceId,
            data.sourceName,
            data.category,
            JSON.stringify(data.tags || [])
        ];

        const result = await db.run(sql, params);
        return result.lastID;
    }

    static async getByCategory(category, page = 1, limit = 20) {
        return await Article.getAll(page, limit, category);
    }
}

module.exports = Article;