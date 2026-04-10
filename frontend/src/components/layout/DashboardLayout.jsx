import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg transition-colors duration-300 overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 w-full bg-surface border-b border-border z-40 flex justify-between items-center px-4 py-3 shadow-sm">
        <h1 className="font-extrabold text-lg text-text-main">EasyEnroll</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-text-main rounded-md hover:bg-bg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-surface shadow-2xl md:hidden flex flex-col"
            >
              <div className="absolute top-4 right-4 z-50">
                <button onClick={() => setIsSidebarOpen(false)} className="bg-bg text-text-main p-2 rounded-full hover:bg-border transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar mobile onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full border-r border-border shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full overflow-y-auto mt-14 md:mt-0 relative">
        <div className="p-4 md:p-12 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
