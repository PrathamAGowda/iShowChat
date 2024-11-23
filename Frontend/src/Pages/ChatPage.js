import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Settings, Send, Trash2 } from "lucide-react";
import api from "../API/api";
const { io } = require("socket.io-client");

const ChatPage = () => {
  const [group, setGroup] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [expand, setExpand] = useState(false);
  const [curGroupName, setCurGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [refresh, doRefresh] = useState(false);

  // Use useRef to maintain socket connection
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection once
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        auth: { username },
      });

      socketRef.current.on("connect", () => {
        console.log(`${username} connected to socket`);
      });

      socketRef.current.emit("join", curGroupName);

      // Add new-message handler here inside the connection setup
      socketRef.current.on("new-message", (message) => {
        try {
          console.log("Works");
          const newMessage = {
            id: message._id,
            text: message.content,
            sender: message.sender,
            username: username,
          };
          // doRefresh(!refresh);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
          console.error("Error Displaying New Message:", error);
        }
      });

      // Clean up socket connection on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [username]);

  // Handle message receiving
  useEffect(() => {
    if (!socketRef.current) return;

    const handlePreviousMessages = (messages) => {
      const loadedMessages = messages.map((message) => ({
        id: Date.now() + Math.random(),
        text: message.content,
        sender: message.sender,
        username: message.sender,
      }));
      setMessages(loadedMessages);
    };

    // Remove existing listeners and add new ones
    socketRef.current.off("previous-messages");
    socketRef.current.on("previous-messages", handlePreviousMessages);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("previous-messages", handlePreviousMessages);
      }
    };
  }, [curGroupName]);

  const sendMessage = async (username, groupName, message) => {
    try {
      if (socketRef.current) {
        socketRef.current.emit("send-message", {
          groupName: groupName,
          content: message,
        });
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  useEffect(() => {
    const initiate = async () => {
      try {
        const res = await api.get("/user/profile", {
          headers: { username: username },
        });
        setName(res.data.username);
        setGroups(res.data.groupList);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    initiate();
  }, [username]);

  const loadMessage = () => {
    if (!socketRef.current || !curGroupName) return;

    // Clear messages before loading new ones
    setMessages([]);

    // Emit load messages event
    socketRef.current.emit("load-messages", curGroupName);
  };

  // Load messages when group changes or refresh toggle changes
  useEffect(() => {
    loadMessage();
  }, [curGroupName, refresh]);

  const handleSendMessage = () => {
    if (!message.trim() || !curGroupName) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: username,
      username: username,
    };

    sendMessage(username, curGroupName, message);
    setMessage("");
  };

  const handleDeleteMessageFromDatabase = async (id) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const MessageItem = ({ msg }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!msg) return null;

    return (
      <div
        className="p-4 flex group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mr-4">
          <span className="text-white font-semibold">
            {msg.sender?.[0]?.toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
          <div
            className={`
            rounded-lg p-3 shadow-md max-w-md 
            ${
              msg.username === username
                ? "bg-indigo-800 text-gray-200 rounded-tl-none"
                : "bg-gray-800 text-gray-200 rounded-tr-none"
            }
          `}
          >
            <p>{msg.text}</p>
          </div>
        </div>

        {msg.username === username && isHovered && (
          <button
            onClick={() => handleDeleteMessageFromDatabase(msg.id)}
            className="absolute top-6 right-4 text-red-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  const ConditionalAvatar = ({ avatarData }) => {
    return avatarData ? (
      <img
        src={avatarData}
        alt="Avatar"
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
    );
  };

  const truncateText = (text, maxWidth) => {
    if (!expand || text.length <= maxWidth) return text;
    return text.substring(0, maxWidth) + "...";
  };

  const sidebarGroups = groups.map((group) => (
    <div
      key={group.groupName}
      className="mb-4 w-full cursor-pointer select-none"
      onClick={() => setCurGroupName(group.groupName)}
    >
      <div
        className={`relative transition-all duration-300 ease-in-out 
        ${expand ? "w-32" : "w-12"} h-12`}
      >
        <div
          className={`absolute left-0 top-0 border-[3px] border-indigo-500/40 
          ${
            expand
              ? "rounded-tr-xl rounded-br-xl rounded-l-3xl"
              : "rounded-full"
          }
          transition-all duration-300 ease-in-out
          ${expand ? "w-64" : "w-12"} h-12`}
        />

        <div
          className="absolute left-0 top-0 w-12 h-12 rounded-full 
          bg-gradient-to-br from-indigo-600 to-indigo-800
          flex items-center justify-center shadow-lg"
        >
          <div className="w-12 h-12 bg-gray-700 rounded-full flex text-center items-center justify-center text-white">
            {group.groupName[0].toUpperCase()}
          </div>
        </div>

        {expand && (
          <div className="absolute left-14 top-1/2 transform -translate-y-1/2 text-white text-sm truncate max-w-48">
            {truncateText(group.groupName, 20)}
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <div
      className={`grid grid-rows-[64px_1fr] ${
        expand ? "grid-cols-[280px_1fr]" : "grid-cols-[64px_1fr]"
      } 
      min-h-screen h-screen w-full transition-all duration-300 overflow-hidden bg-gray-900`}
    >
      <div className="row-span-2 h-full bg-gray-800 py-6 px-2 shadow-lg overflow-hidden flex flex-col">
        <div className="h-16 -mt-2 mb-4 flex items-center">
          {!expand ? (
            <svg
              onClick={() => setExpand(!expand)}
              className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              fill="rgb(99 102 241)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <g id="SVGRepo_iconCarrier">
                <rect className="cls-1" x="11" y="3" width="2" height="10" />
                <rect className="cls-1" x="7" y="3" width="2" height="10" />
                <rect className="cls-1" x="3" y="3" width="2" height="10" />
              </g>
            </svg>
          ) : (
            <svg
              onClick={() => setExpand(!expand)}
              className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              fill="rgb(99 102 241)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  id="Menu_Button"
                  className="cls-1"
                  d="M2,13V11H14v2ZM2,9V7H14V9ZM2,5V3H14V5Z"
                />
              </g>
            </svg>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent hover:scrollbar-thumb-indigo-500/40
          pr-2 scrollbar-hide"
        >
          {sidebarGroups}
        </div>
      </div>

      <div className="w-full h-16 min-h-[64px] bg-gray-800 shadow-md px-4 border-b border-gray-700">
        <div className="h-full flex items-center justify-between">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 md:w-64 h-10 pl-10 pr-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <ConditionalAvatar avatarData={avatar} />
            <div
              className="text-gray-200 text-lg font-semibold select-none"
              onClick={() =>
                navigate("/groupdetails", {
                  state: { groupName: curGroupName, username },
                })
              }
            >
              {curGroupName || "Select a group"}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <MessageCircle
              className="w-5 h-5 text-gray-300 hover:text-indigo-400 cursor-pointer"
              onClick={() => navigate("/creategroup", { state: { username } })}
            />
            <Settings
              className="w-5 h-5 text-gray-300 hover:text-indigo-400 cursor-pointer"
              onClick={() => navigate("/profile", { state: { username } })}
            />
            <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-200 font-semibold select-none">
                {name[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-gray-900 relative overflow-hidden">
        <div
          className="absolute inset-0 overflow-y-auto pb-24
          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 scrollbar-hide"
        >
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <MessageItem key={msg.id || index} msg={msg} />
            ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                curGroupName
                  ? "Type a message..."
                  : "Select a group to start chatting"
              }
              disabled={!curGroupName}
              className="w-full h-12 pl-4 pr-12 rounded-full bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!curGroupName || !message.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${
                  curGroupName && message.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
            >
              <Send className="w-4 h-4 text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
