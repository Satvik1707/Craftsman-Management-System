import { useState, useContext } from 'react';
import withAuth from '../../utils/withAuth';
import AddMaterialModal from '../../components/Modals/AddMaterialModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import MaterialsTable from './MaterialsTable';
import { useMaterials } from '../../hooks/useMaterials';
import { AuthContext } from '../../context/authContext';
import {
  handleConfirmDeleteMaterial,
  handleCancelDeleteMaterial,
  handleAddMaterial,
  handleMaterialInputChange,
  handleEditMaterial,
  handleSaveMaterial,
  handleDeleteMaterial,
} from '../../handlers/MaterialsHandlers';
const Materials = () => {
  const { SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [materials, setMaterials] = useMaterials(SERVER_URL, token);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    material_id: '',
    material_name: '',
  });

  const handleConfirmDelete = () => {
    handleConfirmDeleteMaterial(
      materialToDelete,
      setMaterialToDelete,
      setMaterials,
      setShowDeleteConfirmationModal,
      materials
    );
  };

  const handleCancelDelete = () => {
    handleCancelDeleteMaterial(
      setShowDeleteConfirmationModal,
      setMaterialToDelete
    );
  };

  const handleInputChange = (e, materialId) => {
    handleMaterialInputChange(e, materialId, setMaterials, materials);
  };

  const handleAdd = () => {
    handleAddMaterial(
      newMaterial,
      setMaterials,
      setNewMaterial,
      setShowAddMaterialModal,
      materials
    );
  };
  const handleEdit = (materialId) => {
    handleEditMaterial(materialId, setEditMaterialId);
  };

  const handleSave = (materialId) => {
    handleSaveMaterial(materialId, setEditMaterialId, materials);
  };

  const handleDelete = (materialId) => {
    handleDeleteMaterial(
      materialId,
      setMaterialToDelete,
      setShowDeleteConfirmationModal
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="text-4xl font-semibold mb-4">Material Management</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="border-2 border-blue-500 text-blue-500 p-2 rounded mb-4"
          >
            Add New Material
          </button>
        )}
      </div>
      {isAdmin && showAddMaterialModal && (
        <AddMaterialModal
          newMaterial={newMaterial}
          setNewMaterial={setNewMaterial}
          setShowAddMaterialModal={setShowAddMaterialModal}
          handleAddMaterial={handleAdd}
        />
      )}
      <h2 className="text-2xl font-semibold mb-4">Materials List</h2>
      <div className="flex-1 overflow-y-scroll">
        <MaterialsTable
          materials={materials}
          editMaterialId={editMaterialId}
          handleMaterialInputChange={handleInputChange}
          handleDeleteMaterial={handleDelete}
          handleEditMaterial={handleEdit}
          handleSaveMaterial={handleSave}
        />
        {isAdmin && showDeleteConfirmationModal && (
          <DeleteConfirmationModal
            handleConfirmDelete={handleConfirmDelete}
            handleCancelDelete={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(Materials, true, true);
