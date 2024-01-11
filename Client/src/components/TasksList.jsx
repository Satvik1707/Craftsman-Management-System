import axios from 'axios';
import { useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import {
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaLocationArrow,
  FaMapPin,
} from 'react-icons/fa';
import withAuth from '../utils/withAuth';
import TaskItemContainer from '../components/TaskItemContainer';
import calculateOptimizedRoute from '../utils/optimizeRoute';

import Link from 'next/link';

const TaskList = ({
  routeId,
  userLatitude,
  userLongitude,
  tasks,
  setTasks,
}) => {
  const { SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const [taskIssues, setTaskIssues] = useState({});
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [officeName, setOfficeName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officeLatitude, setOfficeLatitude] = useState(null);
  const [officeLongitude, setOfficeLongitude] = useState(null);
  const [desiredOrder, setDesiredOrder] = useState([]);
  const [optimizedTasksList, setOptimizedTasksList] = useState([]);

  const deleteButton = (task_id) => {
    return isAdmin ? (
      <td className="px-6 text-left whitespace-nowrap">
        <button
          onClick={() => handleDeleteTask(routeId, task_id)}
          className="text-red-500 px-2 rounded"
        >
          <FaTrash />
        </button>
      </td>
    ) : null;
  };

  const handleToggleTask = async (taskId) => {
    if (checkedTasks.includes(taskId)) {
      setCheckedTasks(checkedTasks.filter((task) => task !== taskId));
    } else {
      setCheckedTasks([...checkedTasks, taskId]);
    }
    await updateOptimizedTasks();
    window.location.reload();
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { office_name, office_address, latitude, longitude } =
          response.data;
        setOfficeName(office_name);
        setOfficeAddress(office_address);
        setOfficeLatitude(latitude);
        setOfficeLongitude(longitude);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [token, SERVER_URL]);


  useEffect(() => {
    const fetchTaskIssues = async (taskId) => {
      try {
        const response = await axios.get(
          `${SERVER_URL}api/tasks/${routeId}/${taskId}/issues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTaskIssues((prev) => ({
          ...prev,
          [taskId]: response.data,
        }));
      } catch (error) {
        console.error('Error fetching task issues:', error);
      }
    };

    tasks.forEach((task) => {
      fetchTaskIssues(task.task_id);
    });
  }, [tasks, routeId, SERVER_URL, token]);



  const updateRoute = async () => {
    try {
      const response = await axios.put(
        `${SERVER_URL}api/routeupdate/${routeId}`,
        {
          optimised_path: optimizedTasksList,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Error fetching desired order:', error);
    }
  };

  const updateOptimizedTasks = async () => {
    try {
      setIsRefreshing(true);
      const tasksToOptimize = incompleteTasks.filter((task) =>
        checkedTasks.includes(task.task_id)
      );
      const optimizedTasksList = await calculateOptimizedRoute(
        officeLatitude,
        officeLongitude,
        tasksToOptimize
      );

      updateRoute();

      if (optimizedTasksList) {
        const optimizedIncompleteTasks = optimizedTasksList.map((taskId) =>
          tasksToOptimize.find((task) => task.task_id === taskId)
        );

        const uncheckedTasks = incompleteTasks.filter(
          (task) =>
            !checkedTasks.includes(task.task_id) && task.status !== 'complete'
        );

        const updatedIncompleteTasks = [
          ...optimizedIncompleteTasks,
          ...uncheckedTasks,
        ];
        setOptimizedTasksList(optimizedTasksList);
        setIncompleteTasks(updatedIncompleteTasks);
      }
    } catch (error) {
      console.error('Error optimizing tasks:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let incompleteTasks = tasks.filter((task) => task.status !== 'complete');
    let completedTasks = tasks.filter((task) => task.status === 'complete');
    setIncompleteTasks(incompleteTasks);
    setCompletedTasks(completedTasks);
    setCheckedTasks(incompleteTasks.map((task) => task.task_id));
  }, [tasks]);

  const handleDeleteTask = async (routeId, taskId) => {
    try {
      await axios.delete(`${SERVER_URL}api/tasks/${routeId}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newTasks = tasks.filter((task) => task.task_id !== taskId);
      const newIncompleteTasks = incompleteTasks.filter(
        (task) => task.task_id !== taskId
      );
      const newCompletedTasks = completedTasks.filter(
        (task) => task.task_id !== taskId
      );
      setTasks(newTasks);
      setIncompleteTasks(newIncompleteTasks);
      setCompletedTasks(newCompletedTasks);
      if (optimizedTasks) {
        const newOptimizedTasks = optimizedTasks.filter(
          (task) => task.task_id !== taskId
        );
        setOptimizedTasks(newOptimizedTasks);
      }
    } catch (error) {
      if (error.status) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      } else console.error(error);
    }
  };

  useEffect(() => {
    const fetchDesiredOrder = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allRoutes = response.data;
        const targetRouteId = routeId;
        var foundRoute = null;

        for (var i = 0; i < allRoutes.length; i++) {
          if (allRoutes[i].route_id.toString() === targetRouteId) {
            foundRoute = allRoutes[i];
            break;
          }
        }
        setDesiredOrder(foundRoute.optimised_path);
      } catch (error) {
        console.error('Error fetching desired order:', error);
      }
    };

    fetchDesiredOrder();
  }, []);

  const taskListToRender = incompleteTasks.concat(completedTasks);
  const customSort = (a, b) => {
    const indexA = desiredOrder.indexOf(a.task_id);
    const indexB = desiredOrder.indexOf(b.task_id);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  };
  taskListToRender.sort(customSort);

  return (
    <div>
      {isAdmin && (
        <button
          type="button"
          className="w-full md:w-fit justify-center border-2 border-green-500 text-green-500 px-2 my-2 rounded flex items-center"
          onClick={updateOptimizedTasks}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            'Optimising...'
          ) : (
            <>
              <span className="mr-2">Optimize Route</span>
              <FaLocationArrow />
            </>
          )}
        </button>
      )}

      <h3 className="text-2xl font-semibold mb-2">Pending Tasks</h3>
      {isAdmin && (
        <>
          <div className="border-gray-200 hover:bg-gray-50 w-full">
            <div className="py-2 px-1 text-left whitespace-nowrap w-full items-center md:w-fit flex md:flex-row flex-col md:text-md text-sm">
              <p className="uppercase text-white bg-purple-700 font-semibold py-1 text-xs px-2 md:mr-2 rounded-md my-1">
                <FaMapPin className="inline-block mr-2  text-white" />
                Start
              </p>{' '}
              <div className="text-md w-full overflow-x-scroll">
                Office: {officeName} - {officeAddress}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              {isAdmin && (
                <>
                  <th className="py-3 px-6 text-left">En-route</th>
                </>
              )}
              <th className="py-3 px-6 text-left">Task Name</th>
              <th className="py-3 px-6 text-left">Issues</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-base">
            {taskListToRender.map((task, index) => {
              index = index + 1;
              return (
                task.status !== 'complete' && (
                  <>
                  <tr
                    key={task.task_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    {isAdmin && (
                      <>
                        <td className="py-2 px-6 text-left whitespace-nowrap text-base">
                          <button
                            type="button"
                            className={`${
                              checkedTasks.includes(task.task_id)
                                ? 'text-green-500'
                                : 'text-gray-600'
                            } focus:outline-none scale-125`}
                            onClick={() => handleToggleTask(task.task_id)}
                          >
                            {checkedTasks.includes(task.task_id) ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                        </td>
                      </>
                    )}

                    <td className="py-2 px-6 text-left whitespace-nowrap text-base">
                      <Link
                        href={{
                          pathname: `/Routes/ManageRoute/ManageTask`,
                          query: {
                            routeId: routeId,
                            taskId: task.task_id,
                          },
                        }}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        {task.task_name}
                      </Link>
                    </td>
                    <td>
                      <TaskItemContainer
                          items={(taskIssues[task.task_id] || []).slice(0, 3)}
                          itemType="issue"
                          isAdmin={false}
                          deleteItem={(issueId) =>
                            handleDeleteIssue(routeId, issueId)
                          }
                          random = {true}
                        />
                      
                      </td>
                    <td className="py-2 px-6 text-left whitespace-nowrap text-xs">
                      <span
                        className={`uppercase text-white ${
                          task.status === 'pending'
                            ? 'bg-red-800'
                            : 'bg-green-700'
                        } font-semibold text-xs px-2 py-1 rounded-full mb-2`}
                      >
                        {task.status}
                      </span>
                    </td>
                    {deleteButton(task.task_id)}
                  </tr>
                  </>
                )
              );
            })}
          </tbody>
        </table>
      </div>
      {isAdmin && (
        <>
          <div className="border-gray-200 hover:bg-gray-50">
            <div className="py-2 px-1 text-left whitespace-nowrap items-center w-full md:w-fit flex md:flex-row flex-col md:text-md text-sm">
              <p className="uppercase text-white bg-green-700 font-semibold py-1 text-xs px-2 md:mr-2 rounded-md my-1">
                <FaMapPin className="inline-block mr-2  text-white" />
                Destination
              </p>{' '}
              <div className="text-md w-full overflow-x-scroll">
                Office: {officeName} - {officeAddress}
              </div>
            </div>
          </div>
        </>
      )}

      <h3 className="text-2xl font-semibold mb-2 mt-4">Completed Tasks</h3>
      <div className="overflow-x-auto mb-8">
        <table className="table-auto w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              {isAdmin && (
                <>
                  <th className="py-3 px-6 text-left">Task ID</th>
                </>
              )}
              <th className="py-3 px-6 text-left">Task Name</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-base">
            {completedTasks.map((task) => (
              <>
                {' '}
                <tr
                  key={task.task_id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {isAdmin && (
                    <>
                      <td className="px-6 text-left whitespace-nowrap text-base py-1">
                        {task.task_id}
                      </td>
                    </>
                  )}

                  <td className="px-6 text-left whitespace-nowrap text-base">
                    <Link
                      href={{
                        pathname: `/Routes/ManageRoute/ManageTask`,
                        query: {
                          routeId: routeId,
                          taskId: task.task_id,
                        },
                      }}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      {task.task_name}
                    </Link>
                  </td>
                  <td className="px-6 text-left whitespace-nowrap text-xs">
                    <span
                      className={`uppercase text-white ${
                        task.status === 'pending'
                          ? 'bg-red-800'
                          : 'bg-green-700'
                      } font-semibold text-xs px-2 py-1 rounded-full mb-2`}
                    >
                      {task.status}
                    </span>
                  </td>
                  {deleteButton(task.task_id)}
                </tr>

              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(TaskList);
