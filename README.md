# Dehasoft E-Ticaret Test Projesi

Bu proje, Dehasoft değerlendirme süreci kapsamında modern web mimarileri, API güvenliği ve sistem tasarımı prensiplerine uygun olarak geliştirilmiştir.

## 🏗️ Genel Mimari (Proxy & Isolation)

Proje, görselde belirtilen **zorunlu proxy mimarisi** üzerine kurulmuştur:

- **Frontend (Next.js 14):** Kullanıcı arayüzü ve proxy katmanı olarak çalışır.
- **Backend (Laravel 13):** Veri işleme ve API sağlama (JWT tabanlı) görevini üstlenir.
- **Proxy Güvenliği:** Frontend uygulaması (client tarafı), Laravel backend'e asla doğrudan istek atmaz. Tüm iletişim Next.js API Route'ları üzerinden proxy edilerek gerçekleştirilir. Bu sayede API uç noktaları gizlenmiş ve doğrudan erişim engellenmiştir.
- **Kimlik Doğrulama:** JWT token'lar, tarayıcı tarafında çalınmaya karşı en güvenli yöntem olan **httpOnly Cookie** içerisinde saklanır.

---

## ⚙️ Sistem Gereksinimleri

| Gereksinim | Sürüm |
|---|---|
| PHP | 8.3+ |
| Composer | 2.x |
| Node.js | 18+ |
| npm | 9+ |

> **⚠️ Önemli (Windows Kullanıcıları):** `php` komutu Windows'ta çalışmıyorsa veya sahte bir stub ise, Herd vb. araçların kendi PHP yollarını kullanın.

---

## 🚀 Kurulum ve Çalıştırma

Proje, kurulum kolaylığı ve taşınabilirlik için varsayılan olarak **SQLite** ile yapılandırılmıştır. Herhangi bir veritabanı sunucusu kurulumu gerektirmeden çalıştırılabilir.

### 1. Backend Hazırlığı (Laravel)

```bash
cd backend
```

**Eğer PHP ortamınız doğru kuruluysa (Herd vb. olmadan standart kullanım):**
```bash
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve --port=8000
```

**Alternatif olarak (Windows'ta `php` komutu hata veriyorsa, Herd PHP yolunu kullanarak çalıştırılan komutlar):**
```powershell
# Composer bağımlılıklarını kur (Proje zaten kurulu haldedir)
# C:\Users\<KULLANICI>\.config\herd\bin\php.bat C:\Users\<KULLANICI>\.config\herd\bin\composer.phar install

# Sunucuyu başlat (8000 portunda çalıştırır)
C:\Users\<KULLANICI>\.config\herd\bin\php.bat -S 127.0.0.1:8000 -t public
```

> Backend, **http://127.0.0.1:8000** adresinde çalışmaya başlayacaktır.

---

### 2. Frontend Hazırlığı (Next.js)

Yeni bir terminal açın:

```bash
cd frontend
npm install
npm run dev
```

Uygulama tarayıcınızda **http://localhost:3000** adresinde çalışmaya başlayacaktır.

---

## 💡 Veritabanı Notu (MySQL Desteği)

Proje şu an SQLite üzerinde çalışmaktadır. İstenildiği takdirde `backend/.env` dosyasındaki ilgili alanlar MySQL bilgilerine göre düzenlenip `php artisan migrate` komutu çalıştırılarak MySQL'e saniyeler içinde geçiş yapılabilir.

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dehasoft
DB_USERNAME=root
DB_PASSWORD=
```

---

## ✅ Tamamlanan Özellikler

- **Kullanıcı Yönetimi:** Kayıt ol, Giriş yap, Çıkış yap (JWT & Secure Cookie).
- **Ürün Yönetimi:** Ürün listeleme, detay görüntüleme ve admin paneli üzerinden CRUD (Ekle/Sil/Güncelle) işlemleri.
- **Sepet Sistemi:** Ürün ekleme, miktar güncelleme, ürün silme ve sepeti temizleme.
- **Sipariş Sistemi:** Sepetteki ürünlerle sipariş oluşturma ve sipariş geçmişi görüntüleme.
- **Döviz Kuru:** Harici API entegrasyonu ile USD ve EUR kurlarının **anlık** (her dakika güncellenen) takibi ve Navbar üzerinden gösterimi.

---

## 📦 API Dokümantasyonu

Proje kök dizinindeki `Postman` klasöründe bulunan `Dehasoft_API_Postman.json` dosyasını Postman’e içeri aktararak tüm API uç noktalarını inceleyebilirsiniz. Ayrıca oluşturulan PDF dosyası üzerinden Postman test çıktılarının ekran görüntülerine ulaşabilirsiniz.

---

## 🗂️ Proje Yapısı

```
dehasoft-ecommerce/
├── backend/          # Laravel API (PHP)
│   ├── app/
│   ├── database/
│   │   └── database.sqlite   # Çalışır durumdaki SQLite veritabanı
│   ├── routes/api.php
│   └── .env
├── frontend/         # Next.js (Proxy katmanı)
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── .env.local
└── Dehasoft_API_Postman.json
```
