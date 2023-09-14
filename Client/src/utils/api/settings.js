import axios from 'axios';

const fetchSettings = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export { fetchSettings };
