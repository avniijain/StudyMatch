import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/matches");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="max-w-4xl mx-auto mt-16 p-6 flex flex-col md:flex-row gap-8 bg-[#F5F6FA] rounded-lg shadow-lg">
    {/* Left Welcome Card */}
    <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-semibold mb-4 text-[#2F5D62]">Welcome Back!</h2>
      <p className="text-[#227a6a] mb-6 leading-relaxed">
        We're happy to see you again. Log in to access your account and continue studying and managing your tasks smoothly.
      </p>
      <ul className="text-[#227a6a] space-y-3">
        <li className="flex items-center gap-3">
          <span className="inline-block w-5 h-5 bg-[#227a6a] rounded-full"></span> Secure and private login
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-block w-5 h-5 bg-[#227a6a] rounded-full"></span> Easy access on all devices
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-block w-5 h-5 bg-[#227a6a] rounded-full"></span> Fast and reliable service
        </li>
      </ul>
    </div>

    {/* Right Login Form Card */}
    <div className="flex-1 bg-white rounded-xl shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#3B6978]">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-[#CAD2C5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#52796F]"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-[#CAD2C5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#52796F]"
          required
        />
        <button
          type="submit"
          className="bg-[#227a6a] hover:bg-[#2F5D62] text-white font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-[#354F52] text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-[#227a6a] hover:underline font-medium">
          Signup here
        </Link>
      </p>
    </div>
  </div>
);
}
