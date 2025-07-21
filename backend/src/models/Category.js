import database from '../config/database.js';

class Category {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.color = data.color;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findAll() {
        const sql = 'SELECT * FROM categories ORDER BY name ASC';
        const rows = await database.query(sql);
        return rows.map(row => new Category(row));
    }

    static async findById(id) {
        const sql = 'SELECT * FROM categories WHERE id = ?';
        const row = await database.get(sql, [id]);
        return row ? new Category(row) : null;
    }

    static async findBySlug(slug) {
        const sql = 'SELECT * FROM categories WHERE slug = ?';
        const row = await database.get(sql, [slug]);
        return row ? new Category(row) : null;
    }

    static async create(data) {
        const sql = `
            INSERT INTO categories (name, slug, description, color)
            VALUES (?, ?, ?, ?)
        `;
        const params = [data.name, data.slug, data.description, data.color];
        const result = await database.run(sql, params);
        return await Category.findById(result.id);
    }

    async update(data) {
        const sql = `
            UPDATE categories SET
                name = ?, slug = ?, description = ?, color = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const params = [
            data.name || this.name,
            data.slug || this.slug,
            data.description || this.description,
            data.color || this.color,
            this.id
        ];
        await database.run(sql, params);
        return await Category.findById(this.id);
    }

    async delete() {
        const sql = 'DELETE FROM categories WHERE id = ?';
        await database.run(sql, [this.id]);
        return true;
    }

    async getArticleCount() {
        const sql = 'SELECT COUNT(*) as count FROM articles WHERE category_id = ? AND is_published = 1';
        const result = await database.get(sql, [this.id]);
        return result.count;
    }

    async getArticles(options = {}) {
        const { limit = 20, offset = 0 } = options;
        const sql = `
            SELECT a.*, s.name as source_name
            FROM articles a
            LEFT JOIN sources s ON a.source_id = s.id
            WHERE a.category_id = ? AND a.is_published = 1
            ORDER BY a.published_at DESC
            LIMIT ? OFFSET ?
        `;
        return await database.query(sql, [this.id, limit, offset]);
    }
}

export default Category;