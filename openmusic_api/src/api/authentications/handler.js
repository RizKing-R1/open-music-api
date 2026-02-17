import express from "express";
import AuthenticationsService from "../../services/postgres/AuthenticationsService.js";
import UsersService from "../../services/postgres/UsersService.js";
import AuthenticationsValidator from "../../validator/authentications/index.js";
import TokenManager from "../../tokenize/TokenManager.js";

const router = express.Router();
const authenticationsService = new AuthenticationsService();
const usersService = new UsersService();

router.post("/", async (req, res, next) => {
  try {
    AuthenticationsValidator.validatePostAuthenticationPayload(req.body);
    const { username, password } = req.body;

    const id = await usersService.verifyUserCredential(username, password);

    const accessToken = TokenManager.generateAccessToken({ id });
    const refreshToken = TokenManager.generateRefreshToken({ id });

    await authenticationsService.addRefreshToken(refreshToken);

    res.status(201).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    AuthenticationsValidator.validatePutAuthenticationPayload(req.body);
    const { refreshToken } = req.body;

    await authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = TokenManager.verifyRefreshToken(refreshToken);

    const accessToken = TokenManager.generateAccessToken({ id });

    res.json({
      status: "success",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    AuthenticationsValidator.validateDeleteAuthenticationPayload(req.body);
    const { refreshToken } = req.body;

    await authenticationsService.verifyRefreshToken(refreshToken);
    await authenticationsService.deleteRefreshToken(refreshToken);

    res.json({
      status: "success",
      message: "Refresh token berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
