import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">EasyEnroll</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} 
                  className={`font-semibold text-[15px] transition-colors relative ${isActive('/student/dashboard') || isActive('/admin/dashboard') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                >
                  Dashboard
                  {(isActive('/student/dashboard') || isActive('/admin/dashboard')) && (
                    <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
                <div className="flex items-center space-x-5 pl-5 border-l border-gray-200">
                  <div className="flex items-center space-x-2 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm shadow-inner text-sm text-gray-800">
                    <div className="bg-primary/20 p-1 rounded-full"><UserIcon className="h-3 w-3 text-primary" /></div>
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold text-[15px] text-gray-600 hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative bg-gradient-to-r from-primary to-accent px-6 py-2.5 rounded-xl font-semibold text-white shadow-xl flex items-center gap-2 transform group-hover:-translate-y-0.5 transition-all">
                    Get Started
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="text-gray-800 p-2">
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav absolute w-full top-full left-0 border-b border-gray-200"
          >
            <div className="flex flex-col p-6 space-y-4">
              {user ? (
                <>
                  <div className="text-sm font-semibold text-gray-500 pb-2 border-b border-gray-100">Welcome, {user.name}</div>
                  <Link 
                    onClick={() => setMobileMenu(false)}
                    to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} 
                    className="flex items-center gap-2 font-semibold text-gray-800"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 font-semibold text-red-500 text-left pt-2">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={() => setMobileMenu(false)} to="/login" className="font-semibold text-gray-800 text-lg">Sign In</Link>
                  <Link onClick={() => setMobileMenu(false)} to="/register" className="bg-primary text-white text-center py-3 rounded-xl font-bold shadow-md">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
