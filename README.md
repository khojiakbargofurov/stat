# 📍 Toshkent Viloyati Turizm Statistikasi Dashboard

Toshkent viloyatining turizm salohiyatini tahlil qilish, boshqarish va vizuallashtirish uchun mo'ljallangan zamonaviy dashboard platformasi. 

![Dashboard Preview](https://raw.githubusercontent.com/khojiakbargofurov/stat/main/public/preview.png) *(Eslatma: Rasm joylashuvi misol tariqasida)*

## 🚀 Asosiy Imkoniyatlar

- **📊 Analitik Dashboard:** KPI kartalari va interaktiv grafiklar orqali umumiy statistikani ko'rish.
- **🗺️ Interaktiv Xarita:** Leaflet yordamida turistik obyektlarni xaritada vizuallashtirish.
- **⚙️ Admin Panel (CRUD):** Obyektlarni qo'shish, tahrirlash va o'chirish imkoniyati.
- **💾 Ma'lumotlarni Eksport qilish:** 
    - Dashboardni **PNG** rasm ko'rinishida yuklab olish.
    - Admin ma'lumotlarini **CSV** formatida yuklab olish.
- **📱 To'liq Responsiv:** Mobil qurilmalarda qulay foydalanish uchun maxsus dizayn (Bottom Navigation).
- **🌓 Mavzular (Light/Dark):** Tizimni yorug' yoki qorong'u mavzuda ishlatish imkoniyati.
- **⚡ Yuqori Tezlik:** `useMemo` va build optimizatsiyasi orqali maksimal samaradorlik.

## 🛠️ Texnologiyalar

- **Frontend:** React.js, Vite
- **Grafiklar:** Recharts
- **Xarita:** Leaflet, React-Leaflet
- **Ikonkalar:** Lucide React
- **Stillashtirish:** Vanilla CSS (Glassmorphism & Modern UI)
- **Eksport:** html2canvas

## 📦 O'rnatish va Ishga tushirish

1. **Repozitoriyani klonlash:**
   ```bash
   git clone https://github.com/khojiakbargofurov/stat.git
   cd stat
   ```

2. **Kutubxonalarni o'rnatish:**
   ```bash
   npm install
   ```

3. **Lokal rejimda ishga tushirish:**
   ```bash
   npm run dev
   ```

4. **Production Build yaratish:**
   ```bash
   npm run build
   ```

## 🌐 Deploy (Serverga joylash)

Loyiha quyidagi platformalar uchun tayyorlangan:
- **Vercel:** `vercel.json` orqali routing sozlangan.
- **Netlify:** `_redirects` fayli orqali routing sozlangan.

---
Yaratuvchi: [Khojiakbar Gofurov](https://github.com/khojiakbargofurov)
