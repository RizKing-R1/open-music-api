import "dotenv/config";
import express from "express";
import albumsRouter from "./api/albums/handler.js";
import songsRouter from "./api/songs/handler.js";
import ClientError from "./exceptions/ClientError.js";

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";

app.use(express.json());

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);

app.use((err, req, res, _next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Maaf, terjadi kegagalan pada server kami.",
  });
});

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
