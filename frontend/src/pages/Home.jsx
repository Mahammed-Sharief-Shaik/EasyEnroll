import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 bg-bg transition-colors duration-300">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 w-full relative z-10"
      >
        <div className="text-center space-y-8 mb-20 md:mb-32">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border text-text-main font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary" /> The Next-Gen Enrollment Platform
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-[5.5rem] font-extrabold text-text-main leading-[1.1] tracking-tight">
            Simplify Your <br /> <span className="text-primary">Academic Journey.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-normal">
            Effortlessly discover, manage, and enroll in world-class courses with a modern platform that works for you. 
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/register" className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-[16px] font-bold text-xl hover-lift">
              Start Enrolling <ArrowRight className="w-6 h-6" />
            </Link>
            <Link to="/login" className="flex items-center gap-3 px-10 py-4 rounded-[16px] font-bold text-xl text-text-main bg-border hover:bg-text-muted hover:text-white transition-colors hover-lift">
              Sign In
            </Link>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <motion.div variants={itemVariants} className="bg-border p-8 rounded-[24px] hover-lift">
            <div className="w-14 h-14 rounded-[16px] bg-surface flex items-center justify-center mb-6 shadow-sm border border-border">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Expansive Catalog</h3>
            <p className="text-text-muted leading-relaxed font-medium">Browse hundreds of meticulously crafted courses specifically designed by top industry experts.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-border p-8 rounded-[24px] hover-lift">
            <div className="w-14 h-14 rounded-[16px] bg-surface flex items-center justify-center mb-6 shadow-sm border border-border">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Real-time Updates</h3>
            <p className="text-text-muted leading-relaxed font-medium">Instantly check capacities, availability, drop constraints without needing to refresh pages.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-border p-8 rounded-[24px] hover-lift">
            <div className="w-14 h-14 rounded-[16px] bg-surface flex items-center justify-center mb-6 shadow-sm border border-border">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Secure & Reliable</h3>
            <p className="text-text-muted leading-relaxed font-medium">Your data and enrollments are cryptographically protected and securely synced across devices.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
