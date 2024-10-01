import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const LeaveForm = () => {
  const [formMode, setFormMode] = useState('leave'); // 'leave' or 'meeting'
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [meetingStartDateTime, setMeetingStartDateTime] = useState('');
  const [meetingEndDateTime, setMeetingEndDateTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hardcoded leave types
  const leaveTypes = [
    { id: 1, name: 'SL (Sick Leave)' },
    { id: 2, name: 'CL (Casual Leave)' },
    { id: 3, name: 'EL (Earned Leave)' },
    { id: 4, name: 'PL (Paternity Leave)' },
    { id: 5, name: 'WP (Without Pay)' },
  ];

  // Fetch attendees for meetings
  useEffect(() => {
    if (formMode === 'meeting') {
      const fetchAttendees = async () => {
        try {
          const response = await axios.get('http://localhost:3000/attendees'); // Adjust API endpoint if needed
          setAttendees(response.data);
        } catch (err) {
          console.error('Failed to fetch attendees', err);
        }
      };

      fetchAttendees();
    }
  }, [formMode]);

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to request leave.');
      return;
    }

    const employeeInfo = JSON.parse(atob(token.split('.')[1]));
    const empl_code = employeeInfo.empl_code;

    try {
      const response = await axios.post(
        'http://localhost:3000/request-leave',
        {
          empl_code,
          leave_type_id: leaveTypeId,
          start_date: startDate,
          end_date: endDate,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error details:', err.response || err.message);
      setError('An error occurred while submitting the leave request.');
    }
  };

  const handleSubmitMeeting = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to schedule a meeting.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/schedule-meeting',
        {
          title: meetingTitle,
          start_datetime: meetingStartDateTime,
          end_datetime: meetingEndDateTime,
          description: meetingDescription,
          attendees: meetingAttendees,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error details:', err.response || err.message);
      setError('An error occurred while scheduling the meeting.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAttendeeClick = (empl_code) => {
    setMeetingAttendees((prevAttendees) =>
      prevAttendees.includes(empl_code)
        ? prevAttendees.filter((attendee) => attendee !== empl_code)
        : [...prevAttendees, empl_code]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-sd mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {formMode === 'leave' ? 'Request Leave' : 'Schedule Meeting'}
        </h2>
      </div>

      {/* Toggle Buttons for Leave Request and Meeting Scheduler */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`${
            formMode === 'leave' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          } px-4 py-2 rounded-md`}
          onClick={() => setFormMode('leave')}
        >
          Leave Request
        </button>
        <button
          className={`${
            formMode === 'meeting' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          } px-4 py-2 rounded-md`}
          onClick={() => setFormMode('meeting')}
        >
          Meeting Scheduler
        </button>
      </div>

      {message && <div className="p-4 mb-4 text-green-800 bg-green-200 rounded">{message}</div>}
      {error && <div className="p-4 mb-4 text-red-800 bg-red-200 rounded">{error}</div>}

      {formMode === 'leave' ? (
        <form onSubmit={handleSubmitLeave}>
          <div className="mb-4">
            <label className="block text-gray-700">Leave Type</label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Leave Type</option>
              {leaveTypes.map((leaveType) => (
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit Leave Request
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitMeeting}>
          <div className="mb-4">
            <label className="block text-gray-700">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Meeting Start Date & Time</label>
            <input
              type="datetime-local"
              value={meetingStartDateTime}
              onChange={(e) => setMeetingStartDateTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Meeting End Date & Time</label>
            <input
              type="datetime-local"
              value={meetingEndDateTime}
              onChange={(e) => setMeetingEndDateTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Meeting Description</label>
            <textarea
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative mb-4">
            <label className="block text-gray-700">Attendees</label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {meetingAttendees.length > 0
                  ? `${meetingAttendees.length} Attendee(s) Selected`
                  : 'Select Attendees'}
              </button>
              {dropdownOpen && (
                <div ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="max-h-60 overflow-auto">
                    {attendees.map((attendee) => (
                      <div
                        key={attendee.EMPL_CODE}
                        onClick={() => handleAttendeeClick(attendee.EMPL_CODE)}
                        className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${meetingAttendees.includes(attendee.EMPL_CODE) ? 'bg-gray-200' : ''}`}
                      >
                        {attendee.employee_name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Schedule Meeting
          </button>
        </form>
      )}
    </div>
  );
};

export default LeaveForm;
