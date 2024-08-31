import axios from "axios";

const API_BASE_URL = 'https://chatify-api.up.railway.app';

export const getCsrfToken = async () => {
    const response = await axios.patch(`${API_BASE_URL}/csrf`);
    axios.defaults.headers.post['X-CSRF-Token'] = response.data.csrfToken;
    return response.data.csrfToken;
};

export const registerUser = async (credentials) => {
    await getCsrfToken();
    const response = await axios.post(`${API_BASE_URL}/auth/register`, credentials);
    if (response.status !== 201) {
        throw new Error(response.data.message || 'Registration failed');
    }
};

export const loginUser = async (credentials) => {
    await getCsrfToken();
    const response = await axios.post(`${API_BASE_URL}/auth/token`, credentials);
    if (response.status !== 200) {
        throw new Error(response.data.message || 'Login failed');
    }
    
    const userData = response.data;
    localStorage.setItem('token', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

    return userData;
};

export const fetchMessages = async () => {
    const response = await axios.get(`${API_BASE_URL}/messages`);
    return response.data;
};

export const createMessage = async (messageData) => {
    const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
    if (response.status !== 201) {
        throw new Error('Failed to create message');
    }
    return response.data;
};

export const deleteMessage = async (messageId) => {
    const response = await axios.delete(`${API_BASE_URL}/messages/${messageId}`);
    if (response.status !== 204) {
        throw new Error('Failed to delete message');
    }
};

