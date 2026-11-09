import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePitch, useBusiness, useSavePitchUrl, useAnalyzeByBusiness, useSubmitPitch } from '../../api/hooks';
import { parseFeedback, hasFeedbackContent } from '../../utils/feedbackParser';

import VideoUploader from '../../components/pitch/VideoUploader';
import VideoPreview from '../../components/pitch/VideoPreview';
import AiFeedbackReport from '../../components/pitch/AiFeedbackReport';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function PitchUpload() {
  const { businessId } = useParams<{ businessId: string }>();
  const bId = Number(businessId);
  const { data: business } = useBusiness(bId);
  const { data: pitch, refetch } = usePitch(bId);

  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [aiFeedbackRaw, setAiFeedbackRaw] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const savePitch = useSavePitchUrl();
  const analyzeByBusiness = useAnalyzeByBusiness();
  const submitPitch = useSubmitPitch();

  useEffect(() => {
    if (pitch) {
      setDescription(pitch.description || '');
      if (pitch.aiFeedback) setAiFeedbackRaw(pitch.aiFeedback);
    }
  }, [pitch]);

  useEffect(() => {
    return () => { if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl); };
  }, [localPreviewUrl]);

  // --- File handlers ---
  const handleFileSelect = (file: File) => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setSelectedFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setSelectedFile(null);
    setLocalPreviewUrl('');
  };

  // --- AI Feedback ---
  const handleGetAiFeedback = () => {
    analyzeByBusiness.mutate(bId, {
      onSuccess: (data: any) => {
        if (data?.aiFeedback) setAiFeedbackRaw(data.aiFeedback);
        toast.success('AI analysis complete');
      },
      onError: () => toast.error('AI analysis failed. Try again.'),
    });
  };

  // --- Submit: upload to Cloudinary → save pitch → submit ---
  const handleSubmitPitch = async () => {
    const file = selectedFile;
    if (!file && !pitch?.videoUrl) { toast.error('Select a video first'); return; }

    try {
      setSubmitting(true);
      let videoUrl = pitch?.videoUrl || '';
      let cloudinaryPublicId: string | undefined;

      if (file) {
        setUploadProgress(0);
        const uploadResult = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', UPLOAD_PRESET);
          formData.append('folder', 'bharatinvest/pitches');
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText);
              resolve({ url: res.secure_url, publicId: res.public_id });
            } else reject(new Error('Upload failed'));
          };
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
          xhr.send(formData);
        });
        videoUrl = uploadResult.url;
        cloudinaryPublicId = uploadResult.publicId;
        if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        setSelectedFile(null);
        setLocalPreviewUrl('');
      }

      const saved: any = await new Promise((resolve, reject) => {
        savePitch.mutate(
            { businessId: bId, videoUrl, description, aiFeedback: aiFeedbackRaw || undefined, cloudinaryPublicId },
            { onSuccess: (d: any) => resolve(d), onError: (e: any) => reject(e) }
        );
      });

      const pitchId = saved?.id || pitch?.id;
      if (!pitchId) { toast.error('Could not save pitch'); setSubmitting(false); return; }

      submitPitch.mutate(pitchId, {
        onSuccess: () => {
          toast.success('Pitch submitted. Business is now live for investors.');
          refetch();
          setSubmitting(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Submit failed');
          setSubmitting(false);
        },
      });
    } catch {
      toast.error('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  // --- Derived state ---
  const feedback = parseFeedback(aiFeedbackRaw);
  const hasFeedback = hasFeedbackContent(feedback);
  const previewUrl = localPreviewUrl || (pitch?.videoUrl || '');
  const hasLocalFile = !!selectedFile;
  const hasVideo = hasLocalFile || !!pitch?.videoUrl;
  const isSubmitted = pitch?.status === 'SUBMITTED';

  return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pitch for: {business?.name}</h1>
        <p className="text-gray-500 mb-6">Record your pitch video, get AI feedback, then go live</p>

        {isSubmitted && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <p className="text-green-700 font-medium">Pitch submitted and live</p>
            </div>
        )}

        {/* Video upload + preview */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <VideoUploader
                previewUrl={previewUrl}
                hasLocalFile={hasLocalFile}
                isSubmitted={isSubmitted}
                isSubmitting={submitting}
                onFileSelect={handleFileSelect}
                onRemove={handleRemove}
            />
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={isSubmitted || submitting}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 text-sm"
                  placeholder="Brief about your pitch..."
              />
              {!isSubmitted && (
                  <button
                      onClick={handleGetAiFeedback}
                      disabled={analyzeByBusiness.isPending || submitting}
                      className="mt-3 bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 disabled:opacity-50 w-full"
                  >
                    {analyzeByBusiness.isPending ? 'Analyzing...' : 'Get AI Feedback'}
                  </button>
              )}
            </div>
          </div>
          <VideoPreview previewUrl={previewUrl} hasLocalFile={hasLocalFile} />
        </div>

        {/* AI analyzing spinner */}
        {analyzeByBusiness.isPending && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full border-4 border-accent-200 border-t-accent-600 animate-spin" />
              <p className="text-gray-600 font-medium">Analyzing your pitch with AI...</p>
              <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
            </div>
        )}

        {/* AI analysis report */}
        {hasFeedback && feedback ? (
            <div className="space-y-4">
              <AiFeedbackReport feedback={feedback} />
              {!isSubmitted && hasVideo && (
                  <button
                      onClick={handleSubmitPitch}
                      disabled={submitting || submitPitch.isPending}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? (uploadProgress > 0 ? `Uploading Video... ${uploadProgress}%` : 'Submitting...') : 'Submit Pitch & Go Live'}
                  </button>
              )}
            </div>
        ) : aiFeedbackRaw && !hasFeedback ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h2>
                <pre className="text-gray-600 text-sm whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">{aiFeedbackRaw}</pre>
              </div>
              {!isSubmitted && hasVideo && (
                  <button
                      onClick={handleSubmitPitch}
                      disabled={submitting || submitPitch.isPending}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? (uploadProgress > 0 ? `Uploading Video... ${uploadProgress}%` : 'Submitting...') : 'Submit Pitch & Go Live'}
                  </button>
              )}
            </div>
        ) : !analyzeByBusiness.isPending && !aiFeedbackRaw ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">{hasVideo ? 'Click "Get AI Feedback" to analyze your pitch' : 'Select your pitch video to get started'}</p>
            </div>
        ) : null}
      </div>
  );
}