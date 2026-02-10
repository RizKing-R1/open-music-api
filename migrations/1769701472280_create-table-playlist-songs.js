/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs_playlist_id_playlists_id",
    {
      foreignKeys: {
        columns: "playlist_id",
        references: "playlists(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint("playlist_songs", "fk_playlist_songs_song_id_songs_id", {
    foreignKeys: {
      columns: "song_id",
      references: "songs(id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm) => {
  pgm.dropConstraint(
    "playlist_songs",
    "fk_playlist_songs_playlist_id_playlists_id",
  );
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_song_id_songs_id");
  pgm.dropTable("playlist_songs");
};
