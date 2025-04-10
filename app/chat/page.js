// /app/chat/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function ChatPage() {
    const [userId, setUserId] = useState("");
    const [toUserId, setToUserId] = useState("");
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        fetch("/api/socket"); // 서버 소켓 초기화
        socket = io({
            path: "/api/socketio",
        });

        socket.on("connect", () => {
            console.log("🟢 Connected to socket:", socket.id);
        });

        socket.on("chat:message", (data) => {
            setChatLog((prev) => [...prev, `From ${data.from}: ${data.message}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleJoin = () => {
        socket.emit("chat:join", userId);
    };

    const sendMessage = () => {
        if (!toUserId || !message) return;
        const data = { to: toUserId, from: userId, message };
        socket.emit("chat:message", data);
        setChatLog((prev) => [...prev, `To ${toUserId}: ${message}`]);
        setMessage("");
        inputRef.current?.focus();
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">1:1 Chat</h1>

            <div className="mb-4">
                <input
                    placeholder="내 ID"
                    className="border px-2 py-1 mr-2"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button
                    onClick={handleJoin}
                    className="bg-blue-500 text-white px-2 py-1"
                >
                    입장
                </button>
            </div>

            <div className="mb-4">
                <input
                    placeholder="보낼 상대방 ID"
                    className="border px-2 py-1 mr-2"
                    value={toUserId}
                    onChange={(e) => setToUserId(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <input
                    ref={inputRef}
                    placeholder="메시지 입력"
                    className="border px-2 py-1 mr-2 w-1/2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-500 text-white px-2 py-1"
                >
                    보내기
                </button>
            </div>

            <div className="border p-4 h-64 overflow-y-auto">
                {chatLog.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
        </div>
    );
}
