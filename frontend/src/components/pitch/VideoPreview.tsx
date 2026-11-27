interface Props {
  previewUrl: string;
  hasLocalFile: boolean;
}

export default function VideoPreview({ previewUrl, hasLocalFile }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
      <h2 className="font-semibold text-gray-900 mb-3">Preview</h2>
      {previewUrl ? (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
          <video controls className="absolute inset-0 w-full h-full object-contain" src={previewUrl}>
            Your browser does not support video.
          </video>
        </div>
      ) : (
        <div className="w-full aspect-video flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-400 text-sm">Video preview will appear here</p>
        </div>
      )}
      {hasLocalFile && <p className="text-xs text-gray-400 mt-2 text-center">Local preview — not uploaded yet</p>}
    </div>
  );
}
