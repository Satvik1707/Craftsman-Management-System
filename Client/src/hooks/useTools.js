import { useState, useEffect } from 'react';
import { fetchToolsData } from '../utils/api/tools';

export const useTools = (SERVER_URL, token) => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetchToolsData(SERVER_URL, token);
        setTools(response);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchTools();
  }, [SERVER_URL, token]);

  return [tools, setTools];
};
