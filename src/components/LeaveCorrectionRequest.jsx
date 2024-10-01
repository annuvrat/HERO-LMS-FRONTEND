import React, { useState } from 'react';
import axios from 'axios';

const LeaveCorrectionRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [leaveRequestId, setLeaveRequestId] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
      const emplCode = localStorage.getItem('emplCode'); // Assuming Employee Code is stored in localStorage

      const response = await axios.post(
        '/request-leave-correction',
        { emplCode, leaveRequestId, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setLeaveRequestId('');
      setMessage('');
      setIsOpen(false); // Close the modal after submission
    } catch (err) {
      setErrorMessage(err.response ? err.response.data.error : 'An unexpected error occurred');
      setSuccessMessage('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 px-9 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Attendance Correction
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave Correction Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="leaveRequestId" className="block text-sm font-medium text-gray-700">Leave Request ID:</label>
                <input
                  type="number"
                  id="leaveRequestId"
                  value={leaveRequestId}
                  onChange={(e) => setLeaveRequestId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Request
                </button>
              </div>
            </form>
            {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}
            {errorMessage && <p className="mt-4 text-red-600 text-center">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCorrectionRequest;
