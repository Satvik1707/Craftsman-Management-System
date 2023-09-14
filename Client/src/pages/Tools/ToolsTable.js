import { useState, useEffect } from 'react';
import ToolRow from '../../components/ToolRow';
import withAuth from '../../utils/withAuth';
const ToolsTable = ({
  tools,
  editToolId,
  handleToolInputChange,
  handleDeleteTool,
  handleEditTool,
  handleSaveTool,
}) => {
  const [sortedTools, setSortedTools] = useState([]);

  useEffect(() => {
    setSortedTools([...tools].sort((a, b) => a.tool_id - b.tool_id));
  }, [self, tools]);

  return (
    <table className="w-full bg-white shadow-md rounded-md table-auto">
      <thead className="sticky top-0 bg-white shadow-md z-10">
        <tr className="text-gray-600 uppercase text-sm leading-normal">
          <th className="py-2 px-6 text-left">Tool ID</th>
          <th className="py-2 px-6 text-left" colSpan="3">
            Tool Name
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-base">
        {sortedTools.map((tool) => {
          return (
            <ToolRow
              key={tool.tool_id}
              tool={tool}
              handleToolInputChange={handleToolInputChange}
              handleDeleteTool={handleDeleteTool}
              editToolId={editToolId}
              handleEditTool={handleEditTool}
              handleSaveTool={handleSaveTool}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default withAuth(ToolsTable, true);
