import { Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getDatabasePool } from '../database';

@Injectable()
export class UserService {
  async updateAddress(userId: number, address: string) {
    const db = getDatabasePool();
    await db.query('UPDATE normal_users SET address = ? WHERE id = ?', [address, userId]);
    return { ok: true, message: 'Address updated successfully.' };
  }

  async getStores(search: string, normalUserId: number) {
    const db = getDatabasePool();
    const term = `%${search.trim()}%`;
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT s.id, s.storeName, s.ownerName, s.address,
              COALESCE(overall.averageRating, 0) AS overallRating,
              own.userRating
       FROM store_users s
       LEFT JOIN (
         SELECT store_user_id, AVG(rating) AS averageRating
         FROM ratings
         GROUP BY store_user_id
       ) overall ON overall.store_user_id = s.id
       LEFT JOIN (
         SELECT store_user_id, AVG(rating) AS userRating
         FROM ratings
         WHERE normal_user_id = ?
         GROUP BY store_user_id
       ) own ON own.store_user_id = s.id
       WHERE s.storeName LIKE ? OR s.address LIKE ?
       ORDER BY s.storeName`,
      [normalUserId, term, term]
    );

    return rows.map((store) => ({
      ...store,
      overallRating: Number(store.overallRating ?? 0),
      userRating: store.userRating == null ? null : Number(store.userRating),
    }));
  }

  async saveRating(normalUserId: number, storeUserId: number, rating: number) {
    const db = getDatabasePool();
    const [stores] = await db.query<RowDataPacket[]>('SELECT id FROM store_users WHERE id = ?', [storeUserId]);

    if (stores.length === 0) {
      return { ok: false, message: 'Store not found.' };
    }

    const [existingRatings] = await db.query<RowDataPacket[]>(
      'SELECT id FROM ratings WHERE normal_user_id = ? AND store_user_id = ?',
      [normalUserId, storeUserId]
    );

    if (existingRatings.length > 0) {
      await db.query(
        'UPDATE ratings SET rating = ? WHERE normal_user_id = ? AND store_user_id = ?',
        [rating, normalUserId, storeUserId]
      );
      return { ok: true, message: 'Your rating was updated.' };
    }

    await db.query(
      'INSERT INTO ratings (normal_user_id, store_user_id, rating) VALUES (?, ?, ?)',
      [normalUserId, storeUserId, rating]
    );

    return { ok: true, message: 'Your rating was submitted.' };
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    const db = getDatabasePool();
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE normal_users SET password = ? WHERE id = ? AND password = ?',
      [newPassword, userId, currentPassword]
    );

    if (result.affectedRows === 0) {
      return { ok: false, message: 'Wrong password.' };
    }

    return { ok: true, message: 'Password updated successfully.' };
  }

  async signup(payload: { name: string; email: string; address: string; password: string }) {
    const db = getDatabasePool();
    const [existingRows] = await db.query(
      'SELECT id FROM normal_users WHERE email = ?',
      [payload.email]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return {
        ok: false,
        message: 'Normal user already exists.',
      };
    }

    await db.query(
      'INSERT INTO normal_users (name, email, address, password) VALUES (?, ?, ?, ?)',
      [payload.name, payload.email, payload.address, payload.password]
    );

    return {
      ok: true,
      message: 'Normal user saved successfully.',
    };
  }

  async login(payload: { email: string; password: string }) {
    const db = getDatabasePool();
    const [rows] = await db.query(
      'SELECT id, name, email, address FROM normal_users WHERE email = ? AND password = ?',
      [payload.email, payload.password]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
