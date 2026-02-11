import express from "express";
import PlaylistsService from "../../services/postgres/PlaylistsService.js";
import CollaborationsService from "../../services/postgres/CollaborationsService.js";
import PlaylistsValidator from "../../validator/playlists/index.js";

const router = express.Router();
const collaborationsService = new CollaborationsService();
const service = new PlaylistsService(collaborationsService);

router.post("/", async (req, res, next) => {
  try {
    PlaylistsValidator.validatePlaylistPayload(req.body);
    const { name } = req.body;
    const owner = req.userId;

    const playlistId = await service.addPlaylist({ name, owner });
    res.status(201).json({
      status: "success",
      data: { playlistId },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const owner = req.userId;
    const playlists = await service.getPlaylists(owner);
    res.json({
      status: "success",
      data: { playlists },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.userId;

    await service.verifyPlaylistOwner(id, owner);
    await service.deletePlaylistById(id);

    res.json({
      status: "success",
      message: "Playlist berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/songs", async (req, res, next) => {
  try {
    PlaylistsValidator.validatePlaylistSongPayload(req.body);

    const { id: playlistId } = req.params;
    const { songId } = req.body;
    const { userId } = req;

    await service.verifyPlaylistAccess(playlistId, userId);
    await service.addSongToPlaylist(playlistId, songId);
    await service.addPlaylistActivity(playlistId, songId, userId, "add");

    res.status(201).json({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/songs", async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { userId } = req;

    await service.verifyPlaylistAccess(playlistId, userId);
    const playlist = await service.getPlaylistSongs(playlistId);

    res.json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/songs", async (req, res, next) => {
  try {
    PlaylistsValidator.validatePlaylistSongPayload(req.body);

    const { id: playlistId } = req.params;
    const { songId } = req.body;
    const { userId } = req;

    await service.verifyPlaylistAccess(playlistId, userId);
    await service.deleteSongFromPlaylist(playlistId, songId);
    await service.addPlaylistActivity(playlistId, songId, userId, "delete");

    res.json({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/activities", async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { userId } = req;

    await service.verifyPlaylistAccess(playlistId, userId);
    const activities = await service.getPlaylistActivities(playlistId);

    res.json({
      status: "success",
      data: {
        playlistId,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
