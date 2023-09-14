import React from 'react';
import withAuth from '../../utils/withAuth';
import { useState } from 'react';
const AddToolModal = ({
  newTool,
  setNewTool,
  setShowAddToolModal,
  handleAddTool,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTool({ ...newTool, [name]: value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Tool</h2>
        <input
          type="text"
          name="tool_name"
          autoFocus
          value={newTool.tool_name}
          onChange={handleChange}
          placeholder="Tool Name"
          className="border-2 border-gray-300 p-2 rounded mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={() => {
              setButtonDisabled(true);
              handleAddTool();
            }}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Add Tool
          </button>
          <button
            onClick={() => {
              setShowAddToolModal(false);
            }}
            disabled={buttonDisabled}
            className="bg-gray-300 text-black p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddToolModal, true, true);
