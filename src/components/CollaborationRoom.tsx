import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Users, MessageSquare } from "lucide-react";

interface CollaborationRoomProps {
  programId: string;
  darkMode: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export const CollaborationRoom: React.FC<CollaborationRoomProps> = ({
  programId,
  darkMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers] = useState(1); // Mock active users for now

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a mock unique username for the session
  const [username] = useState(
    () => `Student_${Math.floor(Math.random() * 1000)}`,
  );

  useEffect(() => {
    // Determine socket URL based on current host if running locally or deployed
    const socketUrl =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5001"
        : "/";

    socketRef.current = io(socketUrl, {
      path: "/socket.io/",
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["polling", "websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current?.emit("join_room", programId);
    });

    socketRef.current.on("receive_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [programId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: username,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketRef.current?.emit("send_message", { ...newMessage, room: programId });
    setInputText("");
  };

  return (
    <div
      className={`mt-10 rounded-xl overflow-hidden shadow-lg border ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
      <div
        className={`p-4 border-b flex justify-between items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <h3 className="font-bold text-lg flex items-center gap-2 text-indigo-500">
          <MessageSquare size={20} />
          Collaborative Study Room
        </h3>
        <div className="flex items-center gap-4">
          <span
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 font-semibold ${isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <span
            className={`text-sm flex items-center gap-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            <Users size={16} /> {activeUsers} Online
          </span>
        </div>
      </div>

      <div className="flex flex-col h-80">
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? "bg-gray-900" : "bg-gray-50/50"}`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
              No messages yet. Start the discussion!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"}`}>
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {msg.sender === username ? "You" : msg.sender} •{" "}
                  {msg.timestamp}
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    msg.sender === username
                      ? "bg-indigo-500 text-white rounded-tr-none"
                      : darkMode
                        ? "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className={`p-3 border-t flex gap-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message the ${programId} discussion room...`}
            className={`flex-1 px-4 py-2 text-sm rounded-xl outline-none transition-colors border ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white focus:border-indigo-500"
                : "bg-gray-100 border-transparent text-gray-900 focus:border-indigo-400 focus:bg-white"
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
