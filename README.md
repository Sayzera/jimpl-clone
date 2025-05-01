# EXIF Meta Veri Görüntüleyici ve Temizleyici

Bu proje, kullanıcıların resim dosyalarının EXIF meta verilerini görüntülemelerini ve isteğe bağlı olarak bu verileri temizlemelerini sağlayan bir web uygulamasıdır.

## Özellikler

- Resim yükleme ve önizleme
- EXIF meta verilerini görüntüleme
- EXIF verilerini temizleme
- Temizlenmiş resmi indirme

## Teknolojiler

- Next.js
- TypeScript
- Tailwind CSS
- Sharp (resim işleme)
- ExifReader (EXIF meta veri okuma)
- Formidable (dosya yükleme)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd [proje-dizini]
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

1. Ana sayfada "Resim Seç" butonuna tıklayın ve bir resim dosyası seçin.
2. "EXIF Verilerini Göster" butonuna tıklayarak resmin meta verilerini görüntüleyin.
3. Meta verileri temizlemek için "EXIF Verilerini Temizle" butonuna tıklayın.
4. Temizlenmiş resmi indirmek için "Temizlenmiş Resmi İndir" bağlantısını kullanın.

## Lisans

MIT
