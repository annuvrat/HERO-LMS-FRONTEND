import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovalToggle = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance correction requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/attendance-correction', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        setError('Failed to fetch approval requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Function to approve a correction request
  const approveRequest = async (id) => {
    try {
      await axios.post(`http://localhost:3000/approve-attendance-correction/${id}`, {
        status: 'Approved',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Refresh the requests after approval
      const updatedRequests = requests.filter(request => request.id !== id);
      setRequests(updatedRequests);
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Failed to approve the request.');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className=" overflow-hidden hide-scrollbar p-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold mb-4">Attendance Correction Requests</h2>
      {requests.length === 0 ? (
        <p>No requests to approve.</p>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto hide-scrollbar">
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="p-4 border rounded-lg shadow-sm">
                <p><strong>Code: </strong>{request.EMPL_CODE}</p>
                <p><strong>Date:</strong> {request.absentDate}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <button
                  onClick={() => approveRequest(request.id)}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApprovalToggle;
