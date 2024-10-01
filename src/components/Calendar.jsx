import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';

// Define colors for different leave types and attendance statuses
const leaveTypeColors = {
  'CL': 'orange',  // Casual Leave
  'SL': 'turquoise',   // Sick Leave
  'EL': 'lightgreen',
  'WP': 'yellow'  // Earned Leave
};

const attendanceColors = {
  'Present': 'lightgreen',
  'Absent': 'lightcoral'
};

const Calendar = () => {
  const [showModal, setShowModal] = useState(false);
  const [absentDate, setAbsentDate] = useState(null); // State for absent date
  const [reason, setReason] = useState(''); // State for reason input
  const [events, setEvents] = useState([]);
  const [calendarHeight, setCalendarHeight] = useState('auto');
  const [calendarContentHeight, setCalendarContentHeight] = useState(350);
  const [calendarAspectRatio, setCalendarAspectRatio] = useState(1.25);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });

  const fetchCalendarData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in.');
        return;
      }

      const response = await axios.get('http://localhost:3000/calendar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const calendarData = response.data;

        const transformedEvents = calendarData.map(event => {
          if (event.type === 'meeting') {
            return {
              title: event.title,
              start: event.startTime,
              end: event.endTime,
              extendedProps: {
                description: event.description,
                type: event.type
              },
            };
          } else if (event.type === 'leave') {
            return {
              title: `Leave: ${event.leaveType}`,
              start: event.startDate,
              end: event.endDate,
              extendedProps: {
                status: event.status,
                type: event.type,
                leaveType: event.leaveType
              },
            };
          } else if (event.type === 'holiday') {
            return {
              title: `Holiday: ${event.holidayName}`,
              start: event.date,
              extendedProps: {
                description: event.description,
                type: event.type
              },
            };
          } else if (event.type === 'attendance') {
            return {
              title: event.status,
              start: event.date,
              extendedProps: {
                status: event.status,
                type: event.type
              },
            };
          } else {
            return null;
          }
        }).filter(event => event !== null);

        setEvents(transformedEvents);
      } else {
        console.error(`Failed to fetch calendar data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error.response?.data || error.message);
    }
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      setCalendarHeight(300);
      setCalendarContentHeight(200);
      setCalendarAspectRatio(0.8);
    } else if (screenWidth <= 768) {
      setCalendarHeight(400);
      setCalendarContentHeight(300);
      setCalendarAspectRatio(1.2);
    } else {
      setCalendarHeight('115vh');
      setCalendarContentHeight(350);
      setCalendarAspectRatio(1.25);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEventMouseEnter = (info) => {
    const { type, status, description, leaveType } = info.event.extendedProps;
    let hoverData = {};

    if (type === 'leave') {
      hoverData = {
        title: info.event.title,
        status: status || 'No status',
      };
    } else if (type === 'meeting') {
      hoverData = {
        title: info.event.title,
        description: description || 'No description',
      };
    } else if (type === 'attendance') {
      hoverData = {
        title: info.event.title,
        status: status || 'No status',
      };
    }

    const { clientX, clientY } = info.jsEvent;
    setHoverInfo(hoverData);
    setHoverPosition({ top: clientY + 10, left: clientX + 10 });
  };

  const handleEventMouseLeave = () => {
    setHoverInfo(null);
  };

  const handleEventClick = (info) => {
    const { title, extendedProps } = info.event;
    const status = extendedProps.status || 'No status';
    const { clientX, clientY } = info.jsEvent;

    setHoverInfo(null);

    // Show absent modal if event status is 'Absent'
    if (status === 'Absent') {
      setAbsentDate(info.event.startStr); // Set the absent date
      setShowModal(true);
    }

    setClickInfo({
      title,
      status
    });

    setClickPosition({ top: clientY + 10, left: clientX + 10 });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token'); // Retrieve the JWT token
  
    if (!token) {
      alert('You are not logged in. Please log in to submit a request.');
      return;
    }
  
    const requestData = {
      absentDate,  // Ensure this is a valid date in 'YYYY-MM-DD' format
      reason       // Ensure this is a non-empty string
    };
  
    try {
      // Send the request to the backend API with the token
      const response = await axios.post('http://localhost:3000/attendance-correction', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include JWT in headers
        }
      });
  
      if (response.status === 201) {
        alert('Attendance correction request submitted successfully.');
        handleCloseModal(); // Close the modal on success
      }
    } catch (error) {
      // Handle 400 (Bad Request) errors
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error || 'Bad request: Please check your input.');
      } else {
        console.error('Error submitting attendance correction request:', error);
        alert('Error submitting attendance correction request.');
      }
    }
  };
  
  return (
    <div className="relative p-3  m-2 shadow-lg font-bold rounded-lg dark:border-white-50">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        headerToolbar={{
          start: 'prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short',
        }}
        height={calendarHeight}
        contentHeight={calendarContentHeight}
        aspectRatio={calendarAspectRatio}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        eventClick={handleEventClick}
      />

      {hoverInfo && (
        <div
          className="absolute bg-white border border-white-300 p-2 rounded-lg shadow-md z-10"
          style={{ top: hoverPosition.top, left: hoverPosition.left, transform: 'translate(-50%, 0)' }}
        >
          {hoverInfo.description ? (
            <div><strong>Meeting:</strong> {hoverInfo.title}</div>
          ) : (
            <>
              <div><strong>Event:</strong> {hoverInfo.title}</div>
              <div><strong>Status:</strong> {hoverInfo.status}</div>
            </>
          )}
        </div>
      )}

      {clickInfo && (
        <div
          className="absolute bg-white border border-gray-300 p-2 rounded-lg shadow-md z-10"
          style={{ top: clickPosition.top, left: clickPosition.left, transform: 'translate(-50%, 0)' }}
        >
          <div><strong>Event:</strong> {clickInfo.title}</div>
          <div><strong>Status:</strong> {clickInfo.status}</div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Absent Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Absent Date:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={absentDate}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Reason:</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
// Custom render function for event content
function renderEventContent(eventInfo) {
  const { description, type, leaveType, status } = eventInfo.event.extendedProps; // Include status here
  let backgroundColor = 'transparent';

  // Determine background color based on leave type or attendance status
  if (type === 'leave') {
    backgroundColor = leaveTypeColors[leaveType] || 'lightgray';
  } else if (type === 'attendance') {
    backgroundColor = attendanceColors[status] || 'transparent'; // Ensure to use status here
  }

  return (
    <div
      className="p-1"
      style={{
        backgroundColor,
        color: 'black',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0.5em',
        boxSizing: 'border-box',
      }}
    >
      {/* Conditionally render time for meetings only */}
      {type === 'meeting' && eventInfo.timeText && (
        <div style={{ marginBottom: '0.2em' }}>
          <b className="p-1">{eventInfo.timeText}</b>
        </div>
      )}
      <i>{eventInfo.event.title}</i>
      {description && <div>{description}</div>}
    </div>
  );
}

export default Calendar;
