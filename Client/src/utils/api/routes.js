import axios from 'axios';
const fetchRoutesInfo = async (SERVER_URL, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/routes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};
const fetchRouteDetails = async (SERVER_URL, token, routeId) => {
  try {
    const response = await axios.get(`${SERVER_URL}api/routes/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const details = response.data.find((route) => route.route_id == routeId);
    return details;
  } catch (error) {
    return error;
  }
};

export { fetchRoutesInfo, fetchRouteDetails };
