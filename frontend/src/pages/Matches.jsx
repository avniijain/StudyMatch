import React, { useState, useEffect } from 'react';
import socket from '../socketClient';

const Matches = () => {
  const [activeTab, setActiveTab] = useState('suggested');
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const url =
          activeTab === "suggested"
            ? `${import.meta.env.VITE_API_URL}/api/room/suggested`
            : `${import.meta.env.VITE_API_URL}/api/room/active`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, [activeTab]);

  useEffect(() => {
    socket.on("room_list_update", (updatedRooms) => {
      if (activeTab === "all") {
        setRooms(updatedRooms);
      }
    });

    socket.on("match_list_update", (suggestedRooms) => {
      if (activeTab === "suggested") {
        setRooms(suggestedRooms);
      }
    });

    return () => {
      socket.off("room_list_update");
      socket.off("match_list_update");
    };
  }, [activeTab]);


  const handleSendRequest = async (roomId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // auth
        },
        body: JSON.stringify({ roomId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to send request");

      alert("✅ Request sent to host!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Find Your Study Partner
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab('suggested')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'suggested'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Suggested Rooms
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'all'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              All Active Rooms
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-2 text-center text-gray-600 py-12">
              {activeTab === "suggested" ? (
                <p className="text-lg">No suggestions available right now 🤷‍♂️</p>
              ) : (
                <p className="text-lg">No active rooms at the moment 💤</p>
              )}
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Room Subject */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {room.subject}
                    </h3>

                    {/* Participants */}
                    <p className="text-gray-600 mb-4">
                      Participants:{" "}
                      {room.participants?.map((p) => p.name).join(", ") || "No one yet"}
                    </p>
                  </div>

                  {/* Online Indicator */}
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${room.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {room.status === "active" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                {/* Send Request button */}
                <button
                  onClick={() => handleSendRequest(room._id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Request
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Matches;