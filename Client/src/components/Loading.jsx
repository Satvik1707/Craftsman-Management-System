import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white">
      <div className="flex flex-col justify-center align-middle space-y-4">
        <FaSpinner className="animate-spin text-6xl text-blue-500" />
        <p className="text-gray-600 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
