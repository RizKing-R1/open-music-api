import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/AuthenticationError.js";

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_AGE),
    },
  ),

  generateRefreshToken: (payload) => jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_KEY,
  ),

  verifyAccessToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return decoded;
    } catch (error) {
      throw new AuthenticationError("Access token tidak valid");
    }
  },

  verifyRefreshToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch (error) {
      throw new AuthenticationError("Refresh token tidak valid");
    }
  },
};

export default TokenManager;
