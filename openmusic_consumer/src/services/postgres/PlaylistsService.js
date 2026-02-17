import pg from "pg";

const { Pool } = pg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
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
      throw new Error("Playlist tidak ditemukan");
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
}

export default PlaylistsService;
