import React, { useState, useEffect, useContext } from "react";
import { getCsrfToken } from "../api";
import styles from "./Chat.module.css";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

const API_BASE_URL = "https://chatify-api.up.railway.app";


const Chat = () => {
  const { user, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const conversationID = "44a24916-d34e-4df2-a6a4-e3aa17416b7b";

  const [fakeChat, setFakeChat] = useState([
    {
      id: 4,
      text: "Tja tja, hur mår du?",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
    {
      id: 5,
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
    {
      id: 6,
      text: "Sover du eller?! 😴",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
  ]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.get(
        `${API_BASE_URL}/messages?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      console.log("Fetched messages:", response.data);
      console.log("User ID from AuthContext:", userId);

     
      setMessages(response.data.sort((a, b) => a.timestamp - b.timestamp));

      return response.data;
    } catch (error) {
      console.error("Error fetching messages", error);
      throw error;
    }
  };

  const createMessage = async (messageData) => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 201) {
        throw new Error("Failed to create message");
      }
      return response.data;
    } catch (error) {
      console.error("Error creating message", error);
      throw error;
    }
  };

  const deleteMessage = async (msgId) => {
    console.log("Deleting message with ID:", msgId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/messages/${msgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status !== 204) {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("User ID from AuthContext:", userId);
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    loadMessages();
  }, [userId, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await createMessage({ userId: user.id, text: newMessage });
      }
      setNewMessage("");
      await fetchMessages();
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    console.log("Attempting to delete message with ID:", messageId);
    try {
      await deleteMessage(messageId);

     
      setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {fakeChat
        .slice()
        .reverse()
        .map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles.received}`}>
            <p>{msg.text}</p>
          </div>
        ))}

        {messages
          .slice()
          .reverse()
          .map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                messages.userId === user.userId ? styles.sent : styles.received
              }`}
            >




              <p>{msg.text}</p>
              {messages.userId === user.userId && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className={styles.deleteButton}
                >
                  Radera
                </button>
              )}
            </div>
          ))}
      </div>




      {user && (
        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            required
            className={styles.inputField}
          />
          <button type="submit" className={styles.sendButton}>
            Skicka
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
