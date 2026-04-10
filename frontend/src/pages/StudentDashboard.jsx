import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { BookOpen, Users, Loader, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/enrollments/my-enrollments')
      ]);
      setCourses(coursesRes.data);
      setMyEnrollments(enrollmentsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validMyEnrollments = myEnrollments.filter(e => e.course != null);
  const activeEnrollments = validMyEnrollments.filter(e => e.status === 'enrolled');
  const waitlistedIds = validMyEnrollments.filter(e => e.status === 'waitlisted').map(e => e.course._id);
  const enrolledCourseIds = activeEnrollments.map(e => e.course._id);
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(course => 
    (selectedCategory === 'All' || course.category === selectedCategory) &&
    (course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 pb-12 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-surface p-8 rounded-3xl shadow-sm border border-border">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tight">Explore Courses</h1>
          <p className="text-text-muted mt-2 font-medium">Discover and enroll in world-class programs.</p>
        </div>
      </div>

      {/* Enrollments Spotlight */}
      {activeEnrollments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div> Enrolled Classes
          </h2>
          
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEnrollments.map(({ _id, course }) => (
              <motion.div key={_id} variants={cardVariants} className="bg-bg rounded-[20px] p-6 border border-border relative group">
                <Link to={`/course/${course._id}`} className="absolute top-4 right-4 p-2 bg-surface rounded-full text-text-main shadow-sm hover:scale-110 transition-transform">
                  <ExternalLink className="w-5 h-5" />
                </Link>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-text-main leading-tight pr-10">{course.title}</h3>
                </div>
                <p className="text-text-muted mb-4 text-sm">{course.schedule}</p>
                <div className="inline-block bg-surface border border-border text-text-main px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Catalog Section */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold text-text-main">Ideas for you</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 pb-2 overflow-x-auto w-full no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-text-main text-surface' : 'bg-surface text-text-main hover:bg-border'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" placeholder="Search ideas..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-surface border-none rounded-full w-full focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm font-bold text-text-main"
              />
            </div>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
          {filteredCourses.length === 0 ? (
            <p className="text-text-muted py-12 text-center bg-surface rounded-[24px] font-medium break-inside-avoid">No courses available.</p>
          ) : (
            filteredCourses.map(course => {
              const fillPercentage = (course.enrolledCount / course.capacity) * 100;
              const isFull = course.enrolledCount >= course.capacity;
              
              return (
                <motion.div key={course._id} variants={cardVariants} whileHover={{ scale: 1.02 }} className="bg-surface rounded-[24px] flex flex-col transition-all overflow-hidden relative group break-inside-avoid hover:shadow-lg">
                  <div className="w-full relative overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full object-cover transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-text-main">{course.category}</div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg text-text-main leading-tight mb-1">{course.title}</h3>
                    <p className="text-text-muted mb-4 flex-grow line-clamp-2 text-sm">{course.description}</p>
                    
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden mb-4">
                      <div className={`h-1.5 rounded-full ${isFull ? 'bg-primary' : 'bg-text-main'}`} style={{ width: `${fillPercentage}%` }} />
                    </div>

                    <Link to={`/course/${course._id}`} className="w-full py-3 text-center rounded-full font-bold bg-border text-text-main hover:bg-text-main hover:text-surface transition-all">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
