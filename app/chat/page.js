"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"; // socket.io-client 불러오기

let socket;

export default function ChatPage() {
    const [userId, setUserId] = useState("");
    const [toUserId, setToUserId] = useState("");
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        // socket.io 연결
        socket = io("http://localhost:4000"); // Express 서버 주소

        socket.on("connect", () => {
            console.log("🟢 소켓 연결됨:", socket.id);
        });

        socket.on("chat:message", (data) => {
            setChatLog((prev) => [...prev, `From ${data.from}: ${data.message}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleJoin = () => {
        if (!userId) return alert("내 ID를 입력하세요!");
        socket.emit("chat:join", userId);
    };

    const sendMessage = () => {
        if (!toUserId || !message) return;

        const data = {
            to: toUserId,
            from: userId,
            message,
        };

        socket.emit("chat:message", data);
        setChatLog((prev) => [...prev, `To ${toUserId}: ${message}`]);
        setMessage("");
        inputRef.current?.focus();
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">1:1 실시간 채팅</h1>

            <div className="mb-4 flex items-center gap-2">
                <input
                    placeholder="내 ID"
                    className="border px-2 py-1 flex-1"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button
                    onClick={handleJoin}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    입장
                </button>
            </div>

            <div className="mb-4">
                <input
                    placeholder="상대방 ID"
                    className="border px-2 py-1 w-full"
                    value={toUserId}
                    onChange={(e) => setToUserId(e.target.value)}
                />
            </div>

            <div className="mb-4 flex items-center gap-2">
                <input
                    ref={inputRef}
                    placeholder="메시지 입력"
                    className="border px-2 py-1 flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    보내기
                </button>
            </div>

            <div className="border p-4 h-64 overflow-y-auto bg-gray rounded shadow-sm">
                {chatLog.map((msg, i) => (
                    <div key={i} className="mb-1 text-sm">
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
