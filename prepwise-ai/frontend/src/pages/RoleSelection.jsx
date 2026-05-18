import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../api';
import { UploadCloud, File, X, Code, Briefcase, Database, Layout, Smartphone, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  { id: 'Frontend Developer', icon: Layout },
  { id: 'Backend Developer', icon: Database },
  { id: 'Full Stack Developer', icon: Code },
  { id: 'Mobile Developer', icon: Smartphone },
  { id: 'Data Analyst', icon: BarChart3Icon },
  { id: 'Product Manager', icon: Briefcase },
];

function BarChart3Icon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
}

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    if (!selectedRole || !file) {
      setError('Please select a role and upload your resume');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('role', selectedRole);
    formData.append('resume', file);

    try {
      const { data } = await api.post('/interviews/setup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup interview. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Set up your mock interview</h1>
        <p className="text-slate-500">Choose your target role and upload your resume to generate personalized questions.</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm">1</span>
            Select Job Role
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedRole === role.id 
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20' 
                      : 'border-slate-200 hover:border-primary-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-3 ${selectedRole === role.id ? 'text-primary-600' : 'text-slate-400'}`} />
                  <div className={`font-medium ${selectedRole === role.id ? 'text-primary-900' : 'text-slate-700'}`}>
                    {role.id}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm">2</span>
            Upload Resume (PDF)
          </h2>
          
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-8 h-8 text-primary-500" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-slate-500">
                or click to browse from your computer
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRole || !file}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Questions...
              </>
            ) : (
              'Start Interview'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
