import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../pages/NotificationBell";

export default function Navbar() {
  const { user} = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-black">
        <Link to ="/" className="text-2xl font-bold tracking-wide">StudyMatch</Link>

        {!user? (
          <nav className="flex gap-6">
          <Link
            to="/signup"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200  font-medium"
          > 
            Signup
          </Link>
          <Link
            to="/login"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
          >
            Login
          </Link>
        </nav>
        ):
        (<nav className="flex gap-6">
          <Link
            to="/matches"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200  font-medium"
          >
          Find Partner
          </Link>
          <Link
            to="/room"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
          >
            Room
          </Link>
          <Link
            to="/todo"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200 font-medium"
          >
            ToDo
          </Link>
          <Link
            to="/profile"
            className=" text-gray-600 hover:text-gray-900 hover:font-bold transition-colors duration-200  font-medium"
          >
            Profile
          </Link>
          <NotificationBell/>
          </nav>)}
        
      </div>
    </header>
  );
}
