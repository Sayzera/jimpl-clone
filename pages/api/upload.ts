import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import ExifReader from 'exif-reader';
import sharp from 'sharp';
import { ApiResponse, ExifData } from '../../types';

// formidable için form parsing'i devre dışı bırak
export const config = {
  api: {
    bodyParser: false,
  },
};

// Formidable için promise wrapper
const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

interface RawExifData {
  Image: {
    Make?: string;
    Model?: string;
    DateTime?: string;
    Software?: string;
    ImageWidth?: number;
    ImageLength?: number;
  };
  GPSInfo?: {
    GPSLatitudeRef?: string;
    GPSLatitude?: number[];
    GPSLongitudeRef?: string;
    GPSLongitude?: number[];
    GPSAltitude?: number;
  };
}

// GPS koordinatlarını derece cinsine dönüştür
const convertGPSToDegrees = (gpsData: number[]): number => {
  const [degrees, minutes, seconds] = gpsData;
  return degrees + (minutes / 60) + (seconds / 3600);
};

// EXIF verilerini oku
const readExifData = async (filePath: string): Promise<ExifData | undefined> => {
  try {
    const imageBuffer = await fs.readFile(filePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    if (!metadata.exif) {
      return undefined;
    }

    const rawExifData = ExifReader(metadata.exif) as unknown as RawExifData;
    
    // GPS verilerini oku ve dönüştür
    let gpsLatitude: number | undefined;
    let gpsLongitude: number | undefined;

    if (rawExifData.GPSInfo?.GPSLatitude && rawExifData.GPSInfo?.GPSLongitude) {
      gpsLatitude = convertGPSToDegrees(rawExifData.GPSInfo.GPSLatitude);
      gpsLongitude = convertGPSToDegrees(rawExifData.GPSInfo.GPSLongitude);

      // Güney yarımküre için enlemi negatif yap
      if (rawExifData.GPSInfo.GPSLatitudeRef === 'S') {
        gpsLatitude = -gpsLatitude;
      }
      // Batı yarımküre için boylamı negatif yap
      if (rawExifData.GPSInfo.GPSLongitudeRef === 'W') {
        gpsLongitude = -gpsLongitude;
      }
    }

    return {
      make: rawExifData.Image?.Make,
      model: rawExifData.Image?.Model,
      dateTime: rawExifData.Image?.DateTime,
      software: rawExifData.Image?.Software,
      imageWidth: rawExifData.Image?.ImageWidth,
      imageHeight: rawExifData.Image?.ImageLength,
      gpsLatitude,
      gpsLongitude,
    };
  } catch (error) {
    console.error('EXIF okuma hatası:', error);
    return undefined;
  }
};

// EXIF verilerini temizle
const cleanExifData = async (filePath: string) => {
  try {
    const imageBuffer = await fs.readFile(filePath);
    const cleanedImage = await sharp(imageBuffer)
      .withMetadata({ exif: undefined })
      .toBuffer();

    const outputPath = path.join(
      process.cwd(),
      'public',
      'cleaned',
      `cleaned_${path.basename(filePath)}`
    );

    // Cleaned dizinini oluştur
    await fs.mkdir(path.join(process.cwd(), 'public', 'cleaned'), {
      recursive: true,
    });

    await fs.writeFile(outputPath, cleanedImage);

    return `/cleaned/${path.basename(outputPath)}`;
  } catch (error) {
    console.error('EXIF temizleme hatası:', error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Sadece POST metodu desteklenmektedir',
    });
  }

  try {
    const { fields, files } = await parseForm(req);
    const imageFiles = files.image;
    
    if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Dosya yüklenemedi',
      });
    }

    const file = imageFiles[0];
    const exifData = await readExifData(file.filepath);


    if (fields.clean) {
      const cleanedImageUrl = await cleanExifData(file.filepath);
      return res.status(200).json({
        success: true,
        data: {
          cleanedImageUrl,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        exifData,
      },
    });
  } catch (error) {
    console.error('API hatası:', error);
    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası oluştu',
    });
  }
} 