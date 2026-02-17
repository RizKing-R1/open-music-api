import pg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import AuthorizationError from "../../exceptions/AuthorizationError.js";

const { Pool } = pg;

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;

    this.addPlaylist = this.addPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.deletePlaylistById = this.deletePlaylistById.bind(this);
    this.verifyPlaylistOwner = this.verifyPlaylistOwner.bind(this);
    this.verifyPlaylistAccess = this.verifyPlaylistAccess.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.getPlaylistSongs = this.getPlaylistSongs.bind(this);
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);
    this.addPlaylistActivity = this.addPlaylistActivity.bind(this);
    this.getPlaylistActivities = this.getPlaylistActivities.bind(this);
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.owner = $1 OR collaborations.user_id = $1
             GROUP BY playlists.id, playlists.name, users.username`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: "SELECT id, owner FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== ownerId) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      if (!this._collaborationsService) {
        throw error;
      }

      await this._collaborationsService.verifyCollaborator(playlistId, userId);
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const songQuery = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);

    if (!songResult.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM playlist_songs
             JOIN songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      ...playlistResult.rows[0],
      songs: songsResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO playlist_song_activities 
             VALUES($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(playlistId) {
    await this._ensurePlaylistExists(playlistId);

    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
             FROM playlist_song_activities
             JOIN users ON users.id = playlist_song_activities.user_id
             JOIN songs ON songs.id = playlist_song_activities.song_id
             WHERE playlist_song_activities.playlist_id = $1
             ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time,
    }));
  }

  async _ensurePlaylistExists(playlistId) {
    const query = {
      text: "SELECT id FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async _ensureSongExists(songId) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }
}

export default PlaylistsService;
