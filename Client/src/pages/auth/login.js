import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const Login = () => {
  const { login, error, isLoading } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) {
      setPassword('');
      setUsernameError('');
      setPasswordError('Incorrect Credentials. Please try again.');
    }
  };
  const isButtonDisabled = !username || !password;
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className={`w-full px-3 py-2 border rounded ${
                usernameError || error ? 'border-red-500' : ''
              }`}
              type="text"
              name="username"
              autoFocus
              id="username"
              placeholder="Username"
              value={username}
              disabled={isLoading}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <p className="text-red-500 mt-2">{usernameError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`w-full px-3 py-2 border rounded ${
                passwordError || error ? 'border-red-500' : ''
              }`}
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              disabled={isLoading}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 mt-2">{passwordError}</p>
            )}
          </div>
          <button
            className={`${
              isButtonDisabled ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded mt-4 w-full`}
            type="submit"
            disabled={isLoading && isButtonDisabled}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014
                    12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging In
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
