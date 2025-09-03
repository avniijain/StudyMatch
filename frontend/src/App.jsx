import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./router";
import socket from "./socketClient";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect(); // connect only once

    return () => {
      socket.disconnect(); // disconnect on unmount (optional)
    };
  }, []);

  useEffect(() => {
    socket.on("notification:update", (data) => {
      const currentUserId = localStorage.getItem("userId");
      if (data.receiver !== currentUserId) return;
      if (data.status === "accepted") {
        alert("Your request was accepted! You can now join the call through room page.");
      } else if (data.status === "rejected") {
        alert("Your request to join the room was rejected");
      }
    });

    return () => socket.off("notification:update");
  }, [navigate]);

  const location = useLocation();
  // Paths where you DON'T want navbar/footer
  const hideNavFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!hideNavFooter && <Navbar />}
        <div className="flex-grow">
          <AppRouter />
        </div>
        {!hideNavFooter && <Footer />}
      </div>
    </>
  );
}
