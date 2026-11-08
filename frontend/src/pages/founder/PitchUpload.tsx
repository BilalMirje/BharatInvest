import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePitch, useBusiness, useSavePitchUrl, useAnalyzePitch, useSubmitPitch } from '../../api/hooks';
import type { AiFeedback } from '../../types';
import toast from 'react-hot-toast';

export default function PitchUpload() {
  const { businessId } = useParams<{ businessId: string }>();
  const bId = Number(businessId);
  const { data: business } = useBusiness(bId);
  const { data: pitch, refetch } = usePitch(bId);

  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const savePitch = useSavePitchUrl();
  const analyzePitch = useAnalyzePitch();
  const submitPitch = useSubmitPitch();

  useEffect(() => {
    if (pitch) {
      setVideoUrl(pitch.videoUrl || '');
      setDescription(pitch.description || '');
    }
  }, [pitch]);

  const handleSave = () => {
    if (!videoUrl.trim()) return toast.error('Enter video URL');
    savePitch.mutate(
      { businessId: bId, videoUrl, description },
      {
        onSuccess: () => {
          toast.success('Pitch saved!');
          refetch();
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed'),
      }
    );
  };

  const handleAnalyze = () => {
    if (!pitch?.id) return toast.error('Save pitch first');
    analyzePitch.mutate(pitch.id, {
      onSuccess: () => {
        toast.success('AI analysis complete!');
        refetch();
      },
      onError: () => toast.error('AI analysis failed. Try again.'),
    });
  };

  const handleSubmit = () => {
    if (!pitch?.id) return;
    submitPitch.mutate(pitch.id, {
      onSuccess: () => {
        toast.success('Pitch submitted! Business is now live for investors.');
        refetch();
      },
      onError: (err: any) => toast.error(err.response?.data?.error || 'Failed'),
    });
  };

  let feedback: AiFeedback | null = null;
  if (pitch?.aiFeedback) {
    try {
      feedback = JSON.parse(pitch.aiFeedback);
    } catch {
      feedback = null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pitch for: {business?.name}</h1>
      <p className="text-gray-500 mb-6">Upload your pitch video and get AI feedback before going live</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Video + Upload */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Pitch Video</h2>

            {pitch?.status === 'SUBMITTED' ? (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-green-700 font-medium">✅ Pitch submitted and live!</p>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL (upload to Cloudinary and paste URL)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                disabled={pitch?.status === 'SUBMITTED'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={pitch?.status === 'SUBMITTED'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50"
                placeholder="Brief about your pitch..."
              />
            </div>

            {pitch?.status !== 'SUBMITTED' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={savePitch.isPending}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {savePitch.isPending ? 'Saving...' : 'Save Pitch'}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzePitch.isPending || !pitch?.id}
                  className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 disabled:opacity-50"
                >
                  {analyzePitch.isPending ? '🤖 Analyzing...' : '🤖 Get AI Feedback'}
                </button>
              </div>
            )}
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium text-gray-700 mb-2">Preview</h3>
              <video controls className="w-full rounded-lg" src={videoUrl}>
                Your browser does not support video.
              </video>
            </div>
          )}
        </div>

        {/* Right: AI Feedback */}
        <div className="space-y-4">
          {feedback ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">🤖 AI Analysis</h2>
                  <span className="text-2xl font-bold text-primary-600">{feedback.overallScore}/10</span>
                </div>
                <p className="text-gray-600 text-sm">{feedback.summary}</p>
              </div>

              {feedback.strengths?.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">💪 Strengths</h3>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-green-700 text-sm">✓ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements?.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">📈 Improvements</h3>
                  <ul className="space-y-1">
                    {feedback.improvements.map((s, i) => (
                      <li key={i} className="text-yellow-700 text-sm">→ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.investorQuestions?.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">❓ Investors May Ask</h3>
                  <ul className="space-y-1">
                    {feedback.investorQuestions.map((q, i) => (
                      <li key={i} className="text-blue-700 text-sm">• {q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.pitchTips?.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">💡 Pitch Tips</h3>
                  <ul className="space-y-1">
                    {feedback.pitchTips.map((t, i) => (
                      <li key={i} className="text-purple-700 text-sm">• {t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {pitch?.status !== 'SUBMITTED' && (
                <button
                  onClick={handleSubmit}
                  disabled={submitPitch.isPending}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {submitPitch.isPending ? 'Submitting...' : '🚀 Submit Pitch & Go Live'}
                </button>
              )}
            </>
          ) : pitch?.id && !feedback ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Click "Get AI Feedback" to analyze your pitch</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Save your pitch video first, then get AI feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
