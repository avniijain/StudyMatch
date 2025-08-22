import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socketClient";

const Meetpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Listen for room closed event
  useEffect(() => {
    socket.on("room_closed", ({ message }) => {
      alert(message);
      navigate("/room"); // redirect to rooms list
    });

    return () => {
      socket.off("room_closed");
    };
  }, [navigate]);

  // Fetch room info by ID
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/room/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchRoom();
  }, [id]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading room...
      </div>
    );
  }

  const roomName = room.meetLink.replace("https://meet.jit.si/", "");

  // Handle leaving the room
  const leaveRoom = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/room/leave/${room._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      socket.emit("leave_room", { roomId: room._id });
      navigate("/room");
    } catch (err) {
      console.error("Error leaving room:", err);
      navigate("/room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {room.roomName} ({room.subject})
        </h1>
        <p className="text-gray-600 mb-6">
          Type: {room.type} | Status: {room.status}
        </p>

        {/* Leave Room Button */}
        <div className="mb-4">
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Leave Room
          </button>
        </div>

        {/* Jitsi iframe embed */}
        <div style={{ width: "100%", height: "600px" }}>
          <iframe
            src={`https://meet.jit.si/${roomName}#userInfo.displayName="${user?.name || "Guest"}"&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.prejoinPageEnabled=false`}
            style={{ width: "100%", height: "100%", border: 0 }}
            allow="camera; microphone; fullscreen; display-capture"
            title="Jitsi Meeting"
          />
        </div>

        {/* Participants List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Participants
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            {room.participants.length > 0 ? (
              room.participants.map((p) => (
                <li key={p._id}>{p.name || p.email}</li>
              ))
            ) : (
              <li>No participants yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Meetpage;
