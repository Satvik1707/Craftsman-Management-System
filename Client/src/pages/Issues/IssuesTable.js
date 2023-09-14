import { useState, useEffect } from 'react';
import IssueRow from '../../components/IssuesRow';
import withAuth from '../../utils/withAuth';
const IssuesTable = ({
  issues,
  editIssueId,
  handleIssueInputChange,
  handleDeleteIssue,
  handleEditIssue,
  handleSaveIssue,
}) => {
  const [sortedIssues, setSortedIssues] = useState([]);

  useEffect(() => {
    setSortedIssues([...issues].sort((a, b) => a.issue_id - b.issue_id));
  }, [issues]);

  return (
    <table className="w-full bg-white shadow-md rounded-md table-auto">
      <thead className="sticky top-0 bg-white shadow-md z-20">
        <tr className="text-gray-600 uppercase text-sm leading-normal">
          <th className="py-2 px-6 text-left">Issue ID</th>
          <th className="py-2 px-6 text-left" colSpan="3">Issue Name</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-base ">
        {sortedIssues.map((issue) => {
          return (
            <IssueRow
              key={issue.issue_id}
              issue={issue}
              handleIssueInputChange={handleIssueInputChange}
              handleDeleteIssue={handleDeleteIssue}
              editIssueId={editIssueId}
              handleEditIssue={handleEditIssue}
              handleSaveIssue={handleSaveIssue}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default withAuth(IssuesTable, true);
