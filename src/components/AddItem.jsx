import React, { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../firebase/AuthProvider'; 

const AddItem = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'pantry', currentUser.uid, 'items'), {
        name,
        quantity
      });
      setName('');
      setQuantity('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center  h-[80vh]  bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Add Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item Name"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
