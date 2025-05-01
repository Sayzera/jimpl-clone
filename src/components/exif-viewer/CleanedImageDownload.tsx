interface CleanedImageDownloadProps {
  cleanedImageUrl: string;
}

export const CleanedImageDownload = ({ cleanedImageUrl }: CleanedImageDownloadProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Temizlenmiş Resim
      </h2>
      <a
        href={cleanedImageUrl}
        download
        className="inline-flex items-center px-4 py-2 border border-transparent 
                 text-sm font-medium rounded-md text-white bg-indigo-600 
                 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Temizlenmiş Resmi İndir
      </a>
    </div>
  );
}; 