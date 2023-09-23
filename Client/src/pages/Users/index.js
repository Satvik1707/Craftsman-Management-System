import { useState, useContext } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import UserModal from '../../components/Modals/UserModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import withAuth from '../../utils/withAuth';
import { useUsers } from '../../hooks/useUser';
import { AuthContext } from '../../context/authContext.js';
import {
  handleEditUser,
  handleSaveUser,
  handleUserInputChange,
  handleCreateUser,
  handleConfirmDeleteUser,
  handleCancelDeleteUser,
  handleDeleteUser,
} from '../../handlers/UsersHandlers';

const Users = () => {
  const { SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [users, setUsers] = useUsers(SERVER_URL, token);
  const [showUserCreationModal, setShowUserCreationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleEdit = (userId) => {
    handleEditUser(userId, setEditUserId);
  };

  const handleSave = (userId) => {
    handleSaveUser(userId, users, setEditUserId);
  };

  const handleInputChange = (e, userId) => {
    e.preventDefault();
    // console.log(e);
    // console.log(userId);
    handleUserInputChange(e, userId, setUsers, users);
  };
  const handleCreate = async (newUser) => {
    handleCreateUser(newUser, setUsers, setShowUserCreationModal, users);
  };
  const handleConfirmDelete = () => {
    handleConfirmDeleteUser(
      userToDelete,
      setUsers,
      setShowDeleteConfirmationModal,
      setUserToDelete,
      users
    );
  };
  const handleCancelDelete = () => {
    handleCancelDeleteUser(setShowDeleteConfirmationModal, setUserToDelete);
  };
  const handleDelete = (userId) => {
    handleDeleteUser(userId, setShowDeleteConfirmationModal, setUserToDelete);
  };


  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="text-4xl font-semibold mb-4">Users</h1>
        {isAdmin && (
          <button
            onClick={() => setShowUserCreationModal(true)}
            className="border-2 border-blue-500 text-blue-500 p-2 rounded mb-4"
          >
            Create New User
          </button>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Users List</h2>
      <div className="flex-1 overflow-y-scroll">
        <table className="w-full bg-white shadow-md rounded-md table-auto">
          <thead className="sticky top-0 bg-white shadow-md z-10">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left cursor-pointer">User ID</th>
              <th className="py-3 px-4 text-left cursor-pointer">Username</th>
              <th className="py-3 px-4 text-left cursor-pointer">Password</th>
              <th className="py-3 px-4 text-left cursor-pointer">Role</th>
              <th className="py-3 px-4 text-left cursor-pointer">Email</th>
              <th className="py-3 px-4 text-left cursor-pointer" colSpan="3">
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-base">
            {users
              .filter((user) => user.user_id !== 0)
              .map((user) => (
                <tr
                  key={`${user.id}-${user.username}`}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    {user.user_id}
                  </td>
                
                  {editUserId === user.user_id ? (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <input
                          type="text"
                          name="username"
                          value={user.username}
                          onChange={(e) => handleInputChange(e, user.user_id)}
                          className="border-2 border-gray-300 px-1 w-40 rounded"
                          autoFocus={true}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        {user.username}
                      </td>
                    </>
                  )}

                  {editUserId === user.user_id ? (
                    <>
                      <td>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter new password"
                          value={user.password}
                          onChange={(e) =>
                            handleUserInputChange(
                              e,
                              user.user_id,
                              setUsers,
                              users
                            )
                          }
                          className="border-2 border-gray-300 px-1 w-40 rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        ••••••••
                      </td>
                    </>
                  )}

                  {editUserId === user.user_id ? (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <input
                          type="text"
                          name="role"
                          value={user.role}
                          onChange={(e) => handleInputChange(e, user.user_id)}
                          className="border-2 border-gray-300 px-1 w-40 rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        {user.role}
                      </td>
                    </>
                  )}

                  {editUserId === user.user_id ? (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <input
                          type="text"
                          name="email"
                          value={user.email}
                          onChange={(e) => handleInputChange(e, user.user_id)}
                          className="border-2 border-gray-300 px-1 w-40 rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        {user.email}
                      </td>
                    </>
                  )}
                  {editUserId === user.user_id ? (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <input
                          
                          type="text"
                          name="phone"
                          value={user.phone}
                          onChange={(e) => handleInputChange(e, user.user_id)}
                          className="border-2 border-gray-300 px-1 w-40 rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        {user.phone}
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    {editUserId === user.user_id ? (
                      <button
                        onClick={() => handleSave(user.user_id)}
                        className="text-green-500 px-8 rounded"
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(user.user_id)}
                        className="text-yellow-500 px-8 rounded"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="text-red-500 px-8 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showUserCreationModal && (
        <UserModal
          handleCreateUser={handleCreate}
          setShowUserCreationModal={setShowUserCreationModal}
          users={users}
        />
      )}
      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default withAuth(Users, true, true);
