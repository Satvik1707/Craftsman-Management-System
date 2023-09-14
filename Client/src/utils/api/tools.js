import axios from 'axios';

const fetchToolsData = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/tools`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const addTool = async (SERVER_URL, token, newTool) => {
  try {
    const response = await axios.post(`${SERVER_URL}api/tools/add`, newTool, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const updateTool = async (SERVER_URL, token, toolId, updatedTool) => {
  try {
    await axios.put(`${SERVER_URL}api/tools/`, updatedTool, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return error;
  }
};

const deleteTool = async (SERVER_URL, token, toolId) => {
  try {
    await axios.post(
      `${SERVER_URL}api/tools/`,
      {
        tool_id: toolId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    return error;
  }
};

export { fetchToolsData, addTool, updateTool, deleteTool };
