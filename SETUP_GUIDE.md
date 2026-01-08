# 🚀 Azerbaijan Jobs Channel Bot - Setup Guide

Bot Telegram **kanallarından** iş elanları oxuyur və istifadəçiyə göstərir.

## 📋 Lazım olan məlumatlar

### 1️⃣ Bot Token (BotFather-dən)

1. Telegram-da `@BotFather` açın
2. `/newbot` göndərin
3. Bot üçün ad seçin
4. Bot üçün username seçin (bot ilə bitməlidir)
5. **Token-u kopyalayın** (məsələn: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2️⃣ API Credentials (my.telegram.org-dan)

1. Brauzerdə [https://my.telegram.org](https://my.telegram.org) açın
2. Telefon nömrənizi daxil edin və giriş edin
3. **API development tools** bölməsinə keçin
4. Əgər app yoxdursa, yeni app yaradın:
   - App title: Azerbaijan Jobs Bot
   - Short name: azjobs
   - Platform: Desktop
5. **API ID** və **API Hash** kopyalayın

### 3️⃣ Telefon Nömrəsi

Telegram hesabınızın telefon nömrəsi (məsələn: `+994501234567`)

## ⚙️ Quraşdırma

### Addım 1: Paketləri yüklə

```bash
npm install
```

### Addım 2: .env faylı yarat

```bash
cp env.example .env
```

`.env` faylını açın və məlumatları əlavə edin:

```env
# Bot token (@BotFather-dən)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# API credentials (my.telegram.org-dan)
API_ID=12345678
API_HASH=abcdef1234567890abcdef1234567890

# Telefon nömrəniz
PHONE_NUMBER=+994501234567

# Session (ilk dəfə boş buraxın)
SESSION_STRING=
```

### Addım 3: İlk dəfə işə sal

```bash
npm start
```

**İlk dəfə işə salanda:**
1. Telegram-dan doğrulama kodu soruşacaq
2. Kodu daxil edin
3. **Session string** ekranda göstəriləcək
4. Bu stringi **kopyalayın**
5. `.env` faylında `SESSION_STRING=` -ə yapışdırın
6. Növbəti dəfə kod soruşmayacaq!

### Addım 4: Test et

1. Telegram-da öz botunuzu açın
2. `/start` göndərin
3. İş mövqeyi yazın: `frontend developer`
4. Nəticələri gözləyin!

## ✅ Necə işləyir?

```
İstifadəçi → "frontend developer" yazar
           ↓
Bot → 13 Telegram kanalını oxuyur
           ↓
     → Son 30 gün ərzindəki mesajlara baxır
           ↓
     → "frontend developer" açar sözü olan mesajları tapır
           ↓
     → Linkləri çıxarır
           ↓
İstifadəçi → Nəticələri görür
```

## 📡 Monitorinq edilən kanallar

Bot bu kanallardan oxuyur:
- @smartjobit
- @smartjobaztecrube
- @iktisleri
- @marketinqvakansiyalari
- @itvakansiyalari
- @karyeraaze
- @tecrubeproqrami
- @tecrubeproqramlari
- @azejob
- @jobsearchazerbaijan
- @offeraz
- @hellojobaz
- @iselanlaritut

**Ümumi:** 13 kanal

## 🎯 Əmrlər

| Əmr | Təsvir |
|-----|--------|
| `/start` | Botu başlat |
| `/help` | Kömək mesajı |
| `/channels` | Kanal siyahısı |
| `/stats` | Statistika |
| **Text** | İş axtarışı |

## 💡 Nümunələr

**İstifadəçi:**
```
frontend developer
```

**Bot cavabı:**
```
🔍 Tapılan vakansiyalar (son 30 gün):

📊 Ümumi: 5 elan

• @smartjobit
  Frontend Developer (React) tələb olunur
  🔗 https://boss.az/vacancy/12345
  📅 08.01.2024
  📱 https://t.me/smartjobit/1234

• @itvakansiyalari
  React Developer axtarışındayıq
  🔗 https://linkedin.com/jobs/view/456
  📅 07.01.2024
  📱 https://t.me/itvakansiyalari/789

...
```

## ⚠️ Problemlər və həllər

### Problem: "API_ID tapılmadı"
**Həll:** my.telegram.org saytından API credentials alın və .env-ə əlavə edin

### Problem: "Doğrulama kodu yanlışdır"
**Həll:** Telegram-dan gələn kodu düzgün daxil edin (boşluqsuz)

### Problem: "Session expired"
**Həll:** SESSION_STRING-i silin və yenidən kod ilə giriş edin

### Problem: "Channel not found"
**Həll:** Bəzi kanallar privat ola bilər və ya silinib. Bot avtomatik skip edəcək.

## 🔐 Təhlükəsizlik

- ❌ `.env` faylını **HEÇVAXT** Git-ə commit etməyin
- ✅ SESSION_STRING-i gizli saxlayın
- ✅ Bot tokenini başqaları ilə paylaşmayın
- ✅ API credentials-ı qoruyun

## 🚀 Deploy (Railway/Render)

### Railway-də:

1. Railway-ə project əlavə edin
2. GitHub repo-nu connect edin
3. Environment variables əlavə edin:
   - `TELEGRAM_BOT_TOKEN`
   - `API_ID`
   - `API_HASH`
   - `PHONE_NUMBER`
   - `SESSION_STRING`
4. Deploy!

### Render-də:

1. Render-ə Web Service əlavə edin
2. GitHub repo-nu connect edin
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment variables əlavə edin
6. Deploy!

**Qeyd:** İlk dəfə local-da işə salıb SESSION_STRING alın, sonra deploy edin!

## 📊 Performans

- **Sürət:** ~5-10 saniyə (13 kanal × 100 mesaj)
- **Limit:** Kanal başına 100 mesaj
- **Filter:** Son 30 gün
- **Result limit:** Kanal başına maksimum 10 nəticə

## 🎉 Uğurlar!

Bot hazırdır və işləyir! İstifadəçilər indi Telegram kanallarından iş elanları tapa bilərlər.

**Suallarınız varsa:** GitHub Issues-da soruşun

