import { useState, useEffect } from 'react';
import MaterialRow from '../../components/MaterialRow';
import withAuth from '../../utils/withAuth';
const MaterialsTable = ({
  materials,
  editMaterialId,
  handleMaterialInputChange,
  handleDeleteMaterial,
  handleEditMaterial,
  handleSaveMaterial,
}) => {
  const [sortedMaterials, setSortedMaterials] = useState([]);

  useEffect(() => {
    setSortedMaterials(
      [...materials].sort((a, b) => a.material_id - b.material_id)
    );
  }, [materials]);

  return (
    <table className="w-full bg-white shadow-md rounded-md table-auto">
      <thead className="sticky top-0 bg-white shadow-md z-10">
        <tr className="text-gray-600 uppercase text-sm leading-normal">
          <th className="py-2 px-6 text-left">Material ID</th>
          <th className="py-2 px-6 text-left" colSpan="3">
            Material Name
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-base">
        {sortedMaterials.map((material) => {
          return (
            <MaterialRow
              key={material.material_id}
              material={material}
              handleMaterialInputChange={handleMaterialInputChange}
              handleDeleteMaterial={handleDeleteMaterial}
              editMaterialId={editMaterialId}
              handleEditMaterial={handleEditMaterial}
              handleSaveMaterial={handleSaveMaterial}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default withAuth(MaterialsTable, true);
