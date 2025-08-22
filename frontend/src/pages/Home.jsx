import { useAuth } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { Users, BarChart3, ArrowRight, Globe } from 'lucide-react';

export default function Home() {
  const {user} = useAuth();
  const navigate = useNavigate();

  const handleStart = () =>{
    if(user) navigate('/matches');
    else navigate('/signup');
  };

  const handleRoom = () =>{
    if(user) navigate('/room');
    else navigate('/signup');
  };

  const handleDashboard = () =>{
    if(user) navigate('/dashboard');
    else navigate('/signup');
  };

  const handleProfile = () =>{
    if(user) navigate('/profile');
    else navigate('/signup');
  };

  const handleTodo = () =>{
    if(user) navigate('/todo');
    else navigate('/signup');
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#d1d1d8'}}>
      {/* Hero Section */}
      <section className="text-white py-24" style={{backgroundColor: '#2c4a7a'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Study Better,
              <span className="block text-white">
                Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with motivated students, join study rooms, and transform your learning experience with collaborative tools and accountability partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleStart} className="text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors-200 flex items-center justify-center gap-2 bg-[#f9f9ff] hover:bg-[#d9d9e0] hover:scale-105 cursor-pointer" >
                Start Studying Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What is StudyMatch */}
      <section className="py-20" style={{backgroundColor: '#ffffff'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#1f2937'}}>What is StudyMatch?</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: '#6b7280'}}>
              StudyMatch is the ultimate platform for collaborative learning, connecting students worldwide 
              to create productive study environments and achieve academic excellence together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div onClick={handleStart} className="cursor-pointer p-8 rounded-2xl text-center border" style={{backgroundColor: '#eff6ff', borderColor: '#bfdbfe'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#1f2937'}}>Find Study Partners</h3>
              <p className="leading-relaxed" style={{color: '#6b7280'}}>
                Connect with like-minded students who share your academic goals and study schedule preferences.
              </p>
            </div>
            
            <div onClick={handleRoom} className="cursor-pointer p-8 rounded-2xl text-center border" style={{backgroundColor: '#eff6ff', borderColor: '#bfdbfe'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#1f2937'}}>Join Study Rooms</h3>
              <p className="leading-relaxed" style={{color: '#6b7280'}}>
                Enter focused virtual study spaces designed for different subjects, study styles, and academic levels.
              </p>
            </div>
            
            <div onClick={handleDashboard} className="cursor-pointer p-8 rounded-2xl text-center border" style={{backgroundColor: '#eff6ff', borderColor: '#bfdbfe'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#1f2937'}}>Track Progress</h3>
              <p className="leading-relaxed" style={{color: '#6b7280'}}>
                Monitor your study habits, set goals, and stay accountable with comprehensive analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Does It Work */}
      <section className="py-20" style={{backgroundColor: '#e2e2e9'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#1f2937'}}>How Does It Work?</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: '#6b7280'}}>
              Get started in minutes with our simple, intuitive process designed for seamless collaboration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div onClick={handleProfile} className="cursor-pointer text-center p-6 rounded-xl shadow-sm" style={{backgroundColor: '#ffffff'}}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{color: '#1f2937'}}>Create Your Profile</h3>
              <p style={{color: '#6b7280'}}>Set up your academic interests, study preferences, and availability.</p>
            </div>
            
            <div onClick={handleStart} className="cursor-pointer text-center p-6 rounded-xl shadow-sm" style={{backgroundColor: '#ffffff'}}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{color: '#1f2937'}}>Find Your Match</h3>
              <p style={{color: '#6b7280'}}>Browse study rooms or get matched with compatible study partners.</p>
            </div>
            
            <div onClick={handleRoom} className="cursor-pointer text-center p-6 rounded-xl shadow-sm" style={{backgroundColor: '#ffffff'}}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{color: '#1f2937'}}>Start Studying</h3>
              <p style={{color: '#6b7280'}}>Join study sessions, collaborate on projects, and stay motivated together.</p>
            </div>
            
            <div onClick={handleTodo} className="cursor-pointer text-center p-6 rounded-xl shadow-sm" style={{backgroundColor: '#ffffff'}}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#2c4a7a'}}>
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{color: '#1f2937'}}>Achieve Goals</h3>
              <p style={{color: '#6b7280'}}>Track progress, celebrate milestones, and achieve academic success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 bg-white text-[#2c4a7a]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Studies?</h2>
          <p className="text-xl mb-8 text-[#2c4a7a]">
            Join thousands of students and improve your academic performance through collaborative learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStart} className="cursor-pointer bg-[#e2e2e9] text-[#2c4a7a] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
