/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("authentications", {
    token: {
      type: "TEXT",
      primaryKey: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("authentications");
};
