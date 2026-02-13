import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import AlbumsService from "../../services/postgres/AlbumsService.js";
import AlbumLikesService from "../../services/postgres/AlbumLikesService.js";
import StorageService from "../../services/storage/StorageService.js";
import CacheService from "../../services/redis/CacheService.js";
import AlbumsValidator from "../../validator/albums/index.js";
import authenticate from "../../middlewares/authenticate.js";
import ClientError from "../../exceptions/ClientError.js";
import InvariantError from "../../exceptions/InvariantError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const service = new AlbumsService();
const cacheService = new CacheService();
const albumLikesService = new AlbumLikesService(cacheService);
const storageService = new StorageService(
  path.resolve(__dirname, "covers"),
);

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new InvariantError(
          "Tipe file tidak valid. Hanya gambar (png, jpeg, jpg, webp) yang diperbolehkan.",
        ),
      );
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 512 * 1024,
  },
});

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

router.post(
  "/:id/covers",
  (req, res, next) => {
    upload.single("cover")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new ClientError("Ukuran file melebihi batas 512KB", 413),
          );
        }
        return next(err);
      }
      return next();
    });
  },
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new InvariantError("File cover harus diunggah");
      }

      await service.getAlbumById(id);

      const filename = await storageService.writeFile(req.file, {
        filename: req.file.originalname,
      });

      const host = process.env.HOST || "localhost";
      const port = process.env.PORT || 5000;
      const coverUrl = `http://${host}:${port}/albums/covers/${filename}`;

      await service.updateAlbumCover(id, coverUrl);

      res.status(201).json({
        status: "success",
        message: "Sampul berhasil diunggah",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/:id/likes", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    await service.getAlbumById(id);

    const alreadyLiked = await albumLikesService.verifyUserLike(userId, id);

    if (alreadyLiked) {
      await albumLikesService.deleteLike(userId, id);
      return res.status(201).json({
        status: "success",
        message: "Like album berhasil dihapus",
      });
    }

    await albumLikesService.addLike(userId, id);
    return res.status(201).json({
      status: "success",
      message: "Like album berhasil ditambahkan",
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/likes", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count, source } = await albumLikesService.getLikeCount(id);

    res.set("X-Data-Source", source);

    return res.json({
      status: "success",
      data: {
        likes: count,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
