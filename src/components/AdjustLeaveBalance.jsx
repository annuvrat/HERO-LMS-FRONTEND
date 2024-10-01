import React, { useState } from 'react';
import axios from 'axios';

const AdjustLeaveButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emplCode, setEmplCode] = useState('');
  const [leaveTypeName, setLeaveTypeName] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage
      const response = await axios.post(
        'http://localhost:3000/adjust-leave-balance',
        {
          emplCode,
          leaveTypeName,
          adjustment: parseInt(adjustment, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || 'Leave balance adjusted successfully');
      setError('');
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modalOverlay') {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white rounded hover:bg-blue-600 transition py-2 px-3 text-"
      >
        Adjust Leave
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-11/12 max-w-md mx-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Adjust Leave Balance</h2>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Employee Code"
                value={emplCode}
                onChange={(e) => setEmplCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Leave Type Name"
                value={leaveTypeName}
                onChange={(e) => setLeaveTypeName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="Adjustment Amount"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <button
                className="bg-blue-500 text-white rounded hover:bg-blue-600 transition py-2 px-3 text-sm"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdjustLeaveButton;