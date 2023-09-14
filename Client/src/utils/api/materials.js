import axios from 'axios';

const fetchMaterialsData = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/materials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const addMaterial = async (SERVER_URL, token, newMaterial) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}api/materials/add`,
      newMaterial,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

const updateMaterial = async (
  SERVER_URL,
  token,
  materialId,
  updatedMaterial
) => {
  try {
    await axios.put(`${SERVER_URL}api/materials/`, updatedMaterial, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return error;
  }
};

const deleteMaterial = async (SERVER_URL, token, materialId) => {
  try {
    await axios.post(
      `${SERVER_URL}api/materials/`,
      {
        material_id: materialId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    return error;
  }
};

export { fetchMaterialsData, addMaterial, updateMaterial, deleteMaterial };
