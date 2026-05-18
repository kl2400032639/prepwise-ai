import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, Target, Award, Clock, ArrowRight, BarChart3, TrendingUp, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/interviews/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Track your interview preparation progress</p>
        </div>
        <Link
          to="/role-selection"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          New Interview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Interviews</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.totalInterviews || 0}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Best Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.bestScore || 0}/10</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.averageScore || 0}/10</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                Recent Interviews
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats?.history?.length > 0 ? (
                stats.history.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.role}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-500">Score</div>
                        <div className={`font-bold ${item.score >= 7 ? 'text-green-600' : item.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {item.score}/10
                        </div>
                      </div>
                      <Link
                        to={`/interview/${item._id}?view=feedback`}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No interviews yet</h3>
                  <p className="text-slate-500">Start your first mock interview to see stats here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-400" />
              Recently Practiced
            </h2>
            <div className="space-y-3">
              {stats?.recentRoles?.length > 0 ? (
                stats.recentRoles.map((role, i) => (
                  <div key={i} className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700 font-medium text-sm">
                    {role}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No roles practiced yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
