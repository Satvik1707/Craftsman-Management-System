import axios from 'axios';
const fetchUserData = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const fetchUsers = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export { fetchUsers, fetchUserData };
