import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PunchRecords = () => {
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [manager, setManager] = useState('Anil Kumar'); // Default manager name

  useEffect(() => {
    const fetchPunchRecords = async () => {
      try {
        const response = await axios.get('', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the JWT is stored in localStorage
          },
        });

        const { punchInTime, punchOutTime, totalTime, manager } = response.data;

        setPunchInTime(punchInTime);
        setPunchOutTime(punchOutTime);
        setTotalTime(totalTime);
        setManager(manager || 'Anil Kumar'); // Default to "Anil Kumar" if no manager is assigned
      } catch (error) {
        console.error('Error fetching punch records:', error);
      }
    };

    fetchPunchRecords();
  }, []);

  return (
    <div className="w-full max-w-xs p-2 bg-white dark:bg-black rounded-lg shadow-md h-auto flex flex-col justify-center text-xs md:text-sm"> 
      <div className="flex justify-between text-gray-600 dark:text-gray-300">
        <span>Punch In:</span> 
        <span className="font-bold truncate max-w-[100px]">{punchInTime || 'Not recorded'}</span> {/* Made text bold */}
      </div>
      <div className="flex justify-between text-gray-600 dark:text-gray-300 mt-1">
        <span>Punch Out:</span>
        <span className="font-bold truncate max-w-[100px]">{punchOutTime || 'Not recorded'}</span> {/* Made text bold */}
      </div>
      <div className="flex justify-between text-gray-600 dark:text-gray-300 mt-1">
        <span>Total Time:</span>
        <span className="font-bold truncate max-w-[100px]">{totalTime || 'N/A'}</span> {/* Made text bold */}
      </div>
      <div className="flex justify-between text-gray-600 dark:text-gray-300 mt-1">
        <span>Manager:</span>
        <span className="font-bold truncate max-w-[100px]">{manager}</span> {/* Made text bold */}
      </div>
    </div>
  );
};

export default PunchRecords;
