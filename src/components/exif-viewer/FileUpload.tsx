import { useRef, ChangeEvent } from 'react';
import { DropZone } from './DropZone';

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ selectedFile, onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <DropZone onDrop={onFileSelect}>
      <div 
        className="space-y-4 cursor-pointer" 
        onClick={handleCardClick}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Seçilen resim"
              className="max-h-64 rounded-lg shadow-md"
            />
            <p className="mt-2 text-sm text-gray-600">
              Seçilen dosya: {selectedFile.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Resmi buraya sürükleyin veya tıklayın
            </p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </DropZone>
  );
}; 