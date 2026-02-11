import express from "express";
import SongsService from "../../services/postgres/SongsService.js";
import SongsValidator from "../../validator/songs/index.js";

const router = express.Router();
const service = new SongsService();

router.post("/", async (req, res, next) => {
  try {
    SongsValidator.validateSongPayload(req.body);
    const songId = await service.addSong(req.body);
    res.status(201).json({
      status: "success",
      data: { songId },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { title, performer } = req.query;
    const songs = await service.getSongs(title, performer);
    res.json({
      status: "success",
      data: { songs },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await service.getSongById(id);
    res.json({
      status: "success",
      data: { song },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    SongsValidator.validateSongPayload(req.body);
    const { id } = req.params;
    await service.editSongById(id, req.body);
    res.json({
      status: "success",
      message: "Lagu berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.deleteSongById(id);
    res.json({
      status: "success",
      message: "Lagu berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
