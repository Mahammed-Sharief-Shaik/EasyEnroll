import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Users, Search, Loader, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ 
    title: '', description: '', instructor: '', capacity: 50, category: '', thumbnail: '', schedule: ''
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateCourse = async e => {
    e.preventDefault();
    try {
      await api.post('/courses', formData);
      toast.success('Course created successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', instructor: '', capacity: 50, category: '', thumbnail: '', schedule: '' });
      fetchCourses();
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted');
        fetchCourses();
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader className="w-12 h-12 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-surface p-8 rounded-3xl shadow-sm border border-border">
        <div>
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Admin Console</span>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tight">Manage Catalog</h1>
          <p className="text-text-muted mt-2 font-medium">Control the global catalog for EasyEnroll.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all shadow-md ${showForm ? 'bg-bg text-text-main border border-border' : 'bg-primary text-white hover:bg-primary-light'}`}>
          {showForm ? 'Cancel Creation' : <><Plus className="w-5 h-5" /> New Course</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-surface p-8 rounded-3xl shadow-sm border border-border overflow-hidden">
            <h2 className="text-xl font-bold mb-6 text-text-main">Create Course</h2>
            <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-text-muted mb-2">Course Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-text-muted mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main transition-all"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Instructor</label>
                <input type="text" name="instructor" value={formData.instructor} onChange={handleInputChange} required className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main" placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Thumbnail URL</label>
                <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} required className="w-full px-5 py-3 border border-border rounded-xl focus:border-primary bg-bg text-text-main" />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4">
                <button type="submit" className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-bold transition-colors">Publish Course</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-main">Database</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search title or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-bg border border-border text-text-main rounded-xl focus:border-primary text-sm font-medium transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg text-text-muted text-xs uppercase tracking-wider font-bold">
                <th className="p-5">Course</th>
                <th className="p-5">Category</th>
                <th className="p-5">Capacity</th>
                <th className="p-5">Waitlist</th>
                <th className="p-5 text-right flex-shrink-0 min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredCourses.map(course => (
                  <tr key={course._id} className="hover:bg-bg/50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-text-main">{course.title}</p>
                      <p className="text-xs text-text-muted">{course.instructor}</p>
                    </td>
                    <td className="p-5"><span className="px-2 py-1 bg-border rounded-md text-xs font-bold text-text-main">{course.category || 'General'}</span></td>
                    <td className="p-5"><span className="text-sm font-bold text-text-main">{course.enrolledCount}/{course.capacity}</span></td>
                    <td className="p-5"><span className="text-sm font-bold text-amber-500">{course.waitlist?.length || 0}</span></td>
                    <td className="p-5 pr-5 flex-shrink-0 text-right space-x-2">
                       <Link to={`/course/${course._id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <ExternalLink className="w-4 h-4" /> View
                       </Link>
                       <button onClick={() => handleDeleteCourse(course._id)} className="inline-flex p-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
