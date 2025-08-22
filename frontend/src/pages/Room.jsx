import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../socketClient';

const Room = () => {
  const [roomType, setRoomType] = useState('solo');
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
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
    if (roomName.trim() && subject.trim()) {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/room/create`,
          { type: roomType, roomName: roomName, subject },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // assuming JWT stored
        );

        // Navigate to new room
        navigate(`/room/${data._id}`);
      } catch (err) {
        console.error('Error creating room:', err);
      }
    }
  };

  const handleJoinCall = async (roomId) => {
    try {
      // Call API to join the room
      await fetch(`${import.meta.env.VITE_API_URL}/api/room/join/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Emit socket event
      socket.emit("join_room", { roomId });

      // Redirect to room page
      navigate(`/room/${roomId}`);
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

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room? All participants will be removed."
    );
    if (!confirmDelete) return;

    try {
      // Call API to delete room
      await fetch(`${import.meta.env.VITE_API_URL}/api/room/delete/${roomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Emit socket event
      socket.emit("room_deleted", { roomId });

      // Update UI: remove from displayed rooms
      setRooms((prevRooms) => prevRooms.filter((r) => r._id !== roomId));
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert("Could not delete room. Try again.");
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
                  Room type
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-700"
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
                  Room name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter a subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Create Room
              </button>
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
                      {room.host === userId && (
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                        >
                          Delete Room
                        </button>
                      )}
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