import React, { useState } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import withAuth from '../utils/withAuth';
const ToolRow = ({
  tool,
  handleToolInputChange,
  handleDeleteTool,
  editToolId,
  handleEditTool,
  handleSaveTool,
}) => {
  const [tool_1,setTool_1] = useState(tool);
  return (
    <>
      <tr
        key={tool.tool_id}
        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
      >
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {tool.tool_id}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editToolId === tool.tool_id ? (
            <input
              type="text"
              name="tool_name"
              // value={tool.tool_name}
              onChange={(e) => handleToolInputChange(e, tool.tool_id)}
              className="border-2 border-gray-300 px-2 rounded"
            />
          ) : (
            <span className="text-gray-800">{tool_1.tool_name}</span>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editToolId === tool.tool_id ? (
            <button
              onClick={() => handleSaveTool(tool_1.tool_id)}
              className=" text-green-500 px-2 rounded"
            >
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => handleEditTool(tool.tool_id)}
              className=" text-yellow-500 px-2 rounded"
            >
              <FaEdit />
            </button>
          )}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          <button
            onClick={() => handleDeleteTool(tool.tool_id)}
            className=" text-red-500 px-2 rounded"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};

export default withAuth(ToolRow, true);
