import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import UpdateItem from './UpdateItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../firebase/AuthProvider';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pantry', currentUser.uid, 'items'), (snapshot) => {
      const itemsData = [];
      snapshot.forEach((doc) => itemsData.push({ ...doc.data(), id: doc.id }));
      setItems(itemsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'pantry', currentUser.uid, 'items', id));
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const toggleShowItems = () => {
    setShowItems(prevShowItems => !prevShowItems);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h2 className="text-3xl font-bold text-white mb-4">Pantry Items</h2>
      <button
        onClick={toggleShowItems}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 mb-4"
      >
        {showItems ? 'Hide Items' : 'Show Items'}
      </button>
      {showItems && (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                <th
                  className="py-3 px-6 text-left cursor-pointer text-white flex items-center"
                  onClick={() => requestSort('name')}
                >
                  Name
                  <FontAwesomeIcon icon={getSortIcon('name')} className="ml-2 text-gray-400" />
                </th>
                <th
                  className="py-3 px-6 text-left cursor-pointer text-white"
                  onClick={() => requestSort('quantity')}
                >
                  Quantity
                  <FontAwesomeIcon icon={getSortIcon('quantity')} className="ml-2 text-gray-400" />
                </th>
                <th className="py-3 px-6 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map(item => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="py-3 px-6 text-white">{item.name}</td>
                  <td className="py-3 px-6 text-white">{item.quantity}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => handleUpdateClick(item)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedItem && (
        <UpdateItem item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ItemList;
