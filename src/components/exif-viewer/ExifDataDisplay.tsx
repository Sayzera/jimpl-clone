import { ExifData } from '../../../types';

interface ExifDataDisplayProps {
  exifData: ExifData | null | undefined;
}

const formatGPS = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) return 'Bilgi yok';
  
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  
  const absLat = Math.abs(latitude);
  const absLon = Math.abs(longitude);
  
  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = ((absLat - latDeg) * 60 - latMin) * 60;
  
  const lonDeg = Math.floor(absLon);
  const lonMin = Math.floor((absLon - lonDeg) * 60);
  const lonSec = ((absLon - lonDeg) * 60 - lonMin) * 60;
  
  return `${latDeg}° ${latMin}' ${latSec.toFixed(2)}" ${latDir}, ${lonDeg}° ${lonMin}' ${lonSec.toFixed(2)}" ${lonDir}`;
};

const formatValue = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return 'Bilgi yok';
  }
  return value;
};

export const ExifDataDisplay = ({ exifData }: ExifDataDisplayProps) => {
  const groupedExifData = {
    kamera: {
      'Marka': formatValue(exifData?.make) || 'Bilgi yok',
      'Model': formatValue(exifData?.model) || 'Bilgi yok',
      'Yazılım': formatValue(exifData?.software) || 'Bilgi yok',
    },
    teknik: {
      'Çekim Tarihi': formatValue(exifData?.dateTime) || 'Bilgi yok',
      'Genişlik': exifData?.imageWidth ? `${exifData?.imageWidth} piksel` : 'Bilgi yok',
      'Yükseklik': exifData?.imageHeight ? `${exifData?.imageHeight} piksel` : 'Bilgi yok',
    },
    konum: {
      'GPS Koordinatları': formatGPS(exifData?.gpsLatitude, exifData?.gpsLongitude) || 'Bilgi yok',
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        EXIF Meta Verileri
      </h2>
      <div className="bg-gray-50 rounded-lg p-4 space-y-6">
        {/* Kamera Bilgileri */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Kamera Bilgileri</h3>
          <dl className="grid grid-cols-1 gap-2">
            {Object.entries(groupedExifData.kamera).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Teknik Bilgiler */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Teknik Bilgiler</h3>
          <dl className="grid grid-cols-1 gap-2">
            {Object.entries(groupedExifData.teknik).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Konum Bilgileri */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Konum Bilgileri</h3>
          <dl className="grid grid-cols-1 gap-2">
            {Object.entries(groupedExifData.konum).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          {exifData?.gpsLatitude && exifData?.gpsLongitude && (
            <a
              href={`https://www.google.com/maps?q=${exifData?.gpsLatitude},${exifData?.gpsLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              Google Maps'te Göster
            </a>
          )}
        </div>
      </div>
    </div>
  );
}; 