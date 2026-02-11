import express from "express";
import UsersService from "../../services/postgres/UsersService.js";
import UsersValidator from "../../validator/users/index.js";

const router = express.Router();
const service = new UsersService();

router.post("/", async (req, res, next) => {
  try {
    UsersValidator.validateUserPayload(req.body);
    const userId = await service.addUser(req.body);
    res.status(201).json({
      status: "success",
      data: { userId },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

