import React, { useEffect, useState } from 'react';
import { User, Mail, BookOpen, Target, Edit3, LogOut, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token, logout, updateUser} = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!token){
      navigate('/login');
      return;
    }
    const fetchUser = async()=>{
      try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          console.error(`HTTP Error: ${res.status} ${res.statusText}`);
          if (res.status === 401) {
            // Token is invalid, redirect to login
            logout();
            navigate('/login');
            return;
          }
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON:', contentType);
          const text = await res.text();
          console.error('Response text:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        const data = await res.json();
        setProfileData(data);
        setEditData(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        // If it's a JSON parsing error, the API might be returning HTML
        if (err.message.includes('JSON')) {
          alert.error('Server error: Please check if the API is running correctly');
        }
      } finally{
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editData,
        subjects: typeof editData.subjects === "string"
          ? editData.subjects.split(",").map(s => s.trim()).filter(Boolean)
          : editData.subjects,
        goals: typeof editData.goals === "string"
          ? editData.goals.split(",").map(g => g.trim()).filter(Boolean)
          : editData.goals,
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error(`HTTP Error: ${res.status} ${res.statusText}`);
        if (res.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error(`Failed to update profile: ${res.status}`);
      }

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Update response is not JSON:', contentType);
        const text = await res.text();
        console.error('Response text:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const updatedUser = await res.json();
      updateUser(updatedUser);
      setProfileData(updatedUser);
      setIsEditing(false);
      alert.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert.error(`Error updating profile: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Show loading spinner while data is being fetched
  if(loading || !profileData){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-[#477572] px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User size={48} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profileData?.name || 'Unknown User'}</h1>
                  <p className="text-blue-100 mt-2 flex items-center">
                    <Mail size={16} className="mr-2" />
                    {profileData?.email || 'No email'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-3 text-blue-600" size={20} />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData?.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">{profileData?.name || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 cursor-not-allowed">
                    {profileData?.email || 'No email'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editData?.gender || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">{profileData?.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="mr-3 text-green-600" size={20} />
                Academic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subjects</label>
                  {isEditing ? (
                    <textarea
                      name="subjects"
                      value={Array.isArray(editData?.subjects) ? editData.subjects.join(', ') : (editData?.subjects || '')}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter subjects separated by commas"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {profileData?.subjects && profileData.subjects.length > 0 ? (
                          (Array.isArray(profileData.subjects) ? profileData.subjects : profileData.subjects.split(',')).map((subject, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {typeof subject === 'string' ? subject.trim() : subject}
                            </span>
                          ))
                        ) : (
                          <p className='text-gray-500'>No subjects added</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="mr-3 text-[#667157]" size={20} />
                Goals & Aspirations
              </h2>

              <div>
                {isEditing ? (
                  <textarea
                    name="goals"
                    value={Array.isArray(editData?.goals) ? editData.goals.join(', ') : (editData?.goals || '')}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Share your academic and personal goals"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <ul className="space-y-2">
                      {profileData?.goals && profileData.goals.length > 0 ? (
                        (Array.isArray(profileData.goals) ? profileData.goals : profileData.goals.split(',')).map((goal, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-[#667157] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-800">{typeof goal === 'string' ? goal.trim() : goal}</span>
                          </li>
                        ))
                      ) : (
                        <p className='text-gray-500'>No goals added</p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#477572] text-white rounded-lg hover:bg-[#083d3a] flex items-center space-x-2 transition-all duration-200"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}