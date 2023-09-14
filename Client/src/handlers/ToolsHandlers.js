import { addTool, updateTool, deleteTool } from '../utils/api/tools';
import { getCookie } from '../utils/cookies';
const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;
const token = getCookie('token');

export const handleConfirmDeleteTool = async (
  toolToDelete,
  setToolToDelete,
  setTools,
  setShowDeleteConfirmationModal,
  tools
) => {
  try {
    const response = await deleteTool(SERVER_URL, token, toolToDelete);
    setTools(tools.filter((tool) => tool.tool_id !== toolToDelete));
    setShowDeleteConfirmationModal(false);
    setToolToDelete(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while deleting tool:', error.message);
    }
  }
};

export const handleCancelDeleteTool = (
  setShowDeleteConfirmationModal,
  setToolToDelete
) => {
  setShowDeleteConfirmationModal(false);
  setToolToDelete(null);
};

export const handleAddTool = async (
  newTool,
  setTools,
  setNewTool,
  setShowAddToolModal,
  tools
) => {
  try {
    const response = await addTool(SERVER_URL, token, {
      tool_id: generateToolId(tools),
      tool_name: newTool.tool_name,
    });
    setTools([...tools, ...response.data]);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while adding tool:', error.message);
    }
  }
  setNewTool({ tool_id: '', tool_name: '' });
  setShowAddToolModal(false);
};

export const handleToolInputChange = (e, toolId, setTools, tools) => {
  const { name, value } = e.target;

  setTools(
    tools.map((tool) =>
      tool.tool_id === toolId ? { ...tool, [name]: value } : tool
    )
  );
};


export const handleEditTool = (toolId, setEditToolId) => {
  setEditToolId(toolId);
};

export const handleSaveTool = async (toolId, setEditToolId, tools) => {
  try {
    const toolToSave = tools.find((tool) => tool.tool_id === toolId);
    await updateTool(SERVER_URL, token, toolId, toolToSave);
    setEditToolId(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while saving tool:', error.message);
    }
  }
};

export const handleDeleteTool = (
  toolId,
  setToolToDelete,
  setShowDeleteConfirmationModal
) => {
  setToolToDelete(toolId);
  setShowDeleteConfirmationModal(true);
};

export const generateToolId = (tools) => {
  const toolIds = tools.map((tool) => tool.tool_id);
  let newToolId = Math.floor(Math.random() * 1000);
  while (toolIds.includes(newToolId)) {
    newToolId = Math.floor(Math.random() * 1000);
  }
  return newToolId;
};
