import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Clock, Users, ArrowLeft, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, 'enrolled', 'waitlisted'

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, enrollmentsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/enrollments/my-enrollments')
        ]);
        
        const fetchedCourse = courseRes.data;
        setCourse(fetchedCourse);

        // Determine status
        const activeEnrollment = enrollmentsRes.data.find(e => e.course && e.course._id === id && e.status === 'enrolled');
        if (activeEnrollment) {
          setEnrollmentStatus('enrolled');
        } else if (fetchedCourse?.waitlist?.includes(user?.id)) {
          setEnrollmentStatus('waitlisted');
        }

      } catch (error) {
        toast.error('Failed to load course details');
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, navigate, user.id]);

  const handleAction = async () => {
    try {
      if (enrollmentStatus === 'enrolled') {
        await api.put(`/enrollments/${course._id}/drop`);
        toast.success('Course dropped');
        setEnrollmentStatus(null);
      } else if (course.enrolledCount >= course.capacity) {
        // Join waitlist
        await api.post(`/enrollments/${course._id}/waitlist`);
        toast.success('Joined waitlist');
        setEnrollmentStatus('waitlisted');
      } else {
        // Enroll
        await api.post(`/enrollments/${course._id}/enroll`);
        toast.success('Successfully enrolled');
        setEnrollmentStatus('enrolled');
      }
      
      // Refresh course data to sync counts
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (!course) return null;

  const isFull = course.enrolledCount >= course.capacity;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      {/* Hero Section */}
      <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-border">
        <div className="h-64 md:h-80 w-full relative">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{course.category}</span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{course.level}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">{course.title}</h1>
            <p className="text-gray-300 font-medium text-lg">Instructor: {course.instructor}</p>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="p-6 md:p-8 bg-surface border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-text-main font-bold">
              <Clock className="w-5 h-5 text-primary" /> {course.schedule}
            </div>
            <div className="flex items-center gap-2 text-text-main font-bold">
              <Users className="w-5 h-5 text-primary" /> {course.enrolledCount} / {course.capacity} Enrolled
            </div>
          </div>
          
          <button 
            onClick={handleAction}
            className={`px-8 py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-md w-full md:w-auto flex justify-center items-center gap-2 ${
              enrollmentStatus === 'enrolled' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' :
              enrollmentStatus === 'waitlisted' ? 'bg-amber-50 text-amber-600 border border-amber-200 cursor-not-allowed' :
              isFull ? 'bg-gray-900 text-white hover:bg-gray-800' :
              'bg-primary hover:bg-primary-light text-white shadow-primary/30'
            }`}
            disabled={enrollmentStatus === 'waitlisted'}
          >
            {enrollmentStatus === 'enrolled' ? <><AlertCircle className="w-5 h-5" /> Drop Course</> : 
             enrollmentStatus === 'waitlisted' ? <><Clock className="w-5 h-5" /> On Waitlist</> : 
             isFull ? 'Join Waitlist' : <><CheckCircle2 className="w-5 h-5" /> Enroll Now</>}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface p-8 rounded-3xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-text-main mb-4">Course Description</h2>
            <p className="text-text-muted leading-relaxed font-medium">{course.description}</p>
          </div>

          <div className="bg-surface p-8 rounded-3xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-text-main mb-6">Syllabus Curriculum</h2>
            {(!course.syllabus || course.syllabus.length === 0) ? (
              <p className="text-text-muted italic">Syllabus not yet published.</p>
            ) : (
              <ul className="space-y-4">
                {course.syllabus.map((item, idx) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex gap-4 items-start p-4 bg-bg rounded-2xl border border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="font-bold text-text-main mt-1">{item}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-surface p-8 rounded-3xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-text-main mb-4">Quick Facts</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-text-muted">Status</span>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase ${course.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-500'}`}>{course.status}</span>
              </li>
              <li className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-text-muted">Waitlist Queue</span>
                <span className="text-text-main font-bold">{course.waitlist?.length || 0} students</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-text-muted">Format</span>
                <span className="text-text-main font-bold">Online Interactive</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
