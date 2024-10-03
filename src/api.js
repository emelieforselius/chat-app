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
  avatar,
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
    console.error("Error during login", error.response ? error.response.data : error);
    throw error;
  }
};
