import express from "express";
import PlaylistsService from "../../services/postgres/PlaylistsService.js";
import ProducerService from "../../services/rabbitmq/ProducerService.js";
import ExportsValidator from "../../validator/exports/index.js";

const router = express.Router();
const playlistsService = new PlaylistsService();

router.post("/:playlistId", async (req, res, next) => {
  try {
    ExportsValidator.validateExportPayload(req.body);

    const { playlistId } = req.params;
    const { userId } = req;
    const { targetEmail } = req.body;

    await playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = JSON.stringify({
      playlistId,
      targetEmail,
    });

    await ProducerService.sendMessage("export:playlists", message);

    res.status(201).json({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
