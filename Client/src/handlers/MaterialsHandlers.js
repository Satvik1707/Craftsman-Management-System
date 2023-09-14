import {
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from '../utils/api/materials';
import { getCookie } from '../utils/cookies';
const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;
const token = getCookie('token');
export const handleConfirmDeleteMaterial = async (
  materialToDelete,
  setMaterialToDelete,
  setMaterials,
  setShowDeleteConfirmationModal,
  materials
) => {
  try {
    const response = await deleteMaterial(SERVER_URL, token, materialToDelete);
    setMaterials(
      materials.filter((material) => material.material_id !== materialToDelete)
    );
    setShowDeleteConfirmationModal(false);
    setMaterialToDelete(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while deleting material:', error.message);
    }
  }
};

export const handleCancelDeleteMaterial = (
  setShowDeleteConfirmationModal,
  setMaterialToDelete
) => {
  setShowDeleteConfirmationModal(false);
  setMaterialToDelete(null);
};

export const handleAddMaterial = async (
  newMaterial,
  setMaterials,
  setNewMaterial,
  setShowAddMaterialModal,
  materials
) => {
  try {
    const response = await addMaterial(SERVER_URL, token, {
      material_id: generateMaterialId(materials),
      material_name: newMaterial.material_name,
    });
    setMaterials([...materials, ...response.data]);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while adding material:', error.message);
    }
  }
  setNewMaterial({ material_id: '', material_name: '' });
  setShowAddMaterialModal(false);
};

export const handleMaterialInputChange = (
  e,
  materialId,
  setMaterials,
  materials
) => {
  const { name, value } = e.target;
  setMaterials(
    materials.map((material) =>
      material.material_id === materialId
        ? { ...material, [name]: value }
        : material
    )
  );
};

export const handleEditMaterial = (materialId, setEditMaterialId) => {
  setEditMaterialId(materialId);
};

export const handleSaveMaterial = async (
  materialId,
  setEditMaterialId,
  materials
) => {
  try {
    const materialToSave = materials.find(
      (material) => material.material_id === materialId
    );
    await updateMaterial(SERVER_URL, token, materialId, materialToSave);
    setEditMaterialId(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while saving material:', error.message);
    }
  }
};

export const handleDeleteMaterial = (
  materialId,
  setMaterialToDelete,
  setShowDeleteConfirmationModal
) => {
  setMaterialToDelete(materialId);
  setShowDeleteConfirmationModal(true);
};

export const generateMaterialId = (materials) => {
  const materialIds = materials.map((material) => material.material_id);
  let newMaterialId = Math.floor(Math.random() * 1000);
  while (materialIds.includes(newMaterialId)) {
    newMaterialId = Math.floor(Math.random() * 1000);
  }
  return newMaterialId;
};
