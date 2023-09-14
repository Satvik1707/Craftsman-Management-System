import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import TaskList from '../../../components/TasksList';
import TaskCreationModal from '../../../components/Modals/TaskCreationModal';
import { handleSaveRoute } from '../../../handlers/RoutesHandlers';
import { useUsers } from '../../../hooks/useUser';
import { useRoute } from '../../../hooks/useRoutes';
import withAuth from '../../../utils/withAuth';
import Loading from '../../../components/Loading';
import { AuthContext } from '../../../context/authContext';

const CurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
};

const RouteDetails = () => {
  const router = useRouter();
  const { routeId } = router.query;
  const { currentUser, SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [routeDetails, setRouteDetails] = useRoute(SERVER_URL, token, routeId);
  const [routeName, setRouteName] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useUsers(SERVER_URL, token);
  const [showTaskCreationModal, setShowTaskCreationModal] = useState(false);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const updateTaskList = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  useEffect(() => {
    if (routeId) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(
            `${SERVER_URL}api/tasks/${routeId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setTasks(response.data);
        } catch (error) {
          if (error.status) {
            console.error({
              status: error.response.status,
              message: error.response.data.message,
            });
          } else console.error(error);
        }
      };
      fetchTasks();
    }
    const getLocation = async () => {
      const userLocation = await CurrentLocation();
      setUserLatitude(userLocation.lat);
      setUserLongitude(userLocation.lng);
    };

    if (routeDetails) {
      setRouteName(routeDetails.route_name);
      setAssignedEmployee(routeDetails.employee_id);
    }

    getLocation();
  }, [routeDetails, routeId, SERVER_URL, token]);
  const handleDeleteRoute = async () => {
    try {
      await axios.delete(`${SERVER_URL}api/routes/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/Routes');
    } catch (error) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  };
  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const response = await axios.put(
          `${SERVER_URL}api/routes/${routeId}`,
          {
            route_name: routeName,
            employee_id: assignedEmployee,
            status: 'pending',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRouteDetails(response.data);
      } catch (error) {
        if (error.status) {
          console.error({
            status: error.response.status,
            message: error.response.data.message,
          });
        } else console.error(error);
      }
    }
    setIsEditing(!isEditing);
  };
  if (!currentUser || !SERVER_URL || !token || !routeDetails)
    return <Loading />;
  return (
    <>
      <p className="md:text-4xl text-3xl font-semibold mb-4">
        Manage Route &gt; {routeId}
      </p>

      <div className="w-full flex flex-wrap justify-between py-2">
        <label className="font-semibold md:text-lg text-md w-full md:w-auto mr-4">
          Route ID: <span className="ml-2 font-normal">{routeId}</span>
        </label>
        <div className="w-full md:w-auto mb-2 md:mb-0 mr-4">
          <label className="font-semibold md:text-lg text-md w-full md:w-auto">
            Route Name:{' '}
            {isEditing ? (
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="border ml-2"
              />
            ) : (
              <span className="ml-2 font-normal">{routeName}</span>
            )}
          </label>
        </div>

        <div className="w-full md:w-auto mb-4">
          <label className="font-semibold md:text-lg text-md w-full md:w-auto">
            Assigned Employee:
            {isEditing ? (
              <select
                name="employee_id"
                value={assignedEmployee}
                onChange={(e) => {
                  setAssignedEmployee(e.target.value);
                }}
                className="border-2 border-gray-300 px-2 rounded"
              >
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.user_id === 0
                      ? 'Not Assigned'
                      : `${user.user_id}: ${user.username}`}
                  </option>
                ))}
              </select>
            ) : (
              <span className="ml-2 font-normal">
                {isAdmin &&
                  users
                    .filter((user) => user.user_id === assignedEmployee)
                    .map((user) =>
                      user.user_id === 0
                        ? 'Not Assigned'
                        : `${user.user_id} - ${user.username}`
                    )}
                {currentUser.role === 'employee' &&
                  `${currentUser.user_id} - ${currentUser.username}`}
              </span>
            )}
          </label>
        </div>
      </div>
      {isAdmin && (
        <div className="mb-4 flex  justify-between flex-col md:flex-row">
          <button
            onClick={handleEditSave}
            className={`px-2 my-1 border-2 rounded ${
              isEditing
                ? 'border-green-600 text-green-600'
                : 'border-yellow-500 text-yellow-500'
            } `}
          >
            {isEditing ? 'Save' : 'Edit Route'}
          </button>
          <button
            onClick={() => handleDeleteRoute(routeId)}
            className={`px-2 my-1 border-2 rounded text-red-500 border-red-500`}
          >
            Delete Route
          </button>
          <button
            onClick={() => {
              setShowTaskCreationModal(true);
            }}
            className={`px-2 my-1 border-2 rounded text-blue-500 border-blue-500`}
          >
            Add New Task
          </button>
        </div>
      )}
      {routeId && (
        <TaskList
          routeId={routeId}
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
      {isAdmin && showTaskCreationModal && (
        <TaskCreationModal
          setShowTaskCreationModal={setShowTaskCreationModal}
          routeDetails={routeDetails}
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          updateTaskList={updateTaskList}
        />
      )}
    </>
  );
};
export default RouteDetails;
