import { useState, useEffect } from 'react';
import { fetchRoutesInfo, fetchRouteDetails } from '../utils/api/routes';

const useRoutes = (SERVER_URL, token) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetchRoutesInfo(SERVER_URL, token);
        setRoutes(response.data);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchRoutes();
  }, [SERVER_URL, token]);

  return [routes, setRoutes];
};
const useRoute = (SERVER_URL, token, routeId) => {
  const [routeDetails, setRouteDetails] = useState(null);
  useEffect(() => {
    const fetchRoute = async () => {
      if (routeId === undefined || !routeId) {
        return;
      }
      try {
        const response = await fetchRouteDetails(SERVER_URL, token, routeId);
        setRouteDetails(response);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    if (routeId) fetchRoute();
  }, [routeId, SERVER_URL, token]);
  return [routeDetails, setRouteDetails];
};

export { useRoutes, useRoute };
