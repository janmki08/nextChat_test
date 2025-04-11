const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Next.js 주소
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// 기본 라우터
app.get("/", (req, res) => {
    res.send("API 서버가 정상 작동 중입니다.");
});

// 소켓 처리
io.on("connection", (socket) => {
    console.log("🟢 클라이언트 연결됨:", socket.id);

    socket.on("chat:join", (userId) => {
        console.log(`${userId} 입장`);
        socket.join(userId);
    });

    socket.on("chat:message", (data) => {
        console.log("메시지:", data);
        socket.to(data.to).emit("chat:message", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 연결 해제됨:", socket.id);
    });
});

// 서버 시작
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 API 서버가 포트 ${PORT}에서 실행 중`);
});
