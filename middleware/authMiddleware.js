import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (request, response, next) => {
  const token = request.body.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      try {
        request.user = user;
        next();
      } catch (error) {
        return response.sendStatus(403).json(error);
      }
    });
  } else {
    response.sendStatus(401).json({ message: "no token" });
  }
};

export default authenticateJWT;
