// UsersHandlers.js

import axios from 'axios';
import { getCookie } from '../utils/cookies';
const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;
const token = getCookie('token');
export const handleEditUser = (userId, setEditUserId) => {
  setEditUserId(userId);
};

export const handleSaveUser = async (userId, users, setEditUserId) => {
  const userToSave = users.find((user) => user.user_id === userId);
  try {
    const updatedUser = {
      user_id: userToSave.user_id,
      username: userToSave.username,
      role: userToSave.role,
      email: userToSave.email,
      phone: userToSave.phone,
    };

    if (userToSave.password) {
      updatedUser.password = userToSave.password;
    }

    await axios.put(`${SERVER_URL}api/user/`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditUserId(null);
  } catch (error) {
    console.error({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
};

export const handleUserInputChange = (e, userId, setUsers, users) => {
  const { name, value } = e.target;
  setUsers(users.map(user => (user.user_id === userId ? { ...user, [name]: value } : user)));
  
};

export const handleCreateUser = async (
  newUser,
  setUsers,
  setShowUserCreationModal,
  users
) => {
  try {
    const response = await axios.post(`${SERVER_URL}api/user`, newUser, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers([...users, response.data.user]);
    setShowUserCreationModal(false);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while creating user:', error);
    }
  }
};

export const handleConfirmDeleteUser = async (
  userToDelete,
  setUsers,
  setShowDeleteConfirmationModal,
  setUserToDelete,
  users
) => {
  try {
    await axios.delete(`${SERVER_URL}api/user`, {
      data: { user_id: userToDelete },
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((user) => user.user_id !== userToDelete));
    setShowDeleteConfirmationModal(false);
    setUserToDelete(null);
  } catch (error) {
    console.error({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
};

export const handleCancelDeleteUser = (
  setShowDeleteConfirmationModal,
  setUserToDelete
) => {
  setShowDeleteConfirmationModal(false);
  setUserToDelete(null);
};

export const handleDeleteUser = (
  userId,
  setShowDeleteConfirmationModal,
  setUserToDelete
) => {
  setShowDeleteConfirmationModal(true);
  setUserToDelete(userId);
};
