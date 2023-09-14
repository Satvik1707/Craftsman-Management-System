import React from 'react';
import withAuth from '../../utils/withAuth';
import { useState } from 'react';
const DeleteConfirmationModal = ({
  handleConfirmDelete,
  handleCancelDelete,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-lg mb-4 text-gray-700">
          Are you sure you want to delete?
        </p>
        <button
          onClick={() => {
            setButtonDisabled(true);
            handleConfirmDelete();
          }}
          disabled={buttonDisabled}
          className="border-2 border-red-500 text-red-500 p-2 rounded"
        >
          Confirm
        </button>
        <button
          onClick={handleCancelDelete}
          className="border-2 border-black text-black p-2 rounded ml-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default withAuth(DeleteConfirmationModal, true, true);
