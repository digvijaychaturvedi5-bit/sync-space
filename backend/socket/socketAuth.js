const jwt = require("jsonwebtoken");
const User = require("../models/User");

const resolveSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken;
  }

  const headerToken = socket.handshake.headers.authorization;
  if (headerToken?.startsWith("Bearer ")) {
    return headerToken.split(" ")[1];
  }

  return socket.handshake.query?.token;
};

const socketAuth = async (socket, next) => {
  try {
    const token = resolveSocketToken(socket);

    if (!token) {
      return next(new Error("Not authorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Not authorized"));
  }
};

module.exports = { socketAuth };
