import * as yup from 'yup';
import { useState } from 'react';
import withAuth from '../../utils/withAuth';
const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  role: yup.string().required(),
  email: yup.string().email().required(),
});

const UserCreationModal = ({
  handleCreateUser,
  setShowUserCreationModal,
  users,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const generateUniqueId = (existingUserIds) => {
    let newId = 1;
    while (existingUserIds.includes(newId)) {
      newId++;
    }
    return newId;
  };

  const onSubmit = () => {
    setButtonDisabled(true);
    schema
      .validate(
        { username, password, role, email, phone },
        { abortEarly: false }
      )
      .then(() => {
        const existingUserIds = users.map((user) => user.user_id);
        const newUserId = generateUniqueId(existingUserIds);
        handleCreateUser({
          user_id: newUserId,
          username,
          password,
          role,
          email,
          phone,
        });
        setShowUserCreationModal(false);
      })
      .catch((err) => {
        const newErrors = {};
        if (err.inner) {
          err.inner.forEach((error) => {
            newErrors[error.path] = error.message;
          });
        }
        setErrors(newErrors);
        setButtonDisabled(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 border-2 border-black">
        <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            User Name
          </label>
          <input
            type="text"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>
        <button
          onClick={() => {
            onSubmit();
          }}
          disabled={buttonDisabled}
          className={`border-2 ${
            !buttonDisabled
              ? 'border-blue-500 text-blue-500'
              : 'border-gray-500 text-gray-500'
          } p-2 rounded`}
        >
          Create
        </button>
        <button
          onClick={() => setShowUserCreationModal(false)}
          className="border-2 border-black text-black p-2 rounded ml-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default withAuth(UserCreationModal, true, true);
