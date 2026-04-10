import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const data = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Registration successful!');
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center my-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100"
      >
        {/* Abstract Branding Side */}
        <div className="hidden md:flex md:w-1/2 p-12 relative items-center justify-center bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-accent via-primary to-primary-light opacity-90 z-10"></div>
          <div className="absolute blob-shape bg-white/20 w-80 h-80 bottom-0 right-[-20%] z-20 mix-blend-overlay"></div>
          <div className="absolute blob-shape bg-indigo-400/30 w-96 h-96 top-[-10%] left-[-10%] z-20 mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="relative z-30 text-white space-y-6 max-w-md">
            <h2 className="text-5xl font-extrabold leading-tight">Join <br/>EasyEnroll.</h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">
              Start your educational journey today. Create an account to explore courses, track your progress, and enroll instantly.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center bg-[#fcfcfd]">
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-6 md:hidden">
              <UserPlus className="w-7 h-7" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h3>
            <p className="text-gray-500 mt-2 font-medium">Join the platform in seconds</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange} required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all bg-white font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={onChange} required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all bg-white font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                placeholder="you@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={onChange} required minLength="6"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all bg-white font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Account Role</label>
              <div className="relative">
                <select name="role" value={formData.role} onChange={onChange} 
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all bg-white font-bold text-gray-900 appearance-none shadow-sm cursor-pointer">
                  <option value="student">Student</option>
                  <option value="admin">Administrator (Demo)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full relative group mt-6 overflow-hidden rounded-xl shadow-lg shadow-purple-200/50">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary transition-transform duration-300 group-hover:scale-105"></div>
              <div className="relative flex items-center justify-center gap-2 py-4 text-white font-bold text-lg">
                Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium pb-2">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-purple-700 font-bold ml-1 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
              Sign In here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
