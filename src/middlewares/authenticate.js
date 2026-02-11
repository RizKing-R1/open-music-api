import TokenManager from "../tokenize/TokenManager.js";
import AuthenticationError from "../exceptions/AuthenticationError.js";

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new AuthenticationError("Missing authentication"));
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new AuthenticationError("Missing authentication"));
    return;
  }

  try {
    const { id } = TokenManager.verifyAccessToken(token);
    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;

