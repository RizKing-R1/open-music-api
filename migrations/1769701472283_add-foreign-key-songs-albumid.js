/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.addConstraint("songs", "fk_songs_albumId_albums_id", {
    foreignKeys: {
      columns: "albumId",
      references: "albums(id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs_albumId_albums_id");
};
