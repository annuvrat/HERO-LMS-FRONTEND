import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PunchRecords from './PunchComponent';

const AttendanceSummary = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalLeaves: 0,
    leaveTaken: 0,
    remainingLeaves: 0,
    holidays: 0,
  });

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3000/leave-balance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (Array.isArray(response.data)) {
          setLeaveBalance(response.data);

          const totalLeaves = response.data.reduce((acc, leave) => acc + leave.totalLeaves, 0);
          const leaveTaken = response.data.reduce((acc, leave) => acc + leave.leavesTaken, 0);
          const remainingLeaves = totalLeaves - leaveTaken;
          const holidays = 8; // Assuming holidays are fixed; adjust as needed

          setSummaryData({ totalLeaves, leaveTaken, remainingLeaves, holidays });
        }
      } catch (error) {
        console.error('Error fetching leave balance:', error);
      }
    };

    fetchLeaveBalance();
  }, []);

  const renderDonut = (totalLeaves, remainingLeaves, color, label) => {
    const radius = 50;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const percent = (remainingLeaves / totalLeaves) * 100;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;

    return (
      <div className="text-center p-2 rounded-lg shadow dark:bg-slate-800 bg-white flex flex-col items-center mx-2">
        <svg width="120" height="120" viewBox="0 0 120 120" className="relative">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className="text-sm font-semibold"
            fill={color}
          >
            {remainingLeaves}
          </text>
        </svg>
        <div className="mt-2 text-md font-semibold text-gray-800 dark:text-gray-200">
          Total: {totalLeaves}
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-white">
          {label}
        </div>
      </div>
    );
  };

  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'teal', 'indigo'];

  return (
    <div className="px-4 py-2 bg-white shadow rounded-lg flex flex-col gap-4 dark:bg-black dark:text-white">
      {/* Summary and Punch Records */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        {/* Summary Data */}
        <div className="w-full">
          <h2 className='text-xl font-bold text-left mb-4'>Leave Balance Summary</h2>
          <div className="flex flex-wrap justify-between">
            {/* Total Leaves */}
            <div className="text-center w-1/2 sm:w-1/4 mb-4 sm:mb-0">
              <div className="text-2xl font-bold text-blue-500">{summaryData.totalLeaves}</div>
              <div className="text-gray-500">Total Leaves</div>
            </div>
            {/* Leaves Taken */}
            <div className="text-center w-1/2 sm:w-1/4 mb-4 sm:mb-0">
              <div className="text-2xl font-bold text-red-500">{summaryData.leaveTaken}</div>
              <div className="text-gray-500">Leaves Taken</div>
            </div>
            {/* Remaining Leaves */}
            <div className="text-center w-1/2 sm:w-1/4 mb-4 sm:mb-0">
              <div className="text-2xl font-bold text-green-500">{summaryData.remainingLeaves}</div>
              <div className="text-gray-500">Remaining</div>
            </div>
            {/* Holidays */}
            <div className="text-center w-1/2 sm:w-1/4">
              <div className="text-2xl font-bold text-yellow-500">{summaryData.holidays}</div>
              <div className="text-gray-500">Holidays</div>
            </div>
          </div>
        </div>

        {/* Punch Records */}
        <div className="flex-none ml-0 md:ml-4 mt-4 md:mt-0" style={{ width: '300px' }}>
          <PunchRecords />
        </div>
      </div>

      {/* Leave Balances with Donuts */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Array.isArray(leaveBalance) && leaveBalance.length > 0 ? (
          leaveBalance.map((leave, index) => (
            <div key={leave.leaveType} className="flex-grow">
              {renderDonut(
                leave.totalLeaves,
                leave.remainingLeaves,
                colors[index % colors.length],
                leave.leaveType
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-white w-full">No data available</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;
