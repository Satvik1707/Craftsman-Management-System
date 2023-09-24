import React from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import withAuth from '../utils/withAuth';
import Link from 'next/link';
import moment from 'moment';

const RouteRow = ({
  route,
  unassigned,
  editRouteId,
  handleRouteInputChange,
  handleEditRoute,
  handleSaveRoute,
  handleDeleteRoute,
  handleUserClick,
  getUsernameById,
  users,
  isAdmin,
  isRouteComplete
}) => {

  const isRouteCompleted = isRouteComplete;
  return (
    <>
      <tr
        key={route.route_id}
        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
      >
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {route.route_id}
        </td>
        <td className="py-2 px-6 text-left whitespace-nowrap">
          {editRouteId === route.route_id ? (
            <input
              type="text"
              name="route_name"
              value={route.route_name}
              onChange={(e) => handleRouteInputChange(e, route.route_id)}
              className="border-2 border-gray-300 px-2 rounded"
            />
          ) : (
            <Link
              href={{
                pathname: `/Routes/ManageRoute`,
                query: { routeId: route.route_id },
              }}
              className="text-blue-800 hover:text-blue-600 underline cursor-pointer"
            >
              {route.route_name}
            </Link>
          )}
        </td>

        {!unassigned && isAdmin && (
          <>
            <td className="py-2 px-6 text-left whitespace-nowrap">
              {editRouteId === route.route_id ? (
                <select
                  name="employee_id"
                  value={route.employee_id}
                  onChange={(e) => {
                    handleRouteInputChange(e, route.route_id);
                  }}
                  className="border-2 border-gray-300 px-2 rounded"
                >
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.user_id}: {user.username}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  onClick={() => {
                    isAdmin && handleUserClick(route.employee_id);
                  }}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  {getUsernameById(route.employee_id)}
                </span>
              )}
            </td>
          </>
        )}
        {unassigned && (
          <td className="py-2 px-6 text-left whitespace-nowrap">
            {moment(route.created_at).fromNow()}
          </td>
        )}
<td className="py-2 px-6 text-left whitespace-nowrap">
  <span
    className={`uppercase text-white text-xs font-semibold px-2 rounded-full py-1 ${
      isRouteCompleted
        ? 'bg-green-700' // Green background for Completed
        : !unassigned
        ? 'bg-red-800' // Red background for Pending
        : 'bg-yellow-600' // Yellow background for Unassigned
    }`}
  >
    {unassigned
      ? 'Unassigned'
      : isRouteCompleted
      ? 'Completed'
      : route.status}
  </span>
</td>

        {isAdmin && (
          <>
            <td className="py-2 px-6 text-left whitespace-nowrap">
              {editRouteId === route.route_id ? (
                <button
                  onClick={() => {
                    handleSaveRoute(route.route_id);
                  }}
                  className=" text-green-500 px-2 rounded"
                >
                  <FaSave />
                </button>
              ) : (
                <button
                  onClick={() => handleEditRoute(route.route_id)}
                  className=" text-yellow-500 px-2 rounded"
                >
                  <FaEdit />
                </button>
              )}
            </td>
            <td className="py-2 px-6 text-left whitespace-nowrap">
              <button
                onClick={() => handleDeleteRoute(route.route_id)}
                className=" text-red-500 px-2 rounded"
              >
                <FaTrash />
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default withAuth(RouteRow);
