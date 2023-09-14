import React, { useState } from 'react';
import * as yup from 'yup';
import withAuth from '../../utils/withAuth';
const schema = yup.object().shape({
  routeName: yup.string().required(),
});

const CreateRouteModal = ({
  newRouteName,
  setNewRouteName,
  setShowCreateRouteModal,
  handleCreateRoute,
}) => {
  const [errors, setErrors] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const onSubmit = () => {
    schema
      .validate({ routeName: newRouteName }, { abortEarly: false })
      .then(() => {
        handleCreateRoute();
      })
      .catch((err) => {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Route</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Route Name"
            autoFocus
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded w-full"
          />
          {errors.routeName && (
            <p className="text-red-500">{errors.routeName}</p>
          )}
        </div>
        <button
          onClick={() => {
            setButtonDisabled(true);
            onSubmit();
          }}
          disabled={buttonDisabled}
          className="border-2 border-green-500 text-green-500 p-2 rounded"
        >
          Submit
        </button>
        <button
          onClick={() => {
            setShowCreateRouteModal(false);
          }}
          className="border-2 border-black text-black p-2 rounded ml-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default withAuth(CreateRouteModal, true, true);
