/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("albums");
};
