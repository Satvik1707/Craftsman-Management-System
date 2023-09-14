import { useState, useContext } from 'react';
import withAuth from '../../utils/withAuth';
import AddIssueModal from '../../components/Modals/AddIssueModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import IssuesTable from './IssuesTable';
import { useIssues } from '../../hooks/useIssues';
import { AuthContext } from '../../context/authContext';
import {
  handleConfirmDeleteIssue,
  handleCancelDeleteIssue,
  handleAddIssue,
  handleIssueInputChange,
  handleEditIssue,
  handleSaveIssue,
  handleDeleteIssue,
} from '../../handlers/IssuesHandlers';
const Issues = () => {
  const { SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [issues, setIssues] = useIssues(SERVER_URL, token);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [editIssueId, setEditIssueId] = useState(null);
  const [newIssue, setNewIssue] = useState({
    issue_id: '',
    issue_name: '',
  });

  const handleConfirmDelete = () => {
    handleConfirmDeleteIssue(
      issueToDelete,
      setIssueToDelete,
      setIssues,
      setShowDeleteConfirmationModal,
      issues
    );
  };

  const handleCancelDelete = () => {
    handleCancelDeleteIssue(setShowDeleteConfirmationModal, setIssueToDelete);
  };

  const handleInputChange = (e, issueId) => {
    // setIssues(issues)
    handleIssueInputChange(e, issueId, setIssues, issues);
  };

  const handleAdd = () => {
    handleAddIssue(
      newIssue,
      setIssues,
      setNewIssue,
      setShowAddIssueModal,
      issues
    );
  };

  const handleEdit = (issueId) => {
    handleEditIssue(issueId, setEditIssueId);
  };

  const handleSave = (issueId) => {
    handleSaveIssue(issueId, setEditIssueId, issues);
  };

  const handleDelete = (issueId) => {
    handleDeleteIssue(
      issueId,
      setIssueToDelete,
      setShowDeleteConfirmationModal
    );
  };

  const handleEditName = (issueId, newName) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        return { ...issue, name: newName };
      }
      return issue;
    });
    setIssues(updatedIssues);
  };


  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="text-4xl font-semibold mb-4">Issue Management</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddIssueModal(true)}
            className="border-2 border-blue-500 text-blue-500 p-2 rounded mb-4"
          >
            Add New Issue
          </button>
        )}
      </div>
      {isAdmin && showAddIssueModal && (
        <AddIssueModal
          newIssue={newIssue}
          setNewIssue={setNewIssue}
          setShowAddIssueModal={setShowAddIssueModal}
          handleAddIssue={handleAdd}
        />
      )}
      <h2 className="text-2xl font-semibold mb-4">Issues List</h2>
      <div className="flex-1 overflow-y-scroll">
        <IssuesTable
          issues={issues}
          editIssueId={editIssueId}
          handleIssueInputChange={handleInputChange}
          handleDeleteIssue={handleDelete}
          handleEditIssue={handleEdit}
          handleSaveIssue={handleSave}
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

export default withAuth(Issues, true, true);