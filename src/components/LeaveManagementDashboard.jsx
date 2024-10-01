import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaTh, FaList } from 'react-icons/fa';
import ApprovedLeavesDashboard from './ApprovedLeaves';
import RejectedLeaves from './RejectedLeaves';
import AdjustLeaveButton from './AdjustLeaveBalance';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BulkUploadLeaveButton from './BulkUpload';
import ApprovalToggle from './ApprovalRequests';

const LeaveManagementDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('card');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    setShowComponents(true);
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/leave-requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data && response.data.leaveRequests) {
          setLeaveRequests(response.data.leaveRequests);
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch leave requests.');
        console.error('Error fetching leave requests:', err);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const payload = { action };
      if (action !== 'approve') {
        payload.reason = actionReason;
      }

      await axios.post(`http://localhost:3000/handle-leave/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Remove the request after action
      setLeaveRequests(leaveRequests.filter(request => request.ID !== id));
      setSelectedRequest(null);
      setActionReason('');
    } catch (err) {
      setError('Failed to update leave request.');
      console.error('Error updating leave request:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`transition-opacity duration-1000 ${showComponents ? 'opacity-100' : 'opacity-0'}`}>
    <div className="container mx-auto p-4 flex flex-wrap">
    {/* Sidebar */}

    {/* Main Content */}
    <div className="w-full md:w-2/4 lg:w-2/3 p-4 bg-white">
    
      {/* Tabs */}
      <div className="flex flex-wrap mb-4 border-b border-gray-200">
  <button
    className={`py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-100 rounded-t-lg ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50' : 'text-gray-600'}`}
    onClick={() => setActiveTab('pending')}
  >
    Pending Approvals
  </button>
  <button
    className={`py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-100 rounded-t-lg ${activeTab === 'approved' ? 'border-b-2 border-green-500 text-green-500 font-semibold bg-green-50' : 'text-gray-600'}`}
    onClick={() => setActiveTab('approved')}
  >
    Approved Leaves
  </button>
  <button
    className={`py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-red-100 rounded-t-lg ${activeTab === 'rejected' ? 'border-b-2 border-red-500 text-red-500 font-semibold bg-red-50' : 'text-gray-600'}`}
    onClick={() => setActiveTab('rejected')}
  >
    Rejected Leaves
  </button>
  <button
    className={`py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-100 rounded-t-lg ${activeTab === 'adjustments' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50' : 'text-gray-600'}`}
    onClick={() => setActiveTab('adjustments')}
  >
    Adjust Leave Balance
  </button>
  <button
    className={`py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-100 rounded-t-lg ${activeTab === 'attendance' ? 'border-b-2 border-yellow-500 text-yellow-500 font-semibold bg-yellow-50' : 'text-gray-600'}`}
    onClick={() => setActiveTab('attendance')}
  >
    Attendance Correction
  </button>
</div>

      {/* Tab Content */}
      {activeTab === 'pending' && (
        <div>
          <div className="flex justify-end mb-2 ">
            <button
              className={`p-2 rounded-full border-2 border-gray-300 ${viewType === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setViewType('card')}
            >
              <FaTh size={15} />
            </button>
            <button
              className={`p-2 rounded-full border-2 border-gray-300 ${viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setViewType('list')}
            >
              <FaList size={15} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto hide-scrollbar">
            {viewType === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map(request => (
                    <div
                      key={request.ID}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      style={{     background: 'linear-gradient(145deg, rgba(240, 240, 255, 0.8) 0%, rgba(240, 250, 255, 0.7) 100%, rgba(230, 240, 255, 0.6) 100%)',
                      }}
                    >
                      <div className="flex flex-col items-center mb-2">
                        <FaUser className="text-3xl text-gray-600 mb-1" />
                        <hr className="w-1/2 border-gray-300 my-1" />
                        <h2 className="text-lg font-semibold mb-1 text-gray-800">Leave Request ID: {request.ID}</h2>
                      </div>
                      <div className="flex flex-col flex-grow mb-2">
                        <p className="text-gray-800 mb-1"><strong>Employee Code:</strong> {request.EMPL_CODE}</p>
                        <p className="text-gray-800 mb-1"><strong>Leave Type:</strong> {request.NAME}</p>
                        <div className="flex justify-between mb-1">
                          <p className="text-gray-800"><strong>Start Date:</strong> {formatDate(request.START_DATE)}</p>
                          <p className="text-gray-800"><strong>End Date:</strong> {formatDate(request.END_DATE)}</p>
                        </div>
                        <p className="text-gray-800 mb-2"><strong>Reason:</strong> {request.REASON}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="py-1 px-2 rounded-lg border-2 border-green-500 text-green-500 font-semibold shadow-md hover:bg-green-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                          onClick={() => handleAction(request.ID, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="py-1 px-2 rounded-lg border-2 border-red-500 text-red-500 font-semibold shadow-md hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                          onClick={() => { setSelectedRequest(request.ID); setActionReason(''); }}
                        >
                          Reject
                        </button>
                        <button
                          className="py-1 px-2 rounded-lg border-2 border-yellow-500 text-yellow-500 font-semibold shadow-md hover:bg-yellow-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                          onClick={() => { setSelectedRequest(request.ID); setActionReason(''); }}
                        >
                          Resubmit
                        </button>
                      </div>
                      {selectedRequest === request.ID && (
                        <div className="mt-2">
                          <textarea
                            className="w-full p-2 border rounded-lg"
                            placeholder={`Reason for ${selectedRequest === request.ID ? 'Rejection/Resubmission' : ''}`}
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="py-1 px-2 rounded-lg border-2 border-blue-500 text-blue-500 font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 text-xs"
                              onClick={() => handleAction(request.ID, 'reject')}
                            >
                              Confirm Reject
                            </button>
                            <button
                              className="py-1 px-2 rounded-lg border-2 border-yellow-500 text-yellow-500 font-semibold shadow-md hover:bg-yellow-500 hover:text-white transition-all duration-300 text-xs"
                              onClick={() => handleAction(request.ID, 'resubmit')}
                            >
                              Confirm Resubmit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No pending leave requests found.</p>
                )}
              </div>
            ) : (
              // List view
              <ul className="divide-y divide-gray-200">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map(request => (
                    <li
                      key={request.ID}
                      className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4"
                      style={{ background: 'linear-gradient(145deg, rgba(240, 240, 255, 0.8) 0%, rgba(240, 250, 255, 0.7) 50%, rgba(230, 240, 255, 0.6) 100%)' }}
                    >
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-1 text-gray-800">Leave Request ID: {request.ID}</h2>
                        <p className="text-gray-800 mb-1"><strong>Employee Code:</strong> {request.EMPL_CODE}</p>
                        <p className="text-gray-800 mb-1"><strong>Leave Type:</strong> {request.NAME}</p>
                        <p className="text-gray-800 mb-1"><strong>Start Date:</strong> {formatDate(request.START_DATE)}</p>
                        <p className="text-gray-800 mb-1"><strong>End Date:</strong> {formatDate(request.END_DATE)}</p>
                        <p className="text-gray-800 mb-2"><strong>Reason:</strong> {request.REASON}</p>
                        <div className="flex space-x-2">
                          <button
                            className="py-1 px-2 rounded-lg border-2 border-green-500 text-green-500 font-semibold shadow-md hover:bg-green-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                            onClick={() => handleAction(request.ID, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="py-1 px-2 rounded-lg border-2 border-red-500 text-red-500 font-semibold shadow-md hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                            onClick={() => { setSelectedRequest(request.ID); setActionReason(''); }}
                          >
                            Reject
                          </button>
                          <button
                            className="py-1 px-2 rounded-lg border-2 border-yellow-500 text-yellow-500 font-semibold shadow-md hover:bg-yellow-500 hover:text-white hover:shadow-lg transition-all duration-300 text-xs"
                            onClick={() => { setSelectedRequest(request.ID); setActionReason(''); }}
                          >
                            Resubmit
                          </button>
                        </div>
                        {selectedRequest === request.ID && (
                          <div className="mt-2">
                            <textarea
                              className="w-full p-2 border rounded-lg"
                              placeholder={`Reason for ${selectedRequest === request.ID ? 'Rejection/Resubmission' : ''}`}
                              value={actionReason}
                              onChange={(e) => setActionReason(e.target.value)}
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                className="py-1 px-2 rounded-lg border-2 border-blue-500 text-blue-500 font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 text-xs"
                                onClick={() => handleAction(request.ID, 'reject')}
                              >
                                Confirm Reject
                              </button>
                              <button
                                className="py-1 px-2 rounded-lg border-2 border-yellow-500 text-yellow-500 font-semibold shadow-md hover:bg-yellow-500 hover:text-white transition-all duration-300 text-xs"
                                onClick={() => handleAction(request.ID, 'resubmit')}
                              >
                                Confirm Resubmit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No pending leave requests found.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      )}

        {activeTab === 'approved' && <ApprovedLeavesDashboard />}
        {activeTab === 'rejected' && <RejectedLeaves />}
        {activeTab === 'adjustments' && <AdjustLeaveButton />}
        {activeTab === 'attendance' && <ApprovalToggle />}
      </div>
     {/* Calendar Section */}
     
     <div className="w-full lg:w-1/3 lg:pl-4 ">
          <div className="calendar-section">
            <h2 className="text-lg font-semibold mb-4">Leave Calendar</h2>
            <div className="calendar-container bg-white  rounded-lg shadow-md">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={leaveRequests.map(request => ({
                  title: request.NAME,
                  start: request.START_DATE,
                  end: request.END_DATE
                }))}
                height={400} // Adjust the height as needed
              />
             
            </div>
          </div>
          <BulkUploadLeaveButton/>
        </div>
        
    
      </div>
      </div>
     
  );
};

export default LeaveManagementDashboard;
