import { useState, useEffect } from 'react';
import { fetchIssuesData } from '../utils/api/issues';

export const useIssues = (SERVER_URL, token) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetchIssuesData(SERVER_URL, token);
        setIssues(response);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchIssues();
  }, [SERVER_URL, token]);

  return [issues, setIssues];
};
