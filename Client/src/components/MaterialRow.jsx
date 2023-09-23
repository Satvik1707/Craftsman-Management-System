import React, { useState } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import withAuth from '../utils/withAuth';
const MaterialRow = ({
  material,
  handleMaterialInputChange,
  handleDeleteMaterial,
  editMaterialId,
  handleEditMaterial,
  handleSaveMaterial,
}) => {
  return (
    <>
      <tr
        key={material.material_id}
        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
      >
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {material.material_id}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editMaterialId === material.material_id ? (
            <input
              type="text"
              name="material_name"
              // value={material.material_name}
              onChange={(e) =>
                handleMaterialInputChange(e, material.material_id)
              }
              className="border-2 border-gray-300 px-2 rounded"
            />
          ) : (
            <span className="text-gray-800">{material.material_name}</span>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editMaterialId === material.material_id ? (
            <button
              onClick={() => handleSaveMaterial(material.material_id)}
              className=" text-green-500 px-2 rounded"
            >
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => handleEditMaterial(material.material_id)}
              className=" text-yellow-500 px-2 rounded"
            >
              <FaEdit />
            </button>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          <button
            onClick={() => handleDeleteMaterial(material.material_id)}
            className=" text-red-500 px-2 rounded"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};

export default withAuth(MaterialRow, true);
