import { ADDRESS, PORT } from "../requests/requestConfig.js";
import { getUserId } from "../checking/checkAuth.js";

const url = `ws${ADDRESS}${PORT}/chatting/${getUserId()}`;
export const socket = new WebSocket(url);