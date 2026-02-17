export const up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "collaborations",
    "fk_collaborations_playlist_id_playlists_id",
    {
      foreignKeys: {
        columns: "playlist_id",
        references: "playlists(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint("collaborations", "fk_collaborations_user_id_users_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("collaborations", "unique_collaborations_playlist_user", {
    unique: ["playlist_id", "user_id"],
  });
};

export const down = (pgm) => {
  pgm.dropConstraint("collaborations", "unique_collaborations_playlist_user");
  pgm.dropConstraint(
    "collaborations",
    "fk_collaborations_playlist_id_playlists_id",
  );
  pgm.dropConstraint("collaborations", "fk_collaborations_user_id_users_id");
  pgm.dropTable("collaborations");
};
