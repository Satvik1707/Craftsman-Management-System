import { addIssue, updateIssue, deleteIssue } from '../utils/api/issues';
import { getCookie } from '../utils/cookies';
const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;
const token = getCookie('token');
export const handleConfirmDeleteIssue = async (
  issueToDelete,
  setIssueToDelete,
  setIssues,
  setShowDeleteConfirmationModal,
  issues
) => {
  try {
    const response = await deleteIssue(SERVER_URL, token, issueToDelete);
    setIssues(issues.filter((issue) => issue.issue_id !== issueToDelete));
    setShowDeleteConfirmationModal(false);
    setIssueToDelete(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while deleting issue:', error.message);
    }
  }
};

export const handleCancelDeleteIssue = (
  setShowDeleteConfirmationModal,
  setIssueToDelete
) => {
  setShowDeleteConfirmationModal(false);
  setIssueToDelete(null);
};

export const handleAddIssue = async (
  newIssue,
  setIssues,
  setNewIssue,
  setShowAddIssueModal,
  issues
) => {
  try {
    const response = await addIssue(SERVER_URL, token, {
      issue_id: generateIssueId(issues),
      issue_name: newIssue.issue_name,
      issue_type: newIssue.issue_type,
      issue_color: newIssue.issue_color,
    });
    setIssues([...issues, ...response.data]);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while adding issue:', error.message);
    }
  }
  setNewIssue({ issue_id: '', issue_name: '' });
  setShowAddIssueModal(false);
};

export const handleIssueInputChange = (e, issueId, setIssues, issues) => {
  // const element = e.target
  const { name, value } = e.target;
  // console.log(e);

  setIssues(
    issues.map((issue) =>
      issue.issue_id === issueId ? { ...issue, [name]: value } : issue
    )
  );
};

export const handleEditIssue = (issueId, setEditIssueId) => {
  setEditIssueId(issueId);
};

export const handleSaveIssue = async (issueId, setEditIssueId, issues) => {
  try {
    const issueToSave = issues.find((issue) => issue.issue_id === issueId);
    await updateIssue(SERVER_URL, token, issueId, issueToSave);
    setEditIssueId(null);
  } catch (error) {
    if (error.response) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else {
      console.error('Error while saving issue:', error.message);
    }
  }
};

export const handleDeleteIssue = (
  issueId,
  setIssueToDelete,
  setShowDeleteConfirmationModal
) => {
  setIssueToDelete(issueId);
  setShowDeleteConfirmationModal(true);
};

export const generateIssueId = (issues) => {
  const issueIds = issues.map((issue) => issue.issue_id);
  let newIssueId = Math.floor(Math.random() * 1000);
  while (issueIds.includes(newIssueId)) {
    newIssueId = Math.floor(Math.random() * 1000);
  }
  return newIssueId;
};
