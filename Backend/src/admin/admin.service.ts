import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2';
import { getDatabasePool } from '../database';

@Injectable()
export class AdminService {
  async getListings(filters: { name: string; email: string; address: string; role: string }) {
    const db = getDatabasePool();
    const name = `%${filters.name.trim()}%`;
    const email = `%${filters.email.trim()}%`;
    const address = `%${filters.address.trim()}%`;
    const role = `%${filters.role.trim()}%`;

    const stores = filters.role && filters.role !== 'Store Owner'
      ? []
      : await this.getStores(db, name, email, address);
    const [users] = await db.query<RowDataPacket[]>(
      `SELECT * FROM (
         SELECT id, name, email, address, 'Normal User' AS role, NULL AS rating FROM normal_users
         UNION ALL
         SELECT s.id, s.ownerName AS name, s.email, s.address, 'Store Owner' AS role,
                COALESCE(ratings.averageRating, 0) AS rating
         FROM store_users s
         LEFT JOIN (
           SELECT store_user_id, AVG(rating) AS averageRating
           FROM ratings
           GROUP BY store_user_id
         ) ratings ON ratings.store_user_id = s.id
       ) AS all_users
       WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?
       ORDER BY name`,
      [name, email, address, role]
    );

    return {
      stores,
      users: users.map((user) => ({
        ...user,
        rating: user.rating == null ? null : Number(user.rating),
      })),
    };
  }

  private async getStores(db: ReturnType<typeof getDatabasePool>, name: string, email: string, address: string) {
    const [stores] = await db.query<RowDataPacket[]>(
      `SELECT s.id, s.storeName AS name, s.email, s.address,
              COALESCE(AVG(r.rating), 0) AS rating
       FROM store_users s
       LEFT JOIN ratings r ON r.store_user_id = s.id
       WHERE s.storeName LIKE ? AND s.email LIKE ? AND s.address LIKE ?
       GROUP BY s.id, s.storeName, s.email, s.address
       ORDER BY s.storeName`,
      [name, email, address]
    );

    return stores.map((store) => ({ ...store, rating: Number(store.rating ?? 0) }));
  }

  async updatePassword(adminId: number, currentPassword: string, newPassword: string) {
    const db = getDatabasePool();
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE admins SET password = ? WHERE id = ? AND password = ?',
      [newPassword, adminId, currentPassword]
    );

    if (result.affectedRows === 0) {
      return { ok: false, message: 'Wrong password.' };
    }

    return { ok: true, message: 'Password updated successfully.' };
  }

  async getStats() {
    const db = getDatabasePool();
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT
         (SELECT COUNT(*) FROM normal_users) AS totalUsers,
         (SELECT COUNT(*) FROM store_users) AS totalStores,
         (SELECT COUNT(*) FROM ratings) AS totalRatings`
    );

    return {
      totalUsers: Number(rows[0]?.totalUsers ?? 0),
      totalStores: Number(rows[0]?.totalStores ?? 0),
      totalRatings: Number(rows[0]?.totalRatings ?? 0),
    };
  }

  async signup(payload: { username: string; email: string; password: string }) {
    const db = getDatabasePool();
    const [existingRows] = await db.query(
      'SELECT id FROM admins WHERE username = ? OR email = ?',
      [payload.username, payload.email]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return {
        ok: false,
        message: 'Admin already exists.',
      };
    }

    await db.query('INSERT INTO admins (username, email, password) VALUES (?, ?, ?)', [
      payload.username,
      payload.email,
      payload.password,
    ]);

    return {
      ok: true,
      message: 'Admin saved successfully.',
    };
  }

  async login(payload: { username: string; password: string }) {
    const db = getDatabasePool();
    const [rows] = await db.query(
      'SELECT id, username, email FROM admins WHERE username = ? AND password = ?',
      [payload.username, payload.password]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
