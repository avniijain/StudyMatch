import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../socketClient';

const Room = () => {
  const [roomType, setRoomType] = useState('solo');
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/room/my`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRooms(data.rooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchMyRooms();
  }, []);


  const handleCreateRoom = async () => {
    if (roomName.trim() && subject.trim() && meetLink.trim()) {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/room/create`,
          { type: roomType, roomName: roomName, subject, meetLink },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // assuming JWT stored
        );

        alert("Room created successfully and now you can go back to gmeet and continue study session")
      } catch (err) {
        console.error('Error creating room:', err);
      }
    }
  };

  const handleJoinCall = async (roomId) => {
    try {
      // Call API to join the room
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/room/join/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
      throw new Error("Failed to join room");
    }

    const data = await res.json();

      // Emit socket event
      socket.emit("join_room", { roomId });

      if (data.meetLink) {
        window.open(data.meetLink, "_blank");
      } else {
        alert("No meeting link found for this room.");
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Could not join room. Try again.");
    }
  };


  const handleLeaveRoom = async (roomId) => {
    try {
      // Call API to leave the room
      await fetch(`${import.meta.env.VITE_API_URL}/api/room/leave/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Emit socket event
      socket.emit("leave_room", { roomId });

      // Update UI: remove from displayed rooms
      setRooms((prevRooms) => prevRooms.filter((r) => r._id !== roomId));
    } catch (err) {
      console.error("Failed to leave room:", err);
      alert("Could not leave room. Try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Room</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Create New Room Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">Create a new room</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-700" required
                  >
                    <option value="solo">Solo</option>
                    <option value="group">Group</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400" required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter a subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400" required
                />
              </div>

              <div>
                <div className='flex justify-between'>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Generate meet link <span className="text-red-500">*</span>
                  </label>
                  <button onClick={() => window.open("https://meet.google.com/new", "_blank")} type="button" className="px-4 py-2 mb-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200">Generate</button>
                </div>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="Click on generate and paste meet link here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400" required
                />
              </div>

              <button
                onClick={() => {
                  if (!roomType || !roomName || !subject || !meetLink) {
                    alert("Please fill all required fields before creating a room.");
                    return;
                  }
                  handleCreateRoom();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Create Room
              </button>
              {/* Note */}
              <p className="text-sm text-gray-500 mt-4">
                💡 Make sure to <span className="font-semibold text-gray-700">leave the room </span>
                from <span className="font-semibold">My Rooms</span> once you end the call.
              </p>
            </div>
          </div>

          {/* My Rooms Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">My Rooms</h2>

            <div className="space-y-4">
              {rooms?.map ? rooms.map((room) => (
                <div key={room._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    {/* Left side - Room info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold text-gray-800">{room.subject}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${room.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {room.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{room.type}</p>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleJoinCall(room._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                      >
                        Join Call
                      </button>
                      <button
                        onClick={() => handleLeaveRoom(room._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                      >
                        Leave Room
                      </button>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;