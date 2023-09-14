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

const settingSchema = yup.object().shape({
  officeName: yup.string().required(),
  officeAddress: yup.string().required(),
  officeLatitude: yup.number().required(),
  officeLongitude: yup.number().required(),
});

const SettingModal = ({ setShowSettingModal }) => {
  const [officeName, setOfficeName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officeLatitude, setOfficeLatitude] = useState(null);
  const [officeLongitude, setOfficeLongitude] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const token = getCookie('token');

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
  }, [token]);

  const onSave = async () => {
    setButtonDisabled(true);
    settingSchema
      .validate(
        { officeName, officeAddress, officeLatitude, officeLongitude },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          const response = await axios.put(
            `${SERVER_URL}api/settings`,
            {
              office_name: officeName,
              office_address: officeAddress,
              latitude: officeLatitude,
              longitude: officeLongitude,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setShowSettingModal(false);
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (!officeLatitude || !officeLongitude) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setShowSettingModal(false)}
        className="fixed inset-0 bg-black opacity-50"
      ></div>
      <div className="relative bg-white rounded-lg px-6 py-8">
        <h3 className="text-2xl mb-4">Office Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            autoFocus
            placeholder="Office Name"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            className={`border rounded p-2 ${isEditMode ? '' : 'bg-gray-100'}`}
            disabled={!isEditMode}
          />
          {errors.officeName && (
            <p className="text-red-500 text-sm">{errors.officeName}</p>
          )}

          <textarea
            placeholder="Office Address"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
            className={`border rounded p-2 ${isEditMode ? '' : 'bg-gray-100'}`}
            rows="2"
            disabled={!isEditMode}
          ></textarea>
          {errors.officeAddress && (
            <p className="text-red-500 text-sm">{errors.officeAddress}</p>
          )}
          <Map
            setLatitude={setOfficeLatitude}
            setLongitude={setOfficeLongitude}
            isEditable={isEditMode}
            userLatitude={officeLatitude}
            userLongitude={officeLongitude}
          />
        </div>
        <div className="flex justify-end mt-4">
          {isEditMode ? (
            <button
              onClick={onSave}
              disabled={buttonDisabled}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default withAuth(SettingModal, true, true);
