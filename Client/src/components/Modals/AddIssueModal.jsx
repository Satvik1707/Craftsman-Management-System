import React, { useState } from 'react';
import {
  FaExclamationCircle,
  FaShieldAlt,
  FaHammer,
  FaTools,
  FaWrench,
  FaBatteryEmpty,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';
import withAuth from '../../utils/withAuth';
import Select from 'react-select';
import { components } from 'react-select';

const AddIssueModal = ({
  newIssue,
  setNewIssue,
  setShowAddIssueModal,
  handleAddIssue,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Green');

  const Option = (props) => (
    <components.Option {...props}>
      <span className="flex items-center">
        {props.data.icon}&nbsp;&nbsp;{props.label}
      </span>
    </components.Option>
  );
  const issueTypes = [
    { value: 'Defect', label: 'Defect', icon: <FaExclamationCircle /> },
    { value: 'Theft', label: 'Theft', icon: <FaShieldAlt /> },
    { value: 'Vandalism', label: 'Vandalism', icon: <FaHammer /> },
    {
      value: 'New_Installation',
      label: 'New Installation',
      icon: <FaTools />,
    },
    { value: 'Maintenance', label: 'Maintenance', icon: <FaWrench /> },
    {
      value: 'Battery_Empty',
      label: 'Battery Empty',
      icon: <FaBatteryEmpty />,
    },
    {
      value: 'Sensor_Soiled',
      label: 'Sensor Soiled',
      icon: <FaTimesCircle />,
    },
    {
      value: 'Bad_Measurement_Result',
      label: 'Bad Measurement Result',
      icon: <FaChartLine />,
    },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const handleColorChange = (color) => {
    if (color === selectedColor) {
      setSelectedColor('');
    } else {
      setSelectedColor(color);
      setNewIssue({ ...newIssue, issue_color: color });
    }
  };

  const handleTypeChange = (type) => {
    setNewIssue({ ...newIssue, issue_type: type });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Issue</h2>
        <input
          type="text"
          autoFocus
          name="issue_name"
          value={newIssue.issue_name}
          onChange={handleChange}
          required
          placeholder="Issue Name"
          className="border-2 border-gray-300 p-2 rounded mb-4 w-full"
        />
        <Select
          name="issue_type"
          required
          value={issueTypes.find(
            (issueType) => issueType.value === newIssue.issue_type
          )}
          onChange={(selectedOption) => {
            handleTypeChange(selectedOption ? selectedOption.value : '');
          }}
          className="rounded mb-4 w-full"
          options={issueTypes}
          components={{ Option }}
        />
        <div className="flex mb-4">
          <div
            className={`w-8 h-8 rounded-full bg-green-700 mr-2 cursor-pointer ${
              selectedColor === 'Green' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Green')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-yellow-700 mr-2 cursor-pointer ${
              selectedColor === 'Yellow' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Yellow')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-red-700 mr-2 cursor-pointer ${
              selectedColor === 'Red' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Red')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-blue-900 mr-2 cursor-pointer ${
              selectedColor === 'Blue' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Blue')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-red-900 mr-2 cursor-pointer ${
              selectedColor === 'Brown' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Brown')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-black mr-2 cursor-pointer ${
              selectedColor === 'Black' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Black')}
          ></div>
          <div
            className={`w-8 h-8 rounded-full bg-orange-700 mr-2 cursor-pointer ${
              selectedColor === 'Orange' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => handleColorChange('Orange')}
          ></div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setButtonDisabled(true);
              handleAddIssue();
            }}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Add Issue
          </button>
          <button
            onClick={() => {
              setShowAddIssueModal(false);
            }}
            disabled={buttonDisabled}
            className="bg-gray-300 text-black p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddIssueModal, true, true);
