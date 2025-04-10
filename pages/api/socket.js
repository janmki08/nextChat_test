// /pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
    if (res.socket.server.io) {
        console.log("🔁 Socket is already running");
        res.end();
        return;
    }

    console.log("✅ Socket is initializing");
    const io = new Server(res.socket.server, {
        path: "/api/socketio",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log("🔌 A user connected: ", socket.id);

        socket.on("chat:message", (data) => {
            console.log("📨 Received message: ", data);

            // 받은 메시지를 다시 클라이언트에게 보냄 (브로드캐스트는 아님)
            socket.to(data.to).emit("chat:message", data);
        });

        socket.on("chat:join", (userId) => {
            console.log(`👤 User joined room: ${userId}`);
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            console.log("❌ A user disconnected: ", socket.id);
        });
    });

    res.end();
}
