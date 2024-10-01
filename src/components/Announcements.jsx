import { useState, useEffect } from "react";
import axios from "axios";
import AnnouncementMessage from "./AnnouncementMessage";

const Announcements = () => {
  const [messages, setMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // Controls "Show All" or "Show Less"

  // Fetch announcements from the API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/announcements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
        setVisibleMessages(response.data.slice(0, 2)); // Show only 2 initially
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching announcements:",
          error.response?.status || error.message
        );
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Announcement rotation effect
  useEffect(() => {
    if (messages.length === 0 || showAll) return; // Stop rotation when showing all

    const interval = setInterval(() => {
      setVisibleMessages((prevMessages) => {
        const nextMessage = messages[currentIndex % messages.length];
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        return [...prevMessages.slice(1), nextMessage];
      });
    }, 3000); // Adjust the interval time as needed

    return () => clearInterval(interval);
  }, [currentIndex, messages, showAll]);

  // Handle "Show All" button click
  const handleShowAll = () => {
    setShowAll(true);
    setVisibleMessages(messages); // Show all messages
  };

  // Handle "Show Less" button click
  const handleShowLess = () => {
    setShowAll(false);
    setVisibleMessages(messages.slice(0, 2)); // Show only first 2 messages again
  };

  return (
    <div className="rounded-md shadow-lg m-2 p-4 dark:bg-slate-900 dark:border-white-50">
      <h1 className="font-bold text-xl mb-3 dark:text-gray-50">Announcements</h1>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading announcements...
        </p>
      ) : (
        <div className="relative space-y-2 transition-all duration-500 ease-in-out">
          {visibleMessages.map((msg, index) => (
            <div
              key={`${msg.id}-${index}`} // Combine id and index to ensure uniqueness
              className={`transform transition-transform ${
                !showAll && index === visibleMessages.length - 1
                  ? "animate-slide-up"
                  : ""
              }`}
            >
              <AnnouncementMessage message={msg.title} info={msg.content} />
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-center">
        {!showAll ? (
          // Show the "SEE ALL" button if not all announcements are visible
          <button
            onClick={handleShowAll}
            className="text-blue-500 hover:text-blue-700"
          >
            SEE ALL ANNOUNCEMENTS
          </button>
        ) : (
          // Show the "SEE LESS" button if all announcements are visible
          <button
            onClick={handleShowLess}
            className="text-blue-500 hover:text-blue-700"
          >
            SEE LESS ANNOUNCEMENTS
          </button>
        )}
      </div>
    </div>
  );
};

export default Announcements;
