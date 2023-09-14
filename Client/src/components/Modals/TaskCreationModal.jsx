import { useState, useEffect } from 'react';
import * as yup from 'yup';
import Map from '../Map';
import { getCookie } from '../../utils/cookies';
import axios from 'axios';
import withAuth from '../../utils/withAuth';

const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;

const taskSchema = yup.object().shape({
  taskName: yup.string().required(),
  description: yup.string().required(),
  note: yup.string(),
});

const generateRandomTaskId = () => {
  return Math.floor(Math.random() * 1000);
};

const TaskCreationModal = ({
  setShowTaskCreationModal,
  routeDetails,
  userLatitude,
  userLongitude,
  updateTaskList,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [note, setNote] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const token = getCookie('token');
  useEffect(() => {
    const randomId = generateRandomTaskId();
    setTaskId(randomId);
  }, [routeDetails.tasks]);

  const onSubmit = () => {
    setButtonDisabled(true);
    taskSchema
      .validate({ taskName, description, note }, { abortEarly: false })
      .then(async () => {
        try {
          setButtonDisabled(true);
          const response = await axios.post(
            `${SERVER_URL}api/tasks/${routeDetails.route_id}`,
            {
              task_name: taskName,
              route_id: routeDetails.route_id,
              description,
              latitude,
              longitude,
              note,
              status: 'pending',
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const newTask = {
            task_id: response.data.task_id,
            task_name: taskName,
            description,
            latitude,
            longitude,
            note,
            status: 'pending',
          };
          updateTaskList(newTask);
          setShowTaskCreationModal(false);
        } catch (error) {
          console.error({
            status: error.response.status,
            message: error.response.data.message,
          });
        } finally {
          setButtonDisabled(false);
        }
      })
      .catch((err) => {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        setButtonDisabled(false);
      });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setShowTaskCreationModal(false)}
        className="fixed inset-0 bg-black opacity-50"
      ></div>
      <div className="relative bg-white rounded-lg px-6 py-8">
        <h3 className="text-2xl mb-4">Add New Task</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            autoFocus
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="border rounded p-2"
          />
          {errors.taskName && (
            <p className="text-red-500 text-sm">{errors.taskName}</p>
          )}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2"
            rows="3"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
          <Map
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            isEditable={true}
            userLatitude={userLatitude}
            userLongitude={userLongitude}
          />
          <textarea
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded p-2"
            rows="2"
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setButtonDisabled(true);
              onSubmit();
            }}
            disabled={buttonDisabled}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(TaskCreationModal, true, true);
