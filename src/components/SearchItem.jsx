import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import UpdateItem from './UpdateItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../firebase/AuthProvider';

const SearchItem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { currentUser } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const querySnapshot = await getDocs(collection(db, 'pantry', currentUser.uid, 'items'));
    const itemsData = [];
    querySnapshot.forEach((doc) => itemsData.push({ ...doc.data(), id: doc.id }));

    // Perform client-side filtering
    const filteredResults = itemsData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filteredResults);
    setNotFound(filteredResults.length === 0);
  };

  const sortedResults = [...results].sort((a, b) => {
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

  const handleDelete = async (id) => {
    if (!currentUser) return;

    await deleteDoc(doc(db, 'pantry', currentUser.uid, 'items', id));
    setResults(results.filter(item => item.id !== id));
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <form onSubmit={handleSearch} className="mb-4 w-full max-w-lg flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for an item"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>
      {notFound && (
        <div className="text-center text-red-500">
          No items found. Please try a different search term.
        </div>
      )}
      {results.length > 0 && (
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
              {sortedResults.map(result => (
                <tr key={result.id} className="border-b border-gray-700">
                  <td className="py-3 px-6 text-white">{result.name}</td>
                  <td className="py-3 px-6 text-white">{result.quantity}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => handleUpdateClick(result)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(result.id)}
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

export default SearchItem;
