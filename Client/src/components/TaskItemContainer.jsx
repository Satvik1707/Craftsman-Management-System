import { FaTrash, FaCopy } from 'react-icons/fa';
import AddItemsModal from './Modals/AddItemsModal';
import {
  FaEdit,
  FaSave,
  FaExclamationCircle,
  FaShieldAlt,
  FaHammer,
  FaTools,
  FaWrench,
  FaBatteryEmpty,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';
const TaskItemList = ({
  items,
  itemType,
  isAdmin,
  deleteItem,
  showModal,
  setShowModal,
  allItems,
  selectedItems,
  setSelectedItems,
  handleAddSelectedItems,
}) => {
  const itemId = `${itemType}_id`;
  const itemName = `${itemType}_name`;
  const itemColor = `${itemType}_color`;

  const itemtype = `${itemType}_type`;
  const capitalizedItemType =
    itemType.charAt(0).toUpperCase() + itemType.slice(1);

  const copyToClipboard = () => {
    const stringToCopy = items
      .map((item, index) => `${index + 1}. ${item[itemName]}`)
      .join('\n');
    navigator.clipboard.writeText(stringToCopy);
  };



  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <p className="text-sm uppercase text-gray-700 font-bold">
          {capitalizedItemType}s&nbsp;&nbsp;
          <button onClick={copyToClipboard}>
            <FaCopy className="hover:text-gray-500" />
          </button>
        </p>
      </div>
      <ul className="list-disc my-2">
        {items.map((item) => {
          const color = item[itemColor];
          return (
            <li
              key={`${item[itemId]}:${item[itemName]}`}
              className={`mb-2 flex items-center`}
            >
              <span
                className={`flex w-5/6 items-center px-2 py-1 rounded-lg ${
                  color !== undefined
                    ? color === 'Black'
                      ? `bg-${color.toLowerCase()} text-white text-sm`
                      : color === 'Brown'
                      ? `bg-red-900 text-white text-sm`
                      : color === 'Blue'
                      ? `bg-${color.toLowerCase()}-900 text-white text-sm`
                      : `bg-${color.toLowerCase()}-700 text-white text-sm`
                    : 'text-gray-800'
                }`}
              >
                {item[itemtype] === 'Defect' && (
                  <FaExclamationCircle className="mr-1" />
                )}
                {item[itemtype] === 'Theft' && <FaShieldAlt className="mr-2" />}
                {item[itemtype] === 'Vandalism' && (
                  <FaHammer className="mr-2" />
                )}
                {item[itemtype] === 'New_Installation' && (
                  <FaTools className="mr-2" />
                )}
                {item[itemtype] === 'Maintenance' && (
                  <FaWrench className="mr-2" />
                )}
                {item[itemtype] === 'Battery_Empty' && (
                  <FaBatteryEmpty className="mr-2" />
                )}
                {item[itemtype] === 'Sensor_Soiled' && (
                  <FaTimesCircle className="mr-2" />
                )}
                {item[itemtype] === 'Bad_Measurement_Result' && (
                  <FaChartLine className="mr-2" />
                )}
                {item[itemName]}
              </span>
              {isAdmin && (
                <FaTrash
                  className="text-red-500 cursor-pointer ml-2"
                  onClick={() => deleteItem(item[itemId])}
                />
              )}
            </li>
          );
        })}
      </ul>
      {isAdmin && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 text-sm"
          onClick={() => setShowModal(true)}
        >
          Add {capitalizedItemType}s
        </button>
      )}
      {isAdmin && showModal && (
        <AddItemsModal
          title={capitalizedItemType}
          allItems={allItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setShowItemModal={setShowModal}
          handleAddSelectedItems={handleAddSelectedItems}
        />
      )}
    </div>
  );
};

export default TaskItemList;
