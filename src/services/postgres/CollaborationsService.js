import pg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import AuthorizationError from "../../exceptions/AuthorizationError.js";

const { Pool } = pg;

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const userQuery = {
      text: "SELECT id FROM users WHERE id = $1",
      values: [userId],
    };
    const userResult = await this._pool.query(userQuery);

    if (!userResult.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const id = `collab-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Kolaborasi gagal dihapus");
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

export default CollaborationsService;
