import axios from 'axios';

const fetchIssuesData = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/issues`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const addIssue = async (SERVER_URL, token, newIssue) => {
  try {
    const response = await axios.post(`${SERVER_URL}api/issues/add`, newIssue, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const updateIssue = async (SERVER_URL, token, issueId, updatedIssue) => {
  try {
    await axios.put(`${SERVER_URL}api/issues/`, updatedIssue, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return error;
  }
};

const deleteIssue = async (SERVER_URL, token, issueId) => {
  try {
    await axios.post(
      `${SERVER_URL}api/issues/`,
      {
        issue_id: issueId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    return error;
  }
};

export { fetchIssuesData, addIssue, updateIssue, deleteIssue };
