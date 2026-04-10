import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      toast.success('Sign in successful!');
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
      >
        {/* Abstract Branding Side */}
        <div className="hidden md:flex md:w-1/2 p-12 relative items-center justify-center bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-accent opacity-90 z-10"></div>
          <div className="absolute blob-shape bg-white/20 w-80 h-80 top-0 left-[-20%] z-20 mix-blend-overlay"></div>
          <div className="absolute blob-shape bg-cyan-400/30 w-96 h-96 bottom-[-10%] right-[-10%] z-20 mix-blend-overlay" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-30 text-white space-y-6 max-w-md">
            <h2 className="text-5xl font-extrabold leading-tight">Welcome <br/>Back.</h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">
              Log in to continue managing your courses and progressing through your academic goals cleanly and efficiently.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-[#fcfcfd]">
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 md:hidden">
              <LogIn className="w-7 h-7" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h3>
            <p className="text-gray-500 mt-2 font-medium">Access your EasyEnroll account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-white font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-white font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full relative group mt-4 overflow-hidden rounded-xl shadow-lg shadow-indigo-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light transition-transform duration-300 group-hover:scale-105"></div>
              <div className="relative flex items-center justify-center gap-2 py-4 text-white font-bold text-lg">
                Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium pb-4">
            New to EasyEnroll?{' '}
            <Link to="/register" className="text-primary hover:text-indigo-700 font-bold ml-1 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
