import React from 'react';
import withAuth from '../../utils/withAuth';
import { useState } from 'react';
const AddMaterialModal = ({
  newMaterial,
  setNewMaterial,
  setShowAddMaterialModal,
  handleAddMaterial,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Material</h2>
        <input
          type="text"
          name="material_name"
          autoFocus
          value={newMaterial.material_name}
          onChange={handleChange}
          placeholder="Material Name"
          className="border-2 border-gray-300 p-2 rounded mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={() => {
              setButtonDisabled(true);
              handleAddMaterial();
            }}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Add Material
          </button>
          <button
            onClick={() => {
              setShowAddMaterialModal(false);
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

export default withAuth(AddMaterialModal, true, true);
