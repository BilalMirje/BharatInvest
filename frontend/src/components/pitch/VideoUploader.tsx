import { useRef } from 'react';
import toast from 'react-hot-toast';

interface Props {
  previewUrl: string;
  hasLocalFile: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export default function VideoUploader({ previewUrl, hasLocalFile, isSubmitted, isSubmitting, onFileSelect, onRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasVideo = hasLocalFile || !!previewUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { toast.error('Please select a video file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Video must be under 10MB.'); return; }
    onFileSelect(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
      <h2 className="font-semibold text-gray-900 mb-3">Pitch Video</h2>

      {!isSubmitted && (
        <>
          <div
            onClick={() => !isSubmitting && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isSubmitting ? 'border-primary-300 bg-primary-50 pointer-events-none' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleChange} className="hidden" />
            <p className="text-gray-700 font-medium">
              {hasVideo ? 'Click to select a different video' : 'Click to select your pitch video'}
            </p>
            <p className="text-gray-400 text-sm mt-1">MP4, MOV, AVI — Max 10MB</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Recommended: 16:9 ratio (1280×720 or 1920×1080). Other sizes will fit automatically.</p>
          {hasLocalFile && !isSubmitting && (
            <button onClick={onRemove} className="mt-3 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 w-full">
              Remove Selected Video
            </button>
          )}
        </>
      )}
    </div>
  );
}
