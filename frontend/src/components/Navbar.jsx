import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../pages/NotificationBell";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between text-black">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold tracking-wide"
            onClick={closeMobileMenu}
          >
            StudyMatch
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            {!user ? (
              <nav className="flex gap-4 lg:gap-6">
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
              </nav>
            ) : (
              <nav className="flex gap-4 lg:gap-6 items-center">
                <Link
                  to="/matches"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  Find Partner
                </Link>
                <Link
                  to="/room"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  Room
                </Link>
                <Link
                  to="/todo"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  ToDo
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
                >
                  Profile
                </Link>
                <NotificationBell />
              </nav>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 pb-2 border-t border-gray-100 mt-4">
            {!user ? (
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </nav>
            ) : (
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/matches"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Find Partner
                </Link>
                <Link
                  to="/room"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Room
                </Link>
                <Link
                  to="/todo"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  ToDo
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium py-2 px-2 rounded hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <div className="py-2 px-2">
                  <NotificationBell />
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}