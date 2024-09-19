import React, { useState, useEffect } from "react";
import { createMessage, deleteMessage, fetchMessages } from "../api";
import styles from "./Chat.module.css";

const Chat = ({user}) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    loadMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await createMessage({ userId: user.id, text: newMessage });
      setNewMessage("");
      await fetchMessages();
    } catch (error) {
      console.error("Error creating messages:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      await fetchMessages();
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };


  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.userId === user.id ? styles.sent : styles.received}`}
          >
            <p>{msg.text}</p>
            {msg.userId === user.id && (
              <button onClick={() => handleDeleteMessage(msg.id)} className={styles.deleteButton}>
                Radera
              </button>
            )}
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default Chat;