import axios from "axios";

const API_BASE_URL = "https://chatify-api.up.railway.app";

export const getCsrfToken = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/csrf`);
    return response.data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token", error);
    throw error;
  }
};

export const registerUser = async ({
  username,
  email,
  password,
  avatar = "",
  csrfToken,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      { username, email, password, avatar },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Registration failed");
    }
  }
};

export const loginUser = async (credentials) => {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/auth/token`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Login failed");
    }

    const userData = response.data;
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));

    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;

    return userData;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};

export const fetchMessages = async () => {
  
  try {
    const token = localStorage.getItem("token");
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${API_BASE_URL}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': csrfToken,
      },
    });
    console.log("Fetched messages:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};

export const createMessage = async (messageData) => {
  try {
    const token = localStorage.getItem("token");
    const csrfToken = await getCsrfToken();
    const response = await axios.post(`${API_BASE_URL}/messages`, messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json", 
      },
    });
    if (response.status !== 201) {
      throw new Error("Failed to create message");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating message", error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 204) {
      throw new Error("Failed to delete message");
    }
  } catch (error) {
    console.error("Error deleting message", error);
    throw error;
  }
};