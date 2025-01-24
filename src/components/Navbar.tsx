import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gray-50 shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link to="/home" className="text-xl font-bold nav-link">
            idioma-ai
          </Link>

          {/* Middle: Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div 
              className="relative group"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <Link to="/tools" className="nav-link flex items-center">
                Tools <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              {toolsOpen && (
                <div className="dropdown">
                  <Link to="/tools/sub1" className="block px-4 py-2 nav-link hover:bg-gray-50">Spanish Conjugations</Link>
                  <Link to="/tools/sub2" className="block px-4 py-2 nav-link hover:bg-gray-50">Spanish Vocabulary</Link>
                  <Link to="/tools/sub3" className="block px-4 py-2 nav-link hover:bg-gray-50">Sub Tool 3</Link>
                </div>
              )}
            </div>

            <div 
              className="relative group"
              onMouseEnter={() => setTeachersOpen(true)}
              onMouseLeave={() => setTeachersOpen(false)}
            >
              <Link to="/teach" className="nav-link flex items-center">
                For Teachers <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              {teachersOpen && (
                <div className="dropdown">
                  <Link to="/teach/sub1" className="block px-4 py-2 nav-link hover:bg-gray-50">Teacher Tool 1</Link>
                  <Link to="/teach/sub2" className="block px-4 py-2 nav-link hover:bg-gray-50">Teacher Tool 2</Link>
                </div>
              )}
            </div>

            <Link to="/saas1" className="nav-link">SaaS Tool 1</Link>
            <Link to="/saas2" className="nav-link">AI Content Worksheets</Link>
            <Link to="/twilio" className="nav-link">Twilio</Link>
            <Link to="/twilioOptIn" className="nav-link">Twilio Messaging Opt-In</Link>
          
          </div>

          {/* Right: Profile */}
          <div className="hidden md:block">
            <div 
              className="relative group"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="nav-link flex items-center">
                Profile <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {profileOpen && (
                <div className="dropdown">
                  <Link to="/profile/config" className="block px-4 py-2 nav-link hover:bg-gray-50">
                    Profile and Configuration
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 nav-link hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <Link to="/tools" className="block py-2 nav-link">Tools</Link>
            <Link to="/tools/sub1" className="block py-2 pl-4 nav-link">Sub Tool 1</Link>
            <Link to="/tools/sub2" className="block py-2 pl-4 nav-link">Sub Tool 2</Link>
            <Link to="/tools/sub3" className="block py-2 pl-4 nav-link">Sub Tool 3</Link>
            
            <Link to="/teach" className="block py-2 nav-link">For Teachers</Link>
            <Link to="/teach/sub1" className="block py-2 pl-4 nav-link">Teacher Tool 1</Link>
            <Link to="/teach/sub2" className="block py-2 pl-4 nav-link">Teacher Tool 2</Link>
            
            <Link to="/saas1" className="block py-2 nav-link">SaaS Tool 1</Link>
            <Link to="/saas2" className="block py-2 nav-link">SaaS Tool 2</Link>
            <Link to="/twilio" className="block py-2 nav-link">Twilio</Link>
            <Link to="/twilioOptIn" className="block py-2 nav-link">Twilio Messaging Opt-In</Link>
            <Link to="/profile/config" className="block py-2 nav-link">Profile and Configuration</Link>
            <button onClick={handleLogout} className="w-full text-left py-2 nav-link">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;