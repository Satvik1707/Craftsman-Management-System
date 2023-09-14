import { useState, useEffect } from 'react';
import { fetchMaterialsData } from '../utils/api/materials';

export const useMaterials = (SERVER_URL, token) => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetchMaterialsData(SERVER_URL, token);
        setMaterials(response);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };

    fetchMaterials();
  }, [SERVER_URL, token]);

  return [materials, setMaterials];
};
