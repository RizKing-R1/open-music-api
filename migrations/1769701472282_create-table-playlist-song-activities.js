/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("playlist_song_activities", {
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
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    action: {
      type: "TEXT",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_playlist_id_playlists_id",
    {
      foreignKeys: {
        columns: "playlist_id",
        references: "playlists(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_song_id_songs_id",
    {
      foreignKeys: {
        columns: "song_id",
        references: "songs(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_user_id_users_id",
    {
      foreignKeys: {
        columns: "user_id",
        references: "users(id)",
        onDelete: "CASCADE",
      },
    },
  );
};

export const down = (pgm) => {
  pgm.dropConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_playlist_id_playlists_id",
  );
  pgm.dropConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_song_id_songs_id",
  );
  pgm.dropConstraint(
    "playlist_song_activities",
    "fk_playlist_song_activities_user_id_users_id",
  );
  pgm.dropTable("playlist_song_activities");
};
