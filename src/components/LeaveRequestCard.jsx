import React from 'react';

const LeaveRequestCard = ({ request, onHandleRequest, viewMode }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
    <div className="bg-gray-100 p-4 border-b border-gray-200">
      <div className={`flex ${viewMode === 'list' ? 'items-center' : 'self-center'}`}>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{request.name}</h3>
          <p className="text-sm text-gray-600">Leave Type: {request.leaveType}</p>
          <p className="text-sm text-gray-600">Start Date: {request.startDate}</p>
          <p className="text-sm text-gray-600">End Date: {request.endDate}</p>
          <p className="text-sm text-gray-600">Reason: {request.reason}</p>
        </div>
        {viewMode === 'list' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onHandleRequest(request.id, 'reject')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => onHandleRequest(request.id, 'approve')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
    {viewMode === 'grid' && (
      <div className="p-4 text-center">
        <p className="text-sm">Start date: {request.startDate}</p>
        <p className="text-sm">End date: {request.endDate}</p>
        <p className="text-sm">Number of days: {request.days}</p>
        <p className="text-sm">Leave type: {request.leaveType}</p>
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => onHandleRequest(request.id, 'reject')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Reject
          </button>
          <button
            onClick={() => onHandleRequest(request.id, 'approve')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Approve
          </button>
        </div>
      </div>
    )}
  </div>
);

export default LeaveRequestCard;
