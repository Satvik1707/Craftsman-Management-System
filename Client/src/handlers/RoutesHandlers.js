import axios from 'axios';
import { getCookie } from '../utils/cookies';
const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;
const token = getCookie('token');
export const handleEditRoute = (routeId, setEditRouteId) => {
  setEditRouteId(routeId);
};


export const handleSaveRoute = async (
  routeId,
  routes,
  setRoutes,
  setEditRouteId
) => {
  const route = routes.find((r) => r.route_id === routeId);
  try {
    await axios.put(
      `${SERVER_URL}api/routes/${routeId}`,
      {
        route_name: route.route_name,
        employee_id: route.employee_id,
        status: route.status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEditRouteId(null);
    setRoutes(routes.map((r) => (r.route_id === routeId ? route : r)));
    return response.data;
  } catch (error) {
    console.error({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
};

export const handleDeleteRoute = (
  routeId,
  setRouteToDelete,
  setShowDeleteConfirmationModal
) => {
  setShowDeleteConfirmationModal(true);
  setRouteToDelete(routeId);
};

export const handleConfirmDeleteRoute = async (
  routeToDelete,
  routes,
  setRoutes,
  setShowDeleteConfirmationModal,
  setRouteToDelete
) => {
  try {
    await axios.delete(`${SERVER_URL}api/routes/${routeToDelete}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoutes(routes.filter((route) => route.route_id !== routeToDelete));
    setShowDeleteConfirmationModal(false);
    setRouteToDelete(null);
  } catch (error) {
    console.error({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
};

export const handleCancelDeleteRoute = (
  setShowDeleteConfirmationModal,
  setRouteToDelete
) => {
  setShowDeleteConfirmationModal(false);
  setRouteToDelete(null);
};

export const handleRouteInputChange = (e, routeId, routes, setRoutes) => {
  const { name, value } = e.target;
  setRoutes(
    routes.map((route) =>
      route.route_id === routeId ? { ...route, [name]: value } : route
    )
  );
};

export const handleCreateRoute = async (
  newRouteName,
  routes,
  setRoutes,
  setNewRouteName,
  setShowCreateRouteModal
) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}api/routes`,
      {
        route_name: newRouteName,
        employee_id: 0,
        status: 'pending',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRoutes([...routes, response.data]);
  } catch (error) {
    console.error({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
  setNewRouteName('');
  setShowCreateRouteModal(false);
};
