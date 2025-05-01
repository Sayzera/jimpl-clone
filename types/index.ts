// EXIF veri tiplerini tanımlama
export interface ExifData {
  make?: string;
  model?: string;
  dateTime?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  software?: string;
  imageWidth?: number;
  imageHeight?: number;
  [key: string]: any;
}

// API yanıt tipleri
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    exifData?: ExifData;
    cleanedImageUrl?: string;
  };
  error?: string;
}

// Form durumu için tip
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Yüklenen dosya bilgisi için tip
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
} 