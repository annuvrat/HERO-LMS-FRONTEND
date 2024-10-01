import React, { useState, useEffect } from 'react';
import Announcements from './Announcements';
import AttendanceSummary from './AttendanceSummary';
import Calendar from './Calendar';
import Head from './Head';
import LeaveForm from './LeaveForm';

const Body = () => {
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    setShowComponents(true);
  }, []);

  return (
    <>
      <Head />
      <div className={`transition-opacity duration-1000 ${showComponents ? 'opacity-100' : 'opacity-0'}`}>
        <AttendanceSummary />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`md:col-span-3 transition-transform duration-500 ${showComponents ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
          <Calendar />
        </div>
        <div className="flex flex-col gap-1 md:col-span-1">
        <div className={`transition-opacity duration-1000 ${showComponents ? 'opacity-100' : 'opacity-0'}`}>
          <Announcements />
          <LeaveForm className="flex-grow" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Body;
