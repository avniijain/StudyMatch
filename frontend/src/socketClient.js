import { io } from "socket.io-client";
const user = JSON.parse(localStorage.getItem("user") || '{}');

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false, // optional: connect manually if needed
  auth: {
    token: localStorage.getItem("token"),
    userId: user.id,
  },
});

export default socket;
