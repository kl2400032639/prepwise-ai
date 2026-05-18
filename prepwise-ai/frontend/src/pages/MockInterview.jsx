import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import api from '../api';
import { Mic, MicOff, Video, VideoOff, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockInterview = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isFeedbackView = searchParams.get('view') === 'feedback';
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  // For recording answer text (simulated speech-to-text in UI for now)
  const [currentAnswerText, setCurrentAnswerText] = useState('');

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        setInterview(data);
        if (data.status === 'completed' && !isFeedbackView) {
          navigate(`/interview/${id}?view=feedback`);
        }
        if (data.status !== 'completed') {
           const initialAnswers = data.questions.map(q => ({ questionId: q._id, answer: '' }));
           setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error('Error fetching interview', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, isFeedbackView, navigate]);

  const handleNext = () => {
    // Save current text to answers array
    const newAnswers = [...answers];
    newAnswers[currentQIndex].answer = currentAnswerText || 'User provided no answer.';
    setAnswers(newAnswers);

    if (currentQIndex < interview.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setCurrentAnswerText(newAnswers[currentQIndex + 1]?.answer || '');
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handlePrev = () => {
    // Save current text
    const newAnswers = [...answers];
    newAnswers[currentQIndex].answer = currentAnswerText;
    setAnswers(newAnswers);

    setCurrentQIndex(currentQIndex - 1);
    setCurrentAnswerText(newAnswers[currentQIndex - 1]?.answer || '');
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      await api.post(`/interviews/${id}/submit`, { answers: finalAnswers });
      navigate(`/interview/${id}?view=feedback`);
      window.location.reload(); // Quick way to refresh state
    } catch (error) {
      console.error('Error submitting interview', error);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (!interview) return <div className="p-8 text-center">Interview not found.</div>;

  if (isFeedbackView && interview.feedback) {
    const f = interview.feedback;
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Analysis</h1>
          <p className="text-slate-500">Role: {interview.role}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-primary-100 font-medium mb-2">Overall Score</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl font-bold">{f.overallScore}</span>
              <span className="text-2xl text-primary-200 mb-1">/10</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary-100">Confidence</span>
                  <span>{f.confidenceScore}/10</span>
                </div>
                <div className="h-2 bg-primary-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{width: `${f.confidenceScore*10}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary-100">Communication</span>
                  <span>{f.communicationRating}/10</span>
                </div>
                <div className="h-2 bg-primary-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{width: `${f.communicationRating*10}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary-100">Technical</span>
                  <span>{f.technicalRating}/10</span>
                </div>
                <div className="h-2 bg-primary-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{width: `${f.technicalRating*10}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Strengths
              </h3>
              <ul className="space-y-2">
                {f.strengths?.map((s, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {f.improvementRecommendations?.map((r, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button onClick={() => navigate('/dashboard')} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active Interview View
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white font-medium">Mock Interview: {interview.role}</div>
        <div className="flex items-center gap-4 text-white/80">
          <div className="flex gap-2">
            <button onClick={() => setMicEnabled(!micEnabled)} className={`p-2 rounded-lg backdrop-blur-md \${micEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button onClick={() => setCamEnabled(!camEnabled)} className={`p-2 rounded-lg backdrop-blur-md \${camEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>
              {camEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row relative z-10 p-4 pt-20 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Left: Webcam */}
        <div className="flex-1 rounded-2xl overflow-hidden bg-black/50 relative border border-white/10 shadow-2xl flex items-center justify-center">
          {camEnabled ? (
            <Webcam
              audio={false}
              mirrored={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/50 flex flex-col items-center">
              <VideoOff className="w-12 h-12 mb-2" />
              <p>Camera is disabled</p>
            </div>
          )}
          
          {/* Question Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                  Question {currentQIndex + 1} of {interview.questions.length}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                {interview.questions[currentQIndex].question}
              </h3>
            </div>
          </div>
        </div>

        {/* Right: Controls & Input */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 flex-grow flex flex-col border border-slate-100 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              Your Answer
              {micEnabled && <span className="flex items-center gap-1 text-xs text-red-500 animate-pulse"><Mic className="w-3 h-3"/> Recording</span>}
            </label>
            <textarea
              className="flex-grow w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Type your answer here or speak clearly into the microphone..."
              value={currentAnswerText}
              onChange={(e) => setCurrentAnswerText(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2 text-center">
              In a real scenario, Web Speech API would auto-transcribe here.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentQIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 py-4 rounded-xl font-medium disabled:opacity-50 transition-colors border border-slate-200 hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentQIndex === interview.questions.length - 1 ? (
                <>Submit <CheckCircle2 className="w-5 h-5" /></>
              ) : (
                <>Next <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
