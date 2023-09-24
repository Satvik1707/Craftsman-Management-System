import { useState, useContext, useEffect } from 'react';
import { useUsers } from '../../hooks/useUser';
import withAuth from '../../utils/withAuth';
import CreateRouteModal from '../../components/Modals/CreateRouteModal';
import UserDetailsModal from '../../components/Modals/UserDetailsModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import RouteRow from '../../components/RouteRow';
import { useRoutes } from '../../hooks/useRoutes';
import Loading from '../../components/Loading';
import { AuthContext } from '../../context/authContext';
import {
  handleEditRoute,
  handleSaveRoute,
  handleDeleteRoute,
  handleConfirmDeleteRoute,
  handleCancelDeleteRoute,
  handleRouteInputChange,
  handleCreateRoute,
  handleFetchTasksRoutes
} from '../../handlers/RoutesHandlers';

const Routes = () => {

  const { currentUser, SERVER_URL, token, isAdmin } = useContext(AuthContext);

  const [routes, setRoutes] = useRoutes(SERVER_URL, token);
  
  const [users, setUsers] = useUsers(SERVER_URL, token);
  
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);
  
  const [newRouteName, setNewRouteName] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  
  const [editRouteId, setEditRouteId] = useState(null);
  
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);



  const [routeToDelete, setRouteToDelete] = useState(null);

  const handleEdit = (routeId) => {
    handleEditRoute(routeId, setEditRouteId);
  };

  const handleSave = (routeId) => {
    handleSaveRoute(routeId, routes, setRoutes, setEditRouteId);
  };

  const handleDelete = (routeId) => {
    handleDeleteRoute(
      routeId,
      setRouteToDelete,
      setShowDeleteConfirmationModal
    );
  };

  const handleConfirmDelete = () => {
    handleConfirmDeleteRoute(
      routeToDelete,
      routes,
      setRoutes,
      setShowDeleteConfirmationModal,
      setRouteToDelete
    );
  };

  const handleCancelDelete = () => {
    handleCancelDeleteRoute(setShowDeleteConfirmationModal, setRouteToDelete);
  };

  const handleInputChange = (e, routeId) => {
    handleRouteInputChange(e, routeId, routes, setRoutes);
  };

  const handleCreate = () => {
    handleCreateRoute(
      newRouteName,
      routes,
      setRoutes,
      setNewRouteName,
      setShowCreateRouteModal
    );
  };
  
  const handleUserClick = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    if (user) {
      setSelectedUser(user);
      setShowUserDetailsModal(true);
    }
  };

  const getUsernameById = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.username : '';
  };


  const [tasks, setTasks] = useState([]);

  const fetchTasksForRoute = async (routeId) => {
    try {
      const response = await fetch(`${SERVER_URL}api/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the bearer token in the headers
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data); 
      } else {
        console.error('Error fetching tasks');
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    
    if (routes && routes.length > 0) {
      
      const firstRouteId = routes[0].route_id;
      fetchTasksForRoute(firstRouteId);
    }
  }, [routes]);

  const isRouteComplete = tasks.every((task) => task.status === "complete");
  console.log(isRouteComplete)

  const renderRouteRow = (route, unassigned = false) => {
    return (
      <RouteRow
        key={route.route_id}
        route={route}
        unassigned={unassigned}
        editRouteId={editRouteId}
        handleRouteInputChange={handleInputChange}
        handleEditRoute={handleEdit}
        handleSaveRoute={handleSave}
        handleDeleteRoute={handleDelete}
        handleUserClick={handleUserClick}
        getUsernameById={getUsernameById}
        users={users}
        isAdmin={isAdmin}
        isRouteComplete={isRouteComplete}
      />
    );
  };
  if (!currentUser || !SERVER_URL || !token || !routes) return <Loading />;
  return (
    <>
      <div>
        <h1 className="md:text-4xl text-3xl font-semibold mb-4">
          Route Management
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowCreateRouteModal(true)}
            className="border-2 border-blue-500 text-blue-500 p-2 rounded mb-4"
          >
            Create New Route
          </button>
        )}
      </div>
      {isAdmin && showCreateRouteModal && (
        <CreateRouteModal
          newRouteName={newRouteName}
          setNewRouteName={setNewRouteName}
          setShowCreateRouteModal={setShowCreateRouteModal}
          handleCreateRoute={handleCreate}
        />
      )}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Assigned Routes</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-md">
            <thead>
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-6 text-left">Route ID</th>
                <th className="py-2 px-6 text-left">Route Name</th>
                {isAdmin && (
                  <th className="py-2 px-6 text-left">Assigned Employee</th>
                )}
                <th className="py-2 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-base">
              {routes
                .filter((route) => route.employee_id !== 0)
                .map((route) => renderRouteRow(route))}
            </tbody>
          </table>
        </div>
        {isAdmin && showUserDetailsModal && (
          <UserDetailsModal
            selectedUser={selectedUser}
            setShowUserDetailsModal={setShowUserDetailsModal}
          />
        )}
        {isAdmin && (
          <>
            <h2 className="text-2xl font-semibold my-4">Unassigned Routes</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-md">
                <thead>
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-2 px-6 text-left">Route ID</th>
                    <th className="py-2 px-6 text-left">Route Name</th>
                    <th className="py-2 px-6 text-left">Created</th>
                    <th className="py-2 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {routes
                    .filter((route) => route.employee_id === 0)
                    .map((route) => renderRouteRow(route, true))}
                </tbody>
              </table>
            </div>
            {isAdmin && showDeleteConfirmationModal && (
              <DeleteConfirmationModal
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
export default Routes;
