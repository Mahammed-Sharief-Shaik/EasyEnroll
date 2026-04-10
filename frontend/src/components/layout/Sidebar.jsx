import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { BookOpen, Grid, LogOut, Sun, Moon, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ mobile, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navItems = user?.role === 'admin' 
    ? [{ name: 'Course Catalog', path: '/admin/dashboard', icon: Database }]
    : [{ name: 'Dashboard', path: '/student/dashboard', icon: Grid }];

  const handleNavClick = () => {
    if (mobile && onClose) onClose();
  };

  return (
    <div className={`w-72 bg-surface h-full flex flex-col justify-between transition-colors duration-300 ${!mobile ? '' : ''}`}>
      <div>
        {/* Brand Area */}
        <div className="p-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2.5 rounded-2xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-text-main tracking-tight">EasyEnroll</h1>
              <p className="text-xs text-text-muted font-bold tracking-widest uppercase mt-0.5">{user?.role} portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-5 space-y-2 mt-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 mb-4">Navigation</p>
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive ? 'bg-bg text-text-main border border-border shadow-sm' : 'text-text-muted border border-transparent hover:bg-bg hover:text-text-main'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-5 border-t border-border space-y-4">
        {/* Interactive Theme Switcher */}
        <button 
          onClick={toggleTheme} 
          className="w-full flex items-center justify-between p-1.5 rounded-2xl bg-bg border border-border overflow-hidden relative group"
        >
          <div className="absolute inset-x-0 inset-y-0 flex">
            <div className="w-1/2 h-full z-0 flex items-center justify-center p-1">
               <motion.div 
                 layout 
                 className="w-full h-full bg-surface shadow-sm rounded-xl border border-border"
                 animate={{ x: theme === 'dark' ? '100%' : '0%' }}
                 transition={{ type: 'spring', stiffness: 400, damping: 30 }}
               />
            </div>
          </div>
          
          <div className="w-1/2 py-2 text-center relative z-10 flex items-center justify-center gap-2 font-bold text-sm">
            <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-primary' : 'text-text-muted'}`} /> Light
          </div>
          <div className="w-1/2 py-2 text-center relative z-10 flex items-center justify-center gap-2 font-bold text-sm">
            <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-primary' : 'text-text-muted'}`} /> Dark
          </div>
        </button>
        
        {/* User Card */}
        <div className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border hover:border-text-muted transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-text-main font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden max-w-[120px]">
              <p className="text-sm font-bold text-text-main truncate">{user?.name}</p>
            </div>
          </div>
          <button onClick={logout} title="Log Out" className="p-2 text-text-muted hover:text-primary rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
