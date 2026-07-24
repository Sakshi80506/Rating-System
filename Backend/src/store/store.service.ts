import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2';
import { getDatabasePool } from '../database';

@Injectable()
export class StoreService {
  async updateAddress(storeUserId: number, address: string) {
    const db = getDatabasePool();
    await db.query('UPDATE store_users SET address = ? WHERE id = ?', [address, storeUserId]);
    return { ok: true, message: 'Store address updated successfully.' };
  }

  async updatePassword(storeUserId: number, currentPassword: string, newPassword: string) {
    const db = getDatabasePool();
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE store_users SET password = ? WHERE id = ? AND password = ?',
      [newPassword, storeUserId, currentPassword]
    );

    if (result.affectedRows === 0) {
      return { ok: false, message: 'Wrong password.' };
    }

    return { ok: true, message: 'Password updated successfully.' };
  }

  async getDashboard(storeUserId: number) {
    const db = getDatabasePool();
    const [ratingRows] = await db.query<RowDataPacket[]>(
      `SELECT COALESCE(AVG(rating), 0) AS averageRating, COUNT(*) AS totalRatings
       FROM ratings
       WHERE store_user_id = ?`,
      [storeUserId]
    );
    const [users] = await db.query<RowDataPacket[]>(
      `SELECT u.id, u.name, u.email, AVG(r.rating) AS averageRating
       FROM ratings r
       INNER JOIN normal_users u ON u.id = r.normal_user_id
       WHERE r.store_user_id = ?
       GROUP BY u.id, u.name, u.email
       ORDER BY u.name`,
      [storeUserId]
    );

    return {
      averageRating: Number(ratingRows[0]?.averageRating ?? 0),
      totalRatings: Number(ratingRows[0]?.totalRatings ?? 0),
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        averageRating: Number(user.averageRating ?? 0),
      })),
    };
  }

  async signup(payload: { storeName: string; ownerName: string; address: string; email: string; password: string }) {
    const db = getDatabasePool();
    const [existingRows] = await db.query(
      'SELECT id FROM store_users WHERE email = ?',
      [payload.email]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return {
        ok: false,
        message: 'Store user already exists.',
      };
    }

    await db.query(
      'INSERT INTO store_users (storeName, ownerName, address, email, password) VALUES (?, ?, ?, ?, ?)',
      [payload.storeName, payload.ownerName, payload.address, payload.email, payload.password]
    );

    return {
      ok: true,
      message: 'Store user saved successfully.',
    };
  }

  async login(payload: { email: string; password: string }) {
    const db = getDatabasePool();
    const [rows] = await db.query(
      'SELECT id, storeName, ownerName, address, email FROM store_users WHERE email = ? AND password = ?',
      [payload.email, payload.password]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
