import { useState, useContext } from 'react';
import withAuth from '../../utils/withAuth';
import AddToolModal from '../../components/Modals/AddToolModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import ToolsTable from './ToolsTable';
import { useTools } from '../../hooks/useTools';
import { AuthContext } from '../../context/authContext';
import {
  handleConfirmDeleteTool,
  handleCancelDeleteTool,
  handleAddTool,
  handleToolInputChange,
  handleEditTool,
  handleSaveTool,
  handleDeleteTool,
} from '../../handlers/ToolsHandlers';
const Tools = () => {
  const { SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [tools, setTools] = useTools(SERVER_URL, token);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [editToolId, setEditToolId] = useState(null);
  const [newTool, setNewTool] = useState({
    tool_id: '',
    tool_name: '',
  });

  const handleConfirmDelete = () => {
    handleConfirmDeleteTool(
      toolToDelete,
      setToolToDelete,
      setTools,
      setShowDeleteConfirmationModal,
      tools
    );
  };

  const handleCancelDelete = () => {
    handleCancelDeleteTool(setShowDeleteConfirmationModal, setToolToDelete);
  };

  const handleInputChange = (e, toolId) => {
    handleToolInputChange(e, toolId, setTools, tools);
  };

  const handleAdd = () => {
    handleAddTool(newTool, setTools, setNewTool, setShowAddToolModal, tools);
  };
  const handleEdit = (toolId) => {
    handleEditTool(toolId, setEditToolId);
  };

  const handleSave = (toolId) => {
    handleSaveTool(toolId, setEditToolId, tools);
  };

  const handleDelete = (toolId) => {
    handleDeleteTool(toolId, setToolToDelete, setShowDeleteConfirmationModal);
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="text-4xl font-semibold mb-4">Tool Management</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddToolModal(true)}
            className="border-2 border-blue-500 text-blue-500 p-2 rounded mb-4"
          >
            Add New Tool
          </button>
        )}
      </div>
      {isAdmin && showAddToolModal && (
        <AddToolModal
          newTool={newTool}
          setNewTool={setNewTool}
          setShowAddToolModal={setShowAddToolModal}
          handleAddTool={handleAdd}
        />
      )}
      <h2 className="text-2xl font-semibold mb-4">Tools List</h2>
      <div className="flex-1 overflow-y-scroll">
        <ToolsTable
          tools={tools}
          editToolId={editToolId}
          handleToolInputChange={handleInputChange}
          handleDeleteTool={handleDelete}
          handleEditTool={handleEdit}
          handleSaveTool={handleSave}
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

export default withAuth(Tools, true, true);
