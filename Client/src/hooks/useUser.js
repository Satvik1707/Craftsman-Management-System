import { useState, useEffect } from 'react';
import { fetchUsers } from '../utils/api/users';

export const useUsers = (SERVER_URL, token) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetchUsers(SERVER_URL, token);
        setUsers(response.data);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchUsersData();
  }, [SERVER_URL, token]);

  return [users, setUsers];
};
