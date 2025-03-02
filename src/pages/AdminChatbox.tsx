import React, { useState, useEffect, useRef } from "react";
import Axios from 'axios';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FILE_URL, URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

interface Message {
  content: string;
  sender: string;
  timestamp: string;
  recipient: string;
  imageUrl: string;
}

const AdminChatbox = () => {
  const token = localStorage.getItem('access_token');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessages, setUserMessages] = useState<Map<string, Message[]>>(new Map());
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [unreadUsers, setUnreadUsers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState<string>(""); // Giá trị tìm kiếm
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Kết nối WebSocket và nhận tin nhắn
  useEffect(() => {
    const socket = new SockJS(`${FILE_URL}/chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/user/admin/private", (message) => {
          const chatMessage: Message = JSON.parse(message.body);

          setMessages((prevMessages) => [...prevMessages, chatMessage]);

          setUserMessages((prevUserMessages) => {
            const newUserMessages = new Map(prevUserMessages);

            if (!newUserMessages.has(chatMessage.sender)) {
              newUserMessages.set(chatMessage.sender, []);
            }

            newUserMessages.get(chatMessage.sender)?.push(chatMessage);

            return newUserMessages;
          });

          if (chatMessage.sender !== selectedUser) {
            setUnreadUsers((prev) => new Set(prev).add(chatMessage.sender));
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    setStompClient(client);
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let config = {
      method: 'get',
      url: `${URL}admin/get-all-message`,
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        // Giả sử API trả về một mảng các user string
        const users = response.data;  // Mảng người dùng

        setUserMessages((prevUserMessages) => {
          const newUserMessages = new Map(prevUserMessages);

          // Tạo một Map các người dùng, mặc dù chúng ta không cần tin nhắn ở đây
          users.forEach((user: any) => {
            newUserMessages.set(user, []);  // Khởi tạo danh sách tin nhắn trống cho mỗi user
          });

          return newUserMessages;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser);
    }

  }, [selectedUser]);

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    setUnreadUsers((prev) => {
      const updated = new Set(prev);
      updated.delete(user);
      return updated;
    });
  };

  const fetchConversation = (user: string) => {
    let config = {
      method: 'get',
      url: `${URL}auth/conversation/${user}/admin`,
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        const newMessages = response.data;

        setUserMessages((prevUserMessages) => {
          const updatedUserMessages = new Map(prevUserMessages);
          updatedUserMessages.set(user, newMessages); // Thay thế toàn bộ dữ liệu cũ
          return updatedUserMessages;
        });

        // Đảm bảo rằng scroll xuống cuối sẽ xảy ra sau khi tin nhắn đã được cập nhật
        setTimeout(() => scrollToBottom(), 100);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleSendReply = () => {
    const localTime = new Date(Date.now()); // Thời gian local

    // Định dạng thời gian theo định dạng "yyyy-MM-dd'T'HH:mm:ss"
    const year = localTime.getFullYear();
    const month = String(localTime.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const day = String(localTime.getDate()).padStart(2, '0');
    const hours = String(localTime.getHours()).padStart(2, '0');
    const minutes = String(localTime.getMinutes()).padStart(2, '0');
    const seconds = String(localTime.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    if (input.trim() && stompClient && connected && selectedUser) {
      const newMessage: Message = {
        content: input.trim(),
        sender: "admin",
        recipient: selectedUser,
        timestamp: formattedTime,  // Thời gian theo múi giờ của bạn
        imageUrl: ""
      };

      stompClient.publish({
        destination: "/app/private-message",
        body: JSON.stringify(newMessage),
      });

      setUserMessages((prevUserMessages) => {
        const newUserMessages = new Map(prevUserMessages);
        if (!newUserMessages.has(selectedUser)) {
          newUserMessages.set(selectedUser, []);
        }
        newUserMessages.get(selectedUser)?.push(newMessage);
        return newUserMessages;
      });

      setInput("");
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleTrimUser = (input: string) => {
    const stringLength = input.length;
    return input.substring(0, 6) + "..." + input.substring(stringLength - 6);
  };

  // Lọc danh sách người dùng theo giá trị tìm kiếm
  const filteredUsers = Array.from(userMessages.keys()).filter((user) =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  const endChat = () => {
    let config = {
      method: 'get',
      url: `${URL}admin/end-chat/${selectedUser}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === "ok") {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Chat ended',
            showConfirmButton: false,
            timer: 600,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  return (
    <div className="chat-container gap-3">
      <div className="inside">
        <div className="p-2">
          <input
            className="w-full p-2 border rounded-md"
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className="w-full user-list bg-gray-100 overflow-y-auto min-h-[80svh] max-h-[80svh] sm:min-h-[80svh] sm:max-h-[80svh] max-sm:min-h-[20svh] max-sm:max-h-[20svh]">
          <div className="space-y-4 p-4">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedUser === user ? "bg-blue-200" : ""
                  } ${unreadUsers.has(user) && selectedUser !== user
                    ? "bg-orange-200 animate-pulse"
                    : ""
                  }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex-1">
                  <p className="font-semibold">{handleTrimUser(user)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bên phải */}
      <div className="w-2/3 chat-box flex pt-2">
        {selectedUser ? (
          <div className="chatbox">
            <button className="p-4 bg-red-200" onClick={endChat}>End chat</button>
            <div className="chatbox-body flex-1 overflow-y-auto">
              {userMessages.get(selectedUser)?.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender === "admin" ? "sent" : "received"
                    }`}
                >
                  {msg.imageUrl && <img src={`${FILE_URL}${msg.imageUrl}`} alt="User upload" className="w-32 h-auto rounded-md" />}
                  {msg.content && <p>{msg.content}</p>}
                  <small className="chat-message-timestamp">{msg.timestamp}</small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex">
              <input
                className="flex-1 p-2 border rounded-md"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your reply..."
              />
              <button
                className="ml-1 p-2 bg-blue-500 text-white rounded-md"
                onClick={handleSendReply}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p className="p-4">Select a user to view their messages</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatbox;
