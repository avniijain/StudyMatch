import { useEffect, useState } from "react";
import socket from "../socketClient";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 🔹 Fetch existing notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    // 🔹 Listen for new notifications
    socket.on("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      alert(`${notification.sender.name} sent you a request to join your room "${notification.room.name}"`);
    });

    return () => socket.off("notification:new");
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      // Remove notification locally
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (action === "accept") {
        alert("You accepted the request");
      } else if (action === "reject") {
        // Show alert for rejection
        alert("You rejected the request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>🔔 ({notifications.length})</button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="mb-2 p-2 border-b">
                <p><b>{n.sender.name}</b> wants to join your room</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleAction(n._id, "accept")}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(n._id, "reject")}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
