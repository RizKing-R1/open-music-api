export const up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
      allowNull: true,
    },
    albumId: {
      type: "VARCHAR(50)",
      allowNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("songs");
};
