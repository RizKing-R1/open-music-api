import express from "express";
import AlbumsService from "../../services/postgres/AlbumsService.js";
import AlbumsValidator from "../../validator/albums/index.js";

const router = express.Router();
const service = new AlbumsService();

router.post("/", async (req, res, next) => {
  try {
    AlbumsValidator.validateAlbumPayload(req.body);
    const albumId = await service.addAlbum(req.body);
    res.status(201).json({
      status: "success",
      data: { albumId },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await service.getAlbumById(id);
    res.json({
      status: "success",
      data: { album },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    AlbumsValidator.validateAlbumPayload(req.body);
    const { id } = req.params;
    await service.editAlbumById(id, req.body);
    res.json({
      status: "success",
      message: "Album berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.deleteAlbumById(id);
    res.json({
      status: "success",
      message: "Album berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
