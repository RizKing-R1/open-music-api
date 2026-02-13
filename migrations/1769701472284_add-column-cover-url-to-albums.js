export const up = (pgm) => {
  pgm.addColumn("albums", {
    cover_url: {
      type: "TEXT",
      default: null,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn("albums", "cover_url");
};
