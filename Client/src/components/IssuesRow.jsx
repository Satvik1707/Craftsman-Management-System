import React from 'react';
import withAuth from '../utils/withAuth';
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaExclamationCircle,
  FaShieldAlt,
  FaHammer,
  FaTools,
  FaWrench,
  FaBatteryEmpty,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';

const issueColorMap = {
  Green: 'bg-green-700',
  Yellow: 'bg-yellow-700',
  Red: 'bg-red-700',
  Blue: 'bg-blue-900',
  Brown: 'bg-red-900',
  Black: 'bg-black',
  Orange: 'bg-orange-700',
};

const IssueRow = ({
  issue,
  handleIssueInputChange,
  handleDeleteIssue,
  editIssueId,
  handleEditIssue,
  handleSaveIssue,
}) => {
  const issueColor = issue.issue_color || 'Green';
  const issueType = issue.issue_type || 'Defect';

  return (
    <>
      <tr
        key={issue.issue_id}
        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
      >
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {issue.issue_id}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editIssueId === issue.issue_id ? (
            <input
              type="text"
              name="issue_name"
              value={issue.issue_name}
              onChange={(e) => handleIssueInputChange(e, issue.issue_id)}
              className="border-2 border-gray-300 px-2 rounded"
              style={{ color: issueColorMap[issueColor] }}
            />
          ) : (
            <span
              className={`inline-flex items-center justify-center px-2 py-1 text-sm text-white rounded-lg ${issueColorMap[issueColor]}`}
            >
              {issueType === 'Defect' && (
                <FaExclamationCircle className="mr-1" />
              )}
              {issueType === 'Theft' && <FaShieldAlt className="mr-2" />}
              {issueType === 'Vandalism' && <FaHammer className="mr-2" />}
              {issueType === 'New_Installation' && <FaTools className="mr-2" />}
              {issueType === 'Maintenance' && <FaWrench className="mr-2" />}
              {issueType === 'Battery_Empty' && (
                <FaBatteryEmpty className="mr-2" />
              )}
              {issueType === 'Sensor_Soiled' && (
                <FaTimesCircle className="mr-2" />
              )}
              {issueType === 'Bad_Measurement_Result' && (
                <FaChartLine className="mr-2" />
              )}
              {issue.issue_name}
            </span>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editIssueId === issue.issue_id ? (
            <button
              onClick={() => handleSaveIssue(issue.issue_id)}
              className="text-green-500 px-2 rounded"
            >
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => handleEditIssue(issue.issue_id)}
              className="text-yellow-500 px-2 rounded"
            >
              <FaEdit />
            </button>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          <button
            onClick={() => handleDeleteIssue(issue.issue_id)}
            className="text-red-500 px-2 rounded"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};

export default withAuth(IssueRow, true);
