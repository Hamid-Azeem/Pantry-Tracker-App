import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';

const Profile = () => {
  const user = auth.currentUser;
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    let emailUpdated = false;
    let passwordUpdated = false;

    if (newEmail) {
      try {
        await updateEmail(user, newEmail);
        emailUpdated = true;
      } catch (error) {
        setError('Failed to update email: ' + error.message);
        return;
      }
    }

    if (newPassword.length >= 6) {
      try {
        await updatePassword(user, newPassword);
        passwordUpdated = true;
      } catch (error) {
        setError('Failed to update password: ' + error.message);
        return;
      }
    } else if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (emailUpdated || passwordUpdated) {
      setSuccess('Profile updated successfully.');
      setError('');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Profile</h2>
        
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-300">Email: {user.email}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Update Email</h3>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email"
            className="w-full p-2 border border-gray-700 rounded-md mb-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Update Password</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border border-gray-700 rounded-md mb-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Profile
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;
