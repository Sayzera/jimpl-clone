interface ActionButtonsProps {
  isLoading: boolean;
  hasSelectedFile: boolean;
  hasExifData: boolean;
  onSubmit: () => void;
  onCleanExif: () => void;
}

export const ActionButtons = ({
  isLoading,
  hasSelectedFile,
  hasExifData,
  onSubmit,
  onCleanExif,
}: ActionButtonsProps) => {
  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !hasSelectedFile}
        className="inline-flex justify-center py-2 px-4 border border-transparent 
                 shadow-sm text-sm font-medium rounded-md text-white 
                 bg-blue-600 hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                 disabled:bg-blue-300"
      >
        {isLoading ? 'İşleniyor...' : 'EXIF Verilerini Göster'}
      </button>

      {hasExifData && (
        <button
          type="button"
          onClick={onCleanExif}
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent 
                   shadow-sm text-sm font-medium rounded-md text-white 
                   bg-green-600 hover:bg-green-700 focus:outline-none 
                   focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                   disabled:bg-green-300"
        >
          EXIF Verilerini Temizle
        </button>
      )}
    </div>
  );
}; 