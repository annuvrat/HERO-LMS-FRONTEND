import React, { useState, useEffect } from "react";
import axios from "axios";

const ApprovedLeavesDashboard = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/approved-leaves-manager",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (response.data && response.data.approvedLeaves) {
          setApprovedLeaves(response.data.approvedLeaves);
        } else {
          setError("Unexpected response structure.");
        }
      } catch (err) {
        setError("Failed to fetch approved leaves.");
        console.error("Error fetching approved leaves:", err);
      }
    };
    fetchApprovedLeaves();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-3 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Approved Leave Requests</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="relative max-h-[70vh] overflow-auto hide-scrollbar">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-2 text-left text-gray-600">Leave Request ID</th>
              <th className="p-2 text-left text-gray-600">Employee Code</th>
              <th className="p-2 text-left text-gray-600">Leave Type</th>
              <th className="p-2 text-left text-gray-600">Start Date</th>
              <th className="p-2 text-left text-gray-600">End Date</th>
              <th className="p-2 text-left text-gray-600">Reason</th>
            </tr>
          </thead>
          <tbody>
            {approvedLeaves.length > 0 ? (
              approvedLeaves.map((leave) => (
                <tr key={leave.ID} className="border-b border-gray-200">
                  <td className="p-2">{leave.ID}</td>
                  <td className="p-2">{leave.EMPL_CODE}</td>
                  <td className="p-2">{leave.LEAVE_TYPE_ID || "N/A"}</td>
                  <td className="p-2">{formatDate(leave.START_DATE)}</td>
                  <td className="p-2">{formatDate(leave.END_DATE)}</td>
                  <td className="p-2">{leave.REASON}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-2 text-center">
                  No approved leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedLeavesDashboard;
