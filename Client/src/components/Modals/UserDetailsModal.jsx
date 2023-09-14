import React from 'react';
import withAuth from '../../utils/withAuth';
const UserDetailsModal = ({ selectedUser, setShowUserDetailsModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <p className="text-lg mb-2 text-gray-700">
          <span className="font-bold">User ID:</span>{' '}
          {selectedUser && selectedUser.user_id}
        </p>
        <p className="text-lg mb-2 text-gray-700">
          <span className="font-bold">Name:</span>{' '}
          {selectedUser && selectedUser.username}
        </p>
        <p className="text-lg mb-2 text-gray-700">
          <span className="font-bold">Email:</span>{' '}
          {selectedUser && selectedUser.email}
        </p>
        <p className="text-lg mb-2 text-gray-700">
          <span className="font-bold">Phone:</span>{' '}
          {selectedUser && selectedUser.phone}
        </p>
        <button
          onClick={() => setShowUserDetailsModal(false)}
          className="border-2 border-black text-black p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default withAuth(UserDetailsModal, true);
