import { io } from "socket.io-client";
import { getSocketUrl } from "./config";

export const createAuthenticatedSocket = () => {
  const user = JSON.parse(localStorage.getItem("syncSpaceUser"));

  return io(getSocketUrl(), {
    autoConnect: false,
    auth: {
      token: user?.token
    }
  });
};
