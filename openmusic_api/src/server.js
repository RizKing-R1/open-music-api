import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import albumsRouter from "./api/albums/handler.js";
import songsRouter from "./api/songs/handler.js";
import usersRouter from "./api/users/handler.js";
import authenticationsRouter from "./api/authentications/handler.js";
import playlistsRouter from "./api/playlists/handler.js";
import collaborationsRouter from "./api/collaborations/handler.js";
import exportsRouter from "./api/exports/handler.js";
import authenticate from "./middlewares/authenticate.js";
import ClientError from "./exceptions/ClientError.js";
import config from "./utils/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { port, host } = config.app;

app.use(express.json());
app.use("/albums/covers", express.static(path.resolve(__dirname, "api/albums/covers")));

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/users", usersRouter);
app.use("/authentications", authenticationsRouter);
app.use("/playlists", authenticate, playlistsRouter);
app.use("/collaborations", authenticate, collaborationsRouter);
app.use("/export/playlists", authenticate, exportsRouter);

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
