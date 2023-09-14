import Select from 'react-select';
const AddItemsModal = ({
  title,
  allItems,
  selectedItems,
  setSelectedItems,
  handleAddSelectedItems,
  setShowItemModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white p-8 rounded-lg w-1/2 shadow-2xl">
        <p className="text-lg mb-4">Add {title}</p>
        <Select
          isMulti
          options={allItems}
          value={selectedItems}
          onChange={setSelectedItems}
          className="mb-4 text-sm"
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 text-sm rounded"
          onClick={handleAddSelectedItems}
        >
          Add Selected {title}s
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded ml-4"
          onClick={() => setShowItemModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default AddItemsModal;
