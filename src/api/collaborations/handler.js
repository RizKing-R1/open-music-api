import express from "express";
import PlaylistsService from "../../services/postgres/PlaylistsService.js";
import CollaborationsService from "../../services/postgres/CollaborationsService.js";
import CollaborationsValidator from "../../validator/collaborations/index.js";

const router = express.Router();
const collaborationsService = new CollaborationsService();
const playlistsService = new PlaylistsService(collaborationsService);

// Tambah kolaborator
router.post("/", async (req, res, next) => {
  try {
    CollaborationsValidator.validateCollaborationPayload(req.body);
    const { playlistId, userId } = req.body;
    const ownerId = req.userId;

    await playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    const collaborationId = await collaborationsService.addCollaboration(playlistId, userId);

    res.status(201).json({
      status: "success",
      data: { collaborationId },
    });
  } catch (error) {
    next(error);
  }
});

// Hapus kolaborator
router.delete("/", async (req, res, next) => {
  try {
    CollaborationsValidator.validateCollaborationPayload(req.body);
    const { playlistId, userId } = req.body;
    const ownerId = req.userId;

    await playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await collaborationsService.deleteCollaboration(playlistId, userId);

    res.json({
      status: "success",
      message: "Kolaborasi berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

export default router;

