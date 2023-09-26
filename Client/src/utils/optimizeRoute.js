import { loadGoogleMapsApi } from './loadGoogleMapsAPI';

export default async function calculateOptimizedRoute(
  officeLatitude,
  officeLongitude,
  tasks,
  userLocation
) {
  const googleMaps = await loadGoogleMapsApi(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
  console.log(tasks,"tasks")
  const waypoints = tasks.map((task) => ({
    location: new googleMaps.LatLng(task.latitude, task.longitude),
    stopover: true,
  }));
  console.log(waypoints,"waypoints")
  const request = {
    //change origin to user's location later
    origin: new googleMaps.LatLng(officeLatitude, officeLongitude),
    destination: new googleMaps.LatLng(officeLatitude, officeLongitude),
    waypoints: waypoints,
    optimizeWaypoints: true,
    drivingOptions: {
      departureTime: new Date(Date.now() + 1000 * 60 * 60),
      trafficModel: 'pessimistic',
    },
    travelMode: googleMaps.TravelMode.DRIVING,
  };

  const directionsService = new googleMaps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(request, (result, status) => {
      if (status === googleMaps.DirectionsStatus.OK) {
        console.log("api called", request)
        const optimizedTaskIds = result.routes[0].waypoint_order.map(
          (waypointIndex) => tasks[waypointIndex].task_id
        );
        console.log(optimizedTaskIds,"task id")
        resolve(optimizedTaskIds);
      } else {
        console.error('Error requesting route:', status);
        reject(null);
      }
    });
  });
}
