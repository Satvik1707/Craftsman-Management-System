import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import withAuth from '../../../../utils/withAuth';
import axios from 'axios';
import Map from '../../../../components/Map';
import Loading from '../../../../components/Loading';
import TaskItemContainer from '../../../../components/TaskItemContainer';
import { AuthContext } from '../../../../context/authContext';
import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';

const TaskDetails = () => {
  const { currentUser, SERVER_URL, token, isAdmin } = useContext(AuthContext);
  const router = useRouter();
  const { routeId, taskId } = router.query;
  const [task, setTask] = useState(null);

  const [issues, setIssues] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tools, setTools] = useState([]);

  const [initialTask, setInitialTask] = useState({});

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);

  const [allMaterials, setAllMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [allIssues, setAllIssues] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);

  const [allTools, setAllTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const handleAddSelectedMaterials = async () => {
    const materialIds = selectedMaterials.map((material) => material.value);
    try {
      await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/addMaterials`,
        {
          taskId: taskId,
          material_ids: materialIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const materialsResponse = await axios.get(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/materials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaterials(materialsResponse.data);

      setShowMaterialModal(false);
      setSelectedMaterials([]);
    } catch (error) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
      alert('Error adding materials. Please try again.');
    }
  };

  const handleAddSelectedTools = async () => {
    const toolIds = selectedTools.map((tool) => tool.value);
    try {
      await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/addTools`,
        {
          taskId: taskId,
          tool_ids: toolIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const toolsResponse = await axios.get(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/tools`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTools(toolsResponse.data);

      setShowToolModal(false);
      setSelectedTools([]);
    } catch (error) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
      alert('Error adding tools. Please try again.');
    }
  };

  const handleAddSelectedIssues = async () => {
    const issueIds = selectedIssues.map((issue) => issue.value);
    try {
      await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/addIssues`,
        {
          taskId: taskId,
          issue_ids: issueIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const issuesResponse = await axios.get(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/issues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(issuesResponse.data)
      setIssues(issuesResponse.data);

      setShowIssueModal(false);
      setSelectedIssues([]);
    } catch (error) {
      console.error({
        status: error.response.status,
        message: error.response.data.message,
      });
      alert('Error adding issues. Please try again.');
    }
  };

  const handleDeleteIssue = async (issue_id) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/removeIssue`,
        { taskId: taskId, issue_id: issue_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssues(issues.filter((issue) => issue.issue_id !== issue_id));
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const handleDeleteTool = async (tool_id) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/removeTool`,
        { taskId: taskId, tool_id: tool_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTools(tools.filter((tool) => tool.tool_id !== tool_id));
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleDeleteMaterial = async (material_id) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}api/tasks/${routeId}/${taskId}/removeMaterial`,
        { taskId: taskId, material_id: material_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaterials(
        materials.filter((material) => material.material_id !== material_id)
      );
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  useEffect(() => {
    const handleSaveClick = async () => {
      try {
        const response = await axios.put(
          `${SERVER_URL}api/tasks/${taskId}`,
          {
            task_name: task.task_name,
            status: task.status,
            description: task.description,
            latitude: latitude,
            longitude: longitude,
            note: task.note,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInitialTask(response.data);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
        alert('Error saving the task. Please try again.');
      }
    };
    const isEqual = (a, b, tolerance = 0.00001) => {
      return Math.abs(a - b) < tolerance;
    };

    if (!initialTask || !task) {
      return;
    } else {
      if (
        task.task_name !== initialTask.task_name ||
        task.description !== initialTask.description ||
        !isEqual(latitude, initialTask.latitude) ||
        !isEqual(longitude, initialTask.longitude) ||
        task.status !== initialTask.status ||
        task.note !== initialTask.note
      ) {
        handleSaveClick();
        localStorage.setItem('optimizedTaskList', JSON.stringify([]));
      }
    }
  }, [
    task,
    initialTask,
    longitude,
    latitude,
    SERVER_URL,
    token,
    taskId,
    setLongitude,
    setLatitude,
  ]);

  useEffect(() => {
    const fetchAllMaterials = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/materials`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const materials = response.data.map((material) => ({
          value: material.material_id,
          label: material.material_name,
        }));
        setAllMaterials(materials);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchAllMaterials();
    const fetchAllTools = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/tools`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tools = response.data.map((tool) => ({
          value: tool.tool_id,
          label: tool.tool_name,
        }));
        setAllTools(tools);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };
    fetchAllTools();
    const fetchAllIssues = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}api/issues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const issues = response.data.map((issue) => ({
          value: issue.issue_id,
          label: issue.issue_name,
        }));
        setAllIssues(issues);
      } catch (error) {
        console.error({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    };

    fetchAllIssues();

    if (routeId && taskId) {
      const fetchData = async () => {
        try {
          const taskResponse = await axios.get(
            `${SERVER_URL}api/tasks/${routeId}/${taskId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setTask(taskResponse.data);
          setInitialTask(taskResponse.data);
          setLatitude(taskResponse.data.latitude);
          setLongitude(taskResponse.data.longitude);
          const issuesResponse = await axios.get(
            `${SERVER_URL}api/tasks/${routeId}/${taskId}/issues`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIssues(issuesResponse.data);

          const materialsResponse = await axios.get(
            `${SERVER_URL}api/tasks/${routeId}/${taskId}/materials`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMaterials(materialsResponse.data);
          const toolsResponse = await axios.get(
            `${SERVER_URL}api/tasks/${routeId}/${taskId}/tools`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTools(toolsResponse.data);
        } catch (error) {
          console.error({
            status: error.response.status,
            message: error.response.data.message,
          });
        }
      };

      fetchData();
    }
  }, [routeId, taskId, SERVER_URL, token]);

  const handleTaskChange = (key, value) => {
    setTask((prevTask) => ({ ...prevTask, [key]: value }));
  };

  if (!currentUser || !SERVER_URL || !token || !task) return <Loading />;
  return (
    <div className="task-management-container">
      <h1 className="md:text-4xl text-3xl font-semibold mb-6">
        Task Management
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 w- gap-5">
        <div className="md:col-span-2">
          <div className="md:col-span-1">
            <p className="font-semibold md:text-lg text-md py-1">
              Task ID: <span className="ml-2 font-normal">{taskId}</span>
            </p>
            <p className="font-semibold md:text-lg text-md py-1">
              Route ID: <span className="ml-2 font-normal">{routeId}</span>
            </p>
            <p className="font-semibold md:text-lg text-md py-1">
              <a
                href={`https://www.google.com/maps/search/${latitude},${longitude}`}
                className="text-green-600 md:text-lg text-md flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Show Map <HiExternalLink className="mx-2 md:text-lg text-md" />
              </a>
            </p>
          </div>
          <div className="md:col-span-1">
            <p className="font-semibold md:text-lg text-md py-1">
              Task Name:{' '}
              {isAdmin ? (
                <input
                  type="text"
                  className="bg-white border-2 text-gray-800"
                  value={task.task_name}
                  onChange={(e) =>
                    handleTaskChange('task_name', e.target.value)
                  }
                />
              ) : (
                <span className="text-gray-800">{task.task_name}</span>
              )}
            </p>
            <p className="font-semibold md:text-lg text-md py-1">
              Status:{' '}
              <select
                className="bg-white border-2 text-gray-800"
                value={task.status}
                onChange={(e) => handleTaskChange('status', e.target.value)}
              >
                <option
                  value="pending"
                  className="bg-red-700 font-semibold uppercase text-white text-xs"
                >
                  Pending
                </option>
                <option
                  value="complete"
                  className="bg-green-700 font-semibold uppercase text-white text-xs"
                >
                  Complete
                </option>
              </select>
            </p>
          </div>
        </div>
        <div className='md:col-span-2'>
        <TaskItemContainer
            items={issues}
            itemType="issue"
            isAdmin={isAdmin}
            deleteItem={handleDeleteIssue}
            showModal={showIssueModal}
            setShowModal={setShowIssueModal}
            allItems={allIssues}
            selectedItems={selectedIssues}
            setSelectedItems={setSelectedIssues}
            handleAddSelectedItems={handleAddSelectedIssues}
          />
        </div>
        <div className="md:col-span-2">
          <p className="font-semibold text-lg">
            <span className="text-sm uppercase text-gray-700 font-bold">
              Description
            </span>
            {isAdmin ? (
              <textarea
                className="text-gray-800 border-2 rounded-md w-full h-20 resize-none font-normal md:text-base text-sm my-1"
                value={task.description}
                onChange={(e) =>
                  handleTaskChange('description', e.target.value)
                }
              />
            ) : (
              <p className="text-gray-800 w-full font-normal text-base my-1">
                {task.description}
              </p>
            )}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm uppercase text-gray-700 font-bold">Notes:</p>
          <textarea
            className="text-gray-800 border-2 rounded-md w-full text-sm md:text-base h-32 mt-2 resize-none"
            value={task.note}
            onChange={(e) => handleTaskChange('note', e.target.value)}
          ></textarea>
        </div>
        <div className="md:col-span-1">
          <div className="location-container">
            <p className="text-sm uppercase text-gray-700 font-bold">
              Location
            </p>
            <Map
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              isEditable={isAdmin}
              userLatitude={latitude}
              userLongitude={longitude}
            />
          </div>
        </div>
        <div className="md:col-span-1">

          <TaskItemContainer
            items={tools}
            itemType="tool"
            isAdmin={isAdmin}
            deleteItem={handleDeleteTool}
            showModal={showToolModal}
            setShowModal={setShowToolModal}
            allItems={allTools}
            selectedItems={selectedTools}
            setSelectedItems={setSelectedTools}
            handleAddSelectedItems={handleAddSelectedTools}
          />
          <TaskItemContainer
            items={materials}
            itemType="material"
            isAdmin={isAdmin}
            deleteItem={handleDeleteMaterial}
            showModal={showMaterialModal}
            setShowModal={setShowMaterialModal}
            allItems={allMaterials}
            selectedItems={selectedMaterials}
            setSelectedItems={setSelectedMaterials}
            handleAddSelectedItems={handleAddSelectedMaterials}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(TaskDetails, false, true);
