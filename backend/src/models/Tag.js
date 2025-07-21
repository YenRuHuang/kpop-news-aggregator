import database from '../config/database.js';

class Tag {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.usage_count = data.usage_count || 0;
        this.created_at = data.created_at;
    }

    static async findAll(options = {}) {
        const { limit = 50, orderBy = 'usage_count' } = options;
        const order = orderBy === 'usage_count' ? 'usage_count DESC' : 'name ASC';
        
        const sql = `SELECT * FROM tags ORDER BY ${order} LIMIT ?`;
        const rows = await database.query(sql, [limit]);
        return rows.map(row => new Tag(row));
    }

    static async findById(id) {
        const sql = 'SELECT * FROM tags WHERE id = ?';
        const row = await database.get(sql, [id]);
        return row ? new Tag(row) : null;
    }

    static async findByName(name) {
        const sql = 'SELECT * FROM tags WHERE name = ?';
        const row = await database.get(sql, [name]);
        return row ? new Tag(row) : null;
    }

    static async findBySlug(slug) {
        const sql = 'SELECT * FROM tags WHERE slug = ?';
        const row = await database.get(sql, [slug]);
        return row ? new Tag(row) : null;
    }

    static async create(data) {
        const sql = 'INSERT INTO tags (name, slug) VALUES (?, ?)';
        const params = [data.name, data.slug];
        const result = await database.run(sql, params);
        return await Tag.findById(result.id);
    }

    static async findOrCreate(name, slug) {
        let tag = await Tag.findByName(name);
        if (!tag) {
            tag = await Tag.create({ name, slug });
        }
        return tag;
    }

    async incrementUsage() {
        const sql = 'UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?';
        await database.run(sql, [this.id]);
        this.usage_count += 1;
    }

    async decrementUsage() {
        const sql = 'UPDATE tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = ?';
        await database.run(sql, [this.id]);
        this.usage_count = Math.max(0, this.usage_count - 1);
    }

    async delete() {
        const sql = 'DELETE FROM tags WHERE id = ?';
        await database.run(sql, [this.id]);
        return true;
    }

    async getArticles(options = {}) {
        const { limit = 20, offset = 0 } = options;
        const sql = `
            SELECT a.*, s.name as source_name, c.name as category_name, c.color as category_color
            FROM articles a
            JOIN article_tags at ON a.id = at.article_id
            LEFT JOIN sources s ON a.source_id = s.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE at.tag_id = ? AND a.is_published = 1
            ORDER BY a.published_at DESC
            LIMIT ? OFFSET ?
        `;
        return await database.query(sql, [this.id, limit, offset]);
    }

    static async getPopular(limit = 10) {
        const sql = 'SELECT * FROM tags WHERE usage_count > 0 ORDER BY usage_count DESC LIMIT ?';
        const rows = await database.query(sql, [limit]);
        return rows.map(row => new Tag(row));
    }

    static async search(query, limit = 20) {
        const sql = 'SELECT * FROM tags WHERE name LIKE ? ORDER BY usage_count DESC LIMIT ?';
        const rows = await database.query(sql, [`%${query}%`, limit]);
        return rows.map(row => new Tag(row));
    }
}

export default Tag;