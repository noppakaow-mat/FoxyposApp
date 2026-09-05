import { io } from "socket.io-client";
import { API_ORIGIN } from "../../services/Api";


const socket = io(API_ORIGIN, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
});


export default socket;