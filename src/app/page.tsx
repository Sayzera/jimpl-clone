'use client'
import { useState, FormEvent } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ExifData, FormState, ApiResponse } from '../../types';
import { FileUpload } from '../components/exif-viewer/FileUpload';
import { ExifDataDisplay } from '../components/exif-viewer/ExifDataDisplay';
import { CleanedImageDownload } from '../components/exif-viewer/CleanedImageDownload';

export default function Home() {
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: false,
  });
  const [exifData, setExifData] = useState<ExifData | null | undefined>(undefined);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setFormState({ isLoading: true, error: null, success: false });
    setExifData(null);
    setCleanedImageUrl(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) throw new Error(result.error || 'Bir hata oluştu');

      setExifData(result.data?.exifData || null);
      setCleanedImageUrl(result.data?.cleanedImageUrl || null);
      setFormState({
        isLoading: false,
        error: null,
        success: true,
      });
    } catch (error) {
      setFormState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Bir hata oluştu',
        success: false,
      });
    }
  };

  const handleCleanExif = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('clean', 'true');

    setFormState({ isLoading: true, error: null, success: false });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();


      if (!response.ok) throw new Error(result.error || 'Bir hata oluştu');

      setCleanedImageUrl(result.data?.cleanedImageUrl || null);
      setFormState({
        isLoading: false,
        error: null,
        success: true,
      });
    } catch (error) {
      setFormState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Bir hata oluştu',
        success: false,
      });
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              EXIF Meta Veri Görüntüleyici
            </h1>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Güvenlik ve Gizlilik:</span> Yüklediğiniz görseller ve EXIF verileri tamamen güvenli bir şekilde işlenmektedir. Verileriniz üçüncü taraflarla paylaşılmamakta ve sistemimizde en fazla 24 saat süreyle saklanmaktadır. Bu süre sonunda tüm veriler otomatik olarak silinmektedir.
              </p>
            </div>

            <div className="space-y-6">
              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
              />

              {selectedFile && (
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setExifData(undefined);
                      setCleanedImageUrl(null);
                      setFormState({ isLoading: false, error: null, success: false });
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent 
                             shadow-sm text-sm font-medium rounded-md text-white 
                             bg-blue-600 hover:bg-blue-700 focus:outline-none 
                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Yeni Resim Ekle
                  </button>
                </div>
              )}

              {formState.isLoading && (
                <div className="text-center text-gray-600">
                  Yükleniyor...
                </div>
              )}

              {formState.error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-700">{formState.error}</p>
                </div>
              )}

              {exifData !== undefined && <ExifDataDisplay exifData={exifData} />}

              {cleanedImageUrl && <CleanedImageDownload cleanedImageUrl={cleanedImageUrl} />}

              {exifData && (
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleCleanExif}
                    disabled={formState.isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent 
                             shadow-sm text-sm font-medium rounded-md text-white 
                             bg-green-600 hover:bg-green-700 focus:outline-none 
                             focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                             disabled:bg-green-300"
                  >
                    EXIF Verilerini Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 