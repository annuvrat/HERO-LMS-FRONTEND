import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RejectedLeaves = () => {
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRejectedLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rejected-leaves', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data && response.data.rejectedLeaves) {
          setRejectedLeaves(response.data.rejectedLeaves);
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch rejected leaves.');
        console.error('Error fetching rejected leaves:', err);
      }
    };
    fetchRejectedLeaves();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-3 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Rejected Leave Requests</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="relative max-h-[60vh] overflow-auto hide-scrollbar">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-2 text-left text-gray-600">Leave Request ID</th>
              <th className="p-2 text-left text-gray-600">Employee Code</th>
              <th className="p-2 text-left text-gray-600">Leave Type</th>
              <th className="p-2 text-left text-gray-600">Start Date</th>
              <th className="p-2 text-left text-gray-600">End Date</th>
              <th className="p-2 text-left text-gray-600">Reason</th>
              <th className="p-2 text-left text-gray-600">Duration</th>
              <th className="p-2 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {rejectedLeaves.length > 0 ? (
              rejectedLeaves.map(leave => (
                <tr key={leave.ID} className="border-b border-gray-200">
                  <td className="p-2">{leave.ID}</td>
                  <td className="p-2">{leave.EMPL_CODE}</td>
                  <td className="p-2">{leave.LEAVE_TYPE_ID}</td>
                  <td className="p-2">{formatDate(leave.START_DATE)}</td>
                  <td className="p-2">{formatDate(leave.END_DATE)}</td>
                  <td className="p-2">{leave.REASON}</td>
                  <td className="p-2">{leave.DURATION}</td>
                  <td className="p-2">{leave.STATUS}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-2 text-center">No rejected leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedLeaves;
